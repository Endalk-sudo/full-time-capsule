import { Router } from 'express';
import { generatePreSignedUrl } from '../controllers/s3.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.use(auth);

router.post('/pre_signed_url', generatePreSignedUrl);

export default router;
