const RuleType = {
  Start: 0, // * 号
  Tag: 1, // Tag
  Class: 2, // class
  Hash: 3, // ID
  Attr: 4, // 属性
  P_Class: 5, // 伪类
  P_Element: 6, // 伪元素
}

const validReg = /[a-zA-z0-9\-_]/;

// img + div p ~ code > span
/**
 * 根据 CSS Grammar 判断哪些是合法字符
 * https://www.w3.org/TR/CSS21/grammar.html#scanner
 * @param {string} selector 
 */
function getRules(selector) {
  const rules = [];
  let currRule = null;

  function start(c) {
    if (c === ' ') { // 如果是空格
      return start;
    }
    return waitingRuleStart(c);
  }

  function waitingRuleStart(c) {
    if (c === '*') {
      rules.push(c);
      return waitingRuleStart;
    } else if (c === '.') {
      currRule = {
        type: RuleType.Class,
        rule: '',
      };
      return ruleStart;
    } else if (c === '#') {
      currRule = {
        type: RuleType.Hash,
        rule: '',
      };
      return ruleStart;
    } else if (c === '[') {
      currRule = {
        type: RuleType.Attr,
        rule: '',
      };
      return attrRuleStart;
    } else if (c === ':') {
      return colonStart;
    }
  }

  function ruleStart(c) {
    if (c.match(validReg)) { // 合法字符
      currRule.rule += c;
      return ruleStart;
    }
    currRule = null;
    rules.push(currRule);
    return waitingRuleStart;
  }

  function attrRuleStart(c) {
    if (c === ']') {
      currRule = null;
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
    }
    currRule = null;
    rules.push(currRule);
    return waitingRuleStart;
  }

  function pseudoElementStart(c) {
    if (c.match(validReg)) {
      currRule.rule += c;
    }
    currRule = null;
    rules.push(currRule);
    return waitingRuleStart;
  }

  function ruleEnd(c) {

  }

  let state = start;
  for (const c of selector) {
    state = state(c);
  }
}



// function match(selector, element) {

//   return true;
// }


// match("div #id.class", document.getElementById("id"));
