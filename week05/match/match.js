/**
 * 判断 element 是否匹配 selector
 * getRules 函数使用，状态机返回一个 rules 二维数组，（主要是为了适配 逗号，分隔符）
 * 
 * 支持以下复杂的选择器混用（支持空格混用）
 * `body div > .hello-world #oooo.class + [value="1234"] .hello ~ .gotme , body div p.list-test `
 * 
 * selector 支持
 * 复合选择器: #id.class
 * 列表选择器: [','] 逗号分隔
 * 复杂选择器: [' '], ['>'], ['~'], ['+']
 * 简单选择器:
 *  - Star 例如 * 星号
 *  - TAG 例如 div
 *  - Class 例如 .class'
 *  - Hash ID 例如 #id
 *  - Attribute 例如 [attr="value"]，支持通配符如：[attr~="value"] 详情可以查看: matchAttributeSelector 函数
 *  - PesudoClass 部分支持, not(), empty() 等，详情可以查看：matchPersudoClassSelector 函数
 *  - PesudoElement 不支持
 * @param {string} selector CSS 选择器
 * @param {Element} element Dom Element
 */
function match(selector, element) {
  const ruleList = getRules(selector);
  for (const rules of ruleList) {
    elementPointer = element; // 重置 element 指针
    if (matchRules(rules)) {
      return true;
    }
  }
  return false;
}

let elementPointer = null; // element 引用 指针

const EOF = '\0';

const RuleType = {
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
function getRules(selector) {
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

/**
 * 匹配 复杂选择器
 * 支持
 * - 空格 后代
 * - > 子代
 * - ~ 通用兄弟
 * - + 相邻兄弟
 * 不支持
 * || - 列合并
 *
 * @param {string} rule 规则
 * @param {Element} element Element
 * @param {strign} combinator 组合符
 * @returns {boolean} true 找到，false 没找到
 */
function matchCombinatorSelector(rule, element, combinator) {
  if (!combinator) { // 没有 直接匹配
    if (matchSimpleSelector(rule, element)) {
      return true;
    }
    return false;
  } else if (combinator === ' ') { // 后代
    if (element.parentElement) {
      if (matchSimpleSelector(rule, element.parentElement)) {
        elementPointer = element.parentElement;
        return true;
      }
      return matchCombinatorSelector(rule, element.parentElement, combinator);
    }
    return false;
  } else if (combinator === '>') { // 子代
    if (element.parentElement) {
      if (matchSimpleSelector(rule, element.parentElement)) {
        elementPointer = element.parentElement;
        return true;
      }
    }
    return false;
  } else if (combinator === '~') { // 通用兄弟
    if (element.parentElement) {
      const children = Array.from(element.parentElement.children);
      const index = children.indexOf(element); // 先找到自己的位置
      if (index > 0) { // 如果最后一个则跳过
        for (let i = index - 1; i >= 0; i--) { // 直接从当前位置之后开始
          if (matchSimpleSelector(rule, children[i])) {
            elementPointer = children[i];
            return true;
          }
        }
      }
    }
    return false;
  } else if (combinator === '+') { // 相邻兄弟
    if (element.parentElement) {
      const children = Array.from(element.parentElement.children);
      const index = children.indexOf(element); // 先找到自己的位置
      if (index > 0) { // 如果最后一个则跳过
        if (matchSimpleSelector(rule, children[index - 1])) {
          elementPointer = children[index - 1];
          return true;
        }
      }
    }
  } else if (combinator === '|') { // 列合并 TODO: 待实现
  }
  return false;
}

/**
 * 匹配 属性 选择器
 * 通配符 适配 https://developer.mozilla.org/zh-CN/docs/Web/CSS/Attribute_selectors
 * @param {string} rule 规则
 * @param {Array} attributes 属性数组
 */
function matchAttributeSelector(rule, attributes) {
  const splitVals = rule.split('=');
  if (splitVals.length === 0) { // [attr] 只有 属性名
    const name = splitVals[0];
    if (attributes.find((a) => a.name === name)) {
      return true;
    }
  }
  if (splitVals.length > 1) {
    const name = splitVals[0];
    let value = splitVals[1];
    if (value.match(/^["'](.*)["']$/)) {
      value = RegExp.$1;
    }
    if (name.endsWith('~')) { // [attr~=value] 只要 value 有其中一个匹配即可
      const vals = value.split(' ');
      const attrName = name.substring(0, name.length - 1);
      if (attributes.find((a) => a.name === attrName && vals.indexOf(a.value) > -1)) {
        return true;
      }
    } else if (name.endsWith('|')) { // [attr|=value] attr="foo" 或者 attr="foo-"
      const attrName = name.substring(0, name.length - 1);
      if (attributes.find((a) => a.name === attrName && ((a.value === value) || (a.value === `${value}-`)))) {
        return true;
      }
    } else if (name.endsWith('^')) { // [attr^=value] attr="foo" 或者 attr="foo-" 或者 attr="foobar"
      const attrName = name.substring(0, name.length - 1);
      if (attributes.find((a) => a.name === attrName && a.value.startsWith(value))) {
        return true;
      }
    } else if (name.endsWith('$')) { // [attr$=value]
      const attrName = name.substring(0, name.length - 1);
      if (attributes.find((a) => a.name === attrName && a.value.endsWith(value))) {
        return true;
      }
    } else if (name.endsWith('*')) { // [attr*=value]
      const attrName = name.substring(0, name.length - 1);
      if (attributes.find((a) => a.name === attrName && a.value.indexOf(value) > -1)) {
        return true;
      }
    } else { // [attr=value]
      if (attributes.find((a) => a.name === name && a.value === value)) {
        return true;
      }
    }
  }
}

/**
 * 匹配 伪类 选择器
 * 根据 https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes
 * 由于时间不足，很多没有匹配上，还有一些无法在 element 上获取到的值，例如：hover, focus，这一类比较麻烦的没有处理
 * 适配了以下：empty, only-child, first-of-type, last-of-type, only-of-type, not(), nth-child, nth-last-child, nth-of-type, nth-last-of-type
 * @param {string} rule 规则
 * @param {Element} element HTMLElement
 */
function matchPersudoClassSelector(rule, element) {
  if (rule === 'empty') {
    return Array.from(element.children).length === 0;
  } else if (rule === 'only-child') {
    return Array.from(element.children).length === 1;
  } else if (rule === 'first-child') {
    if (element.parentElement) {
      return Array.from(element.parentElement.children).indexOf(element) === 0;
    }
  } else if (rule === 'first-of-type') {
    const tagName = element.tagName;
    if (element.parentElement) {
      return element === Array.from(element.parentElement.children).find((el) => el.tagName === tagName);
    }
  } else if (rule === 'last-of-type') {
    const tagName = element.tagName;
    if (element.parentElement) {
      return element === Array.from(element.parentElement.children).reverse().find((el) => el.tagName === tagName);
    }
  } else if (rule === 'only-of-type') {
    const tagName = element.tagName;
    if (element.parentElement) {
      const filters = Array.from(element.parentElement.children).filter((el) => el.tagName === tagName);
      return filters.length === 1 && filters[0] === element;
    }
  } else if (rule.match(/^not\(([.#]?[a-zA-Z0-9]+)\)$/)) {
    /**
     * 根据这里的规则，https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not
     * 只支持 CSS 3 (Tag, Hash, Class)
     * TODO: CSS 4 复杂选择器 暂不支持
     */
    const _rule = RegExp.$1;
    const ruleObj = {};
    if (_rule[0] === '.') {
      ruleObj.type = RuleType.Class;
      ruleObj.rule = _rule.substring(1, _rule.length);
    } else if (_rule[1] === '#') {
      ruleObj.type = RuleType.Hash;
      ruleObj.rule = _rule.substring(1, _rule.length);
    } else {
      ruleObj.type = RuleType.Tag;
      ruleObj.rule = _rule;
    }
    return !matchSimpleSelector(ruleObj, element);
  } else if (rule.match(/^nth-child\((\d+)\)$/)) {
    const index = parseInt(RegExp.$1) - 1;
    if (element.parentElement) {
      return Array.from(element.parentElement.children).indexOf(element) === index;
    }
  } else if (rule.match(/^nth-last-child\((\d+)\)$/)) {
    const index = parseInt(RegExp.$1) - 1;
    if (element.parentElement) {
      return Array.from(element.parentElement.children).reverse().indexOf(element) === index;
    }
  } else if (rule.match(/^nth-of-type\((\d+)\)$/)) {
    const index = parseInt(RegExp.$1);
    if (element.parentElement) {
      return Array.from(element.parentElement.children).filter((el) => el.tagName === element.tagName).indexOf(
        element) === index;
    }
  } else if (rule.match(/^nth-last-of-type\((\d+)\)$/)) {
    const index = parseInt(RegExp.$1);
    if (element.parentElement) {
      return Array.from(element.parentElement.children).filter((el) => el.tagName === element.tagName).indexOf(
        element) === index;
    }
  }
}

/**
 * 匹配 简单 选择器
 * @param {object} rule 规则
 * @param {Element} element HTMLElement
 */
function matchSimpleSelector(rule, element) {
  if (rule.type === RuleType.PesudoClass) { // 伪类
    return matchPersudoClassSelector(rule.rule, element);
  } else if (rule.type === RuleType.PesudoElement) { // 伪元素，TODO: 不知道怎么判断，跳过了
    return true;
  } else if (rule.type === RuleType.Attribute) { // 属性
    return matchAttributeSelector(rule.rule, Array.from(element.attributes));
  } else if (rule.type === RuleType.Class) { // Class
    if (Array.from(element.attributes).find((a) => a.name === 'class' && a.value === rule.rule)) {
      return true;
    }
  } else if (rule.type === RuleType.Hash) { // Hash
    if (Array.from(element.attributes).find((a) => a.name === 'id' && a.value === rule.rule)) {
      return true;
    }
  } else if (rule.type === RuleType.Tag) { // Tag
    if (element.tagName.toLowerCase() === rule.rule.toLowerCase()) {
      return true;
    }
  } else if (rule.type === RuleType.Star) { // Star
    return true;
  }
}

function matchRules(rules) {
  for (let i = rules.length - 1; i >= 0; i--) { // 反向查找
    const rule = rules[i];
    if (matchCombinatorSelector(rule, elementPointer, rule.combinator)) {
      continue;
    }
    return false;
  }
  return true;
}