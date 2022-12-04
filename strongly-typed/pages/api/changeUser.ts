import config from '../../pg_config'
import { NextApiRequest, NextApiResponse } from "next";
import { Client, QueryResult } from "pg";
import bcrypt from 'bcrypt'

/**
 * this function will access the database and if the user inputs the correct password they may
 * change their account username
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
                case '23514':
                    // invalid characters in username
                    res.status(401).json({ error: "Username may only contain alphanumeric characters and underscores."})
                    break;
                case '23505':
                    // database side error code
                    res.status(400).json({ error: "Username already taken" });
                    break;
                case '2001':
                    // would be thrown by auth function for incorrect currentPassword value
                    res.status(401).json({ error: "Incorrect Password" });
                    break;
                default: res.status(400).json({ error: "Error connecting to database" });
            }
        }
    }
}

/**
 * This is a function that will verify that the given username and password
 * are correspond to a row on the given client database
 * 
 * @param client 
 * @param username 
 * @param password 
 */
async function auth(client: Client, username: string, password: string) {

    //get response to query
    var response: QueryResult<any> = await client.query('SELECT id, username, password from Users WHERE Username = $1', [username])
    
    //where row is returned (aka a correct username is provided)
    if (response.rowCount > 0) {

        //get user and respective hashed password
        var user: any = response.rows[0]
        var hashedPassword: string = user.password

        //check if the database hashed password is the same as the given password after same hash
        var isSame: boolean = await bcrypt.compare(password, hashedPassword)

        //if not authorized
        if (!isSame) {
            throw {code: '2001'};
            //password is incorrect
        }
    }
    //****else should never occur */
}