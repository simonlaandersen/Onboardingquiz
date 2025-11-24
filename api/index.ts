import { createServer } from 'http';
import express from 'express';
import { registerRoutes } from '../server/routes';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all routes (API + SPA)
const setupApp = async (app: any, server: any) => {
  const distPath = path.resolve(__dirname, '../dist/public');
  
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
  }
  
  // Fallback to index.html for SPA routing
  app.use('*', (_req: any, res: any) => {
    const indexPath = path.resolve(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Not found');
    }
  });
};

let server: any;

export default async function handler(req: any, res: any) {
  if (!server) {
    server = createServer(app);
    await registerRoutes(app);
    await setupApp(app, server);
  }
  
  // Delegate to Express
  app(req, res);
}
