import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import multer from "multer";
import multerSharpS3 from "multer-sharp-s3";
import { s3 } from '../s3-client'



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

export enum ImageSizes {
    "lg.webp" = "lg.webp",
    "md.webp" = "md.webp",
    "sm.webp" = "sm.webp",
    "thumb.webp" = "thumb.webp",
    "original.webp" = "original.webp",
}

type ImageAttributes = {
    Bucket: string
    ContentType: string
    ETag: string
    Key: string
    Location: string
    height: number
    key: string
    premultiplied: boolean;
    size: number;
    width: number
}

type Versions = Record<ImageSizes, ImageAttributes>


/**
 * ===========================
 * HANDLER
 * ===========================
 */

export type FileResponse = {
    file?: Express.Multer.File & Versions;
    message?: string;
}
const handler = nc<NextApiRequest, NextApiResponse<FileResponse>>({
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