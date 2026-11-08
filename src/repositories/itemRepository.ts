import { DatabaseSync } from 'node:sqlite';
import { Item, ItemFilterQuery, ItemAuditLog, CreateItemDTO, UpdateItemDTO } from '../models/types.js';

interface RawItemRow {
  id: number;
  name: string;
  description: string | null;
  sku: string | null;
  category: string;
  quantity: number;
  condition: string;
  estimated_value: number | null;
  location_id: number;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

export class ItemRepository {
  constructor(private db: DatabaseSync) {}

  private mapRowToItem(row: RawItemRow): Item {
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      sku: row.sku || undefined,
      category: row.category,
      quantity: row.quantity,
      condition: row.condition as Item['condition'],
      estimatedValue: row.estimated_value,
      locationId: row.location_id,
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  findAll(filters: ItemFilterQuery = {}): Item[] {
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filters.search) {
      conditions.push('(name LIKE ? OR description LIKE ? OR sku LIKE ?)');
      const pattern = `%${filters.search}%`;
      params.push(pattern, pattern, pattern);
    }

    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    if (filters.locationId) {
      conditions.push('location_id = ?');
      params.push(filters.locationId);
    }

    if (filters.tag) {
      conditions.push('tags LIKE ?');
      params.push(`%"${filters.tag}"%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    const query = `
      SELECT 
        id, name, description, sku, category, quantity, 
        condition, estimated_value, location_id, tags, 
        created_at, updated_at 
      FROM items
      ${whereClause}
      ORDER BY updated_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...params) as unknown as RawItemRow[];
    return rows.map((row) => this.mapRowToItem(row));
  }

  findById(id: number): Item | null {
    const stmt = this.db.prepare(`
      SELECT 
        id, name, description, sku, category, quantity, 
        condition, estimated_value, location_id, tags, 
        created_at, updated_at 
      FROM items 
      WHERE id = ?
    `);
    const row = stmt.get(id) as unknown as RawItemRow | undefined;
    return row ? this.mapRowToItem(row) : null;
  }

  create(data: CreateItemDTO): Item {
    const tagsJson = data.tags ? JSON.stringify(data.tags) : JSON.stringify([]);
    const condition = data.condition || 'good';

    const stmt = this.db.prepare(`
      INSERT INTO items (
        name, description, sku, category, quantity, 
        condition, estimated_value, location_id, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.name,
      data.description || null,
      data.sku || null,
      data.category,
      data.quantity,
      condition,
      data.estimatedValue || null,
      data.locationId,
      tagsJson
    );

    const id = Number(result.lastInsertRowid);
    return this.findById(id)!;
  }

  update(id: number, data: UpdateItemDTO): Item | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const tagsJson = data.tags !== undefined ? JSON.stringify(data.tags) : (existing.tags ? JSON.stringify(existing.tags) : '[]');

    const stmt = this.db.prepare(`
      UPDATE items SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        sku = COALESCE(?, sku),
        category = COALESCE(?, category),
        quantity = COALESCE(?, quantity),
        condition = COALESCE(?, condition),
        estimated_value = COALESCE(?, estimated_value),
        location_id = COALESCE(?, location_id),
        tags = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      data.name ?? null,
      data.description ?? null,
      data.sku ?? null,
      data.category ?? null,
      data.quantity ?? null,
      data.condition ?? null,
      data.estimatedValue ?? null,
      data.locationId ?? null,
      tagsJson,
      id
    );

    return this.findById(id);
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM items WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  logAudit(itemId: number, action: ItemAuditLog['action'], details: string): void {
    const stmt = this.db.prepare(`
      INSERT INTO item_audit_logs (item_id, action, details)
      VALUES (?, ?, ?)
    `);
    stmt.run(itemId, action, details);
  }

  getAuditLogs(itemId: number): ItemAuditLog[] {
    const stmt = this.db.prepare(`
      SELECT id, item_id AS itemId, action, details, timestamp
      FROM item_audit_logs
      WHERE item_id = ?
      ORDER BY timestamp DESC
    `);
    return stmt.all(itemId) as unknown as ItemAuditLog[];
  }
}
