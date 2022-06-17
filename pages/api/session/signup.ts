import { NextApiRequest, NextApiResponse } from "next";
import { createUser, getUserByEmail } from "../apollo_functions/users";
import bcrypt from 'bcrypt';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const b = JSON.parse(req.body)
  // These better be available
  const {email, password} = b
  // Check if there is already a user with that email
  const { data } = await getUserByEmail(email)
  // If so, throw an error depending on the verified property
  const user = data?.users_connection?.edges[0]?.node
  if (user) {
    res.status(400).json({ error: `User with email address ${email} already exists.` })
  }
  // TODO: check if email is verified
  // Otherwise, create a password hash
  const password_hash = await bcrypt.hash(password, 10)
  // And save the user
  const { data: newUserData } = await createUser({ email: email, password_hash })
  // TODO: send a confirmation email
  // Return a confirmation message with instructions to check email
  return res.json({
    data: {
      message: `Verification link sent to ${email}. Please verify your email.`
    }
  })
};


