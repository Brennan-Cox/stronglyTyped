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
    //common fields
    var client: Client = new Client(config)
    let currentUser = req.body.currentUser
    var condition: string = currentUser
    var values: string[]

    //PassChange method
    if (req.method == "POST") {

        //what will update
        var hashed_password: string = await bcrypt.hash(req.body.newPassword, 10)
        values = [hashed_password, condition];
        try {

            //connect, autorize? update : no-update
            client.connect()

            //authorize
            var response: QueryResult<any> = await client.query('SELECT id, username, password from Users WHERE Username = $1', [currentUser])
            if (response.rowCount > 0) {
                var user: any = response.rows[0]
                var hashedPassword: string = user.password
                var isSame: boolean = await bcrypt.compare(req.body.currentPassword, hashedPassword)

                //if authorized
                if (isSame) {
                    //query
                    await client.query('UPDATE Users SET password = $1 WHERE username = $2', values)
                } else {
                    //incorrect Password
                    throw new Error('2000');
                }
            } else {
                //incorrect Username
                throw new Error('2000');
            }
            //end
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