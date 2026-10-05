import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimiter';
import { validateBody } from '../middleware/validateMiddleware';
import { RegisterSchema, LoginSchema } from '../../../shared/schemas/advisory';

const router = Router();

router.post('/register', authLimiter, validateBody(RegisterSchema), AuthController.register);
router.post('/login', authLimiter, validateBody(LoginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', requireAuth, AuthController.me);

export default router;
