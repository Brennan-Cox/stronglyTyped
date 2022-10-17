import config from '../../pg_config'
import { Client, QueryResult } from 'pg'
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        var client: Client = new Client(config)
        try {
            await client.connect()
            var username: string = req.body.username
            var password: string = req.body.password
            var hashed_password: string = await bcrypt.hash(password, 10)
            var values: string[] = [username, hashed_password]
            await client.query('INSERT INTO Users(username, password) VALUES($1, $2)', values)
            res.status(200).end()
        } catch (e: any) {
            switch (e.code) {
                case '23505':
                    res.status(400).json({error: "Username already taken"});
                    break;
                default: res.status(400).json({error: "Error connecting to database"});
            }
        }
    }
}