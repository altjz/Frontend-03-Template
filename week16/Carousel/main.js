import { createElement } from './lib/framework';
import { Carousel } from './components/carousel.js';

const d = [
  {
    img: "./img/1.jpg",
    url: 'https://time.geekbang.org',
    title: '蓝猫1',
  },
  {
    img: "./img/2.jpg",
    url: 'https://time.geekbang.org',
    title: '橘猫加白',
  },
  {
    img: "./img/3.jpg",
    url: 'https://time.geekbang.org',
    title: '梨花加白',
  },
  {
    img: "./img/4.jpg",
    url: 'https://time.geekbang.org',
    title: '橘猫',
  }
]

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
a.mountTo(document.body);