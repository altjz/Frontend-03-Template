const EOF = '\0';

const RuleType = {
  Star: 'Star', // * 号
  Tag: 'Tag', // Tag
  Class: 'Class', // class
  Hash: 'Hash', // ID
  Attr: 'Attribute', // 属性
  P_Class: 'PesudoClass', // 伪类
  P_Element: 'PesudoElement', // 伪元素
}

/**
 * 根据 CSS Grammar 判断哪些是合法字符
 * https://www.w3.org/TR/CSS21/grammar.html#scanner
 */
const validReg = /[a-zA-Z\-\_]/;
const combinatorTag = /[ >+~,|]/;

const rules = [];
let currRule = null;

function start(c) {
  if (c === ' ') { // 如果是空格
    return start;
  }
  return waitingRuleStart(c);
}

function waitingRuleStart(c) {
  if (c === '*') { // Star
    rules.push(c);
    return waitingRuleStart;
  } else if (c === '.') { // Class
    currRule = {
      type: RuleType.Class,
      rule: '',
    };
    return ruleStart;
  } else if (c === '#') { // Hash
    currRule = {
      type: RuleType.Hash,
      rule: '',
    };
    return ruleStart;
  } else if (c === '[') { // Attribute
    currRule = {
      type: RuleType.Attr,
      rule: '',
    };
    return attrRuleStart;
  } else if (c === ':') {
    return colonStart;
  } else if (c.match(validReg)) { // TAG
    currRule = {
      type: RuleType.Tag,
      rule: c,
    };
    return ruleStart;
  } else if (c.match(combinatorTag)) { // Combinator
    if (currRule) {
      if (currRule.combinator) { // 如果已经存在了，要判断是不是多余的空格
        if (c !== ' ') { // 如果不是空格，则替换掉
          currRule.combinator = c;
        }
      } else {
        currRule.combinator = c;
      }
    }
    return waitingRuleStart
  }
  return waitingRuleStart;
}

function ruleStart(c) {
  if (c.match(validReg)) { // 合法字符
    currRule.rule += c;
    return ruleStart;
  }
  rules.push(currRule);
  return waitingRuleStart(c);
}

function attrRuleStart(c) {
  if (c === ']') {
    rules.push(currRule);
    return waitingRuleStart;
  }
  currRule.rule += c;
  return attrRuleStart;
}

function colonStart(c) {
  if (c === ':') { // 双冒号，伪元素
    currRule = {
      type: RuleType.P_Element,
      rule: '',
    }
    return pseudoElementStart;
  } else if (c.match(validReg)) {
    currRule = {
      type: RuleType.P_Class,
      rule: '',
    }
    return pesudoClassStart(c);
  }
  return waitingRuleStart;
}

function pesudoClassStart(c) {
  if (c.match(validReg)) {
    currRule.rule += c;
    return pesudoClassStart;
  }
  rules.push(currRule);
  return waitingRuleStart;
}

function pseudoElementStart(c) {
  if (c.match(validReg)) {
    currRule.rule += c;
    return pseudoElementStart;
  }
  rules.push(currRule);
  return waitingRuleStart;
}

/**
 * 获取 rules 数组
 * @param {string} selector 
 */
function getRules(_selector) {
  const selector = _selector.split('');
  selector.push(EOF); // 添加一个 结束符

  let state = start;
  for (const c of selector) {
    state = state(c);
  }
  return rules;
}

function match(selector, element) {
  const rules = getRules(selector);
  const _element = element; // element 指针

  for (let i = rules.length - 1; i >= 0; i--) { // 反向查找
    const rule = rules[i];
    if (!rule.combinator) {

    }

    if (matchElement(rule, element)) {
      continue;
    }
  }
  return true;
}

function matchElement(rule, element) {
  if (rule.type === RuleType.P_Class || rule.type === RuleType.P_Element) { // 伪元素 和 伪类 跳过
    return true;
  } else if (rule.type === RuleType.Attr) { // TODO: 通配符 https://developer.mozilla.org/zh-CN/docs/Web/CSS/Attribute_selectors
    const name = rule.rule.split('=')[0];
    const value = rule.rule.split('=')[1];
    if (Array.from(element.attributes).find((a) => a.name === name && a.value === value)) {
      return true;
    }
  } else if (rule.type === RuleType.Class) {
    if (Array.from(element.attributes).find((a) => a.name === 'class' && a.value === rule.rule)) {
      return true;
    }
  } else if (rule.type === RuleType.Hash) {
    if (Array.from(element.attributes).find((a) => a.name === 'id' && a.value === rule.rule)) {
      return true;
    }
  } else if (rule.type === RuleType.Tag) {
    if (element.type === rule.rule) {
      return true;
    }
  } else if (rule.type === RuleType.Star) {
    return true;
  }
}

// console.log(getRules('div > .hello-world #id.class[value="1234"]::first-letter'));

// match(`div > .hello-world #id.class[value="1234"]::first-letter`, document.getElementById("id"));

