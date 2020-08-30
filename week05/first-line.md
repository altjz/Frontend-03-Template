# 思考题

## 为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢

## 结论

先说结论吧:

`first-line 会打断行内元素，重新生成多个行内元素，如果使用 float 的话，会导致排版错乱`

`first-letter 因为只有一个字母，并不会打断元素，因此它可以使用 float 不用担心打乱排版`

老实说，我也无法确认是不是这个，主要对 float 的原理不够熟悉，但比之前瞎猜要好吧。

## 假设

看到这一题的时候我完全懵逼，完全不知道怎么下手，感觉光靠猜也无补于事。先大胆假设吧。

1. 性能问题

是不是因为 `::first-line` 会导致重绘的性能问题（瞎JB猜）

2. 无法实现

难倒是浏览器实现不了？？

3. 和某条规则冲突

会不会是和某条 `::first-line` 的规则冲突，或者和 `float` 的规则冲突。

## 证实

第一，第二条，我感觉都不太可能，性能问题，只要是伪元素都会导致重绘的问题，也不至于性能问题不让用，实现不了就更不应该，都 2020 年，chrome 都到 85 的版本了。

感觉第三条最有可能，既然是规则问题，用追溯法吧。

1. 查找到 `::first-line` 的 css 标准:

[csswg ::first-line](https://drafts.csswg.org/selectors-3/#first-line)

*The ::first-line pseudo-element is similar to an inline-level element, but with certain restrictions.*

`::first-line` 的行为类似于行内元素，但是有一定的限制。

emm，也没说为啥不能用

2. 接下来看 `::first-letter` 的 css 标准：

[csswg ::first-line](https://drafts.csswg.org/selectors-3/#first-letter)

*In CSS a `::first-line` pseudo-element is similar to an inline-level element if its ‘float’ property is ‘none’; otherwise, it is similar to a floated element.*

`::first-letter` 如果 `float` 设置为 `'none'` 它的行为类似于行内元素，否则则是类似于浮动元素

(⊙o⊙)… 居然发现了一个书写错误，它把 `::first-letter`，写成了 `::first-line`，搞得我高兴了一下。

但这句话也是没说为啥，没有告诉我为啥。😂

3. 偷不了懒了，看来只能硬啃全部的标准内容了

这段标准，我看了不下 20 次，我还是完全没有头绪，只能看看有没有前人总结过了。

谷歌了整整两天，一个都找不到，🤣，有点想哭。

后来放弃了，发散随便找吧，想把伪元素相关的看一遍，然后在 Winter 老师《重新前端》（果然是解铃还须系铃人吗）这一篇有意外收获
[CSS选择器：伪元素是怎么回事儿？](https://time.geekbang.org/column/article/84633)

```html
<div>
  <span id=a>First paragraph</span><br/>
  <span>Second paragraph</span>
</div>
```

```css
div>span#a {
    color:green;
}

div::first-line {
    color:blue;
}
```

这个例子里面，`First paragraph` 并不是蓝色的，而是绿色的，有点神奇，但是原因 Winter 老师只是一笔带过了，伪元素在 span 之外。

重新回到标准里面，重新细读这部分。

*7.1.1. First formatted line definition in CSS*

.....

A UA should act as if the fictional start tags of the ::first-line pseudo-elements were nested just inside the innermost enclosing block-level element. (Since CSS1 and CSS2 were silent on this case, authors should not rely on this behavior.) For example, the fictional tag sequence for

```html
<DIV>
  <P>First paragraph</P>
  <P>Second paragraph</P>
</DIV>
```

is

```html
<DIV>
  <P><DIV::first-line><P::first-line>First paragraph</P::first-line></DIV::first-line></P>
  <P><P::first-line>Second paragraph</P::first-line></P>
</DIV>
```

上面部分，提到了一个虚拟标签(fictional tags)的概念，就是说，其实伪元素其实最终是这样插入到 DOM 结构树之中的，可以看到，如果是块状的元素，它是同时具备 `DIV` 和 `p` 的 `::first-line` 的虚拟标签

但是在行内元素，并不是这样的：

```html
<DIV>
  <span>First paragraph</span>
  <span>Second paragraph</span>
</DIV>
```

is

```html
<DIV>
  <DIV::first-line><span>First paragraph</span></DIV::first-line>
  <span>Second paragraph</span>
</DIV>
```

行内元素只有 `DIV` 的 `::first-line`，因此 Winter 老师的例子里面，first-line 没有生效

然后问题来了：貌似这个跟 first-line 不能用 float 没啥关系 😂

## 依据

其实之前的线索并没有直接回答这个问题，但是却让我意外发现，`first-letter` 和 `first-line` 这两个的差别

依据是以下这部分标准，因为 first-line 是格式化之后的第一行(First formatted line)，格式化的定义，在标准里面也有，是真正布局之后计算出来的实际显示的效果，如果被 first-line 打断(break up)一个真正的元素的话，会产生多个相同的元素，例如，下面的案例的话，会导致变成了两个 `<span>`，如果有 `float` 属性的话，会导致排版错乱。

但是 `first-letter` 不会打断元素，因为它只有一个，并不存在打断，因此它不用担心 `float` 会打乱排版.

csswg 的 first-line 标准:

If a pseudo-element breaks up a real element, the desired effect can often be described by a fictional tag sequence that closes and then re-opens the element. Thus, if we mark up the previous paragraph with a span element:

```html
<P><SPAN class="test"> This is a somewhat long HTML
paragraph that will be broken into several
lines.</SPAN> The first line will be identified
by a fictional tag sequence. The other lines
will be treated as ordinary lines in the
paragraph.</P>
```
the user agent could simulate start and end tags for span when inserting the fictional tag sequence for ::first-line.

```html
<P><P::first-line><SPAN class="test"> This is a
somewhat long HTML
paragraph that will </SPAN></P::first-line><SPAN class="test"> be
broken into several
lines.</SPAN> The first line will be identified
by a fictional tag sequence. The other lines
will be treated as ordinary lines in the
paragraph.</P>
```
