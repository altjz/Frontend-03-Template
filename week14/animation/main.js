import { Timeline, Animation } from './animation.js';
import { easeIn } from './ease.js';

const tl = new Timeline();
tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 2000, 0, easeIn, v => `translateX(${v}px)`));
tl.start();

document.querySelector('#el2').style.transition = 'transform ease-in 2s';
document.querySelector('#el2').style.transform = 'translateX(500px)';

document.querySelector('#start-btn').addEventListener('click', () => {
  tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 2000, 0, easeIn, v => `translateX(${v}px)`));
  tl.start();
});
document.querySelector('#pause-btn').addEventListener('click', () => tl.pause());
document.querySelector('#resume-btn').addEventListener('click', () => tl.resume());
document.querySelector('#reset-btn').addEventListener('click', () => {
  tl.reset();
  document.querySelector('#el').style.transform = 'none';
});