# Week 03 学习笔记

## 学习感受

这周的学习强度，真的相当大，首先，自身对 CSS 不是特别熟悉，所以有很多知识是恶补的，例如，复合选择器，简单选择器，这些术语，我还没搞懂。翻看了很多基础文章补全。

## 选做题：复合选择器解析 和 Specificity

这个选做题，我一度想放弃，尝试了很多方法，也翻阅了很多资料。

特别是：`img + div p ~ code > span` 这样的规则，可以多种复合选择器复用的，简直快把我逼疯了。

后来重新看了一遍 Winter 老师的视频，老师建议我们用 正则，只能硬着头皮试试正则了。

写出了正则，匹配出来后，依然特别多的问题，结果写了一大堆，目前勉强能解决，但是写得不是特别优雅，复杂度特别高。应该有更好的方式。

不过总算可以了，还是挺有成就感。但基础选择器还有很多没有匹配，还有很多特殊情况都没写。

但不得不说这样学习 CSS 之后，反过来，什么匹配规则，被覆盖的问题，要解决起来都游刃有余，果然还是从原理开始。

## 其他疑问笔记

Winter 老师的 文本节点是放在了 children 里面，但是，我看实际上浏览器的是在 textContent 里面，然后 children 里面也没有文本节点。

然后我带这个疑问，去翻阅了一些资料，发现，真有文本节点，只是，默认 children 是不会放 文本节点的，然后 textContent 是根据 children 里面的文本节点算出来的。

另外翻出了一个大瓜：

## innerText 和 TextConent 的区别

翻阅了一些资料，原来 innerText 是 IE 的私有实现，其他浏览器为了兼容这个 innerText，也不得不实现它，但在最新的标准里面大家都建议使用 TextConent，性能也更优。

以下是一些参考资料：

[小tips: JS DOM innerText和textContent的区别](https://www.zhangxinxu.com/wordpress/2019/09/js-dom-innertext-textcontent/)
[浅谈innerHTML,innerText,outerHTML,outText和textConten](https://zhuanlan.zhihu.com/p/66958519)
[https://www.cnblogs.com/rubylouvre/archive/2011/05/29/2061868.html](https://www.cnblogs.com/rubylouvre/archive/2011/05/29/2061868.html)

## 本周作业

本周作业的强度还是挺大的，如果简单的模拟 Winter 老师的代码，还是能完成交差的，但是要继续深入，就很吃力了。

选做题我也只完成了一个，另外 属性选择器，时间限制实在没办法完成了，只能之后再抽时间补上了

但之前立下的 Flag，一个都没完成。。。一旦落下了进度，就真的很难赶上。

## 作业说明

1. DOM 树构建 (parser.js)
2. 选做题：复合选择器解析 (computed.js)
3. 选做题：Specificity 支持 Class 空格分割 (computed.js)

作业里面直接集成了上面三个部分，由于 `CSS compute` 代码比较长，做了拆分，其他使用基本和 Winter 老师的保持一致。

*用了 `Optional Chaining` 符号，node 版本需要 大于 14 才可以。*

### 复合选择器解析

复合选择器解析，使用了正则表达式提取关键规则，参考规则: [Mozilla CSS 部分](https://developer.mozilla.org/en-US/docs/Web/CSS)

```javascript
    const selector = rule.selectors[0].replace(/\s*([>+~])\s*/g, '$1'); // 删除多余的空格
    const selectorParts = selector.match(/([.#]?[a-zA-Z0-9-]+[ >+~]?)/g)?.reverse(); // 匹配 复合选择器正则，返回一个反序的数组
```

目前支持以下4种复合选择器：

1. 后代选择器 Descendant Combinator
2. 子代选择器 Child Combinator
3. 相邻兄弟选择器 Adjacent Sibling Combinator
4. 通用兄弟选择器 Gernal Sibling Combinator

其他支持：

1. 支持混用，例如：`img + div p ~ code > span`，支持混插空格，例如：`img   + div p   ~   code>   span`
2. 支持 `span.classname` 类似这样的 tagName + classname 的组合（中间不包括空格）
3. 支持 多个 classname （就是12题的选做题）

不支持：

1. `Column Combinator`  列表选择器
2. 伪类，伪元素
3. 属性选择器
4. 逗号分割
