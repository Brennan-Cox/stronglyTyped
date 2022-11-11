import type { NextPage, GetServerSideProps } from 'next'
import React, { useState } from "react";
import Link from 'next/link';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { signOut } from "next-auth/react";
import SyntaxTab from '../../components/syntaxTab'

const SyntaxPage: NextPage = (props: any) => {

    return (<></>)
    /**
     * Used for the user account dropdown menu. Inverts value of showMe variable for the element menu-items 
     */
    // const [userDropdown, setUserDropdown] = useState(false);
    // function toggle() {
    //     setUserDropdown(!userDropdown);
    // }
    


    // // Anything wrapped in this return statement is HTML
    // return (
    //     <main>
    //         <div className="flex bg-stgray-200 justify-between items-end">
    //             {/* stronglyTyped in top left */}
    //             <div id="logo" className="flex py-4 ml-3">
    //                 <h4 className="login-text text-mint">strongly</h4>
    //                 <h4 className="login-text text-white ">Typed;</h4>
    //             </div>

    //             {/* Navigation bar options */}
    //             <div id="navigation-bar" className="px-4">
    //                 <ul className="flex">

    //                     <Link href="/standard/1"><a id="standard-tab" className="inactive-tab">Standard</a></Link>
    //                     <Link href="/syntax/1"><a id="syntax-tab" className="active-tab">Syntax</a></Link>
    //                     <Link href="/tutorials/1"><a id="tutorials-tab" className="inactive-tab">Tutorials</a></Link>
    //                 </ul>
    //             </div>

    //             {/* Account options dropdown menu */}
    //             <div id="account-dropdown" className="py-4 mr-4">

    //                 <button id="username" onClick={toggle} className="hover:text-mint text-white text-2xl px-12">{props.user.username}</button>

    //                 {/* Sets the value of the style attribute to either "block" or "none" */}
    //                 <ul id="menu-items" style={{ display: userDropdown ? "block" : "none" }} className="font-semibold mt-1 absolute bg-stgray-200 border-2 py-2 px-2 border-mint">
    //                     <Link href="/account-options"><li className="hover:text-mint text-white py-1"><button>Account Options</button></li></Link>
    //                     <li onClick={() => signOut()} className="hover:text-mint text-white py-1"><button>Log Out</button></li>
    //                 </ul>
    //             </div>
    //         </div>
    //         <div id="main-tabs" className="bg-stgray-100 h-screen text-center">
    //             <SyntaxTab />
    //         </div>
    //     </main>
    // )
}

// /**
//  * Gets the session server-side and redirects to the login-page
//  * if there is no active session
//  * 
//  * @param context Request information passed to the server.
//  * @returns props
//  */
//  export const getServerSideProps: GetServerSideProps = async (context) => {
//     var session: Session | null = await getSession(context)

//     if (!session) {
//         return {
//             redirect: {
//                 destination: "/"
//             },
//             props: {}
//         }
//     }

//     console.log(context.query)

//     return {props: {user: session.user}};
// }

export default SyntaxPage;