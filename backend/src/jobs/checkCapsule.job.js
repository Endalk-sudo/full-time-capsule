import cron from 'node-cron';
import prisma from '../server.js';
import emailQueue from '../config/queue.js';

const checkDb = () => {
    cron.schedule('* * * * *', async (ctx) => {
        console.log('****job fired******✌🏾');
        try {
            // Atomically update only LOCKED capsules whose unlock date has passed.
            // This prevents race conditions where a second cron tick could pick up
            // the same capsules before the first tick finishes processing them.
            const { count } = await prisma.capsule.updateMany({
                where: {
                    unlock_date: {
                        lt: new Date(),
                    },
                    status: 'LOCKED',
                },
                data: {
                    status: 'PROCESSING',
                },
            });

            if (count > 0) {
                // Now query the capsules we just flipped to PROCESSING
                const capsules = await prisma.capsule.findMany({
                    where: { status: 'PROCESSING' },
                });

                const jobName = 'send-email';

                const capsuleJobs = capsules.map((c) => ({ name: jobName, data: { id: c.id } }));

                console.log("All capsule ID's ", capsuleJobs);

                await emailQueue.addBulk(capsuleJobs);
            }
        } catch (error) {
            console.error('cron error : ', error);
        }
    });
};

export default checkDb;
