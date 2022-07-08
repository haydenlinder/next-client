import { NextApiRequest, NextApiResponse } from "next";
import { createUser, getUserByEmail } from "../apollo_functions/users";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


import sgMail, { ResponseError, MailDataRequired } from '@sendgrid/mail';
console.log(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const sendEmail = async (msg: MailDataRequired) => {
  try {
    await sgMail.send(msg);
  } catch (e) {
    const error = e as ResponseError;
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const b = JSON.parse(req.body)
  // These better be available
  const {email, password} = b
  // Check if there is already a user with that email
  const { data } = await getUserByEmail(email)
  // If so, throw an error depending on the verified property
  const user = data?.users_connection?.edges[0]?.node
  if (user) {
    return res.status(400).json({ error: `User with email address ${email} already exists.` })
  }
  // TODO: check if email is verified
  // Otherwise, create a password hash
  const password_hash = await bcrypt.hash(password, 10)
  // And save the user
  const { data: newUserData } = await createUser({ email: email, password_hash })
  const token = jwt.sign(
    { user_id: newUserData?.insert_users_one?.id },
    process.env.REFRESH_SECRET!,
    { expiresIn: '7d' }
  )
  console.log("signup: ", token)
  const params = new URLSearchParams({token})
  const msg = {
    to: email,
    from: `noreply@${process.env.DOMAIN}`, // Use the email address or domain you verified above
    subject: 'Please verify your email',
    text: `Please use this link to verify your email: ${process.env.BASE_URL}/verify?${params.toString()}`,
    html: `<p>Please <a href="${process.env.BASE_URL}/verify?token=${token}">click here to verify your email.</p>`,
  };

  await sendEmail(msg)

  return res.json({
    data: {
      message: `Verification link sent to ${email}. Please verify your email.`
    }
  })
};


