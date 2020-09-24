const arr = [7, 1, 3, 10, 5, 2, 8, 9, 6, 4];

function parent(i) {
  return parseInt(i / 2);
}

function left(i) {
  return i * 2 + 1;
}

function right(i) {
  return i * 2 + 2;
}

function swap(arr, a, b) {
  let tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
}

function shiftUp(d, s) {
  while (s > 0 && d[s] < d[parent(s)]) {
    swap(d, s, parent(s));
    s = parent(s);
  }
}

function shiftDown(d, s) {
  while (left(s) <= d.length) {
    const minChildIdx = d[left(s)] > d[right(s)] ? right(s) : left(s);
    if (d[s] > d[minChildIdx]) {
      swap(d, s, minChildIdx);
    }
    s = minChildIdx;
  }
}

class MinHeap {
  constructor(arr) {
    this.data = arr.slice();
    const pLen = parseInt(this.data.length / 2, 10);
    for (let s = pLen - 1; s >= 0; s--) {
      shiftDown(this.data, s);
    }
  }

  take(index) {
    swap(arr, index, arr.length - 1);
    const tmp = arr.pop();
    shiftUp(arr, index);
    return tmp;
  }
  
  give(value) {
    arr.push(value);
    shiftUp(arr, arr.length - 1);
    return arr;
  }
}

// function _heap(arr, isMax) {
//   const d = arr.slice();
//   const pLen = parseInt(d.length / 2, 10);
//   if (isMax) { // 最大堆
//     for (let s = 0; s < pLen - 1; s++) {
//       shiftUp(d, s);
//     }
//   } else { // 最小堆
//     for (let s = pLen - 1; s >= 0; s--) {
//       shiftDown(d, s);
//     }
//   }
//   return d;
// }

// function shiftDown(d, s) {
//   while (left(s) <= d.length) {
//     const minChildIdx = d[left(s)] > d[right(s)] ? right(s) : left(s);
//     if (d[s] > d[minChildIdx]) {
//       swap(d, s, minChildIdx);
//     }
//     s = minChildIdx;
//   }
// }

// function findChildIdx(s) {
//   return s % 2 === 0 ? parseInt(s / 2 - 1) : parseInt((s - 1) / 2)
// }


const heap = new MinHeap(arr);
console.log(heap.data);
// const _arr = heap(arr, false);
console.log(heap.give(0));