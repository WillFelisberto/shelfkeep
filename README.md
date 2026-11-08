# ShelfKeep 📦

A lightweight, self-hosted personal inventory and physical asset manager built with TypeScript, Node.js, and SQLite.

Designed for makers, collectors, and hobbyists who want to keep track of their tools, components, electronics, books, and collectibles across physical locations (rooms, shelves, bins, and boxes) without relying on cloud subscriptions or heavy enterprise software.

---

## Features

- **Storage Hierarchy:** Organize items into hierarchical locations (e.g. *Workshop → Shelf B → Bin 04*).
- **Asset Metadata:** Track item quantities, conditions, serial numbers, estimated values, purchase dates, and custom tags.
- **Audit Logging:** Every quantity change and location transfer is tracked.
- **Fast Search & Filtering:** Filter by location, category, tag, or full-text query.
- **Zero-Dependency SQLite Backend:** Utilizes Node.js native `node:sqlite` for high performance with zero native compilation overhead.
- **RESTful API:** Clean, documented JSON API ready for web or mobile clients.

---

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/) (v22+)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Server Framework:** [Express](https://expressjs.com/)
- **Database:** [SQLite](https://www.sqlite.org/) (via native `node:sqlite`)
- **Execution & Dev Tools:** `tsx` for high-speed TypeScript execution and watch mode

---

## Getting Started

### Prerequisites

- Node.js `v22.0.0` or later (or any version with built-in `node:sqlite`)
- npm `v10.0.0` or later

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/WillFelisberto/shelfkeep.git
   cd shelfkeep
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   ```bash
   cp .env.example .env
   ```

4. **Seed mock data (optional but recommended):**
   ```bash
   npm run seed
   ```

5. **Start in development mode:**
   ```bash
   npm run dev
   ```
   The API will be running at `http://localhost:3000`.

### Running Tests

```bash
npm run test
```

### Production Build

```bash
npm run build
npm start
```

---

## API Overview

### Locations
- `GET /api/locations` - List all physical locations (hierarchical)
- `POST /api/locations` - Create a new location (e.g., room, shelf, bin)
- `GET /api/locations/:id` - Get location details and items stored inside

### Items
- `GET /api/items` - List items with optional query filters (`search`, `category`, `locationId`, `tag`)
- `POST /api/items` - Register a new inventory item
- `GET /api/items/:id` - Get item details with location and audit history
- `PATCH /api/items/:id` - Update item properties or move location
- `DELETE /api/items/:id` - Remove an item from inventory

### System Health
- `GET /health` - Service health and database status check

---

## Planned Work & Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed descriptions of upcoming milestones (~25+ hours of work ahead), including:
- CSV/JSON bulk import/export engine
- Printable QR code & barcode label generation
- Automated depreciation and low-stock alerting
- Comprehensive test coverage and migration framework
- Lightweight web interface and mobile scanner support

---

## License

This project is licensed under the [MIT License](./LICENSE).
