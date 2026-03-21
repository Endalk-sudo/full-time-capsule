import { PrismaClient } from '../src/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    // This ID must exist in your 'User' table before running this script
    const USER_ID = 'a8a8e304-8d05-48df-a5e1-a63faa60af7f';

    console.log('Seeding capsules for user:', USER_ID);

    await prisma.capsule.deleteMany({where: {user_id : USER_ID}})

    // ────────────────────────────────────────────────
    // Capsule 1 – Classic future message (locked)
    // ────────────────────────────────────────────────
    await prisma.capsule.create({
        data: {
            user_id: USER_ID,
            title: 'Open when you graduate 🎓',
            message_body:
                'Hey love, if you’re reading this then you finally made it! I’m so proud of you. Remember that night we stayed up until 4 a.m. talking about your dreams? This is proof you can do anything.',
            unlock_date: new Date('2027-06-15T09:00:00Z'),
            status: 'LOCKED',
            created_at: new Date('2025-11-20T14:30:00Z'),
            files: {
                createMany: {
                    data: [
                        {
                            s3_object_key: 'users/a8a8.../grad-photo-2025.jpg',
                            file_name: 'graduation_selfie.jpg',
                            file_size: '2841921',
                            mime_type: 'image/jpeg',
                        },
                        {
                            s3_object_key: 'users/a8a8.../video-message.mp4',
                            file_name: 'congrats-video.mp4',
                            file_size: '14567890',
                            mime_type: 'video/mp4',
                        },
                    ],
                },
            },
            recipients: {
                createMany: {
                    data: [
                        { email_address: 'sarah.miller94@gmail.com', delivery_status: false },
                        { email_address: 'mom.davis@gmail.com', delivery_status: false },
                    ],
                },
            },
        },
    });

    // ────────────────────────────────────────────────
    // Capsule 2 – Already sent (past unlock date)
    // ────────────────────────────────────────────────
    await prisma.capsule.create({
        data: {
            user_id: USER_ID,
            title: 'New Year 2026 wishes',
            message_body:
                'Hey future me,\n\nIf 2026 was anything like the last few years… I hope you finally took that solo trip to Japan. Also – did you keep watering the monstera? Be honest.',
            unlock_date: new Date('2026-01-01T00:00:00Z'),
            status: 'SENT',
            created_at: new Date('2025-12-20T23:15:00Z'),
            recipients: {
                createMany: {
                    data: [{ email_address: 'myself.private@proton.me', delivery_status: true }],
                },
            },
        },
    });

    // ────────────────────────────────────────────────
    // Capsule 3 – Very soon (almost due)
    // ────────────────────────────────────────────────
    await prisma.capsule.create({
        data: {
            user_id: USER_ID,
            title: 'To my best friend – 30th birthday',
            message_body:
                'Dude. Thirty. We’re ancient. Here’s the embarrassing photo folder password: ilovepizza99\n\nLove you forever.',
            unlock_date: new Date('2026-04-10T08:00:00Z'),
            status: 'LOCKED',
            created_at: new Date('2025-10-05T17:45:00Z'),
            files: {
                createMany: {
                    data: [
                        {
                            s3_object_key: 'users/a8a8.../throwback-2015.zip',
                            file_name: 'cringy-high-school-photos.zip',
                            file_size: '8734567',
                            mime_type: 'application/zip',
                        },
                    ],
                },
            },
            recipients: {
                createMany: {
                    data: [{ email_address: 'jake.the.snake94@gmail.com', delivery_status: false }],
                },
            },
        },
    });

    // ────────────────────────────────────────────────
    // Capsule 4 – No recipients (self-only)
    // ────────────────────────────────────────────────
    await prisma.capsule.create({
        data: {
            user_id: USER_ID,
            title: 'Letters to my future kids (if any)',
            message_body:
                'If you exist one day: I’m sorry for all the times I was on my phone instead of looking at you.',
            unlock_date: new Date('2042-07-20T12:00:00Z'),
            status: 'LOCKED',
            created_at: new Date('2025-08-12T09:20:00Z'),
            files: {
                createMany: {
                    data: [
                        {
                            s3_object_key: 'users/a8a8.../voice-2025-08-12.wav',
                            file_name: 'dad-voice-message-2025.wav',
                            file_size: '5423100',
                            mime_type: 'audio/wav',
                        },
                    ],
                },
            },
        },
    });

    // ────────────────────────────────────────────────
    // Capsule 5 – Processing (edge case)
    // ────────────────────────────────────────────────
    await prisma.capsule.create({
        data: {
            user_id: USER_ID,
            title: 'Emergency goodbye – do NOT open unless…',
            message_body:
                'If something happened to me and you’re reading this… just know I love you more than anything.',
            unlock_date: new Date('2026-03-01T00:00:00Z'),
            status: 'PROCESSING',
            created_at: new Date('2026-02-01T03:10:00Z'),
            recipients: {
                createMany: {
                    data: [
                        { email_address: 'emma.johnson22@outlook.com', delivery_status: false },
                        { email_address: 'thomas.r@company.com', delivery_status: false },
                    ],
                },
            },
        },
    });

    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
