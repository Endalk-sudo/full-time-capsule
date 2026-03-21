import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import {
    createCapsule,
    updateCapsule,
    getCapsule,
    getCapsules,
    deleteCapsule,
} from '../controllers/capsule.controller.js';

const router = Router();

router.use(auth);

router.post('/', createCapsule);

router.get('/', getCapsules);

router.get('/:id', getCapsule);

router.put('/:id', updateCapsule);

router.delete('/:id', deleteCapsule);

export default router;
