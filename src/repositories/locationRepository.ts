import { DatabaseSync } from 'node:sqlite';
import { Location } from '../models/types.js';

export class LocationRepository {
  constructor(private db: DatabaseSync) {}

  findAll(): Location[] {
    const stmt = this.db.prepare(`
      SELECT 
        id, 
        name, 
        description, 
        parent_id AS parentId, 
        created_at AS createdAt, 
        updated_at AS updatedAt 
      FROM locations
      ORDER BY name ASC
    `);
    return stmt.all() as unknown as Location[];
  }

  findById(id: number): Location | null {
    const stmt = this.db.prepare(`
      SELECT 
        id, 
        name, 
        description, 
        parent_id AS parentId, 
        created_at AS createdAt, 
        updated_at AS updatedAt 
      FROM locations 
      WHERE id = ?
    `);
    const result = stmt.get(id);
    return (result as unknown as Location) || null;
  }

  create(data: { name: string; description?: string; parentId?: number | null }): Location {
    const stmt = this.db.prepare(`
      INSERT INTO locations (name, description, parent_id)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(data.name, data.description || null, data.parentId || null);
    const createdId = Number(result.lastInsertRowid);
    return this.findById(createdId)!;
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM locations WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
