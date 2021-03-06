const net = require('net');
const fs = require('fs');
const path = require('path');
const images = require('images');
const parser = require('./parser');
const render = require('./render');

const getElementByClass = require('./lib/query');

const OUTPU_DIR = path.join(__dirname, '../output');

class Request {
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || '/';
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map((key) => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
    }

    this.headers['Content-Length'] = this.bodyText.length;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      // console.log(this.toString());
      const _parser = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      }
      const _connection = connection || net.createConnection({
        host: this.host,
        port: this.port,
      }, () => _connection.write(this.toString()));
      _connection.on('data', (data) => {
        // console.log(data.toString());
        _parser.receive(data.toString());
        if (_parser.isFinished) {
          resolve(_parser.response);
          _connection.end();
        }
      })
        .on('error', (err) => {
          reject(err);
          _connection.end();
        });
    });
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map((key) => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`;
  }
}

class ResponseParser {
  constructor() {
    this.WATTING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.current = this.WATTING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(''),
    };
  }

  receive(str) {
    for (let i = 0; i < str.length; i++) {
      this.receiveChar(str.charAt(i));
    }
  }

  receiveChar(char) {
    switch (this.current) {
      default: break;
      case this.WATTING_STATUS_LINE:
        if (char === '\r') this.current = this.WAITING_STATUS_LINE_END;
        else this.statusLine += char;
        break;
      case this.WAITING_STATUS_LINE_END:
        if (char === '\n') this.current = this.WAITING_HEADER_NAME;
        break;
      case this.WAITING_HEADER_NAME:
        if (char === ':') this.current = this.WAITING_HEADER_SPACE;
        else if (char === '\r') {
          this.current = this.WAITING_HEADER_BLOCK_END;
          if (this.headers['Transfer-Encoding'] === 'chunked') this.bodyParser = new TrunkedBodyParser();
        } else this.headerName += char;
        break;
      case this.WAITING_HEADER_SPACE:
        if (char === ' ') this.current = this.WAITING_HEADER_VALUE;
        break;
      case this.WAITING_HEADER_VALUE:
        if (char === '\r') {
          this.current = this.WAITING_HEADER_LINE_END;
          this.headers[this.headerName] = this.headerValue;
          this.headerName = '';
          this.headerValue = '';
        } else this.headerValue += char;
        break;
      case this.WAITING_HEADER_LINE_END:
        if (char === '\n') {
          this.current = this.WAITING_HEADER_NAME;
        }
        break;
      case this.WAITING_HEADER_BLOCK_END:
        if (char === '\n') {
          this.current = this.WAITING_BODY;
        }
        break;
      case this.WAITING_BODY:
        this.bodyParser.receiveChar(char);
        break;
    }
  }
}

class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WATING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  }

  receiveChar(char) {
    switch (this.current) {
      default: break;
      case this.WAITING_LENGTH:
        if (char === '\r') {
          if (this.length === 0) {
            this.isFinished = true;
          }
          this.current = this.WAITING_LENGTH_LINE_END;
        } else {
          this.length *= 16;
          this.length += parseInt(char, 16);
        }
        break;
      case this.WAITING_LENGTH_LINE_END:
        if (char === '\n') {
          this.current = this.READING_TRUNK;
        }
        break;
      case this.READING_TRUNK:
        this.content.push(char);
        this.length--;
        if (this.length === 0) {
          this.current = this.WAITING_NEW_LINE;
        }
        break;
      case this.WAITING_NEW_LINE:
        if (char === '\r') {
          this.current = this.WATING_NEW_LINE_END;
        }
        break;
      case this.WATING_NEW_LINE_END:
        if (char === '\n') {
          this.current = this.WAITING_LENGTH;
        }
        break;
    }
  }
}

async function makeRequest() {
  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8080',
    path: '/',
    headers: {},
    body: {
      name: 'alex ',
    },
  });
  const response = await request.send();
  const dom = parser(response.body);

  if (!fs.existsSync(OUTPU_DIR)) {
    fs.mkdirSync(OUTPU_DIR);
  }

  const c1Els = [];
  getElementByClass(c1Els, dom, 'class', 'c1'); // 找到 c1 class 的 element
  if (c1Els.length > 0) {
    genRenderImage(c1Els[0], path.join(OUTPU_DIR, 'single.jpg'));
  }

  genDomString(dom);
  genRenderImage(dom, path.join(OUTPU_DIR, 'dom.jpg'));
}

function genDomString(dom) {
  // 由于 DOM 结构是有循环引用，因此要把循环引用的 key 去掉，参照 司徒正美的处理： https://www.cnblogs.com/rubylouvre/p/6814431.html
  let cache = [];
  const domString = JSON.stringify(dom, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  }, 2);
  cache = null;

  fs.writeFile(path.join(OUTPU_DIR, 'dom.json'), domString, (err) => {
    if (!err) {
      console.log('success, please check the output folder');
    }
  });
}

function genRenderImage(element, outputPath) {
  const viewport = images(800, 600);

  render(viewport, element);

  viewport.save(outputPath);
}

makeRequest();
