import { NextApiRequest, NextApiResponse } from "next"
import cookie from 'cookie'
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const refreshToken = req.cookies.refresh_token;
    // If no token, throw 401
    if (!refreshToken) return res.status(401).json({ errors: 'No token.' });
    // Otherwise, verify the token
    let payload;
    try {
        payload = jwt.verify(refreshToken, process.env.ACCESS_SECRET!)
    } catch(e) {
        console.log("refresh server error: ", {e})
    }
    if (!payload) return res.status(401).json({ errors: 'Invalid token.' });
    // Get the user id
    let user_id: string = "";
    if (typeof payload !== "string") user_id = payload.user_id;
    // Generate a refresh token
    const refresh_token = jwt.sign(
        { user_id: user_id },
        process.env.REFRESH_SECRET!,
        { expiresIn: '7d' }
    )
    // Generate access token
    const access_token = jwt.sign(
        { user_id: user_id },
        process.env.ACCESS_SECRET!,
        { expiresIn: '15m' }
    )
    // Add refresh token to cookies
    res.setHeader(
        "Set-Cookie",
        cookie.serialize(
            'refresh_token',
            refresh_token,
            {
                path: '/',
                // signed: true,
                httpOnly: true,
                // // https only v
                secure: true,
                sameSite: 'none'
            }
        )
    )
    res.setHeader(
        "Set-Cookie",
        cookie.serialize(
            'access_token',
            access_token ,
            {
                path: '/',
                // signed: true,
                httpOnly: true,
                // // https only v
                secure: true,
                sameSite: 'none'
            }
        )
    )
    // Return access_token to be stored in memory
    // and the user_id for identification
    return res.json({
        data: {
            user_id,
            access_token
        }
    })
}