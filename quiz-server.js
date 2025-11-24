const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

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
