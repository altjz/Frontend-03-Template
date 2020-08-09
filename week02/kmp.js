function match(str, pat) {
  if (pat === '') {
    return 0;
  }
  const pmt = getPMT(pat); // 生成一张 PMT 表

  function getNext(m) {
    if (m === pat.length) {
      return end;
    }
    return (i) => {
      if (str[i] === pat[m]) { // 如果相等，返回一下个状态
        return getNext(m + 1);
      } else // 如果不相等，查 PMT 返回到上次匹配的状态
        return getNext(m - pmt[m]);
    }
  }

  let state = getNext(0);
  for (let i = 0; i < str.length; i++) {
    state = state(i);
  }
  return state === end;
}

function end() {
  return end;
}

/**
 * 网上看到的全是用 next 数组，其实我到现在也没有理解为什么要用 next 数组，因此自己实现了一个 PMT 的生成函数
 * @param {string} str 
 */
function getPMT(str) {
  const pmt = [];
  pmt[0] = 0;
  let i = 0;
  let j = 1;
  while (j < str.length) {
    if (str[i] === str[j]) {
      i++;
      pmt[j] = i;
    } else {
      pmt[j] = 0;
      i = 0;
    }
    j++;
  }
  return pmt;
}

console.log('result',
  match('hello', 'll'),
  match('aaaa', 'aaaa'),
  match('aaa', 'a'),
  match('bbbbababbbaabbba', 'abb'),
  match("BBC ABCDABEAAA ABCDABCDABDE", "ABCDABD"),
);