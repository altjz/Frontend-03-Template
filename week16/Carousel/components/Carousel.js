import {
  Component,
  STATE,
  ATTRIBUTE,
  createElement,
} from '../lib/framework.js';
import {
  enableGesture
} from '../lib/gesture.js';
import {
  Animation,
  Timeline
} from '../lib/animation.js';
import {
  ease
} from '../lib/ease.js';

export {
  STATE,
  ATTRIBUTE
}
from '../lib/framework';

function renderChild(child) {
  if (Array.isArray(child)) {
    return child.map(c => renderChild(c));
  }
  return child.render();
}

export class Carousel extends Component {
  constructor() {
    super();
  }

  appendChild(child) {
    this.template = child;
    this.render();
  }

  render() {
    // this.root = document.createElement('div');
    // this.root.classList.add('carousel');
    // for (const r of this[ATTRIBUTE].src) {
    //     const child = document.createElement('div');
    //     child.style.backgroundImage = `url('${r.img}')`;
    //     this.root.appendChild(child);
    //   }
    this.children = this[ATTRIBUTE].data.map(this.template);
    this.root = (<div>{this.children}</div>).render();
    if (this[ATTRIBUTE].className) {
      this.root.classList = this[ATTRIBUTE].className.split(' ');
    }
    // const children = this.children.map(child => child.render());
    const children = renderChild(this.children);

    enableGesture(this.root);
    const timeline = new Timeline();
    timeline.start();

    this[STATE].position = 0;

    let t = 0;

    let ax = 0;

    this[STATE].handler = null;

    this.root.addEventListener('start', event => {
      timeline.pause();
      clearInterval(this[STATE].handler);
      if (Date.now() - t < 1500) {
        let progress = (Date.now() - t) / 1500;
        ax = progress * 500 - 500;
      } else {
        ax = 0;
      }
    });

    this.root.addEventListener('tap', event => {
      this.triggerEvent('click', {
        position: this[STATE].position,
        data: this[ATTRIBUTE].src[this[STATE].position],
      });
    });

    this.root.addEventListener('pan', event => {
      const x = event.clientX - event.startX - ax;

      const current = this[STATE].position - ((x - x % 500) / 500);

      for (const offest of [-1, 0, 1]) {
        let pos = current + offest;
        pos = (pos % children.length + children.length) % children.length;

        children[pos].style.transition = 'none';
        children[pos].style.transform = `translateX(${- pos * 500 + offest * 500 + x % 500}px)`;
      }
    });

    this.root.addEventListener('panend', event => {
      timeline.reset();
      timeline.start();
      this[STATE].handler = setInterval(nextPicture, 3000);

      const x = event.clientX - event.startX - ax;

      const current = this[STATE].position - ((x - x % 500) / 500);

      let direction = Math.round((x % 500) / 500);

      if (event.isFlick) {
        console.log(event.velocity);
        if (event.velocity < 0) {
          direction = Math.ceil((x % 500) / 500);
        } else {
          direction = Math.floor((x % 500) / 500);
        }
      }

      for (const offest of [-1, 0, 1]) {
        let pos = current + offest;
        pos = (pos % children.length + children.length) % children.length;

        timeline.add(new Animation(children[pos].style, 'transform',
          -pos * 500 + offest * 500 + x % 500,
          -pos * 500 + offest * 500 + direction * 500,
          500, 0, ease, v => `translateX(${v}px)`));

        this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction;
        this[STATE].position = (this[STATE].position % children.length + children.length) % children.length;

      }
    });

    const nextPicture = () => {
      const children = this.root.children;
      let nextIndex = (this[STATE].position + 1) % children.length;

      let current = children[this[STATE].position];
      let next = children[nextIndex];

      t = Date.now();

      timeline.add(new Animation(current.style, 'transform',
        -this[STATE].position * 500,
        -500 - this[STATE].position * 500, 500, 0, ease, v => `translateX(${v}px)`));
      timeline.add(new Animation(next.style, 'transform',
        500 - nextIndex * 500,
        -nextIndex * 500, 500, 0, ease, v => `translateX(${v}px)`));

        this[STATE].position = nextIndex;
        this.triggerEvent("change", { position: this[STATE].position });
    };
    this[STATE].handler = setInterval(nextPicture, 3000);
    return this.root;
  }
}