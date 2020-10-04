const regExp = /([0-9\.]+)|([\s\t]+)|([\r\n]+)|([\*])|([\/])|([\+])|([\-])/g;

const dictonary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];

function* tokenize(source) {
  let result = null;
  let lastIndex = 0;
  while(true) {
    lastIndex = regExp.lastIndex;

    result = regExp.exec(source);

    if (!result) break;

    if (regExp.lastIndex - lastIndex > result[0].length)
      break;

    let token = {
      type: null,
      value: null,
    }

    for (let i = 1; i < result.length; i++) {
      if (result[i]) {
        token.type = dictonary[i - 1];
      }
    }
    token.value = result[0];
    yield token;
  }
}

const results = tokenize('10 * 25 / 2');

for (const token of results) {
  console.log(token);
}