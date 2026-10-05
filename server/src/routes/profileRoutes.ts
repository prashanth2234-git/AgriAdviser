import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { requireAuth } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { ProfileUpdateSchema, PreferencesUpdateSchema } from '../../../shared/schemas/advisory';

const router = Router();

router.use(requireAuth);

router.get('/profile', ProfileController.getProfile);
router.patch('/profile', validateBody(ProfileUpdateSchema), ProfileController.updateProfile);

router.get('/preferences', ProfileController.getPreferences);
router.patch('/preferences', validateBody(PreferencesUpdateSchema), ProfileController.updatePreferences);

export default router;
