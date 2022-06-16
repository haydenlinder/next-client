import { NextApiRequest, NextApiResponse } from "next"
import cookie from 'cookie'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Add refresh token to cookies
    res.setHeader(
        "Set-Cookie",
        cookie.serialize(
            'refresh_token',
            "",
            {
                path: '/',
                // signed: true,
                // httpOnly: true,
                // https only v
                // secure: true,
                // sameSite: 'none'
            }
        )
    )
    // Return access_token to be stored in memory
    return res.json({
        data: "Success"
    })
}