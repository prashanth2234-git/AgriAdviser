import { Request, Response, NextFunction } from 'express';
import { AdvisoryEngine } from '../services/advisory/advisoryEngine';

export class DashboardController {
  static async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const summary = await AdvisoryEngine.getDashboardSummary(userId);
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}
