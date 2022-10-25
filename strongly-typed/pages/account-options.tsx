// Copy over the stuff from create account, but get a framework for what it will look like
import type { NextPage, GetServerSideProps } from 'next'
import Router from 'next/router'
import Link from 'next/link';
import { useState, FormEvent } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { Session } from 'next-auth';

/**
 * 
 */
const CreateAccount: NextPage = () => {

    var [username, setUsername] = useState('')
    var [password, setPassword] = useState('')
    var [confirmPassword, setConfirmPassword] = useState('')
    var [error, setError] = useState('')

    /**
     * Handles submitting the information the user provided to
     * the authentication handler. On success, will create the user an account,
     * sign them in, and redirect to main-page.
     * 
     * @param event: FormEvent<HTMLFormElement>
     */
    async function handleSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        // Check if both passwords are the same
        if (password === confirmPassword) {

            // Create a new user in the database
            var results: Response = await fetch('/api/signup', {
                method: "POST",
                body: JSON.stringify({ username: username, password: password }),
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            // Check if the request was successful
            if (results.ok) {
                // Sign the user in and redirect them
                await signIn('credentials', { username: username, password: password, redirect: false })
                Router.push('/main-page')
            } else {
                // Display the error message
                var error: string = await results.json()
                setError(error)
            }
        } else {
            setError("Password and confirm password doesn't match")
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
            return (<p className='text-red-400 text-center'>{error}</p>)
        }
        return (<p></p>)
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
                    {/* The action attribute will depend on how this page interacts with the database */}
                    <form onSubmit={(e) => { handleSignup(e) }}>
                        <h1 className="ml-6 mt-3 mb-2 text-white">New Username</h1>
                        <input onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username" className="w-96 ml-6 rounded-sm mb-6" />
                        <div className="ml-6">
                            <Link href="/main-page">
                                <button className="text-mint text-center py-1 font-semibold border-2 border-mint hover:bg-stgray-100 w-40 mr-10 ml-auto">Update Username</button>
                            </Link>
                        </div>
                        <h1 className="ml-6 mt-3 mb-2 text-white">Current Password</h1>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" className="w-96 ml-6 rounded-sm mb-3" required />
                        <h1 className="ml-6 mt-3 pb-2 text-white">New Password</h1>
                        <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" id="confirm_password" name="confirm_password" className="w-96 ml-6 rounded-sm mb-6" required />
                        <div className="pb-4 ml-6">
                            <Link href="/main-page">
                                <button className="text-mint text-center py-1 font-semibold border-2 border-mint hover:bg-stgray-100 w-40 mr-10">Update Password</button>
                            </Link>
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

export default CreateAccount;