const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(fs.readFileSync(path.join(__dirname, 'layout.html')).toString());
  res.end();
}).listen(8080);
