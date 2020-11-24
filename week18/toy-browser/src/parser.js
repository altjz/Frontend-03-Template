import { addCssRules, computeCss } from './computed';
import { layout } from './layout';

const EOF = Symbol('EOF');

let currentToken = null;
let currentAttribute = null;
let stack = [{ type: 'document', children: [] }];
let currentTextNode = null;

function reset() {
  currentToken = null;
  currentAttribute = null;
  stack = [{ type: 'document', children: [] }];
  currentTextNode = null;
}

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
      layout(top);
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
  } if (c === EOF) {
    emit({ type: 'EOF' });
  } else {
    emit({
      type: 'text',
      content: c,
    });
    return data;
  }
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: '',
    };
    return tagName(c);
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName;
  } if (c === '/') {
    return selfClosingStartTag;
  } if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } if (c === '>') {
    emit(currentToken);
    return data;
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
  } if (c === '>' || c === EOF) {
    return afterAttributeName(c);
  } if (c === '/') {
    return selfClosingStartTag;
  }

  currentAttribute = {
    name: '',
    value: '',
  };
  return attributeName(c);
}

function afterAttributeName(c) {
  if (c === '>') {
    emit(currentToken);
    return data;
  }
  setAttributeValue();
  return beforeAttributeName;
}

function attributeName(c) {
  if (c.match(/^[\t\n\f\s]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } if (c === '=') {
    return beforeAttributeValue;
  }
  currentAttribute.name += c;
  return attributeName;
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f\s]$/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue;
  } if (c === '"') {
    return doubleQuotedAttributeValue;
  } if (c === "'") {
    return singleQuotedAttributeValue;
  }
  return unQuotedAttributeValue(c);
}

function singleQuotedAttributeValue(c) {
  if (c === "'") {
    setAttributeValue();
    return beforeAttributeName;
  }
  currentAttribute.value += c;
  return singleQuotedAttributeValue;
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    setAttributeValue();
    return beforeAttributeName;
  }
  currentAttribute.value += c;
  return doubleQuotedAttributeValue;
}

function unQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    setAttributeValue();
    return beforeAttributeName;
  } if (c === '/') {
    setAttributeValue();
    return selfClosingStartTag;
  } if (c === '>') {
    setAttributeValue();
    emit(currentToken);
    return data;
  }
  currentAttribute.value += c;
  return unQuotedAttributeValue;
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

export function parseHtml(html) {
  reset();
  let state = data;
  for (const c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
  // console.log(stack[0]);
}

// module.exports = parseHtml;
