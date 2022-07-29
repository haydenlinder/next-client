import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import multer from "multer";
import multerSharpS3 from "multer-sharp-s3";


import AWS from "aws-sdk";

export const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    // endpoint: process.env.S3_SERVER_URL,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
});
/**
 * ===========================
 * FILE UPLOAD CONFIG
 * ===========================
 */
const storage = multerSharpS3({
    toFormat: 'webp',
    s3,
    ACL: undefined,
    Bucket: process.env.S3_BUCKET_NAME,
    multiple: true,
    resize: [
        { suffix: "lg.webp", width: 800, height: 800 },
        { suffix: "md.webp", width: 500, height: 500 },
        { suffix: "sm.webp", width: 300, height: 300 },
        { suffix: "thumb.webp", width: 150, height: 150 },
        { suffix: "original.webp" },
    ],
});

const upload = multer({ storage });


/**
 * ===========================
 * HANDLER
 * ===========================
 */
const handler = nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
        console.log(err);
    },
});

handler.post(upload.single("image"), async (req, res) => {
    if (!req.file) res.status(400).json({ message: "Failed to upload file" });
    return res.json({ file: req.file });
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler;