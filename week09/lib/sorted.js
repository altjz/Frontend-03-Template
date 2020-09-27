
class Sorted {
  constructor(data, compare) {
    this.data = data.slice();
    this.compare = compare || ((a, b) => a > b);
  }

  get length() {
    return this.data.length;
  }

  take() {
    if (!this.data.length) {
      return;
    }
    let min = this.data[0];
    let minIndex = 0;

    for (let i = 0; i < this.data.length; i++) {
      if (this.compare(min, this.data[i])) {
        min = this.data[i];
        minIndex = i;
      }
    }

    this.data[minIndex] = this.data[this.data.length - 1];
    this.data.pop();
    return min;
  }

  give(v) {
    this.data.push(v);
  }
}

(function () {
  const arr = [7, 1, 3, 10, 5, 2, 8, 9, 6, 4];

  const s = new Sorted(arr);
  s.give(0);
  console.log(s.take());
})();