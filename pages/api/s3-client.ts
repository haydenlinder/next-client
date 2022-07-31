import AWS from "aws-sdk";

export const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    // endpoint: process.env.S3_SERVER_URL,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
});
