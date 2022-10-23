import type { NextPage, NextPageContext, GetServerSideProps } from 'next'
import React, { useState } from "react";
import Link from 'next/link';

const Main: NextPage = () => {

    /**
     * A React hook, "hooks" into a React feature. Let's us define a variable and a function to manipulate/interact with that variable.
     * Documentation: https://reactjs.org/docs/hooks-state.html
     */
    const [showMe, setShowMe] = useState(false);
    const [syntax, setActiveSyntax] = useState(false);
    const [standard, setActiveStandard] = useState(true);
    const [tutorials, setActiveTutorials] = useState(false);

    /**
     * Used for the user account dropdown menu. Inverts value of showMe variable for the element menu-items 
     */
    function toggle() {
        setShowMe(!showMe);
    }

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

    // Anything wrapped in a return statement is HTML
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
                    <ul className="flex nav nav-tabs">
                        <li id="standard-tab" onClick={() => toggleActiveTab("standard")} className={standard ? "active-tab" : "inactive-tab"}><a aria-controls="standard">Standard</a></li>
                        <li id="syntax-tab" onClick={() => toggleActiveTab("syntax")} className={syntax ? "active-tab" : "inactive-tab"}>Syntax</li>
                        <li id="tutorials-tab" onClick={() => toggleActiveTab("tutorial")} className={tutorials ? "active-tab" : "inactive-tab"}>Tutorial</li>
                    </ul>
                </div>

                {/* Account options dropdown menu */}
                <div id="account-dropdown" className="py-4 mr-4">

                    <a onClick={toggle} className="text-mint text-xl">Username</a>

                    {/* Sets the value of the style attribute to either "block" or "none" */}
                    <ul id="menu-items" style={{ display: showMe ? "block" : "none" }} className="font-semibold mt-1 absolute bg-stgray-200 border-2 py-1 px-2 border-mint">
                        <Link href="/account-options"><li className="hover:text-mint text-white"><a>Account options</a></li></Link>
                        <Link href="/"><li className="hover:text-mint text-white"><a href="">Log out</a></li></Link>
                    </ul>
                </div>
            </div>
            <div id="main-tabs" className="bg-stgray-100 h-screen tab-content">
                <div id="standard" className="text-white tab-pane">
                    Contents of the standard tab
                </div>
                <div id="syntax" className="text-white tab-pane">
                    Contents of the syntax tab
                </div>
                <div id="tutorials" className="text-white tab-pane">
                    Contents of the tutorials tab
                </div>
            </div>
        </main>
    )
}

export default Main;