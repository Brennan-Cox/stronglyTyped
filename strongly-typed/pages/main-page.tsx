import type { NextPage, GetServerSideProps } from 'next'
import React, { useState } from "react";
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { signOut } from "next-auth/react";
import dynamic from 'next/dynamic' 
const StandardTab = dynamic(() => import('../components/standardTab'))
const SyntaxTab = dynamic(() => import('../components/syntaxTab'))
const TutorialsTab = dynamic(() => import('../components/tutorialsTab'))

const Main: NextPage = (props: any) => {

    /**
     * A React hook, "hooks" into a React feature. Let's us define a variable and a function to manipulate/interact with that variable.
     * Documentation: https://reactjs.org/docs/hooks-state.html
     * 
     * Below hooks and method used for updating the styling of a selected tab, and displaying the correct content for each tab
     */
    const [syntax, setActiveSyntax] = useState(false);
    const [standard, setActiveStandard] = useState(true);
    const [tutorials, setActiveTutorials] = useState(false);

    /**
     * Updates hooks to display selected tab's content, and update styling of selected tab.
     * @param tab - tab to be activated
     */
    function toggleActiveTab(tab: String) {
        switch (tab) {
            case "standard":
                setActiveStandard(true);
                setActiveSyntax(false);
                setActiveTutorials(false);
                break;
            case "syntax":
                setActiveSyntax(true);
                setActiveStandard(false);
                setActiveTutorials(false);
                break;
            case "tutorial":
                setActiveTutorials(true);
                setActiveSyntax(false);
                setActiveStandard(false);
                break;
        }
    }

    /**
     * Used for the user account dropdown menu. Inverts value of showMe variable for the element menu-items 
     */
    const [userDropdown, setUserDropdown] = useState(false);
    function toggle() {
        setUserDropdown(!userDropdown);
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
                        <li id="standard-tab" onClick={() => toggleActiveTab("standard")} className={standard ? "active-tab" : "inactive-tab"}><button>Standard</button></li>
                        <li id="syntax-tab" onClick={() => toggleActiveTab("syntax")} className={syntax ? "active-tab" : "inactive-tab"}><button>Syntax</button></li>
                        <li id="tutorials-tab" onClick={() => toggleActiveTab("tutorial")} className={tutorials ? "active-tab" : "inactive-tab"}><button>Tutorial</button></li>
                    </ul>
                </div>

                {/* Account options dropdown menu */}
                <div id="account-dropdown" className="py-4 mr-4">

                    <button id="username" onClick={toggle} className="hover:text-mint text-white text-2xl px-12">{props.username}</button>

                    {/* Sets the value of the style attribute to either "block" or "none" */}
                    <ul id="menu-items" style={{ display: userDropdown ? "block" : "none" }} className="z-20 font-semibold mt-1 absolute bg-stgray-200 border-2 py-2 px-2 border-mint">
                        <Link href="/account-options"><li className="hover:text-mint text-white py-1"><button>Account Options</button></li></Link>
                        <li onClick={() => signOut()} className="hover:text-mint text-white py-1"><button>Log Out</button></li>
                    </ul>
                </div>
            </div>
            <div id="main-tabs" className="bg-stgray-100 text-center">
                <div id="standard" className={standard ? "block" : "hidden"}>
                    <StandardTab/>
                </div>
                <div id="syntax" className={syntax ? "block" : "hidden"}>
                    <SyntaxTab/>
                </div>
                <div id="tutorials" className={tutorials ? "block" : "hidden"}>
                    <TutorialsTab text="Drill54"/>
                </div>
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
    return {
        redirect: {
            destination: '/standard/1'
        },
        props: {}
    }
}


export default Main;