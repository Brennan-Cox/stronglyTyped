import type { NextPage, GetServerSideProps } from 'next'
import React, { useState } from "react";
import Link from 'next/link';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { signOut } from "next-auth/react";
import config from '../../pg_config';
import { Client } from 'pg'
import SyntaxTab from '../../components/syntaxTab'
import Image from 'next/image';

const SyntaxPage: NextPage = (props: any) => {

    /**
     * Used for the user account dropdown menu. Inverts value of showMe variable for the element menu-items 
     */
    const [userDropdown, setUserDropdown] = useState(false);
    function toggle() {
        setUserDropdown(!userDropdown);
    }

    /**
     * Breaks test text into displayable array of jsx elements
     * @param string 
     * @returns JSX.Element[] lines of text to display to user
     */
    function getInitialLines(string: string): JSX.Element[] {
        let result: JSX.Element[] = []
        let lines: string[] = string.split('$')
        
        let i: number = 0
        lines.forEach((line) => {
            let jsxLine: JSX.Element[] = []
            line.split('').forEach(character => {
                if (character === ' ') {
                    let element: JSX.Element = <span className="text-white" key={i++}>&nbsp;</span>
                    jsxLine.push(element)
                }
                else {
                    let element: JSX.Element = <span className="text-white" key={i++}>{character}</span>
                    jsxLine.push(element)
                }
            })
            result.push(<div key={++i}>{jsxLine}</div>)
        })
        
        return result
    }

    // Anything wrapped in this return statement is HTML
    return (
        <main>
            <div className="grid grid-cols-3 bg-stgray-200 items-end">
                {/* stronglyTyped in top left */}
                <div id="logo" className="flex py-4 ml-3 place-self-start">
                    <h4 className="login-text text-mint">strongly</h4>
                    <h4 className="login-text text-white ">Typed;</h4>
                </div>

                {/* Navigation bar options */}
                <div id="navigation-bar" className="px-4 place-self-end">
                    <ul className="flex">
                        <Link href="/standard/1"><a id="standard-tab" className="inactive-tab">Standard</a></Link>
                        <Link href="/syntax/1"><a id="syntax-tab" className="active-tab">Syntax</a></Link>
                        <Link href="/tutorials/1"><a id="tutorials-tab" className="inactive-tab">Tutorials</a></Link>
                    </ul>
                </div>

                {/* Account options dropdown menu */}
                <div id="account-dropdown" className="py-4 mr-16 place-self-end">

                    <Image className={userDropdown ? "rotate-90" : ""} src="/username-arrow.png" alt="" width={13} height={15} />

                    <button id="username" onClick={toggle} className="hover:text-mint text-white text-2xl px-3">{props.user.username}</button>

                    {/* Sets the value of the style attribute to either "block" or "none" */}
                    <ul id="menu-items" style={{ display: userDropdown ? "block" : "none" }} className="z-20 font-semibold mt-1 absolute bg-stgray-200 border-2 py-2 px-2 border-mint">
                        <Link href="/account-options"><li className="hover:text-mint text-white py-1"><button>Account Options</button></li></Link>
                        <li onClick={() => signOut()} className="hover:text-mint text-white py-1"><button>Log Out</button></li>
                    </ul>
                </div>
            </div>
            <div id="main-tabs" className="bg-stgray-100 h-screen text-center mb-4">
                <SyntaxTab testID={props.testID} unlocked={props.unlocked} initialText={getInitialLines(props.test.text)} leaderScores={props.leaderScores} userID={props.userID} test={props.test} scores={props.scores} averageScore={props.averageScore}/>
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
        var values = [context.query.id, 'syntax']
        var { rows: tests } = await client.query('SELECT * FROM Tests WHERE id = $1 AND type = $2', values)
        // Make sure that the test id is a tutorial
        if (tests.length > 0) {
            values = [session.user.id, 'syntax']
            // Get personal highscores for all tutorials
            var { rows: highScores } = await client.query('SELECT * FROM Leaderboards l INNER JOIN tests t ON l.test_id = t.id AND l.type = t.type WHERE user_id = $1 and t.type = $2 ORDER BY l.test_id', values)
            values = [session.user.id, context.query.id]
            var { rows: averageScore } = await client.query('SELECT * FROM Scores WHERE user_id = $1 and test_id = $2', values)
            values = ['syntax', context.query.id]
            var { rows: leaderScores } = await client.query('SELECT * FROM Leaderboards l INNER JOIN users u ON l.user_id = u.id WHERE type = $1 and test_id = $2 ORDER BY (high_wpm * (high_accuracy / 100)) desc limit 15', values)
            values = [session.user.id]
            var { rows: unlocks } = await client.query('SELECT test_id FROM unlocks WHERE user_id = $1', values)
            await client.end()

            
            //get challenge group
            let challengesInAGroup = 5
            let group: number = Math.floor((tests[0].id - 1) / challengesInAGroup)
            //get subChallenge index
            let idInGroup: number = (tests[0].id - 1) % challengesInAGroup

            //if not the first challenge and prev is undefined
            //meaning a prev challenge has not been completed
            let index: number = group * challengesInAGroup + idInGroup + 1
            let iDsUnlocked: number[] = []
            unlocks.forEach(lock => {
                iDsUnlocked.push(lock.test_id)
            })
            if (idInGroup != 0 && !iDsUnlocked.includes(index)) {

                //find where prev had a score or is origin
                while (!iDsUnlocked.includes(index) && idInGroup > 0) {
                    index--
                    idInGroup--
                }
                
                //redirect to appropriate test
                return {
                    redirect: {
                        destination: ("/syntax/" + (index))
                    },
                    props: {}
                }
            }
            return {props: {unlocked: unlocks, user: session.user, test: tests[0], scores: highScores, leaderScores: leaderScores, userID: session.user.id, averageScore: averageScore, testID: Number(context.query.id)}};
        }
        

        // If the test id is not syntax. Return a 404
        return {
            notFound: true
        }
    } catch (e: any) {
        switch (e.code) {
            case 'ENOTFOUND':
                break;
            default:
                console.log(e)
        }
    }

    return {props: {user: session.user, scores: [], averageScore: []}};
}

export default SyntaxPage;