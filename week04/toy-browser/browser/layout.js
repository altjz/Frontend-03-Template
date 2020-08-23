function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  for (const prop in element.computedStyle) {
    // console.log(prop);
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) { // 这里如果是用其他单位的是怎么处理呢？，例如用 em, pt，% 之类的
      element.style[prop] = parseInt(element.style[prop], 10);
    }
    if (element.style[prop].toString().match(/^[0-9.]+$/)) {
      element.style[prop] = parseInt(element.style[prop], 10);
    }
  }

  return element.style;
}

function layout(element) {
  if (!element.computedStyle) return;
  const style = element.computedStyle;

  const elementStyle = getStyle(element);

  if (elementStyle.display !== 'flex') return;

  const items = element.children.filter((e) => e.type === 'element');
  // 为什么不是 item.style.order?
  items.sort((a, b) => (a.order || 0) - (b.order || 0));

  ['width', 'height'].forEach((size) => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null;
    }
  });

  style.flexDirection = (!style.flexDirection || style.flexDirection === 'auto') ? 'row' : style.flexDirection; // 主轴的方向，默认设置为 横向 row

  style.alignItems = (!style.alignItems || style.alignItems === 'auto') ? 'stretch' : style.alignItems; // 交叉轴的，子节点对齐的属性，默认是 strech，Strech 就是默认拉伸到与容器的交叉轴 相同的size，（默认是 row，就是和容器的高度一样）

  style.justifyContent = (!style.justifyContent || style.justifyContent === 'auto') ? 'flex-start' : style.justifyContent; // 主轴 元素之间和周围的空间，默认是 flext-start，就是从行首开始排列

  style.flexWrap = (!style.flexWrap || style.flexWrap === 'auto') ? 'nowrap' : style.flexWrap; // 是否要换行，默认是不换行

  style.alignContent = (!style.alignContent || style.alignContent === 'auto') ? 'stretch' : style.alignContent; // 和 alignItems 类似，只适用于多行，所以 nowrap 是无效的

  let mainSize; let mainStart; let mainEnd; let mainSign; let mainBase; let crossSize; let crossStart; let crossEnd; let crossSign; let
    crossBase;

  if (style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  } else if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  } else if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  } else if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  if (style.flexWrap === 'wrap-reverse') {
    const tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  let isAutoMainSize = false;
  if (!style[mainSize]) { // 如果没有设定 mainSize 的话，就默认当做 AutoMainSize
    elementStyle[mainSize] = 0;
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const itemStyle = item.computedStyle;
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== undefined) {
        elementStyle[mainSize] += item[mainSize]; // 计算所有的子元素 element 的size
      }
    }
    isAutoMainSize = true;
  }

  let flexLine = [];
  const flexLines = [flexLine];

  let mainSpace = elementStyle[mainSize];
  let crossSpace = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemStyle = getStyle(item);

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) { // 有 Flex 属性，是可伸缩，可以参与 行计算
      flexLine.push(item);
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) { // autoMainSize
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]); // 因为默认是 Strech 属性，所以子元素交叉轴最大的就是该行的交叉轴大小
      }
      flexLine.push(item);
    } else {
      if (itemStyle[mainSize] > style[mainSize]) { // 如果子元素的 mainSize 大于 父元素的 mainSize
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
      flexLine.crossSpace = (style[crossSize] !== undefined) ? elementStyle[crossSize] : crossSpace;
    } else {
      flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
      const scale = style[mainSize] / (style[mainSize] - mainSpace);
      let currentMain = mainBase;
      for (let j = 0; j < items.length; j++) {
        const _item = items[j];
        const _itemStyle = getStyle(_item);

        if (_itemStyle.flex) {
          _itemStyle[mainSize] = 0;
        }

        _itemStyle[mainSize] *= scale;

        _itemStyle[mainStart] = currentMain;
        _itemStyle[mainEnd] = _itemStyle[mainStart] + mainSign * _itemStyle[mainSize];
        currentMain = _itemStyle[mainEnd];
      }
    } else {
      flexLines.forEach((_items) => {
        const { mainSpace: _mainSpace } = _items;
        let flexTotal = 0;
        for (let k = 0; k < _items.length; k++) {
          const _item = _items[k];
          const _itemStyle = getStyle(_item);

          if ((_itemStyle.flex !== null) && (_itemStyle.flex !== (undefined))) {
            flexTotal += _itemStyle.flex;
            continue;
          }
        }

        if (flexTotal > 0) {
          let currentMain = mainBase;
          for (let j = 0; j < _items.length; j++) {
            const _item = _items[j];
            const _itemStyle = getStyle(_item);

            if (_itemStyle.flex) {
              _itemStyle[mainSize] = (_mainSpace / flexTotal) * _itemStyle.flex;
            }
            _itemStyle[mainStart] = currentMain;
            _itemStyle[mainEnd] = _itemStyle[mainStart] + mainSign * _itemStyle[mainSize];
            currentMain = _itemStyle[mainEnd];
          }
        } else {
          let currentMain;
          let step;
          if (style.justifyContent === 'flex-start') {
            currentMain = mainBase;
            step = 0;
          } else if (style.justifyContent === 'flex-end') {
            currentMain = _mainSpace * mainSign + mainBase;
            step = 0;
          } else if (style.justifyContent === 'center') {
            currentMain = _mainSpace / 2 * mainSign + mainBase;
            step = 0;
          } else if (style.justifyContent === 'space-between') {
            step = _mainSpace / (_items.length - 1) * mainSign;
            currentMain = mainBase;
          } else if (style.justifyContent === 'space-around') {
            step = _mainSpace / _items.length * mainSign;
            currentMain = step / 2 + mainBase;
          }
          for (let j = 0; j < _items.length; j++) {
            const _item = _items[j];
            const _itemStyle = getStyle(_item);
            _itemStyle[mainStart] = currentMain;
            _itemStyle[mainEnd] = _itemStyle[mainStart] + mainSign * _itemStyle[mainSize];
            currentMain = _itemStyle[mainEnd] + step;
          }
        }
      });
    }
  }

  let _crossSpace;
  if (!style[crossSize]) {
    _crossSpace = 0;
    elementStyle[crossSize] = 0;
    for (let i = 0; i < flexLines.length; i++) {
      _crossSpace -= elementStyle[crossSize] + flexLines[i].crossSize;
    }
  } else {
    _crossSpace = elementStyle[crossSize];
    for (let i = 0; i < flexLines.length; i++) {
      _crossSpace -= flexLines[i].crossSpace;
    }
  }

  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }

  // const lineSize = elementStyle[crossSize] / flexLines.length;

  let step;
  if (style.alignContent === 'flex-start') {
    crossBase += 0;
    step = 0;
  } else if (style.alignContent === 'flex-end') {
    crossBase += crossSign * _crossSpace;
    step = 0;
  } else if (style.alignContent === 'center') {
    crossBase += crossSign * _crossSpace / 2;
    step = 0;
  } else if (style.alignContent === 'space-between') {
    crossBase += 0;
    step = _crossSpace / (flexLines.length - 1);
  } else if (style.alignContent === 'space-around') {
    crossBase += crossSign * step / 2;
  } else if (style.alignContent === 'stretch') {
    crossBase += 0;
    step = 0;
  }
  flexLines.forEach((_items) => {
    const lineCrossSize = style.alignContent === 'stretch' ? _items.crossSpace + _crossSpace / flexLines.length : _items.crossSpace;
    for (let i = 0; i < _items.length; i++) {
      const item = _items[i];
      const itemStyle = getStyle(item);

      const align = itemStyle.alignSelf || style.alignItems;

      if (itemStyle[crossSize] === undefined) {
        itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
      }
      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      } else if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      } else if (align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize] / 2);
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      } else if (align === 'stretch') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== undefined && itemStyle[crossSize]));

        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
      }
    }
    crossBase += crossSign * (lineCrossSize + step);
  });
  // console.log(items);
}

module.exports = layout;
