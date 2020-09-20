const N = 5; // 棋 数字
const COLUMN = 15; // 棋盘格子数
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

function create(pattern, board) {
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


  function userMove(pattern, x, y) {
    // if (current === 1) console.log(`${x},${y}`);
    pattern[y][x] = current;
    if (check(pattern, x, y, current)) {
      alert(`${getColor(current)} win !!`);
      return;
    }
    current = 3 - current;
    show();
    computerMove(pattern, x, y);
  }

  function computerMove(pattern, x, y) {
    let choice = bestChoice(pattern, x, y, current);
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
