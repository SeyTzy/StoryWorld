import { Router } from 'express';
import { getChapterById } from '../controllers/storyController';
import { optionalAuthenticate } from '../middleware/auth';

const router = Router();

router.get('/:id', optionalAuthenticate, getChapterById);

export default router;
