
import { NextApiRequest, NextApiResponse } from "next"

import { s3 } from "../s3-client"

type Response = {
    data?: any;
    errors?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    const key = req.query.key
    
    if (typeof key !== 'string') return res.json({ errors: `Expected key to be "string", instead got: ${typeof key}` })
    
    const downloadParams = {
        Key: key,
        Bucket: process.env.S3_BUCKET_NAME || ""
    }
    
    const readStream = s3.getObject(downloadParams).createReadStream()
    
    readStream.pipe(res)
}