function parent(s) {
  return s % 2 === 0 ? parseInt(s / 2 - 1) : parseInt((s - 1) / 2);
}

function left(i) {
  return i * 2 + 1;
}

function right(i) {
  return i * 2 + 2;
}

class MinHeap {
  constructor(arr, compare) {
    this.data = arr.slice();
    this.compare = compare || ((a, b) => a > b);
    const pLen = parseInt(this.data.length / 2, 10);
    for (let s = pLen - 1; s >= 0; s--) {
      this.shiftDown(s);
    }
  }

  get length() {
    return this.data.length;
  }

  swap(a, b) {
    let tmp = this.data[a];
    this.data[a] = this.data[b];
    this.data[b] = tmp;
  }

  shiftUp(s) {
    const d = this.data;
    while (s > 0 && d[parent(s)] && d[s]) {
      if (!this.compare(d[parent(s)], d[s])) {
        break;
      }
      this.swap(s, parent(s));
      s = parent(s);
    }
  }
  
  shiftDown(s) {
    const d = this.data;
    while (left(s) <= d.length && d[left(s)] && d[right(s)]) {
      const minChildIdx = this.compare(d[left(s)], d[right(s)]) ? right(s) : left(s);
      if (this.compare(d[s], d[minChildIdx])) {
        this.swap(s, minChildIdx);
      }
      s = minChildIdx;
    }
  }

  take(index=0) {
    this.swap(index, this.data.length - 1);
    const tmp = this.data.pop();
    this.shiftDown(index);
    return tmp;
  }
  
  give(value) {
    this.data.push(value);
    this.shiftUp(this.data.length - 1);
  }
}

// (function () {
//   const arr = [7, 1, 3, 10, 5, 2, 8, 9, 6, 4];

//   function compare(a, b) {
//     if (a !== undefined && b !== undefined) {
//       return a > b;
//     }
//     console.log(a, b);
//   }

//   const heap = new MinHeap(arr);
//   heap.give(0);
//   while(heap.length) {
//     console.log(heap.take());
//   }
// })();

