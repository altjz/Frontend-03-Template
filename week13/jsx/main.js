function createElement(type, attributes, ...children) {
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

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
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

class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
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

class Div {
  constructor() {
    this.root = document.createElement('div');
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

let a = <Div id="a" >
  <span>a</span>
  <span>b</span>
  <span>c</span>
  </Div>;

// document.body.appendChild(a);
a.mountTo(document.body);