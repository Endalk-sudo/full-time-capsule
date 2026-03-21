import cron from 'node-cron';
import prisma from '../server.js';
import emailQueue from '../config/queue.js';

const checkDb = () => {
    cron.schedule('* * * * *', async (ctx) => {
        console.log('****job fired******✌🏾');
        try {
            const resulte = await prisma.capsule.findMany({
                where: {
                    unlock_date: {
                        lt: new Date(),
                    },
                    status: 'LOCKED',
                },
            });

            if (resulte.length > 0) {
                await prisma.capsule.updateMany({
                    where: {
                        unlock_date: {
                            lt: new Date(),
                        },
                    },
                    data: {
                        status: 'PROCESSING',
                    },
                });

                const jobName = 'send-email';

                const capsuleJobs = resulte.map((c) => ({ name: jobName, data: { id: c.id } }));

                console.log("All capsule ID's ", capsuleJobs);

                await emailQueue.addBulk(capsuleJobs);
            }
        } catch (error) {
            console.error('cron error : ', error);
        }
    });
};

export default checkDb;
