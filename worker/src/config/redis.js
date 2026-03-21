import Redis from 'ioredis';

const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
};

const redisConnection = new Redis(redisConfig);

redisConnection.on('connect', () => {
    console.log('Redis connected successfully');
});

redisConnection.on('error', () => {
    console.error('Redis connection error:', err);
});

export default Redis;
