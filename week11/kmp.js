function pmt(pattern) {
  const table = new Array(pattern.length).fill(0);
  let i = 1, j = 0;
  while (i < pattern.length) {
    if (pattern[i] === pattern[j]) {
      ++j, ++i;
      table[i] = j;
    } else {
      if (j > 0) {
        j = table[j];
      } else {
        ++i;
      }
    }
  }
  return table;
}

function kmp(str, pattern) {
  if (!pattern) {
    return 0;
  }
  const table = pmt(pattern);
  let i = 0, j = 0;
  while (i < str.length) {
    if (str[i] === pattern[j]) {
      ++i, ++j;
    } else {
      if (j > 0) {
        j = table[j];
      } else {
        ++i;
      }
    }
    if (j === pattern.length) {
      return i - j;
    }
  }
  return -1;
}

module.exports = kmp;