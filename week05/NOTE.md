# Week05 学习笔记

## 总结

这周课程除了爬虫意外，没讲解什么代码，但对于之前的 `toy-browser` 来说，又加深了很多我对 CSS 的理解。

这周我花了大量的时间在 `match(selector, element)` 函数上，基本完成了大部分工作，但还差一部分完全不知道怎么实现，伪元素。

正愁我对这部分完全没有头绪的时候，我开始做另外一个作业 `为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢`，我对 伪元素，有了些全新认识，虽然还是有点懵，不过大概有点眉目。

但在学习的过程，接触了越来越多的东西，和概念，一开始感觉，`哦，就这样啊`，越接触，越觉得，`这是啥，这又是啥`，越学，不懂得越多。

例如：各种流的概念，现在还是懵逼，什么 `IFC`, `BFC`，`FFC`，`GFC`，每个都特别抽象，深深的让我感觉 css 易学难精。

## 本周作业

### match 函数

#### 心得

在 `toy-browser` 里面， `computeStyle` 部分，我也实现了 复杂选择器，当时用了正则加双循环，实现得不太好。

这次我从新用了，状态机先分解 selector 成为一个 二元数组，二元数组也是为了支持 逗号的列表选择器。

选择器也可以支持以下很复杂的部分：

```css
body div > .hello-world #oooo.class + [value="1234"] .hello ~ .gotme , body div p.list-test {
  font-weight: bold;
  color: blue;
}
```

#### 使用

直接打开 `index.html` 即可

上面是浏览器原生的匹配，蓝色是匹配成功的样式，下面的是，match 函数返回的结果。

#### 说明

判断 element 是否匹配 selector
getRules 函数使用，状态机返回一个 rule 二维数组

selector 支持
复合选择器: #id.class
列表选择器: [','] 逗号分隔
复杂选择器: [' '], ['>'], ['~'], ['+']
简单选择器:

- Star * 星号 支持
- TAG 例如 div
- Class 例如 .class'
- Hash ID 例如 #id
- Attribute 例如 [attr="value"]，支持通配符如：[attr~="value"] 详情可以查看: matchAttributeSelector 函数
- PesudoClass 部分支持, not(), empty() 等，详情可以查看：matchPersudoClassSelector 函数
- PesudoElement 不支持

### 思考题

推导过程已经写在了 [first-line.md](./first-line.md) 上面

这里主要说一下心得。

#### 心得

不得不说，这个题目瞎猜只能猜到大概范围，没有依据，是很难证实的，而且就算有依据，我也没法完全证实是不是正确。

谷歌了好几天，我也完全没有答案，就算后面找到了标准，也没有告诉你为什么。

对于这样的题目，我有点不太习惯，就算推导出了结论，但是没有答案让我有点不太习惯，估计是学习的时候已经形成了惯性，都是等待别人告诉我这个东西答案，自己习惯性的先接受答案，再等别人告诉我为什么。

但是前端，应该说现实的技术问题，有很多是没有标准答案的，谷歌不出来，前端充斥着这些不起眼的小细节，没有谷歌的答案，也没有人告诉你应该怎么做，但是背后隐藏大量的东西，，需要自己查找资料，顺藤摸瓜需要自己一点点的啃标准。

要不是这次是一个作业，或许我也可能不会为一个小细节这么花时间，可能只是简单一笔带过，标准都没说的东西，为啥要深究。

但多亏这次的作业，我觉得有一个好问题，以及自己尝试解决这个问题的过程，比别人告诉你一个答案要有趣的多。

## 其他的意外发现

### 怎么获取伪类 :hover

在写 `match` 函数的时候，遇到了怎么在 javascript 里面获取，伪类 的属性，例如：`:hover`，在 console 里面获取了一个 element，翻遍了 element 下面的接口，并没有找到任何有关于 `:hover` 的相关的

谷歌了一下，搜索到一个有点意思的全局的函数：`getComputedStyle()`

这个函数可以获取该元素计算之后的所有的样式，包括伪类，emm，有点意思。

[getComputedStyle](https://www.javascripttutorial.net/javascript-dom/javascript-getcomputedstyle/)

但这个其实是获取计算之后的 style，有没有计算之前。

唯一想到的办法是，给这个 element 监听一个 `mouseover` 事件，一旦触发就适配这个样式，至少 [jQuery.hover()](https://api.jquery.com/hover/) 是这么实现的。

### CSS 优先级

查找 CSS 优先级的时候，找到一张很有意思的图片，（在 Mozilla 这么正经的网站上看到的），只能说外国人真会玩，`!important` 我真笑了 🤣

![specifishity.png](https://specifishity.com/specifishity.png)