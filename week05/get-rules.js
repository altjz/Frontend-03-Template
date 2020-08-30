const EOF = '\0';

export const RuleType = {
  Star: 'Star', // * 号
  Tag: 'Tag', // Tag
  Class: 'Class', // class
  Hash: 'Hash', // ID
  Attribute: 'Attribute', // 属性
  PesudoClass: 'PesudoClass', // 伪类
  PesudoElement: 'PesudoElement', // 伪元素
}

const validReg = /[a-zA-Z0-9\-\_]/;
const combinatorTag = /[ >+~,|]/;

/**
 * 获取 rules 数组
 * @param {string} selector 
 * @returns {Array} 二元数组
 */
export function getRules(selector) {
  /**
   * 根据 CSS Grammar 判断哪些是合法字符
   * https://www.w3.org/TR/CSS21/grammar.html#scanner
   */

  const rulesList = []; // 这是一个二元数组，以 逗号隔开是一个 独立的 rules
  let rules = [];
  let currRule = null;

  function start(c) {
    if (c === ' ') { // 如果是空格
      return start;
    } else if (c === EOF) {
      return;
    }
    return waitingRuleStart(c);
  }

  function waitingRuleStart(c) {
    if (c === ',') { // List 逗号重新分配一个 rules
      currRule = null;
      if (rules[rules.length - 1].combinator) { // 最后一个如果有多余的 空格 或者 combinator，要删除掉
        delete rules[rules.length - 1].combinator;
      }
      rulesList.push(rules);
      rules = [];
    } else if (c === '*') { // Star
      currRule = {
        type: RuleType.Star,
        rule: '',
      };
      rules.push(currRule);
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
        type: RuleType.Attribute,
        rule: '',
      };
      return attrRuleStart;
    } else if (c === ':') { // Pesudo Class or Pesudo Element
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
        type: RuleType.PesudoElement,
        rule: '',
      }
      return pseudoElementStart;
    } else if (c.match(validReg)) {
      currRule = {
        type: RuleType.PesudoClass,
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
    } else if (c === '(') {
      currRule.rule += c;
      return pesudoClassStart;
    } else if (c === ')') {
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
  const _selector = selector.trim().split('');
  _selector.push(EOF); // 添加一个 结束符

  let state = start;
  for (const c of _selector) {
    if (c === EOF) {
      rulesList.push(rules);
    }
    state = state(c);
  }
  return rulesList;
}

// let list = getRules(`div > .hello-world #id.class[value="1234"]::first-letter , body div p.class`);
// console.log(list);
