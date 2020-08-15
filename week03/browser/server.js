var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(`<html meta=hello meta2="world" meta3='hhh"wwww"ddd' >
  <head>hello world</head>
  <body>
    <img src="abc.png" />
    <div>Test</div>
  </body>
</html>`);
  res.end();
}).listen(8080);