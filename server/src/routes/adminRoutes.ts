import { Router } from 'express';
import { 
  getDashboardStats,
  getAdminStories,
  createStory,
  updateStory,
  deleteStory,
  createChapter,
  updateChapter,
  deleteChapter,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getUsers,
  toggleUserStatus,
} from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { uploadCover } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { 
  createStorySchema, 
  createChapterSchema, 
  createCategorySchema 
} from '../validators/storyValidator';

const router = Router();

// Protect all admin routes
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Stories
router.get('/stories', getAdminStories);
router.post('/stories', uploadCover.single('cover'), validate(createStorySchema), createStory);
router.put('/stories/:id', uploadCover.single('cover'), updateStory);
router.delete('/stories/:id', deleteStory);

// Chapters
router.post('/chapters', validate(createChapterSchema), createChapter);
router.put('/chapters/:id', updateChapter);
router.delete('/chapters/:id', deleteChapter);

// Categories
router.get('/categories', getAdminCategories);
router.post('/categories', validate(createCategorySchema), createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Users
router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);

export default router;
