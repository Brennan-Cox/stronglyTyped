import { NextApiRequest, NextApiResponse } from 'next'
import config from '../../pg_config'
import { Client } from 'pg'

/**
 * Handles updating a users wpm and accuracy of a given test.
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

        try {
            var client = new Client(config)
            await client.connect()
            var values = [userID, testID, accuracy, wpm]
            // Store procedure in database that handles updating a user's test with the wpm and accurcy.
            await client.query('CALL updateAverageScores($1, $2, $3::NUMERIC, $4::NUMERIC)', values);
            res.status(200).end()
        } catch(e: any) {
            switch (e.code) {
                default: res.status(400).end()
            }
        }
    }
}