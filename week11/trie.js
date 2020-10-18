const $ = Symbol('$');

class Trie {
  constructor() {
    this.root = Object.create(null);
  }

  insert(word) {
    let node = this.root;
    for (const c of word) {
      if (!node[c]) {
        node[c] = Object.create(null);
      }
      node = node[c];
    }
    if (!($ in node)) {
      node[$] = 0;
    }
    node[$] ++
  }

  most() {
    let max = 0;
    let maxWord = null;
    let visit = (node, word) => {
      if (node[$] && node[$] > max) {
        max = node[$];
        maxWord = word;
      }
      for (const p in node) {
        visit(node[p], word + p);
      }
    }
    visit(this.root, '');
    return {
      max,
      word: maxWord,
    };
  }
}

const ACode = 'a'.charCodeAt(0);

function randomWord(length) {
  let s = '';
  for (let i = 0; i < length; i++) {
    s += String.fromCharCode(Math.random() * 26 + ACode);
  }
  return s;
}

const trie = new Trie();

for (let i = 0; i < 100000; i++) {
  trie.insert(randomWord(4));
}