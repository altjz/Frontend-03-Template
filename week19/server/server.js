const http = require('http');
const https = require('https');
const unzipper = require('unzipper');
const querystring = require('querystring');
require('dotenv').config();

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRETS) {
  console.error('please provide CLIENT_ID and CLIENT_SECRETS environment variables\n');
  process.exit(-1);
}

function getToken(code, callback) {
  const param = {
    code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRETS,
  };
  const request = https.request({
    hostname: 'github.com',
    path: `/login/oauth/access_token?code=${param.code}&client_id=${param.client_id}&client_secret=${param.client_secret}`,
    method: 'POST',
    port: 443,
  }, (response) => {
    let data = '';
    response.on('data', chunk => {
      data += chunk.toString();
    });
    response.on('end', () => callback(data));
  });
  request.end();
}

function getUser(token, callback) {
  const request = https.request({
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    port: 443,
    headers: {
      'Authorization': `token ${token}`,
      'User-Agent': 'toy-publish',
    }
  }, (response) => {
    let data = '';
    response.on('data', chunk => {
      data += chunk.toString();
    });
    response.on('end', () => callback(data));
  });
  request.end();
}

function auth(request, response) {
  const query = querystring.parse(request.url.match(/^\/auth\?([\s|\S]+)$/)[1]);
  getToken(query.code, (info) => {
    console.log('token', info);
    const token = querystring.parse(info).access_token;
    response.write(`<a href="http://localhost:8081/token?token=${token}">publish</a>`);
    response.end();
  });
}

function publish(request, response) {
  const { token } = request.headers;
  if (token) {
    getUser(token, (info) => {
      console.log(info);
      request.pipe(unzipper.Extract({ path: 'public'}));
      response.write(`Hello ${JSON.parse(info).login}, We are processing your request...\nPublishing\n`);
      request.on('end', () => {
        response.write('done!\n');
        response.end();
      });
    });
  } else {
    response.write('token is empty');
    response.end();
  }
}

const server = http.createServer((request, response) => {
  console.log(request.url);
  if (request.url === '/publish') {
    return publish(request, response);
  } else if (request.url.match(/^\/auth\?/)) {
    return auth(request, response);
  } else {
    response.write(`invalid route: ${request.url || '""'}`);
    response.end();
  }
});

server.listen(8080);