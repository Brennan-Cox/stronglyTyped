import { NextApiRequest, NextApiResponse } from 'next'
import config from '../../pg_config'
import { Client } from 'pg'

/**
 * Handles updating a user's highscore of a given test.
 *  
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "PUT") {
        var testID = req.body.test_id
        var userID = req.body.user_id
        var wpm = req.body.wpm
        var accuracy = req.body.accuracy
        var type = req.body.type

        try {
            var client = new Client(config)
            await client.connect()
            var values = [userID, testID, accuracy, wpm, type]
            // Function in database that handles updating a user's highscore if they beat the previous highscore
            // Returns a boolean value if they did beat their previous highscore.
            var { rows } = await client.query('SELECT updateHighScore($1, $2, $3::NUMERIC, $4::NUMERIC, $5)', values);
            var result = rows[0]
            res.status(200).json({didBeatHighscore: result.updatehighscore})
        } catch(e: any) {
            switch (e.code) {
                default: res.status(400).end()
            }
        }
    }
}