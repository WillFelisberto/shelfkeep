import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`📦 ShelfKeep server running on http://localhost:${config.port}`);
  console.log(`📁 Database path: ${config.dbPath}`);
});
