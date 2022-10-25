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
            await auth(client, req.body.currentUser, req.body.currentPassword)
            await client.query('UPDATE Users SET username = $1 WHERE username = $2', values)

            res.status(200).end()
        } catch (e: any) {
            switch (e.code) {
                case '23505':
                    res.status(400).json({ error: "Username already taken" });
                    break;
                case '2001':
                    res.status(401).json({ error: "Incorrect Password" });
                    break;
                default: res.status(400).json({ error: "Error connecting to database" });
            }
        }
    }
}

async function auth(client: Client, username: string, password: string) {

    //authorize
    var response: QueryResult<any> = await client.query('SELECT id, username, password from Users WHERE Username = $1', [username])
    console.log(response)
    if (response.rowCount > 0) {
        var user: any = response.rows[0]
        var hashedPassword: string = user.password
        var isSame: boolean = await bcrypt.compare(password, hashedPassword)

        //if authorized
        if (!isSame) {
            throw {code: '2001'};
        }
    }
}