const regExp = /([0-9\.]+)|([\s\t]+)|([\r\n]+)|([\*])|([\/])|([\+])|([\-])/g;

const dictonary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];

function* tokenize(source) {
  let result = null;
  let lastIndex = 0;
  while(true) {
    lastIndex = regExp.lastIndex;

    result = regExp.exec(source);

    if (!result) break;

    if (regExp.lastIndex - lastIndex > result[0].length)
      break;

    let token = {
      type: null,
      value: null,
    }

    for (let i = 1; i < result.length; i++) {
      if (result[i]) {
        token.type = dictonary[i - 1];
      }
    }
    token.value = result[0];
    yield token;
  }
  yield { type: 'EOF' };
}

function MultipicativeExpression(source) {
  if (source[0].type === 'Number') {
    const node = {
      type: 'MutiplicativeExpression',
      children: [source[0]]
    };
    source[0] = node;
    return MultipicativeExpression(source);
  }
  if (source[0].type === 'MutiplicativeExpression' && source[1] && source[1].type === '*') {
    const node = {
      type: 'MutiplicativeExpression',
      operator: '*',
      children: [],
    }
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());
    source.unshift(node);
    return MultipicativeExpression(source);
  }
  if (source[0].type === 'MutiplicativeExpression' && source[1] && source[1].type === '/') {
    const node = {
      type: 'MutiplicativeExpression',
      operator: '/',
      children: [],
    }
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());
    source.unshift(node);
    return MultipicativeExpression(source);
  }
  if (source[0].type === 'MutiplicativeExpression') {
    return source[0];
  }

  return MultipicativeExpression(source);
}


function AdditiveExpression(source) {
  if (source[0].type === 'MutiplicativeExpression') {
    const node = {
      type: 'AdditiveExpression',
      children: [source[0]],
    }
    source[0] = node;
    return AdditiveExpression(source);
  }
  if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '+') {
    const node = {
      type: 'AdditiveExpression',
      operator: '+',
      children: [],
    }
    node.children.push(source.shift());
    node.children.push(source.shift());
    MultipicativeExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }
  if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '-') {
    const node = {
      type: 'AdditiveExpression',
      operator: '-',
      children: [],
    }
    node.children.push(source.shift());
    node.children.push(source.shift());
    MultipicativeExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }
  if (source[0].type === 'AdditiveExpression') {
    return source[0];
  }
  MultipicativeExpression(source);
  return AdditiveExpression(source);
}

function Expression(source) {
  if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === 'EOF' ) {
    const node = {
      type: 'Expression',
      children: [source.shift(), source.shift()],
    };
    source.unshift(node);
    return node;
  }
  AdditiveExpression(source);
  return Expression(source);
}

let source = [];

const results = tokenize('1 + 2 + 3 * 1024');

for (const token of results) {
  if (token.type !== 'Whitespace' && token.type !== 'LineTerminator') {
    source.push(token);
  }
}

console.log(source.length);

console.log(Expression(source));