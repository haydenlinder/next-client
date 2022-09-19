import { NextApiRequest, NextApiResponse } from "next"
import { setCookies } from "./refresh"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Add refresh token to cookies
    const cookies = {
        refresh_token: "",
        access_token: "",
        is_admin: "",
        user_id: ""
    }
    setCookies(cookies, res)
    // Return access_token to be stored in memory
    return res.json({
        data: "Success"
    })
}