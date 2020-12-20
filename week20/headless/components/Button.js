import {
  Component,
  STATE,
  ATTRIBUTE,
  createElement,
} from '../lib/framework.js';
import {
  enableGesture
} from '../lib/gesture.js';

export class Button extends Component {
  constructor() {
    super();
  }
  
  render() {
    this.childContainer = <span />;
    this.root = (<div> {this.childContainer} </div>).render();
    return this.root;
  }

  appendChild(child) {
    if (!this.childContainer) {
      this.render();
    }
    this.childContainer.appendChild(child);
  }
}