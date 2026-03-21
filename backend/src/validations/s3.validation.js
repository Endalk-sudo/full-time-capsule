import * as z from 'zod';

export const s3UrlsSchema = z.object({
    fileNames: z.array(z.string()),
});
