import { Router } from 'express';
import { updateProfile } from '../controllers/authController';
import { 
  getBookmarks, 
  addBookmark, 
  removeBookmark, 
  getHistory, 
  saveProgress 
} from '../controllers/readerController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../validators/authValidator';
import { progressSchema } from '../validators/storyValidator';

const router = Router();

router.use(authenticate);

// Profile
router.put('/profile', validate(updateProfileSchema), updateProfile);

// Bookmarks
router.get('/bookmarks', getBookmarks);
router.post('/bookmarks', addBookmark);
router.delete('/bookmarks/:storyId', removeBookmark);

// History & Progress
router.get('/history', getHistory);
router.put('/history', validate(progressSchema), saveProgress);

export default router;
