const regExp = /([0-9\.]+)|([\s\t]+)|([\r\n]+)|([\*])|([\/])|([\+])|([\-])/g;

const dictonary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];

function tokenize(source) {
  let result = null;
  while(true) {
    result = regExp.exec(source);

    if (!result) break;

    for (let i = 1; i < result.length; i++) {
      if (result[i]) {
        console.log(dictonary[i - 1]);
      }
    }
    console.log(result);
  }
}

tokenize('1024 + 10 * 25');