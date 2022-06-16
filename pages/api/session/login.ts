import { NextApiRequest, NextApiResponse } from "next"
import { getUserByEmail } from "../apollo_functions/users"
import cookie from 'cookie'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const b = JSON.parse(req.body)
    // These better be available
    const { email, password } = b
    // Look for user with the email above
    const { data, error } = await getUserByEmail(email, true)
    console.log("Error finding user: ", {error})
    const user = data?.users_connection?.edges[0]?.node
    // Throw if no user or if they are not verified
    if (!user) return res.status(404).json({ errors: 'No user with that email.' })
    // TODO: handle case where user has not verified email
    // Check if password is correct
    const bcrypt = await import('bcrypt')
    const valid = bcrypt.compareSync(password, user.password_hash)
    // If not, throw
    if (!valid) return res.status(401).json({ errors: 'Wrong password.' })
    // Generate a refresh token
    const jwt = await import('jsonwebtoken')
    const refresh_token = jwt.sign(
        { user_id: user.id }, 
        process.env.REFRESH_SECRET!,
        { expiresIn: '7d' }
    )
    // Generate access token
    const access_token = jwt.sign(
        { user_id: user.id },
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
                // https only v
                secure: true,
                sameSite: 'none'
            }
        )
    )
    // Return access_token to be stored in memory
    return res.json({
        data: {
            user_id: user.id,
            access_token
        }
    })
}