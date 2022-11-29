import config from '../../pg_config'
import { Client, QueryResult } from 'pg'
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'

/**
 * Handles signing up a user. Users password is hashed and the username and 
 * hashed password is stored in the database.
 * 
 * @param req
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        var client: Client = new Client(config)
        try {

            // Make sure the password and confirm password match
            if (req.body.password != req.body.confirmPassword) {
                throw {code: '2002'}
            }
            await client.connect()
            var username: string = req.body.username
            var password: string = req.body.password

            //Hash password
            var hashed_password: string = await bcrypt.hash(password, 10)
            var values: string[] = [username, hashed_password]
            await client.query('INSERT INTO Users(username, password) VALUES($1, $2)', values)
            res.status(200).end()
        } catch (e: any) {
            console.log(e.message);
            switch (e.code) {
                case '23514':
                    // invalid characters in username
                    res.status(401).json({ error: "Username may only contain alphanumeric characters and underscores."})
                    break;
                case '23505':
                    res.status(400).json({ error: "Username already taken" });
                    break;
                case '2002':
                    res.status(400).json({ error: "Password and confirm password doesn't match" });
                    break;
                default: res.status(400).json({ error: "Error connecting to database" });
            }
        }
    }
}