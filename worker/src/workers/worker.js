import dotenv from 'dotenv';
dotenv.config();
import { Worker } from 'bullmq';
import redisConnection from '../config/redis.js';
import { prisma } from '../config/prisma.js';
import transporter from '../config/nodemailer.js';

const emailWorker = new Worker(
    'email-sending',
    async (job) => {
        const { id } = job.data;

        try {
            console.log(`Sending capsule job ${job.id} capsule id ${id}`);

            const result = await prisma.capsule.findUnique({
                where: { id },
                include: { recipients: true, files: true },
            });

            console.log('capsule full data : ', result);

            const { title, message_body, recipients, files } = result;

            const emailList = recipients.map((rec) => rec.email_address);

            console.log('email list: ', emailList);

            const mailOptions = {
                from: process.env.EMAIL,
                to: emailList,
                subject: title,
                text: message_body,
            };

            const info = await transporter.sendMail(mailOptions);

            console.log('info', info);

            const updatedCapsule = await prisma.capsule.update({ where: id, data: { status: 'SENT' } });

            console.log('updated capusle that sent :', updatedCapsule);
        } catch (error) {
            console.error(`Email sending failed for job ${job.id}:`, error);

            // If it's a permanent failure (invalid email), don't retry
            if (error.code === 'INVALID_EMAIL') {
                console.error(`Permanent email failure for ${to}:`, error.message);
                throw new Error('Permanent email failure - no retry');
            }

            throw error; // This will trigger retry
        }
    },
    {
        connection: redisConnection,
        concurrency: 5,
    },
);

emailWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed ✅`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');

    // Close workers
    await emailWorker.close();

    // Close server
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
