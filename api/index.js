import { createServer } from 'http';
import express from 'express';
import { registerRoutes } from '../server/routes.js';
import fs from 'fs';
import path from 'path';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default async function handler(req, res) {
  if (req.method === 'GET' && req.url === '/') {
    const indexPath = path.join(__dirname, '../dist/public/index.html');
    if (fs.existsSync(indexPath)) {
      const html = fs.readFileSync(indexPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    }
  }

  if (req.url.startsWith('/api')) {
    try {
      const { registerRoutes: routes } = await import('../dist/index.js');
      return routes(app);
    } catch (e) {
      console.error('Error loading routes:', e);
    }
  }

  const staticPath = path.join(__dirname, '../dist/public', req.url);
  if (fs.existsSync(staticPath)) {
    return res.sendFile(staticPath);
  }

  const indexPath = path.join(__dirname, '../dist/public/index.html');
  res.setHeader('Content-Type', 'text/html');
  res.send(fs.readFileSync(indexPath, 'utf8'));
}
