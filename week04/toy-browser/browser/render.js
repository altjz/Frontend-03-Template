const images = require('images');

const BACKGROUND_COLOR = 'background-color';

function render(viewport, element) {
  if (element.style) {
    const image = images(element.style.width, element.style.height);
    if (element.style[BACKGROUND_COLOR]) {
      const color = element.style[BACKGROUND_COLOR] || 'rgb(0,0,0)';
      const rgbs = color.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
      rgbs.shift();
      image.fill(...rgbs.map((v) => Number(v)));
      viewport.draw(image, element.style.left || 0, element.style.top || 0);
    }
  }

  if (element.children) {
    for (const e of element.children) {
      render(viewport, e);
    }
  }
}

module.exports = render;
