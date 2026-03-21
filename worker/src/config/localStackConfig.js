export const localstackConfig = {
    endpoint: process.env.LOCALSTACK_ENDPOINT || 'http://localhost:4566', // Unified endpoint
    region: process.env.LOCALSTACK_REGION || 'us-east-1', // Default; change if needed
    credentials: {
        accessKeyId: process.env.LOCALSTACK_ACCESS_KEY_ID || 'test', // Fake
        secretAccessKey: process.env.LOCALSTACK_SECRET_ACCESS_KEY || 'test', // Fake
    },
    forcePathStyle: true, // Important for S3—uses path-style URLs (LocalStack default)
};
