import { Request, Response, NextFunction } from 'express';
import { AdvisoryEngine } from '../services/advisory/advisoryEngine';

export class AdvisoryController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const advisory = await AdvisoryEngine.createAdvisory(userId, req.body);
      res.status(201).json({
        success: true,
        data: advisory,
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { crop, domain, search, sort } = req.query as {
        crop?: string;
        domain?: string;
        search?: string;
        sort?: 'newest' | 'oldest';
      };

      const advisories = await AdvisoryEngine.getAdvisories(userId, {
        crop,
        domain,
        search,
        sort,
      });

      res.status(200).json({
        success: true,
        data: advisories,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = String(req.params.id);

      const advisory = await AdvisoryEngine.getAdvisoryById(userId, id);
      if (!advisory) {
        res.status(404).json({
          success: false,
          error: {
            code: 'ADVISORY_NOT_FOUND',
            message: 'Agricultural advisory record not found or you do not have permission to view it.',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: advisory,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = String(req.params.id);

      const deleted = await AdvisoryEngine.deleteAdvisory(userId, id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: {
            code: 'ADVISORY_NOT_FOUND',
            message: 'Advisory not found or already deleted',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { message: 'Advisory deleted successfully' },
      });
    } catch (error) {
      next(error);
    }
  }
}
