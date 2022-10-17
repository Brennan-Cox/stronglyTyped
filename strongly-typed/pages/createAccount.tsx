import type { NextPage } from 'next'
import Link from 'next/link';

const CreateAccount: NextPage = () => {

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

                    {/* The action attribute will depend on how this page interacts with the database */}
                    <form action="POST">
                        <h1 className="ml-6 mt-3 mb-2 text-white">Username</h1>
                        <input type="text" id="username" name="username" className="w-96 ml-6 rounded-sm mb-3" />
                        <h1 className="ml-6 mt-3 mb-2 text-white">Password</h1>
                        <input type="password" id="password" name="password" className="w-96 ml-6 rounded-sm mb-3" required/>
                        <h1 className="ml-6 mt-3 mb-2 text-white">Re-Enter Password</h1>
                        <input type="password" id="password" name="password" className="w-96 ml-6 rounded-sm mb-3" required/>
                    </form>

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
                </div>
            </div>
        </main>
  )
}

export default CreateAccount;