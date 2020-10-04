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

let source = [];

const results = tokenize('10 * 25 / 2');

for (const token of results) {
  if (token.type !== 'Whitespace' && token.type !== 'LineTerminator') {
    source.push(token);
  }
}

// console.log(source);

console.log(MultipicativeExpression(source));