import { NextApiRequest, NextApiResponse } from "next"
import cookie from 'cookie'
import jwt from 'jsonwebtoken';

export type VerifyResponse = {
    data?: string;
    errors?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<VerifyResponse>) {
    if (!req.query.token) return res.status(401).json({ errors: "No token." })
    if (typeof req.query.token !== 'string') return res.status(401).json({ errors: "Received multiple tokens, expected one." })
    const token = req.query.token;
    // Otherwise, verify the token
    let payload;
    try {
        payload = jwt.verify(token, process.env.REFRESH_SECRET!)
    } catch (e) {
        console.log("refresh server error: ", { e })
    }
    
    if (!payload) return res.status(401).json({ errors: 'Invalid token.' });

    return res.json({
        data: "Success"
    })
}