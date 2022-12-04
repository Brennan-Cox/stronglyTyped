import type { NextPage, NextPageContext, GetServerSideProps } from 'next'
import Link from 'next/link';
import Router from 'next/router'
import { useState, FormEvent } from 'react';
import { signIn, SignInResponse, getSession } from 'next-auth/react'
import { Session } from 'next-auth'

/**
 * 
 */
const Login: NextPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    /**
     * Handles submitting the information the user provided to
     * the authentication handler. On success, will redirect to
     * main-page.
     * 
     * @param event: FormEvent<HTMLFormElement>
     */
    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        // Prevent default behavior when form is submitted
        event.preventDefault()

        // Set error back to empty
        setError('')

        // Attempt log in
        var response: SignInResponse | undefined = await signIn('credentials', {username: username, password: password, redirect: false})

        // Check for an error
        if (response?.error) {
            // Display the error returned from the database
            setError(response.error)
        } else {
            // Successful log in. Redirecting to main application.
            Router.push('/main-page')
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
                    <div className="flex justify-center py-10 px-20">
                        <h4 className="login-text text-mint">strongly</h4>
                        <h4 className="login-text text-white ">Typed;</h4>
                    </div>
                    <div className="flex justify-center">
                        <h4 className="login-text text-white">Log In</h4>
                    </div>
                    <ErrorMessage/>

                    {/* The action attribute will depend on how this page interacts with the database */}
                    <form onSubmit={(e) => { handleLogin(e)}}>
                        <h1 className="ml-6 mt-3 mb-2 text-white">Username</h1>
                        <input onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username" className="w-96 ml-6 rounded-sm mb-3" />
                        <h1 className="ml-6 mt-3 mb-2 text-white">Password</h1>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" className="w-96 ml-6 rounded-sm mb-3" required/>
                        <div className="flex justify-between py-7">
                        <div>
                            <Link href="/createAccount">
                                <a className="text-mint font-semibold ml-6 mt-1 hover:bg-stgray-100">Create an account</a>
                            </Link>
                        </div>
                        <div>
                            <input type="submit" className="text-mint text-center py-1 font-semibold border-2 border-mint hover:bg-stgray-100 w-20 mr-10" value="Log in"/>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </main>
  )
}

/**
 * Gets the session server-side and redirects to the main-page
 * if there is a session active
 * 
 * @param context Request information passed to the server.
 * @returns props
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
    var session: Session | null = await getSession(context)
    if (session) {
        return {
            redirect: {
                destination: "/main-page"
            },
            props: {}
        }
    }

    return { props: {}}
}

export default Login;