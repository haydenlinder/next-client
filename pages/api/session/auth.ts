import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
// This is a hasura auth webhook. See https://hasura.io/docs/latest/graphql/core/auth/authentication/webhook/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // access token from cookies
    const auth = req.cookies["Authorization"]; // "Bearer {token}" see https://datatracker.ietf.org/doc/html/rfc6750#section-2.1
    if (!auth) return res.status(401).json({ errors: "No Authorization header present." })
    const access_token = auth.split(" ")[1];
    // If no token, throw 401
    if (!access_token) return res.status(401).json({ errors: 'No token.' });
    // Otherwise, verify the token
    const payload = jwt.verify(access_token, process.env.ACCESS_SECRET!)
    if (!payload) return res.status(401).json({ errors: 'Invalid token.' });
    // Get the user id
    let user_id: string = "";
    if (typeof payload !== "string") user_id = payload.user_id;
    // return the access_token to be stored in memory on the client
    return res.status(200).json({
        "x-hasura-user-id": user_id,
        "x-hasura-role": "user",
    });
};