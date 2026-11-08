import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { DatabaseSync } from 'node:sqlite';
import { LocationRepository } from '../src/repositories/locationRepository.js';
import { ItemRepository } from '../src/repositories/itemRepository.js';
import { InventoryService } from '../src/services/inventoryService.js';

describe('InventoryService', () => {
  let db: DatabaseSync;
  let service: InventoryService;
  let locationRepo: LocationRepository;
  let itemRepo: ItemRepository;

  beforeEach(() => {
    // In-memory test database for isolation and speed
    db = new DatabaseSync(':memory:');
    db.exec(`
      CREATE TABLE locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        parent_id INTEGER REFERENCES locations(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        sku TEXT UNIQUE,
        category TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        condition TEXT NOT NULL DEFAULT 'good',
        estimated_value REAL,
        location_id INTEGER NOT NULL REFERENCES locations(id),
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE item_audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    locationRepo = new LocationRepository(db);
    itemRepo = new ItemRepository(db);
    service = new InventoryService(itemRepo, locationRepo);
  });

  test('should create a location and retrieve it', () => {
    const loc = service.createLocation({ name: 'Garage Shelf A', description: 'Top shelf' });
    assert.strictEqual(loc.name, 'Garage Shelf A');
    assert.ok(loc.id > 0);

    const retrieved = service.getLocation(loc.id);
    assert.strictEqual(retrieved.name, 'Garage Shelf A');
  });

  test('should create an item and track initial audit log', () => {
    const loc = service.createLocation({ name: 'Lab' });
    const item = service.createItem({
      name: 'Multimeter Digital',
      category: 'Tools',
      quantity: 1,
      locationId: loc.id,
      condition: 'good',
      tags: ['electronics', 'test'],
    });

    assert.strictEqual(item.name, 'Multimeter Digital');
    assert.deepStrictEqual(item.tags, ['electronics', 'test']);

    const { history } = service.getItem(item.id);
    assert.strictEqual(history.length, 1);
    assert.strictEqual(history[0].action, 'create');
  });

  test('should log location transfer when item is moved', () => {
    const locA = service.createLocation({ name: 'Box A' });
    const locB = service.createLocation({ name: 'Box B' });

    const item = service.createItem({
      name: 'Screwdriver Set',
      category: 'Tools',
      quantity: 1,
      locationId: locA.id,
    });

    service.updateItem(item.id, { locationId: locB.id });

    const { item: updated, history } = service.getItem(item.id);
    assert.strictEqual(updated.locationId, locB.id);

    const transferLog = history.find((h) => h.action === 'location_transfer');
    assert.ok(transferLog, 'Expected location_transfer audit entry');
  });

  test('should reject creation with negative quantity', () => {
    const loc = service.createLocation({ name: 'Storage' });
    assert.throws(
      () =>
        service.createItem({
          name: 'Invalid Item',
          category: 'Misc',
          quantity: -5,
          locationId: loc.id,
        }),
      /Quantity must be zero or a positive number/
    );
  });
});
