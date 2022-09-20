import { NextApiRequest, NextApiResponse } from "next";
import { createUser, getUserByEmail } from "../apollo_functions/users";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sgMail, { ResponseError } from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export type SignupResponse = {
  data?: {
    message: string
  },
  errors?: string
}

export default async (req: NextApiRequest, res: NextApiResponse<SignupResponse>) => {
  const b = JSON.parse(req.body)
  // These better be available
  const {email, password} = b
  // Check if there is already a user with that email
  const { data } = await getUserByEmail(email)
  // If so, throw an error depending on the verified property
  const user = data?.users_connection?.edges[0]?.node
  if (user) {
    return res.status(400).json({ errors: `User with email address ${email} already exists.` })
  }
  // TODO: check if email is verified
  // Otherwise, create a password hash
  const password_hash = await bcrypt.hash(password, 10)
  // Save the user
  const { data: newUserData } = await createUser({ email: email, password_hash })
  const token = jwt.sign(
    { user_id: newUserData?.insert_users_one?.user_id, is_admin: false },
    process.env.REFRESH_SECRET!,
    { expiresIn: '7d' }
  )
  // And send them an email
  const params = new URLSearchParams({token})
  const msg = {
    to: email,
    from: `noreply@${process.env.EMAIL_DOMAIN}`, 
    subject: 'Please verify your email',
    text: `Please use this link to verify your email: ${process.env.BASE_URL}/verify?${params.toString()}`,
    html: `<p>Please <a href="${process.env.BASE_URL}/verify?token=${token}">verify your email.</a></p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (e) {
    const error = e as ResponseError;
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }

    res.status(500).json({ errors: "Something went wrong. Please try again." })
  }

  return res.json({
    data: {
      message: `Verification link sent to ${email}. Please verify your email.`
    }
  })
};


