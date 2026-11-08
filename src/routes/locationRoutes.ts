import { Router, Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventoryService.js';

export function createLocationRouter(service: InventoryService): Router {
  const router = Router();

  router.get('/', (_req: Request, res: Response, next: NextFunction) => {
    try {
      const locations = service.listLocations();
      res.json({ data: locations, count: locations.length });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      const location = service.getLocation(Number(req.params.id));
      res.json({ data: location });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      const location = service.createLocation(req.body);
      res.status(201).json({ data: location });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
