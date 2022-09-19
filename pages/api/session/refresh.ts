import { NextApiRequest, NextApiResponse } from "next"
import cookie from 'cookie'
import jwt from 'jsonwebtoken';
import { SessionData } from "./types";

export type RefreshResponse = {
    data?: {
        session: SessionData
        access_token: string
        refresh_token: string
    },
    errors?: string
}

export const setCookies = (cookies: Record<string, string>, res: NextApiResponse) => {
    for (const key in cookies) {
        res.setHeader(
            "Set-Cookie",
            Object.keys(cookies).map(key => 
                cookie.serialize(
                    key,
                    cookies[key],
                    cookieConfig
                )
            )
        )
    }
};

export const cookieConfig: cookie.CookieSerializeOptions = {
    path: '/',
    // signed: true,
    httpOnly: true,
    // // https only v
    secure: true,
    sameSite: 'none'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<RefreshResponse>) {
    const refreshToken = req.cookies.refresh_token;
    // If no token, throw 401
    if (!refreshToken) return res.status(401).json({ errors: 'No token.' });
    // Otherwise, verify the token
    let session: SessionData | undefined;
    try {
        session = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as SessionData
    } catch(e) {
        console.error("refresh server error: ", {e})
    }

    if (!session) {
        const cookies = {
            is_admin: "",
            access_token: "",
            refresh_token: "",
            user_id: ""
        }
        // logout
        setCookies(cookies, res)
        return res.status(401).json({ errors: 'Invalid token.' });
    }
    // Get the user id
    if (typeof session === "string") return res.status(500).json({ errors: "Unexpected session format" })
    const { user_id, is_admin, iat, exp } = session;
    // Generate a refresh token
    const refresh_token = jwt.sign(
        { user_id, is_admin },
        process.env.REFRESH_SECRET!,
        { expiresIn: '7d' }
    )
    // Generate access token
    const access_token = jwt.sign(
        { user_id, is_admin },
        process.env.ACCESS_SECRET!,
        { expiresIn: '15m' }
    )
    // Add tokens to cookies
    const cookies: Record<string, string> = {
        refresh_token,
        access_token,
        is_admin: String(is_admin),
        user_id: String(user_id)
    }
    setCookies(cookies, res)
    // Return access_token to be stored in memory
    // and the user_id for identification
    return res.json({
        data: {
            access_token,
            refresh_token,
            session: {
                user_id,
                is_admin,
                iat, 
                exp
            }
        }
    })
}