import { Router } from 'express';
import { 
  getStories, 
  getStoryBySlug, 
  getComments, 
  addComment, 
  rateStory 
} from '../controllers/storyController';
import { optionalAuthenticate, authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { addCommentSchema, rateStorySchema } from '../validators/storyValidator';

const router = Router();

router.get('/', optionalAuthenticate, getStories);
router.get('/:slug', optionalAuthenticate, getStoryBySlug);
router.get('/:id/comments', getComments);
router.post('/:id/comments', authenticate, validate(addCommentSchema), addComment);
router.post('/:id/ratings', authenticate, validate(rateStorySchema), rateStory);

export default router;
