const N = 3; // 5 字棋
const COLUMN = 3; // 棋盘格子数
let pattern = [];
for (let i = 0; i < COLUMN; i++) { // 初始化棋盘
  const row = [];
  for (let j = 0; j < COLUMN; j++) {
    row.push(0);
  }
  pattern.push(row);
}

let current = 1;
let ITEMS = [];
const board = document.getElementById('board');

function create(pattern) {
  board.innerHTML = "";
  for (let i = 0; i < COLUMN; i++) {
    ITEMS[i] = [];
    for (let j = 0; j < COLUMN; j++) {
      const item = document.createElement('div');
      item.className = 'item';
      item.addEventListener('click', () => userMove(pattern, j, i), {
        once: true
      });
      ITEMS[i].push(item);
      board.appendChild(item);
    }
    board.appendChild(document.createElement('br'));
  }
}

function show() {
  for (let i = 0; i < COLUMN; i++) {
    for (let j = 0; j < COLUMN; j++) {
      if (ITEMS[i][j].textContent !== getColor(pattern[i][j])) {
        ITEMS[i][j].textContent = getColor(pattern[i][j]);
      };
    }
  }
}

function getColor(color) {
  return color === 2 ? '❌' : color === 1 ? '⭕️' : '';
}

function userMove(pattern, x, y) {
  // if (current === 1) console.log(`${x},${y}`);
  pattern[y][x] = current;
  if (check(pattern, x, y, current)) {
    alert(`${getColor(current)} win !!`);
    return;
  }
  current = 3 - current;
  show();
  computerMove(pattern);

  // console.log(bestChoice(pattern, current));
  // // if (willWin(pattern, current)) {
  // //   console.log(`${getColor(current)} will Win!!`);
  // // }
}

function computerMove(pattern) {
  let choice = bestChoice(pattern, current);
  if (choice.point) {
    console.log(choice.point, choice.result);
    pattern[choice.point[1]][choice.point[0]] = current;
  }
  if (check(pattern, choice.point[0], choice.point[1], current)) {
    alert(`${getColor(current)} win !!`);
  }
  current = 3 - current;
  show();
}

/**
 * 判断落子点，横竖斜，是否有连子 N 个
 */
function check(pattern, x, y, current) {
  // 横 -
  {
    let matchCount = 0;
    for (let i = 0; i < COLUMN; i++) {
      if (pattern[y][i] === current) {
        matchCount += 1;
      } else {
        matchCount = 0;
      }
      if (matchCount >= N) {
        return true;
      }
    }
  }
  // 竖 |
  {
    let matchCount = 0;
    for (let i = 0; i < COLUMN; i++) {
      if (pattern[i][x] === current) {
        matchCount += 1;
      } else {
        matchCount = 0;
      }
      if (matchCount >= N) {
        return true;
      }
    }
  }
  // 正斜 /
  {
    let matchCount = 0;
    const COUNT = COLUMN - Math.abs(COLUMN - x - 1 - y); // 获取当前正斜的元素数量
    let _x, _y;
    if (COLUMN - x - 1 > y ) { // 只要 COLUMN - x + 1 > y 就是在对角线的内
      _y = COUNT;
      _x = 0;
    } else {
      _y = COLUMN - 1;
      _x = COLUMN - COUNT;
    }
    if (COUNT >= N) { // 必须大于目标棋子才判断
      for (let i = 0; i < COUNT; i++, _x++, _y--) {
        if (pattern[_y][_x] === current) {
          matchCount++;
        } else {
          matchCount = 0;
        }
        if (matchCount >= N) {
          return true;
        }
      }
    }
  }
  // 反斜 \
  {
    let matchCount = 0;
    const diff = Math.abs(x - y);
    const COUNT = COLUMN - diff; // 获取当前正斜的元素数量
    let _x, _y;
    if (x < y) { // 只要 x < y 就是在对角线的内
      _y = COLUMN - 1;
      _x = COUNT - 1;
    } else {
      _y = COUNT - 1;
      _x = COLUMN - 1;
    }
    if (COUNT >= N) { // 必须大于目标棋子才判断
      for (let i = 0; i < COUNT; i++, _x--, _y--) {
        if (pattern[_y][_x] === current) {
          matchCount++;
        } else {
          matchCount = 0;
        }
        if (matchCount >= N) {
          return true;
        }
      }
    }
  }
}

function clone(pattern) {
  return JSON.parse(JSON.stringify(pattern));
}

function willWin(pattern, color) {
  for (let i = 0; i < COLUMN; i++) {
    for (let j = 0; j < COLUMN; j++) {
      if (pattern[i][j]) {
        continue;
      }
      const tmp = clone(pattern);
      tmp[i][j] = color;
      if (check(tmp, j, i, color)) {
        return [j, i];
      }
    }
  }
  return false;
}

function bestChoice(pattern, color) {
  if (p = willWin(pattern, color)) {
    return {
      point: p,
      result: 1,
    }
  }
  let result = -2;
  let point = null;
  outer:for (let i = 0; i < COLUMN; i++) {
    for (let j = 0; j < COLUMN; j++) {
      if (pattern[i][j])
        continue;
      const tmp = clone(pattern);
      tmp[i][j] = color;
      let r = bestChoice(tmp, 3 - color).result;
  
      if (- r > result) {
        result = - r;
        point = [j, i];
      }
      if (result === 1) {
        break outer;
      }
    }
  }
  return {
    point,
    result: point ? result : 0,
  }
}

create(pattern);