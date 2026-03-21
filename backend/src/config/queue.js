import redisConnection from './redis.js';
import { Queue } from 'bullmq';

const emailQueue = new Queue('email-sending', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
    },
});

export default emailQueue;
