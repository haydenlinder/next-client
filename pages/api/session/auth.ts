import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { TokenPayload } from './types';
// This is a hasura auth webhook. See https://hasura.io/docs/latest/graphql/core/auth/authentication/webhook/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // access token from Authorization header
    const auth = req.headers.authorization; // "Bearer {token}" see https://datatracker.ietf.org/doc/html/rfc6750#section-2.1
    console.log({auth})
    // check for an access_token
    if (!auth || typeof auth !== 'string') return res.status(401).json({ errors: "No Authorization header present." })
    const access_token = auth.split(" ")[1];
    // If no token, throw 401
    if (!access_token) return res.status(401).json({ errors: 'No token.' });
    // Otherwise, verify the token
    let payload: TokenPayload | undefined;
    try {
        payload = jwt.verify(access_token, process.env.ACCESS_SECRET!) as TokenPayload;
    } catch (e) {
        console.error("auth error: ",e)
    }
    if (payload === undefined) return res.status(401).json({ errors: 'Invalid token.' });
    // Get the user id
    let user_id: number = -1;
    if (typeof payload !== "string") user_id = payload.user_id;
    // return the user credentials to hasura
    return res.status(200).json({
        "x-hasura-user-id": String(user_id),
        "x-hasura-role": "user",
    });
};