import { getDatabase } from '../db/database.js';
import { LocationRepository } from '../repositories/locationRepository.js';
import { ItemRepository } from '../repositories/itemRepository.js';

function seed() {
  console.log('🌱 Seeding sample inventory data...');
  const db = getDatabase();
  const locationRepo = new LocationRepository(db);
  const itemRepo = new ItemRepository(db);

  // Clean existing sample data
  db.exec('DELETE FROM item_audit_logs;');
  db.exec('DELETE FROM items;');
  db.exec('DELETE FROM locations;');

  // Create Locations
  const workshop = locationRepo.create({
    name: 'Workshop Room A',
    description: 'Main garage workshop area',
  });

  const shelf1 = locationRepo.create({
    name: 'Shelf 01 - Heavy Duty',
    description: 'Steel shelf near the workbench',
    parentId: workshop.id,
  });

  const binElectronics = locationRepo.create({
    name: 'Bin E-102 (Microcontrollers)',
    description: 'ESD safe plastic bin on Shelf 01',
    parentId: shelf1.id,
  });

  const office = locationRepo.create({
    name: 'Home Office',
    description: 'Desk and bookshelf area',
  });

  console.log('✅ Created locations');

  // Create Sample Items
  const sampleItems = [
    {
      name: 'Soldering Iron Station 60W',
      description: 'Temperature controlled soldering station with brass cleaner',
      sku: 'TOOL-SLD-001',
      category: 'Tools',
      quantity: 1,
      condition: 'good' as const,
      estimatedValue: 49.99,
      locationId: shelf1.id,
      tags: ['electronics', 'soldering', 'workbench'],
    },
    {
      name: 'ESP32-WROOM-32D Development Board',
      description: 'Dual-core WiFi + Bluetooth MCU board (pack of 3)',
      sku: 'MCU-ESP32-003',
      category: 'Electronics',
      quantity: 3,
      condition: 'new' as const,
      estimatedValue: 18.5,
      locationId: binElectronics.id,
      tags: ['mcu', 'iot', 'hardware', 'wireless'],
    },
    {
      name: 'Digital Caliper 150mm Stainless Steel',
      description: 'High precision 0.01mm digital measuring caliper',
      sku: 'TOOL-CAL-002',
      category: 'Tools',
      quantity: 1,
      condition: 'good' as const,
      estimatedValue: 25.0,
      locationId: shelf1.id,
      tags: ['measuring', 'precision', 'hand-tool'],
    },
    {
      name: 'The Pragmatic Programmer (20th Anniversary Edition)',
      description: 'Hardcover technical book on software engineering craftsmanship',
      sku: 'BOOK-PRAG-001',
      category: 'Books',
      quantity: 1,
      condition: 'good' as const,
      estimatedValue: 45.0,
      locationId: office.id,
      tags: ['books', 'software', 'reading'],
    },
    {
      name: 'M3 Hex Socket Head Screws Assortment Kit',
      description: '300-piece stainless steel assortment kit M3x4mm to M3x20mm',
      sku: 'FAST-M3-300',
      category: 'Fasteners',
      quantity: 280,
      condition: 'new' as const,
      estimatedValue: 14.99,
      locationId: shelf1.id,
      tags: ['hardware', 'fasteners', '3d-printing'],
    },
  ];

  for (const itemData of sampleItems) {
    const item = itemRepo.create(itemData);
    itemRepo.logAudit(item.id, 'create', `Initial seed data for ${item.name}`);
  }

  console.log(`✅ Seeded ${sampleItems.length} items with realistic mock data!`);
}

seed();
