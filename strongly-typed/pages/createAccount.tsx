import type { NextPage, GetServerSideProps } from 'next'
import Router from 'next/router'
import Link from 'next/link';
import { useState, FormEvent } from 'react'
import { signIn, getSession } from 'next-auth/react'

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
                body: JSON.stringify({username: username, password: password}),
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            // Check if the request was successful
            if (results.ok) {
                // Sign the user in and redirect them
                await signIn('credentials', {username: username, password: password, redirect: false})
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
                    <div className="flex justify-center py-10 px-20">
                        <h4 className="login-text text-mint">strongly</h4>
                        <h4 className="login-text text-white ">Typed;</h4>
                    </div>
                    <div className="flex justify-center">
                        <h4 className="login-text text-white">Create Account</h4>
                    </div>
                    <ErrorMessage/>
                    {/* The action attribute will depend on how this page interacts with the database */}
                    <form onSubmit={(e) => { handleSignup(e)}}>
                        <h1 className="ml-6 mt-3 mb-2 text-white">Username</h1>
                        <input onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username" className="w-96 ml-6 rounded-sm mb-3" />
                        <h1 className="ml-6 mt-3 mb-2 text-white">Password</h1>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" className="w-96 ml-6 rounded-sm mb-3" required/>
                        <h1 className="ml-6 mt-3 mb-2 text-white">Re-Enter Password</h1>
                        <input onChange={(e) => setConfirmPassword(e.target.value)}  type="password" id="confirm_password" name="confirm_password" className="w-96 ml-6 rounded-sm mb-3" required/>
                        <div className="flex justify-between py-7">
                        <div>
                            <Link href="/">
                                <button className="text-mint font-semibold ml-6 mt-1 hover:bg-stgray-100" >Return to Login Page</button>
                            </Link>
                        </div>
                        <div>
                            <button className="text-mint text-center py-1 font-semibold border-2 border-mint hover:bg-stgray-100 w-40 mr-10">Create Account</button>
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
    // Get stored session
    var session = await getSession(context)

    // If there is a session redirect them to the main-page
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

export default CreateAccount;