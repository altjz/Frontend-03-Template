function find(str, pattern) {
  let startCount = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '*') {
      startCount++;
    }
  }
  if (startCount === 0) {
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== str[i] && pattern[i] !== '?') {
        return false;
      }
    }
    return ;
  }

  let i = 0;
  let lastIndex = 0;

  for (i = 0; pattern[i] !== '*'; i++) {
    if (pattern[i] !== str[i] && pattern[i] !== '?') {
      return false;
    }
  }

  lastIndex = i;

  for (let p = 0; p < startCount - 1; p++) {
    i++;
    let subPattern = '';
    while(pattern[i] !== '*') {
      subPattern += pattern[i];
      i++;
    }
    let reg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g');
    reg.lastIndex = lastIndex;


    // console.log(reg.exec(str));

    if (!reg.exec(str)) {
      return false;
    }

    lastIndex = reg.lastIndex;
  }

  for (let j = 0; j <= str.length - lastIndex && pattern[pattern.length - j] !== '*'; j++) {
    if (pattern[pattern.length - j] !== str[str.length - j] && pattern[pattern.length - j] !== '?')  {
      return false;
    }
  }
  
  return true;

}

module.exports = find;
