import { Router, Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventoryService.js';
import { ItemFilterQuery } from '../models/types.js';

export function createItemRouter(service: InventoryService): Router {
  const router = Router();

  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: ItemFilterQuery = {
        search: req.query.search as string | undefined,
        category: req.query.category as string | undefined,
        locationId: req.query.locationId ? Number(req.query.locationId) : undefined,
        tag: req.query.tag as string | undefined,
        limit: req.query.limit ? Number(req.query.limit) : 50,
        offset: req.query.offset ? Number(req.query.offset) : 0,
      };

      const items = service.listItems(filters);
      res.json({ data: items, count: items.length });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = service.getItem(Number(req.params.id));
      res.json({ data: result.item, history: result.history });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = service.createItem(req.body);
      res.status(201).json({ data: item });
    } catch (err) {
      next(err);
    }
  });

  router.patch('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = service.updateItem(Number(req.params.id), req.body);
      res.json({ data: item });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      service.deleteItem(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
