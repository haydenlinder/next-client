import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { SessionData } from './types';
// This is a hasura auth webhook. See https://hasura.io/docs/latest/graphql/core/auth/authentication/webhook/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // access token from Authorization header
    const auth = req.headers.authorization; // "Bearer {token}" see https://datatracker.ietf.org/doc/html/rfc6750#section-2.1
    // check for an access_token
    if (!auth || typeof auth !== 'string') return res.status(401).json({ errors: "No Authorization header present." })
    const access_token = auth.split(" ")[1];
    // If no token, authorize as anon
    if (!access_token) return res.status(200).json({
        "x-hasura-role": "anon"
    });
    // Otherwise, verify the token
    let session: SessionData | undefined;
    try {
        session = jwt.verify(access_token, process.env.ACCESS_SECRET!) as SessionData;
    } catch (e) {
        console.error("auth error: ",e)
    }
    if (session === undefined) return res.status(200).json({
        "x-hasura-role": "anon"
    });
    // Get the user id
    let user_id: number = -1;
    let is_admin: boolean = false;
    if (typeof session !== "string") {
        user_id = session.user_id;
        is_admin = session.is_admin;
    }
    // admin user
    if (is_admin) return res.status(200).json({
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        "x-hasura-role": "admin"
    })
    // return the user credentials to hasura
    return res.status(200).json({
        "x-hasura-user-id": String(user_id),
        "x-hasura-role": "user",
    });
};