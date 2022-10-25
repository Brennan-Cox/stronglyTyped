import config from '../../pg_config'
import { NextApiRequest, NextApiResponse } from "next";
import { Client, QueryResult } from "pg";
import bcrypt from 'bcrypt'

/**
 * 
 * 
 * @param req 
 * @param res 
 */
export default async function change(req: NextApiRequest, res: NextApiResponse) {

    if (req.method == "POST") {

        //common fields
        var client: Client = new Client(config)
        
        //what will update
        var values: string[] = [req.body.newUser, req.body.currentUser];
        try {

            //connect and query
            await client.connect();
            await client.query('UPDATE Users SET username = $1 WHERE username = $2', values)
            
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