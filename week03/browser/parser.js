const { addCssRules, computeCss } = require('./computed');
const EOF = Symbol('EOF');

let currentToken = null;
let currentAttribute = null;
let stack = [{type: 'document', children: []}];
let currentTextNode = null;

function emit(token) {
  // if (token.type !== 'text')
    // console.log('token', token);
  const top = stack[stack.length - 1];

  if (token.type === 'startTag') {
    const element = {
      tagName: token.tagName,
      type: 'element',
      children: [],
      attributes: token.attributes || [],
      content: '',
    };
    element.parent = top;
    top.children.push(element);

    computeCss(element, stack);

    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error('tag is not end');
    } else {
      if (top.tagName === 'style') {
        addCssRules(top.children[0].content);
      }
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: '',
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({ type: 'EOF'});
  } else {
    emit({
      type: 'text',
      content: c,
    })
    return data;
  }
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    };
    return tagName(c);
  } else {
    return;
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    };
    return tagName(c);
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName;
  } else if (c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '/') {
    return selfClosingStartTag;
  }
  else {
    currentAttribute = {
      name: '',
      value: '',
    };
    return attributeName(c);
  }
}

function afterAttributeName(c) {
  if (c === '>') {
    emit(currentToken);
    return data;
  }
  return afterAttributeName;
}

function attributeName(c) {
  if (c.match(/^[\t\n\f\s]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    return beforeAttributeValue;
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f\s]$/)  || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuotedAttributeValue;
  } else {
    return unQuotedAttributeValue(c);
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "'") {
    setAttributeValue();
    return beforeAttributeName;
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    setAttributeValue();
    return beforeAttributeName;
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function unQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    setAttributeValue();
    return beforeAttributeName;
  } else if (c === '/') {
    setAttributeValue();
    return selfClosingStartTag;
  } else if (c === '>') {
    setAttributeValue();
    emit(currentToken);
    return data;
  } else {
    currentAttribute.value += c;
    return unQuotedAttributeValue;
  }
}

function setAttributeValue() {
  if (!currentToken.attributes) {
    currentToken.attributes = [];
  }
  currentToken.attributes.push({
    name: currentAttribute.name,
    value: currentAttribute.value,
  });
}

function parseHtml(html) {
  let state = data;
  for (const c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
  // console.log(stack[0]);
}

module.exports = parseHtml;