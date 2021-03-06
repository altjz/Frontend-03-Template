# 14周 学习笔记

## Animation 动画库

本周进行了一个最基本的 Animation 动画库的基础组件。

有点意思，虽然非常简单，但是麻雀虽小五脏俱全，JavaScript 实现的动画虽然性能虽然没有 CSS 原生的好，不过也有很多优势，例如，暂停，恢复等，而且可以灵活自由配置。

这个动画组件的组件课程短小精悍，不过由于以前很少使用动画，所以这一次的课程老实说有很多远离没有理解，如果课程可以像上节课一样，讲一些原理性的东西，感觉会更好。

## Animation 动画组件库和 CSS 动画的区别

- 根据 Chrome 的介绍，渲染进程分为*主线程* 和 *合成线程(compositor thread)*。如果 CSS 动画只是改变 `transform` 和 `opacity` 的话，整个 CSS 动画是可以在 *合成线程* 中完成的，但是 JavaScript 的动画则会在 *主线程* 执行，然后出发的操作会在*合成线程*中完成，因此流畅度肯定是 CSS 动画更优

- 如果触发绘画，或者布局，无论是 CSS 或者是 JS 动画都需要在 *主进程*  中解决，其实他们本质上没有太大区别

- CSS3 的动画在不同浏览器上会有兼容性问题，但是 JavaScript 大多没有问题 （就算有也可以使用 Polyfill 解决）

## 作业说明

貌似 `webpack-dev-server` 和 `webpack 5` 有点冲突，导致一直用不了，因此我直接用了 `http-server`

1. cd animation
2. npm i
3. npm run start
