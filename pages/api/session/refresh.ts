import { NextApiRequest, NextApiResponse } from "next"
import cookie from 'cookie'
import jwt from 'jsonwebtoken';
import { TokenPayload } from "./types";

export type RefreshResponse = {
    data?: {
        user_id: number | undefined;
        access_token: string;
        is_admin: boolean
    },
    errors?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<RefreshResponse>) {
    const refreshToken = req.cookies.refresh_token;

    // If no token, throw 401
    if (!refreshToken) return res.status(401).json({ errors: 'No token.' });
    // Otherwise, verify the token
    let payload: TokenPayload | undefined;
    try {
        payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as TokenPayload
    } catch(e) {
        console.error("refresh server error: ", {e})
    }

    if (!payload) {
        // logout
        res.setHeader(
            "Set-Cookie",
            [
                cookie.serialize(
                    'refresh_token',
                    "",
                    {
                        path: '/',
                        // signed: true,
                        httpOnly: true,
                        // https only v
                        secure: true,
                        sameSite: 'none'
                    }
                ),
                cookie.serialize(
                    'access_token',
                    "",
                    {
                        path: '/',
                        // signed: true,
                        httpOnly: true,
                        // https only v
                        secure: true,
                        sameSite: 'none'
                    }
                ),
            ]
        )
        return res.status(401).json({ errors: 'Invalid token.' });
    }
    // Get the user id
    let user_id: number | undefined;
    let is_admin: boolean = false;
    if (typeof payload !== "string") {
        user_id = payload.user_id;
        is_admin = payload.is_admin
    }
    // Generate a refresh token
    const refresh_token = jwt.sign(
        { user_id: user_id, is_admin: is_admin },
        process.env.REFRESH_SECRET!,
        { expiresIn: '7d' }
    )
    // Generate access token
    const access_token = jwt.sign(
        { user_id: user_id, is_admin: is_admin },
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
            access_token,
            is_admin

        }
    })
}