import { localstackConfig } from '../config/localStackConfig.js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client(localstackConfig);

export function generateDownloadUrl(files, expiresIn = 604800) {
    const downloadUrls = files.map((file) => {
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET,
            Key: file.s3_object_key,
        });

        return getSignedUrl(s3Client, command, { expiresIn: expiresIn });
    });

    return downloadUrls;
}
