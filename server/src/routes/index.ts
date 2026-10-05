import { Router } from 'express';
import authRoutes from './authRoutes';
import advisoryRoutes from './advisoryRoutes';
import profileRoutes from './profileRoutes';
import dashboardRoutes from './dashboardRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/advisories', advisoryRoutes);
router.use('/', profileRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
