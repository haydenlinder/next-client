import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import multer from "multer";
import multerSharpS3 from "multer-sharp-s3";


import AWS from "aws-sdk";

console.log("construting S3 client with params", {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_SERVER_URL,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
});

export const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_SERVER_URL,
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
    ACL: "public-read",
    Bucket: process.env.S3_BUCKET_NAME,
    multiple: true,
    resize: [
        { suffix: "lg.webp", width: 800, height: 800 },
        { suffix: "md.webp", width: 500, height: 500 },
        { suffix: "sm.webp", width: 300, height: 300 },
        { suffix: "thumb.webp", width: 150, height: 150 },
        { suffix: "original.webp" },
    ],
    // Key: (req, file, cb) => {
    //     crypto.pseudoRandomBytes(16, (err, raw) => {
    //         const filename = err ? undefined : raw.toString("hex");
    //         cb(err, filename);
    //     });
    // },
});

const upload = multer({ storage });

// Code outside of the exported request handler will be invoked once
// So let's try to bootstrap the bucket we want to upload to, in case it doesn't exist

async function checkBucketExists(s3: AWS.S3, bucketName: string) {
    const options = { Bucket: bucketName };
    try {
        await s3.headBucket(options).promise();
        return true;
    } catch (error) {
        if (error.statusCode === 404) return false;
        throw error;
    }
}

async function createBucketIfNotExists(s3: AWS.S3, bucketName: string) {
    const exists = await checkBucketExists(s3, bucketName);
    if (exists) return;

    console.log(
        "Checked for S3 bucket",
        process.env.S3_BUCKET_NAME,
        "but it didn't exist. Attempting to create it now"
    );

    const bucket = await s3
        .createBucket({
            Bucket: "my-bucketname",
            ACL: "public-read",
        })
        .promise();

    console.log("Created bucket:", bucket);

    return bucket;
}

createBucketIfNotExists(s3, process.env.S3_BUCKET_NAME || "").catch((err) => {
    console.log("Got error while creating bucket", process.env.S3_BUCKET_NAME);
    console.log(err);
});

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