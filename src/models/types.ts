export interface Location {
  id: number;
  name: string;
  description?: string;
  parentId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export type ItemCondition = 'new' | 'good' | 'fair' | 'poor' | 'broken';

export interface Item {
  id: number;
  name: string;
  description?: string;
  sku?: string;
  category: string;
  quantity: number;
  condition: ItemCondition;
  estimatedValue?: number | null;
  locationId: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ItemAuditLog {
  id: number;
  itemId: number;
  action: 'create' | 'update' | 'quantity_change' | 'location_transfer' | 'delete';
  details: string;
  timestamp: string;
}

export interface CreateItemDTO {
  name: string;
  description?: string;
  sku?: string;
  category: string;
  quantity: number;
  condition?: ItemCondition;
  estimatedValue?: number;
  locationId: number;
  tags?: string[];
}

export interface UpdateItemDTO {
  name?: string;
  description?: string;
  sku?: string;
  category?: string;
  quantity?: number;
  condition?: ItemCondition;
  estimatedValue?: number;
  locationId?: number;
  tags?: string[];
}

export interface ItemFilterQuery {
  search?: string;
  category?: string;
  locationId?: number;
  tag?: string;
  limit?: number;
  offset?: number;
}
