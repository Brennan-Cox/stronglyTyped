import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import config from '../../../pg_config'
import { Client, QueryResult } from 'pg'
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import bcrypt from 'bcrypt'
/**
 * 
 */
var options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            // Use username and password credentials
            credentials: { username: { }, password: { }},
            // Handles the authorization of a user
            async authorize(credentials) {
                var client: Client = new Client(config)
                try {
                    // Connect to database
                    await client.connect()

                    // Send query
                    var response: QueryResult<any> = await client.query('SELECT id, username, password from Users WHERE Username = $1', [credentials!.username])

                    // If rows returned is greater than 0 the credentials were correct
                    if (response.rowCount > 0) {
                        var user: any = response.rows[0]
                        var hashedPassword: string = user.password
                        var isSame: boolean = await bcrypt.compare(credentials!.password, hashedPassword)

                        if (isSame) {
                            return user
                        }
                    }

                    // Username or password incorrect error
                    throw new Error('2000')
                } catch (e: any) {
                    switch (e.message) {
                        case '2000':
                            throw new Error("Username or password is incorrect")
                        default:
                            throw new Error("Error connecting to database")
                    }
                }
            },

        })
    ],

    // Sets up a session with the user that signed in
    callbacks: {
        jwt: async ({token, user}) => {
            if (user) {
                token.user = user
            }

            return token
        },

        session: async ({session, token}) => {
            if (token) {
                session.user = token.user
            }
            return session
        }
    },


    secret: "FnMFBv73JxZN",
    jwt: {
        secret: "6uQSYvsccLmV",
    },

    // Redirects
    pages: {
        signIn: "/login",
        error: "/login",
        signOut: "/",
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)