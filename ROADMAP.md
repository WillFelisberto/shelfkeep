# ShelfKeep Roadmap & Planned Milestones

This document outlines the planned improvements, architectural refinements, and upcoming features for ShelfKeep (~25-35 hours of planned engineering effort).

---

## Phase 1: Core Robustness & Testing (~6-8 hours)
- [ ] **Unit & Integration Test Suite**
  - [x] Initial service test setup with `node:test`
  - [ ] Add comprehensive test coverage for `itemRepository` and edge cases (concurrent updates, duplicate SKUs).
  - [ ] Add HTTP integration tests for all Express endpoints with request assertions.
- [ ] **Input Validation & Schema Sanitization**
  - [ ] Integrate Zod schemas for runtime request body validation.
  - [ ] Sanitize query parameters for pagination, sorting, and multi-field filters.
- [ ] **Database Migration System**
  - [ ] Implement a lightweight migration runner for schema versioning (`migrations/001_initial.sql`, etc.) to replace hardcoded initialization.

---

## Phase 2: Bulk Data Operations & Reporting (~6-8 hours)
- [ ] **CSV / JSON Ingestion Engine**
  - [ ] Bulk import endpoint with preview, validation dry-run, and rollback on malformed lines.
  - [ ] Configurable field mapping for custom CSV columns.
- [ ] **Export & Reporting**
  - [ ] Export current inventory or filtered views to CSV, JSON, and formatted PDF summaries.
  - [ ] Valuation summary report (calculating total asset value grouped by category and location).

---

## Phase 3: Physical Tagging & Asset Identification (~5-7 hours)
- [ ] **QR Code & Barcode Generation**
  - [ ] Generate printable SVG/PNG QR codes encoding item UUIDs or custom asset tags.
  - [ ] Printable label sheets formatted for standard adhesive label sizes (Avery/Brother).
- [ ] **Lookup by Barcode / Asset Tag**
  - [ ] Endpoint optimized for barcode scanners (direct lookup by SKU / UPC / serial number).

---

## Phase 4: History & Audit Trails (~4-6 hours)
- [ ] **Item Movement & Maintenance Logs**
  - [ ] Record item location transfers (who moved it, timestamp, reason).
  - [ ] Maintenance and calibration schedule tracking for tools/equipment.
- [ ] **Low-Stock & Depreciation Alerts**
  - [ ] Threshold alerts for consumable inventory (wires, screws, components).
  - [ ] Straight-line depreciation calculation for electronics and equipment.

---

## Phase 5: Web UI & Dashboard (~6-8 hours)
- [ ] **Interactive Web Interface**
  - [ ] Minimalist dashboard with search-as-you-type, location cards, and category breakdowns.
  - [ ] Quick-action modal for updating item quantities and moving storage bins.
- [ ] **Offline-first Local Sync**
  - [ ] Support local browser caching with IndexedDB for rapid mobile lookups.
