import { Component, createElement } from './framework';
class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for(const r of this.attributes.src) {
      const child = document.createElement('div');
      child.style.backgroundImage = `url('${r}')`;
      this.root.appendChild(child);
    }

    let position = 0;

    this.root.addEventListener('mousedown', (event) => {
      console.log('mouse down');
      const children = this.root.children;
      const startX = event.clientX;

      const move = event => {
        console.log('mousemove', event.clientX, event.clientY);
        const x = event.clientX - startX;

        const current = position - ((x - x % 500) / 500);

        for (const offest of [-1, 0, 1]) {
          let pos = current + offest;
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = 'none';
          children[pos].style.transform = `translateX(${- pos * 500 + offest * 500 + x % 500}px)`;
        }
      }

      const up = event => {
        const x = event.clientX - startX;
        position = position - Math.round(x / 500);
        for (const offest of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
          let pos = position + offest;
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = '';
          children[pos].style.transform = `translateX(${- pos * 500 + offest * 500}px)`;
        }
        console.log('mouseup');
        this.root.removeEventListener('mousemove', move);
        this.root.removeEventListener('mouseup', up);
      }

      this.root.addEventListener('mousemove', move);
      this.root.addEventListener('mouseup', up);
    })

    /*
    let currentIndex = 0;
    setInterval(() => {
      const children = this.root.children;
      let nextIndex = (currentIndex + 1) % children.length;

      let current = children[currentIndex];
      let next = children[nextIndex];

      next.style.transition = 'none';
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

      setTimeout(() => {

        next.style.transition = '';
        current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        next.style.transform = `translateX(${- nextIndex * 100}%)`;

        currentIndex = nextIndex;
      }, 16);
    }, 3000);
    */
    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

const imgs = [
  'https://www.zhifure.com/upload/images/2018/7/1618626704.jpg',
  'https://www.zhifure.com/upload/images/2018/7/1618320511.jpg',
  'http://n.sinaimg.cn/sinacn10114/241/w640h401/20191109/58fa-iieqaps9887598.png',
]

let a = <Carousel src={imgs} />

// document.body.appendChild(a);
a.mountTo(document.body);