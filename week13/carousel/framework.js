export function createElement(type, attributes, ...children) {
  let dom;

  if (typeof type === 'string') {
    dom = new ElementWrapper(type);
  } else {
    dom = new type;
  }
  for (const attrName in attributes) {
    dom.setAttribute(attrName, attributes[attrName]);
  }
  for (const child of children) {
    if (typeof child === 'string') {
      child = new TextWrapper(child);
    }
    dom.appendChild(child);
  }
  return dom;
}

export class Component {
  constructor(type) {
    // this.root = this.render(type);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    child.mountTo(this.root);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class TextWrapper extends Component {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    this.root = document.createElement(type);
  }
}