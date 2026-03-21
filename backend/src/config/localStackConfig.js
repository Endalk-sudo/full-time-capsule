export const localstackConfig = {
    endpoint: 'http://localhost:4566', // Unified endpoint
    region: 'us-east-1', // Default; change if needed
    credentials: {
        accessKeyId: 'test', // Fake
        secretAccessKey: 'test', // Fake
    },
    forcePathStyle: true, // Important for S3—uses path-style URLs (LocalStack default)
};
