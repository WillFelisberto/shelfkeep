import { ItemRepository } from '../repositories/itemRepository.js';
import { LocationRepository } from '../repositories/locationRepository.js';
import { Item, CreateItemDTO, UpdateItemDTO, ItemFilterQuery, Location } from '../models/types.js';

export class InventoryService {
  constructor(
    private itemRepo: ItemRepository,
    private locationRepo: LocationRepository
  ) {}

  // Location methods
  listLocations(): Location[] {
    return this.locationRepo.findAll();
  }

  getLocation(id: number): Location {
    const loc = this.locationRepo.findById(id);
    if (!loc) {
      throw new Error(`Location with id ${id} not found`);
    }
    return loc;
  }

  createLocation(data: { name: string; description?: string; parentId?: number | null }): Location {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Location name is required');
    }
    if (data.parentId) {
      const parent = this.locationRepo.findById(data.parentId);
      if (!parent) {
        throw new Error(`Parent location with id ${data.parentId} does not exist`);
      }
    }
    return this.locationRepo.create(data);
  }

  // Item methods
  listItems(filters: ItemFilterQuery = {}): Item[] {
    return this.itemRepo.findAll(filters);
  }

  getItem(id: number): { item: Item; history: any[] } {
    const item = this.itemRepo.findById(id);
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    const history = this.itemRepo.getAuditLogs(id);
    return { item, history };
  }

  createItem(dto: CreateItemDTO): Item {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error('Item name is required');
    }
    if (dto.quantity === undefined || dto.quantity < 0) {
      throw new Error('Quantity must be zero or a positive number');
    }
    if (!this.locationRepo.findById(dto.locationId)) {
      throw new Error(`Target location with id ${dto.locationId} does not exist`);
    }

    const item = this.itemRepo.create(dto);
    this.itemRepo.logAudit(item.id, 'create', `Created item "${item.name}" with initial quantity ${item.quantity}`);
    return item;
  }

  updateItem(id: number, dto: UpdateItemDTO): Item {
    const existing = this.itemRepo.findById(id);
    if (!existing) {
      throw new Error(`Item with id ${id} not found`);
    }

    if (dto.locationId && dto.locationId !== existing.locationId) {
      const targetLoc = this.locationRepo.findById(dto.locationId);
      if (!targetLoc) {
        throw new Error(`Target location ${dto.locationId} does not exist`);
      }
      this.itemRepo.logAudit(id, 'location_transfer', `Transferred from location ${existing.locationId} to ${dto.locationId}`);
    }

    if (dto.quantity !== undefined && dto.quantity !== existing.quantity) {
      this.itemRepo.logAudit(id, 'quantity_change', `Quantity updated from ${existing.quantity} to ${dto.quantity}`);
    }

    const updated = this.itemRepo.update(id, dto);
    if (!updated) {
      throw new Error(`Failed to update item with id ${id}`);
    }
    this.itemRepo.logAudit(id, 'update', 'Updated item details');
    return updated;
  }

  deleteItem(id: number): boolean {
    const existing = this.itemRepo.findById(id);
    if (!existing) {
      throw new Error(`Item with id ${id} not found`);
    }
    this.itemRepo.logAudit(id, 'delete', `Deleted item "${existing.name}"`);
    return this.itemRepo.delete(id);
  }
}
