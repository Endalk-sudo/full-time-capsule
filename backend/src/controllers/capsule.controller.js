import prisma from '../server.js';
import { auth } from '../middlewares/auth.js';
import { client as s3Client } from '../config/s3.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createCapsuleSchema, capsuleUrlParamSchema } from '../validations/capsule.validation.js';

export const createCapsule = async (req, res) => {
    const { userId } = req;

    const result = createCapsuleSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error.flatten().fieldErrors);
    }

    const { title, message, unlockDate, files, recipients } = result.data;

    try {
        const dbResult = await prisma.capsule.create({
            data: {
                title,
                message_body: message,
                unlock_date: new Date(unlockDate),
                user: {
                    connect: { id: userId },
                },
                recipients: {
                    createMany: {
                        data: (recipients || []).map((email) => ({ email_address: email })),
                    },
                },
                files: {
                    createMany: {
                        data: (files || []).map((file) => ({
                            s3_object_key: file.s3_key,
                            file_name: file.original_name,
                            file_size: String(file.file_size),
                            mime_type: file.mime_type,
                        })),
                    },
                },
            },
        });
        res.json({ message: 'create capsule', result: dbResult });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getCapsules = async (req, res) => {
    const { userId } = req;

    try {
        const result = await prisma.capsule.findMany({
            where: { user_id: userId },
        });

        res.status(200).json({ message: 'all capsules', result });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getCapsule = async (req, res) => {
    const result = capsuleUrlParamSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json(result.error.flatten().fieldErrors);
    }

    const { id } = result.data;

    try {
        const result = await prisma.capsule.findUnique({
            where: { id: id },
            include: { recipients: true, files: true },
        });

        if (!result) return res.status(404).json({ error: 'Capsule not found' });

        res.status(200).json({ message: 'single capsule', result });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCapsule = async (req, res) => {
    const result = capsuleUrlParamSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json(result.error.flatten().fieldErrors);
    }

    const { id } = result.data;

    try {
        const result = await prisma.capsule.update({
            where: { id: id },
            data: req.body,
        });

        res.json({ msg: 'update capsule', result });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteCapsule = async (req, res) => {
    const result = capsuleUrlParamSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json(result.error.flatten().fieldErrors);
    }

    const { id } = result.data;

    try {
        const capsule = await prisma.capsule.findUnique({ where: { id }, include: { files: true } });

        if (capsule.status === 'SENT') {
            return res.status(400).json({ message: "capsule is already sent you can't delete it" });
        }

        const result = await prisma.capsule.delete({
            where: { id: id },
        });

        if (capsule?.files.length > 0) {
            const s3ObjDeletePromises = capsule.files.map((f) => {
                return s3Client.send(new DeleteObjectCommand({ Bucket: process.env.BUCKET, Key: f.s3_object_key }));
            });

            await Promise.all(s3ObjDeletePromises);
        }

        await res.json({ message: 'delete capsule', result });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
