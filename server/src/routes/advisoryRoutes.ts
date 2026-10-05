import { Router } from 'express';
import { AdvisoryController } from '../controllers/advisoryController';
import { requireAuth } from '../middleware/authMiddleware';
import { advisoryLimiter } from '../middleware/rateLimiter';
import { validateBody } from '../middleware/validateMiddleware';
import { AdvisoryRequestInputSchema } from '../../../shared/schemas/advisory';

const router = Router();

// All advisory routes are protected by authentication
router.use(requireAuth);

router.post('/', advisoryLimiter, validateBody(AdvisoryRequestInputSchema), AdvisoryController.create);
router.get('/', AdvisoryController.list);
router.get('/:id', AdvisoryController.getById);
router.delete('/:id', AdvisoryController.delete);

export default router;
