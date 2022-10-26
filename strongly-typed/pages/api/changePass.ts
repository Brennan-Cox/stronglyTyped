import config from '../../pg_config'
import { NextApiRequest, NextApiResponse } from "next";
import { Client, QueryResult } from "pg";
import bcrypt from 'bcrypt'

/**
 * Function will access the database and if the user inputs the correct password they may
 * change their account password
 * If the user inputs an incorrect password the respective error code is thrown
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

    //POST method required for json
    if (req.method == "POST") {

        //hash newPassword
        var hashed_password: string = await bcrypt.hash(req.body.newPassword, 10)

        //set what will input into database
        values = [hashed_password, condition];
        try {

            //if password is not confirmed then throw error code
            if (req.body.newPassword != req.body.confirmNewPassword) {
                throw {code: '2002'}
            }

            //connect to database client
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

                    //incorrect Password throw code
                    throw {code: '2001'};
                }
            }
            //end
            res.status(200).end()
        } catch (e: any) {

            //on error code
            switch (e.code) {
                case '23505':
                    //database error code return
                    res.status(400).json({ error: "Username already taken" });
                    break;
                case '2001':
                    //where incorrect currentPassword is given and does not matched database hash
                    res.status(401).json({ error: "Incorrect Password" });
                    break;
                case '2002':
                    //where the newPassword in not confirmed
                    res.status(401).json({ error: "Password and confirm password doesn't match" });
                    break;
                default: res.status(400).json({ error: "Error connecting to database" });
                //where no valid code is given
            }
        }
    }
}