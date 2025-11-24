import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../dist/public');
const indexPath = path.join(publicPath, 'index.html');

export default function handler(req, res) {
  // Serve static files
  if (req.method === 'GET') {
    const filePath = path.join(publicPath, req.url === '/' ? 'index.html' : req.url);
    
    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const content = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        const mimeTypes = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.svg': 'image/svg+xml'
        };
        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
        return res.status(200).send(content);
      }
    } catch (err) {
      // Fallback to index.html for SPA routing
    }
  }
  
  // Fallback to index.html for SPA
  try {
    const html = fs.readFileSync(indexPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).send('Server Error');
  }
}
