export class Dispatcher {
  constructor(element) {
    this.element = element;
  }
  dispatch(type, properties = {}) {
    const event = new Event(type);
    for (const name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
  }
}

export class Listener {
  constructor(element, recognizer) {
    const contexts = new Map();

    let isListeningMouse = false;
    
    element.addEventListener('mousedown', (event) => {
      const context = Object.create(null);
      contexts.set(`mouse${1 << event.button}`, context);
    
      recognizer.start(event, context);
    
      let mousemove = event => {
        let button = 1;
    
        while (button <= event.buttons) {
          if (button & event.buttons) {
            // event.buttons order is not the same as event.button
            let key;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            } else {
              key = button;
            }
            recognizer.move(event, contexts.get(`mouse${key}`));
          }
          button = button << 1;
        }
      }
    
      let mouseup = event => {
        recognizer.end(event, contexts.get(`mouse${1 << event.button}`));
        contexts.delete(`mouse${1 << event.button}`);
        if (event.buttons === 0) {
          document.removeEventListener('mouseup', mouseup);
          document.removeEventListener('mousemove', mousemove);
          isListeningMouse = false;
        }
      }
      if (!isListeningMouse) {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        isListeningMouse = true;
      }
    })
    
    element.addEventListener('touchstart', event => {
      for (let touch of event.changedTouches) {
        const context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    });
    
    element.addEventListener('touchmove', event => {
      for (let touch of event.changedTouches) {
        recognizer.move(touch, contexts.get(touch.identifier));
      }
    });
    
    element.addEventListener('touchend', event => {
      for (let touch of event.changedTouches) {
        recognizer.end(touch, contexts.get(touch.identifier));
        contexts.delete(touch.identifier);
      }
    });
    
    element.addEventListener('touchcancel', event => {
      for (let touch of event.changedTouches) {
        recognizer.cancel(touch, contexts.get(touch.identifier));
        contexts.delete(touch.identifier);
      }
    });
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }
  start(point, context) {
      context.startX = point.clientX;
      context.startY = point.clientY;
      context.isPan = false;
      context.isTap = true;
      context.isPress = false;
      context.points = [{
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
      }]
    
      context.handler = setTimeout(() => {
        context.isPan = false;
        context.isTap = false;
        context.isPress = true;
        context.handler = null;
        this.dispatcher.dispatch('press');
      }, 500);
  }
  move(point, context) {
      const dx = point.clientX - context.startX;
      const dy = point.clientY - context.startY;
      if (!context.isPan && (dx ** 2 + dy ** 2) > 100) {
        context.isTap = false;
        context.isPan = true;
        context.isPress = false;
        context.isVertical = Math.abs(dx) < Math.abs(dy);
        this.dispatcher.dispatch('panstart', {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical,
        });
        clearTimeout(context.handler);
      }
    
      if (context.isPan) {
        this.dispatcher.dispatch('pan', {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical,
        });
      }
      context.points = context.points.filter(p => Date.now() - p.t < 500);
      context.points.push({
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
      })
  }
  end(point, context) {
      if (context.isTap) {
        this.dispatcher.dispatch('tap');
        clearTimeout(context.handler);
      }
      if (context.isPress) {
        this.dispatcher.dispatch('pressend');
      }
      context.points = context.points.filter(p => Date.now() - p.t < 500);
      let d, v;
      if (!context.points.length) {
        v = 0;
      } else {
        d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
        v = d / (Date.now() - context.points[0].t);
      }
      if (v > 1.5) {
        context.isFlick = true;
        this.dispatcher.dispatch('flick', {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical,
          isFlick: context.isFlick,
          velocity: v,
        });
      } else {
        context.isFlick = false;
      }
      if (context.isPan) {
        this.dispatcher.dispatch('panend', {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical,
          isFlick: context.isFlick,
        });
      }
  }
  cancel(point, context) {
    clearTimeout(context.handler);
    this.dispatcher.dispatch('cancel');
  }
}

export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}