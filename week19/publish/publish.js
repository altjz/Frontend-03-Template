const http = require('http');
const archiver = require('archiver');
const open = require('open');
const querystring = require('querystring');
require('dotenv').config();

function openUrl() {
  open(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`);
}

function publish(token, callback) {
  const request = http.request({
    hostname: "127.0.0.1",
    port: 8080,
    method: "POST",
    path: "/publish",
    headers: {
      "Content-Type": 'application/octet-stream',
      "token": token,
    },
  }, response => {
    let data = '';
    response.on('data', chunk => { data += chunk.toString(); });
    response.on('end', () => callback(data));
  });
  
  const archive = archiver('zip', {
    zlib: {
      level: 9
    },
  });
  
  archive.directory('public/', false);
  archive.finalize();
  
  archive.pipe(request);
}

function createServer() {
  const server = http.createServer((request, response) => {
    console.log(request.url);
    if (request.url.startsWith('/token')) {
      const query = querystring.parse(request.url.match(/^\/token\?([\s|\S]+)$/)[1]);
      console.log('token', query.token);
      response.write('Publish Tool is processing, please wait...');
      publish(query.token, (info) => {
        console.log(info);
        response.write('\nServer response: ' + info);
        response.end();
        server.close();
      });
    } else {
      response.end();
    }
  });
  server.listen(8081);
}

createServer();

openUrl();