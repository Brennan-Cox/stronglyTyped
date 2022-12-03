import type { NextPage, GetServerSideProps } from 'next'
import React, { useState } from "react";
import Link from 'next/link';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { signOut } from "next-auth/react";
import config from '../../pg_config';
import { Client } from 'pg'
import TutorialsTab from '../../components/tutorialsTab'
import Image from 'next/image';

const TutorialPage: NextPage = (props: any) => {

    /**
     * Used for the user account dropdown menu. Inverts value of showMe variable for the element menu-items 
     */
    const [userDropdown, setUserDropdown] = useState(false);
    function toggle() {
        setUserDropdown(!userDropdown);
    }

    /**
     * This will set an initial text of a given string
     * @param input 
     */
     function setInitialText(text: string) : JSX.Element[] {
        var elementArr: JSX.Element[] = []
        //set each JSX element as a span with a single character of white text
        text.split('').forEach((character, i) => {
            let element: JSX.Element = <span className="text-white" key={i}>{character}</span>
            elementArr.push(element)
        })
        //you may simply set the element array because display is a different object
        return elementArr
    }

    // Anything wrapped in this return statement is HTML
    return (
        <main>
            <div className="flex bg-stgray-200 justify-between items-end">
                {/* stronglyTyped in top left */}
                <div id="logo" className="flex py-4 ml-3">
                    <h4 className="login-text text-mint">strongly</h4>
                    <h4 className="login-text text-white ">Typed;</h4>
                </div>

                {/* Navigation bar options */}
                <div id="navigation-bar" className="px-4">
                    <ul className="flex">

                        <Link href="/standard/1"><a id="standard-tab" className="inactive-tab">Standard</a></Link>
                        <Link href="/syntax/1"><a id="syntax-tab" className="inactive-tab">Syntax</a></Link>
                        <Link href="/tutorials/1"><a id="tutorials-tab" className="active-tab">Tutorials</a></Link>
                    </ul>
                </div>

                {/* Account options dropdown menu */}
                <div id="account-dropdown" className="py-4 mr-4">
    
                    <Image className={userDropdown ? "rotate-90" : ""} src="/username-arrow.png" alt="" width={13} height={15} />

                    <button id="username" onClick={toggle} className="hover:text-mint text-white text-2xl px-3">{props.user.username}</button>

                    {/* Sets the value of the style attribute to either "block" or "none" */}
                    <ul id="menu-items" style={{ display: userDropdown ? "block" : "none" }} className="z-20 font-semibold mt-1 absolute bg-stgray-200 border-2 py-2 px-2 border-mint">
                        <Link href="/account-options"><li className="hover:text-mint text-white py-1"><button>Account Options</button></li></Link>
                        <li onClick={() => signOut()} className="hover:text-mint text-white py-1"><button>Log Out</button></li>
                    </ul>
                </div>
            </div>
            <div id="main-tabs" className="bg-stgray-100 h-screen text-center">
                <TutorialsTab initialText= {setInitialText(props.test.text)} userID={props.userID} test={props.test} scores={props.scores} averageScore={props.averageScore}/>
            </div>
        </main>
    )
}

/**
 * Gets the session server-side and redirects to the login-page
 * if there is no active session
 * 
 * @param context Request information passed to the server.
 * @returns props
 */
 export const getServerSideProps: GetServerSideProps = async (context) => {
    var session: Session | null = await getSession(context)

    if (!session) {
        return {
            redirect: {
                destination: "/"
            },
            props: {}
        }
    }

    var client = new Client(config)
    try {
        await client.connect()
        var values = [context.query.id, 'tutorial']
        var { rows: tests } = await client.query('SELECT * FROM Tests WHERE id = $1 AND type = $2', values)
        // Make sure that the test id is a tutorial
        if (tests.length > 0) {
            values = [session.user.id, 'tutorial']
            // Get personal highscores for all tutorials
            var { rows: highScores } = await client.query('SELECT * FROM Leaderboards l INNER JOIN tests t ON l.test_id = t.id AND l.type = t.type WHERE user_id = $1 and t.type = $2 ORDER BY l.test_id', values)
            values = [session.user.id, context.query.id]
            var { rows: averageScore } = await client.query('SELECT * FROM Scores WHERE user_id = $1 and test_id = $2', values)
            await client.end()
            return {props: {user: session.user, test: tests[0], scores: highScores, userID: session.user.id, averageScore: averageScore}};
        }

        // If the test id is not a tutorial. Return to main-page
        return {
            redirect: {
                destination: "/tutorials/1"
            },
            props: {}
        }
    } catch (e: any) {
        switch (e.code) {
            case 'ENOTFOUND':
                break;
        }
    }

    return {props: {user: session.user, scores: [], averageScore: []}};
}

export default TutorialPage;