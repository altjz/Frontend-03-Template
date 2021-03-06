// const css = require('css');
import css from 'css';

const rules = [];

export function addCssRules(text) {
  const ast = css.parse(text);
  // console.log(JSON.stringify(ast, null, 2));
  rules.push(...ast.stylesheet.rules);
}

/**
 * Computed CSS 的function，由于 parser 文件太长拆分了，调用的时候和 Winter 老师的一致，只需传入 Stack 即可
 * @param {Element} element 元素
 * @param {Elment[]} stack 当前 Stack
 */
export function computeCss(element, stack) {
  // console.log(rules);
  const elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  const matched = true;
  RuleFor:
  for (const rule of rules) {
    let _element = element; // 需要指定一个指针 element
    let _elements = elements.slice(); // 指定一个 elements stack
    /**
     * 只支持无空格的复合选择器，例如："img+div p~code>span"
     * "img + div p ~ code > span" 这样的暂时不支持，所以先要用正则，把多余的空格删除掉
     * match 之后返回一个这样的数组：[ 'span', 'code>', 'p~', 'div ', 'img+' ]
     * 迭代这个数组，然后根据每个 selector 的后缀，来选择需要用什么样的策略查找
     */
    const selector = rule.selectors[0].replace(/\s*([>+~])\s*/g, '$1'); // 删除多余的空格
    const selectorParts = selector.match(/([.#]?[a-zA-Z0-9-]+[ >+~]?)/g)?.reverse(); // 匹配 复合选择器正则，返回一个反序的数组
    for (const _selector of selectorParts) {
      const subfix = _selector.match(/[ >+~]$/)?.[0];
      /**
       * 后代选择器，需要匹配所有的父元素
       */
      if (subfix === ' ') {
        let _matched = false;
        for (const e of _elements) { // 循环 stack 里面的 父元素
          if (!match(e, _selector)) { // 如果没找到，则下一个
            continue;
          } else { // 如果匹配到直接 break;
            _matched = true;
            _element = e; // 如果匹配到 父级 element，需要把指针指向这个父级
            const index = _elements.indexOf(e);
            _elements = _elements.slice(index + 1, _elements.length); // 把该父类之前的删除掉
            break;
          }
        }
        if (!_matched) {
          continue RuleFor;
        }
        /**
         * 子代选择器，只判断上一个 父元素是否匹配
         */
      } else if (subfix === '>') {
        if (_elements.length > 0) {
          const e = _elements[0];
          if (!match(e, _selector)) { // 如果没有匹配到，直接跳过
            continue RuleFor;
          }
        } else {
          continue RuleFor;
        }
        // 如果匹配到，指针前移一位
        _element = _elements[0];
        _elements.shift();
        /**
         * 相邻兄弟选择器，需要判断上一个 兄弟节点是否匹配
         */
      } else if (subfix === '+') {
        const { children } = _element.parent;
        const index = children.indexOf(_element); // 先找到自己在父类的位置
        if (index > 0) { // 如果是首位，也要跳过，因为前面没有元素了
          for (let i = index - 1; i >= 0; i--) { // 然后往前找，相邻位置
            if (children[i].type === 'text') { // 跳过文本节点
              continue;
            }
            if (!match(children[i], _selector)) { // 如果没有匹配到，则跳过
              continue RuleFor;
            } else break;
          }
        } else {
          continue RuleFor;
        }
      /**
       * 通用兄弟选择器，只要父类，在自己之前的元素匹配到
       */
      } else if (subfix === '~') {
        const { children } = _element.parent;
        const index = children.indexOf(_element); // 先找到自己在父类的位置
        if (index > 0) { // 如果是首位，也要跳过，因为前面没有元素了
          let _matched = false;
          for (let i = index - 1; i >= 0; i--) { // 然后往前找，相邻位置
            if (children[i].type === 'text') { // 跳过文本节点
              continue;
            }
            if (!match(children[i], _selector)) { // 如果没有匹配到，继续查找
              continue;
            } else {
              _matched = true; // 如果找到设置一个 match 标记
              break;
            }
          }
          if (!_matched) { // 循环结束，没有找到匹配的兄弟元素
            continue RuleFor;
          }
        }
      /**
       * 什么后缀都没有，直接匹配
       */
      } else if (!match(_element, _selector)) { // 如果不匹配直接跳过
        continue RuleFor;
      } else continue;
    }
    /**
     * 后面部分跟 winter 老师的是一样的处理
     */
    if (matched) {
      // console.log('rule', rule);
      const sp = specificity(selectorParts); // 前面已经解析过了，这里直接传进去即可
      const { computedStyle } = element;
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }

        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
      // console.log(element.computedStyle);
    }
  }
}

function specificity(selectorParts) {
  const p = [0, 0, 0, 0];
  // const selectorParts = selector.split(' ');
  /**
   * 上层已经做了解析，直接迭代即可
   */
  for (const part of selectorParts) {
    if (part[0] === '#') {
      p[1] += 1;
    } else if (part[0] === '.') {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  } if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  } if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }
  return sp1[3] - sp2[3];
}

// 支持空格的 Class 选择器 Match 函数
function match(element, selector) {
  // console.log('selector', selector);

  if (!selector || !element.attributes) return false;

  if (selector.match(/[ >+~]$/)) {
    selector = selector.substring(0, selector.length - 1);
  }

  if (selector[0] === '#') {
    const id = selector.substring(1, selector.length);
    const attr = element.attributes.find((_attr) => _attr.name === 'id' && _attr.value === id);
    return attr !== undefined;
  } if (selector[0] === '.') { // Class 选择器，支持空格
    const cls = selector.substring(1, selector.length);
    const attr = element.attributes.find((_attr) => _attr.name === 'class' && (_attr.value === cls || _attr.value.split(' ').find((c) => c === cls))); // 如果 class 有多个，则 split 空格再查找
    return attr !== undefined;
  }
  if (element.tagName !== selector) {
    return false;
  }
  // const index = selector[0].indexOf('.');
  // if (index > -1) { // 如果包含class，类似：span.myclass
  //   const cls = selector[0].substring(index + 1, selector[0].length); // 提取 class
  //   const attr = element.attributes.find((_attr) => _attr.name === 'class' && (_attr.value === cls || _attr.value.split(' ').find((c) => c === cls))); // 如果 class 有多个，则 split 空格再查找
  //   return attr !== undefined; // 如果 class 不匹配，返回 false
  // }
  return true;
}

// module.exports = {
//   addCssRules,
//   computeCss,
// };
