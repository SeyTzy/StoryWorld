import { Router } from 'express';
import authRoutes from './authRoutes';
import storyRoutes from './storyRoutes';
import chapterRoutes from './chapterRoutes';
import categoryRoutes from './categoryRoutes';
import userRoutes from './userRoutes';
import commentRoutes from './commentRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/stories', storyRoutes);
router.use('/chapters', chapterRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/comments', commentRoutes);
router.use('/admin', adminRoutes);

export default router;
