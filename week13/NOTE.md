# 学习笔记

## 对象与组件

模块化其实是一种通用的描述（后端，前端，移动端），各种地方都可以用，但组件化，重点是描述 UI 方面。

组件的概念一般包含：

- Properties
- Methods
- Inherit
- Attribute
- Config & State
- Event
- Lifecycle
- Children

*之前一直有一个疑问，为什么可视化的拖拽UI为什么不流行，Winter 老师是从 树形结构的形式上解释的* 

## Attribute Property State Config 的概念区别

- 组件的 `Attribute`
    1. Attribute 强调描述性
    2. 通常是用在 markup 语言上 （例如 XML）

```
    myComp.setAttribute('a', 'hello');
    myComp.setAttribute('b', 'world');
```

- 组件的 `Property`
    1. Property 强调从属关系
    2. 通常是用在 JavaScript 代码上用的

```
    myComp.a = 'hello';
    myComp.b = 'world';
```

| Name      | Markup | JS   | JS Change | User Input |
| --------- | ------ | ---- | --------- | ---------- |
| property  | ✖︎      | ✔︎    | ✔︎         | ❔         |
| attribute | ✔︎      | ✔︎    | ✔︎         | ❔         |
| state     | ✖︎      | ✖︎    | ✖︎         | ✔︎          |
| config    | ✖︎      | ✔︎    | ✖︎         | ✖︎          |

## 生命周期

生命周期的概念有点意思，之前一直都是按照 React 或者 Vue 的生命周期来理解。Winter 老师从整个通用的 组件化的生命周期来理解，高度抽象了一些概念。

有点理解生命周期的设计了。

## 子组件

分成：模板型 和 内容型

## 总结

这周终于开始做组件化了，这个组件化挺有意思的，干货非常多。

之前也接触了 React 和 Vue，但也不是特别深入，一直想要通过阅读源码来理解，但其实这样很容易陷进去某个框架体系里面。

Winter 的讲解特别的好，虽然借助了 React 的JSX 语法解析，但其实是高度抽象了组件化系统的，标记语言体系。

跟完整个轮播的还是收获很大。

另外轮播的组件原本还以为很简单，其实发现组件化的过程其实代码量不大，但是轮播里面的各种坐标换算特别耗费时间。