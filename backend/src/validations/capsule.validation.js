import * as z from 'zod';

export const createCapsuleSchema = z.object({
    title: z.string().min(3, 'Title has to be at least 3 character').max(50, 'Title has to be under 50 character'),
    message: z.string().min(1, 'message must be provided').max(500, 'message has to be under 500 character'),
    unlockDate: z.iso.date(),
    files: z.array(
        z.object({
            s3_object_key: z.string(),
            file_name: z.string(),
            file_size: z.number(),
            mime_type: z.string(),
        }),
    ),
    recipients: z.array(z.object()),
});

export const capsuleUrlParamSchema = z.object({
    id: z.uuid(),
});
