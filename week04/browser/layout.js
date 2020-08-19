function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  for(const prop in element.computedStyle) {
    const p = element.computedStyle.value;
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].value.toString().match(/px$/)) { // 这里如果是用其他单位的是怎么处理呢？，例如用 em, pt，% 之类的
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }

  return element.style;

}

function layout(element) {
  if (!element.computedStyle)
    return;

  const elementStyle = getStyle(element);

  if (elementStyle.display !== 'flex')
    return;

  const items = element.children.filter(e => e.type === 'element');
  // 为什么不是 item.style.order?
  items.sort((a, b) => (a.order || 0) - (b.order || 0));

  ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null;
    }
  });

  style.flexDirection = (!style.flexDirection || style.flexDirection === 'auto') ? 'row' : style.flexDirection; // 主轴的方向，默认设置为 横向 row

  style.alignItems = (!style.alignItems || style.alignItems === 'auto') ? 'stretch' : style.alignItems; // 交叉轴的，子节点对齐的属性，默认是 strech，Strech 就是默认拉伸到与容器的交叉轴 相同的size，（默认是 row，就是和容器的高度一样）
  
  style.justifyContent = (!style.justifyContent || style.justifyContent === 'auto') ? 'flex-start' : style.justifyContent; // 主轴 元素之间和周围的空间，默认是 flext-start，就是从行首开始排列
  
  style.flexWrap = (!style.flexWrap || style.flexWrap === 'auto') ? 'nowrap' : style.flexWrap; // 是否要换行，默认是不换行
  
  style.alignContent = (!style.alignContent || style.alignContent === 'auto') ? 'stretch' : style.alignContent; // 和 alignItems 类似，只适用于多行，所以 nowrap 是无效的

  let mainSize, mainStart, mainEnd, mainSign, mainBase, crossSize, crossStart, crossEnd, crossSign, crossBase;

  if (style.flexDirection === 'row') {
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
  

  
}