import { ClientConfig } from "pg"

const config: ClientConfig = {
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}

export default config