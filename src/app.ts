import express, { Express } from 'express';
import cors from 'cors';
import { getDatabase } from './db/database.js';
import { LocationRepository } from './repositories/locationRepository.js';
import { ItemRepository } from './repositories/itemRepository.js';
import { InventoryService } from './services/inventoryService.js';
import { createLocationRouter } from './routes/locationRoutes.js';
import { createItemRouter } from './routes/itemRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp(customDbPath?: string): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Database and Dependency Injection
  const db = getDatabase(customDbPath);
  const locationRepo = new LocationRepository(db);
  const itemRepo = new ItemRepository(db);
  const inventoryService = new InventoryService(itemRepo, locationRepo);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'shelfkeep', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/locations', createLocationRouter(inventoryService));
  app.use('/api/items', createItemRouter(inventoryService));

  // Error Handler
  app.use(errorHandler);

  return app;
}
