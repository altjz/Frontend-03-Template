## 流

### 盒子 Box

之前 toy-browser，已经使用过了 flex 布局，但是那种都是很简单粗暴，直接把元素作为排版的单位，但是现实中是复杂很多的。所以这里引入了一个 Box 的概念，Box 除了 `Content` 以外，还包含 `Padding` 行内边距，`Margin` 行外边距，还有 `Border` 边框，因此也有 `content-size`，和 `box-size` 的概念

然后 CSS 的东西概括起来就只有两种，一种是：box 的排版，还有一种是：文字的排版

### 正常流 Normal Flowing

就是最基本的流，说它正常流，是因为它在排版界已经使用了很多年了，相对于排版行业来说是特别成熟的一套。

但是对很多正常人的理解来说，它反而是不容易理解的。

说以相对于，Flex ，Grid ，正常流的概念反而更难理解

但是正常流分成两类

- inline-level-box

- block-level-box

inline-level-box 是行内元素的 box，它是一种从左到右（不考虑其他因素）的排版方式

block-level-box 是一种块状元素的 box，它是一种从上到下的排版方式

看PPT是说，从左到右的 inline box，只有行内的排版，但是从上到下，inline-level-box 与 block-level-box 也是一样可以参与的

这两种统称为：

- IFC，Inline Formatting Contexts，行内上下文格式化

- BFC，Block Formatting Contexts，块状上下文格式化

## float 和 clear

其实 float 的原意是用来做绕排的效果，就是文字围绕 图片的排版方式。但是因为早年正常流很难达到我们布局的需求，所以使用了 float 来弥补正常流布局的不足。

这个时候，就会配合 clear 来使用

但是目前已经完全可以使用 flexbox 或者 grid 替代掉 float 和 clear，已经不再需要了

float 也可以回归它最原始的用意。

## BFC

### Block

#### Block Container

就是 display 的属性：

- block
- inline-block
- table-cell
- flex item
- grid cell
- table-caption

#### Block-level Box

block-level 与 inline-level 是对称的
- Block level
- Inline level

还有一个特殊的：run-in

是根据上一个使用的来确认是：block-level 或者 inline-level，但使用很少

#### BFC

##### 创建 BFC 的四个原因：

- float
- 绝对定位元素，或者 fixed
- block containers
- overflow 不为 visible

##### 为什么会有：BFC

1. 默认能容纳 Block Container 会创建 BFC
2. overflow 不为 visible

###### 为什么 overflow: hidden 会清除 float

[CSS中为什么overflow:hidden能清除浮动(float)的影响？原理是什么？ - 贺师俊的回答 - 知乎](https://www.zhihu.com/question/30938856/answer/50098824)

## 动画与绘制

### CSS 主要做什么

1. CSS 控制 元素位置，尺寸信息
2. CSS 控制 绘制
3. 交互绘制，动画

#### 动画

- @keyframes 定义
- animation 使用
- Transaction
- 三次贝塞尔曲线

#### 颜色

- RGB
- HSV 与 HSL

#### 绘制

- 几何图形
- 文字
- 位图

