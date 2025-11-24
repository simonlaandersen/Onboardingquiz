import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Serve the quiz HTML
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'onboarding-quiz.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  res.header('Content-Type', 'text/html; charset=utf-8');
  res.header('X-Frame-Options', 'ALLOWALL');
  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Quiz server running at http://0.0.0.0:${PORT}`);
});
