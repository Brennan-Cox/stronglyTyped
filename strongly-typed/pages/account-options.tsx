// Copy over the stuff from create account, but get a framework for what it will look like
import type { NextPage, GetServerSideProps } from 'next'
import Link from 'next/link';
import { useState, FormEvent } from 'react'
import { signIn, getSession, signOut, getCsrfToken } from 'next-auth/react'
import { Session } from 'next-auth';

/**
 * 
 */
const AccountOptions: NextPage = () => {

    var [currentUser, setUserName] = useState('')
    getUsername()
    var [newUser, setNewUsername] = useState('')
    var [currentPassword, setCurrentPassword] = useState('')
    var [newPassword, setNewPassword] = useState('')
    var [confirmNewPassword, confirmPassword] = useState('')
    var [error, setError] = useState('')
    var [success, setSuccess] = useState('')

    /**
     * Handles submitting the information the user provided to
     * the authentication handler. On success, will update user account password
     * 
     * @param event: FormEvent<HTMLFormElement>
     */
    async function handleUpdatePass(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        // Create a new user in the database
        var results: Response = await fetch('/api/changePass', {
            method: "POST",
            body: JSON.stringify({ currentUser: currentUser, currentPassword: currentPassword, newPassword: newPassword, confirmNewPassword: confirmNewPassword }),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        currentPassword = newPassword;

        // Check if the request was successful
        if (results.ok) {
            await signIn('credentials', { username: currentUser, password: newPassword, redirect: false })
            setSuccess("Password Updated Successfully")
        } else {
            // Display the error message
            var errorResponse = await results.json()
            setError(errorResponse.error)
        }
    }

    async function handleUpdateUser(event: FormEvent<HTMLFormElement>) {

        event.preventDefault()
        setError('')

        var results: Response = await fetch('/api/changeUser', {
            method: "POST",
            body: JSON.stringify({ currentUser: currentUser, newUser: newUser, currentPassword: currentPassword }),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        currentUser = newUser;

        if (results.ok) {
            await signIn('credentials', { username: newUser, password: currentPassword, redirect: false })
            setSuccess("Username Updated Successfully")
        } else {
            var errorResponse = await results.json()
            setError(errorResponse.error)
        }
    }

    /**
     * Custom tag that handles displaying the error message when the state
     * of the error changes
     * 
     * @returns JSX.Element
     */
    function ErrorMessage(): JSX.Element {
        if (error) {
            //issue exsists where error is not caught
            return (<p className='text-red-400 text-center'>{error}</p>)
        }
        return (<p></p>)
    }

    /**
     * Custom tag that handles displaying the sucess message upon successful update of username/password
     * 
     * @returns JSX.Element
     */
    function SuccessMessage(): JSX.Element {
        if (success) {
            //issue exsists where error is not caught
            return (<p className='text-green-400 text-center'>{success}</p>)
        }
        return (<p></p>)
    }

    async function getUsername() {
        const session = await getSession()
        if (session) {
            setUserName(session?.user.username);
        }
    }

    return (
        <main className="bg-stgray-100 w-screen h-screen flex justify-center items-center">
            <div className="w-128 h-96">
                <div className="bg-stgray-200 rounded-sm">
                    <div className="grid grid-cols-3">
                        <div className="pl-10 pt-10">
                            <Link href="/main-page">
                                <button><svg className="w-10 h-10 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></button>
                            </Link>
                        </div>
                        <div className="flex justify-center py-10 ">
                            <h4 className="login-text text-mint">strongly</h4>
                            <h4 className="login-text text-white ">Typed;</h4>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <h4 className="login-text text-white">Edit Account</h4>
                    </div>
                    <ErrorMessage />
                    <SuccessMessage />
                    {/* The action attribute will depend on how this page interacts with the database */}
                    {/*Change form so that password is always required */}
                    <div className="flex justify-evenly">
                        <div>
                            <p className="mt-3 mb-2 text-mint text-xl text-center">Current Password Required for Edits</p>
                            <input onChange={(e) => setCurrentPassword(e.target.value)} type="password" id="password" name="password" className="w-96 rounded-sm mb-3" required />
                        </div>
                    </div>
                    <form id="updateUser" onSubmit={(e) => { handleUpdateUser(e) }}>
                        <h1 className="ml-6 mt-3 mb-2 text-white">New Username</h1>
                        <input onChange={(e) => setNewUsername(e.target.value)} type="text" id="username" name="username" className="w-96 ml-6 rounded-sm mb-6" />
                        <div className="ml-6">
                            <button type="submit" className="text-mint text-center py-1 font-semibold border-2 border-mint hover:bg-stgray-100 w-40 mr-10 ml-auto">Update Username</button>
                        </div>
                    </form>
                    <form id="updatePassword" onSubmit={(e) => { handleUpdatePass(e) }}>
                        <h1 className="ml-6 mt-3 pb-2 text-white">New Password</h1>
                        <input onChange={(e) => setNewPassword(e.target.value)} type="password" id="confirm_password" name="confirm_password" className="w-96 ml-6 rounded-sm mb-6" required />
                        <h1 className="ml-6 mt-3 pb-2 text-white">Confirm New Password</h1>
                        <input onChange={(e) => confirmPassword(e.target.value)} type="password" id="confirm_password" name="confirm_password" className="w-96 ml-6 rounded-sm mb-6" required />
                        <div className="pb-4 ml-6">
                            <button type="submit" className="text-mint text-center py-1 font-semibold border-2 border-mint hover:bg-stgray-100 w-40 mr-10">Update Password</button>
                        </div>
                    </form>
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

    return { props: {} };
}

export default AccountOptions;