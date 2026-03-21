import { PutObjectCommand } from '@aws-sdk/client-s3';
import { client } from '../config/s3.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3UrlsSchema } from '../validations/s3.validation.js';

export const generatePreSignedUrl = async (req, res) => {
    const result = s3UrlsSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ success: false, message: result.error.flatten().fieldErrors });
    }

    const { fileNames } = result.data;

    // I used existing S3Client instance to create all the presigned URLs
    // or all presigned URL are created using an existing S3Client instance that has already been provided with credentials.

    const bucket = process.env.BUCKET || 'time-capsule-bucket';

    try {
        // Create a array of promise objects using fileNames ,PutObjectCommand and mainly getSignedUrl used to create the presigned url
        const allFiles = fileNames.map((fileName) => {
            const command = new PutObjectCommand({ Bucket: bucket, Key: fileName });

            // It return a promise object to create presigned url when fullfiled
            return getSignedUrl(client, command, { expiresIn: 3500 });
        });

        // I use Promise all to create all presigned urls in parallel using an array of promise objects (allFiles)
        const preSignedUrls = await Promise.all(allFiles);

        res.status(200).json({ success: true, message: 'pre_signed_url is generated', urls: preSignedUrls });
    } catch (error) {
        res.status(500).json({ success: false, error: 'internal server error' });
    }
};
