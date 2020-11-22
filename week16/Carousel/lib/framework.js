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
  const processChildren = (children) => {
    for (const child of children) {
      if (Array.isArray(child)) {
        processChildren(child);
        continue;
      }
      if (typeof child === 'string') {
        child = new TextWrapper(child);
      }
      // console.log(child);
      dom.appendChild(child);
    }
  }
  processChildren(children);
  return dom;
}

export const STATE = Symbol('state');
export const ATTRIBUTE = Symbol('attribute');

export class Component {
  constructor(type) {
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }
  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
  }
  appendChild(child) {
    child.mountTo(this.root);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
  mountTo(parent) {
    if (!this.root) {
      this.render();
    }
    parent.appendChild(this.root);
  }
  triggerEvent(type, args) {
    this[ATTRIBUTE]['on' + type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, { detail: args }));
  }
  render() {
    return this.root;
  }
}

class TextWrapper extends Component {
  constructor(content) {
    super();
    this.root = document.createTextNode(content);
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    super();
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
}