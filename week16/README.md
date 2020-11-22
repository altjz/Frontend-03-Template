# 第16周

## 总结

本周结束了全部的组件化课程，老实说，感觉有点短，要是可以在这里在深入一下，React 或者 Vue 的原理就好了。

例如：组件化和第十二周里面的 `Proxy` 的应用，还可以继续深入一下。

但是收获也不少，之前组件化，最多的还是组件本身，但是*动画*和*手势*这方面，是我很少接触的，感觉挺有意思。

还有借用 `JSX` 这个也是非常好的学习，自己的 React 心智模式 更进一步完善了。

## 作业

- npm i

- npm run start

## 额外作业：Carousel 的 Children

目前的组件化，是需要自己手动 render。

按照课程原来的写法，其实是在 render 的时候，手动的触发 DOM 更新

```javascript
  // 原来的写法
  this.root = document.createElement('div');
  this.root.classList.add('carousel');
  for (const r of this[ATTRIBUTE].src) {
      const child = document.createElement('div');
      child.style.backgroundImage = `url('${r.img}')`;
      this.root.appendChild(child); // 在这里的时候触发了 DOM 更新
    }
```

如果需要提供 `children` 的传入，就需要手动的调用 `render()`，因为 `jsx` 的解析拿到的只是 `createElement` 转义后的代码

```javascript
  // 组件化 children
  this.children = this[ATTRIBUTE].data.map(this.template);
  this.root = (<div>{this.children}</div>).render();
  if (this[ATTRIBUTE].className) {
    this.root.classList = this[ATTRIBUTE].className.split(' ');
  }
  const children = this.children.map(child => child.render()); // 需要手动调用 render()
```

这样就可以再调用组件的时候，在 `jsx` 里面传入 `children`

```jsx
const a = <Carousel
  className="carousel"
  data={d}
  onChange={event => console.log(event.detail.position)}
  onClick={event => {
    console.log(event.detail.position, event.detail.data);
    window.open(event.detail.data.url);
  }}
  >
   { (r) => <img src={r.img} alt={r.title} draggable="false" /> }
  </Carousel>
```

`const children = this.children.map(child => child.render());`
这样也只能针对下一层的`children`进行渲染，如果`children`里面还有`children`嵌套，还需要循环的进行嵌套，
因此可能要写成一个函数

```javascript
function renderChild(child) {
  if (Array.isArray(child)) {
    return child.map(c => renderChild(c));
  }
  return child.render();
}
```

这样的话，`children` 就可以循环嵌套了

```jsx
const a = <Carousel
  className="carousel"
  data={d}
  onChange={event => console.log(event.detail.position)}
  onClick={event => {
    console.log(event.detail.position, event.detail.data);
    window.open(event.detail.data.url);
  }}
  >
   { (r) =>
    <div>
      <img src={r.img} alt={r.title} draggable="false" />
    </div> }
  </Carousel>
```

## 延伸思考

React 是通过挂载在最顶层的 root，来渲染整个组件树

也就是：`ReactDom.render()`

React 中的 `JSX` 会替换成 `React.createElement`，也就是使用 React 创建 `VirtualDom` 的函数。

要是课程结合第十二周 `Proxy` 和 `reactive` 的使用的话，估计就可以深入一下 `VirtualDom` 类似的机制了。

而且感觉这样每次都渲染全部的组件，也是性能消耗很大，这里可以接触到 `Diff` 方面的东西。

有点小小遗憾。
