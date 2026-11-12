import { Router } from 'express';
import { deleteComment } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.delete('/:id', authenticate, requireAdmin, deleteComment);

export default router;
