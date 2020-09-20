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
    if (COLUMN - x - 1 > y) { // 只要 COLUMN - x + 1 > y 就是在对角线的内
      _y = COUNT - 1;
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

/**
 * 棋型的评估分数
 * 参照 https://github.com/colingogogo/gobang_AI#%E6%9E%81%E5%A4%A7%E6%9E%81%E5%B0%8F%E5%80%BC%E6%90%9C%E7%B4%A2
 * # 棋型的评估分数
 * */ 

const ShapeScore = [
  [50,        [0, 1, 1, 0, 0]],          // 活二
  [50,        [0, 0, 1, 1, 0]],          // 活二
  [200,       [1, 1, 0, 1, 0]],         // 冲三
  [500,       [0, 0, 1, 1, 1]],         // 冲三
  [500,       [1, 1, 1, 0, 0]],         // 冲三
  [5000,      [0, 1, 1, 1, 0]],        // 活三
  [5000,      [0, 1, 0, 1, 1, 0]],     // 活三
  [5000,      [0, 1, 1, 0, 1, 0]],     // 活三
  [5000,      [1, 1, 1, 0, 1]],        // 冲四
  [5000,      [1, 1, 0, 1, 1]],        // 冲四
  [5000,      [1, 0, 1, 1, 1]],        // 冲四
  [5000,      [1, 1, 1, 1, 0]],        // 冲四
  [5000,      [0, 1, 1, 1, 1]],        // 冲四
  [50000,     [0, 1, 1, 1, 1, 0]],    // 活四
  [Infinity,  [1, 1, 1, 1, 1]],    // 连五
]

/**
 * 评估函数，判断当前的分数
 * @param {Array} pattern 棋盘
 * @param {number} color 当前子颜色
 */
function evaluate(pattern, color) {
  for (let i = 0; i < COLUMN; i++) {
    for (let j = 0; j < COLUMN; j++) {
      if (pattern[i][j]) {
        continue;
      }
      calPoint(pattern, j, i, color);
    }
  }
}

function calPointDirectionScore(line, m, max, color, allScoreShapes) {
  // const shapes = [];
  let maxScoreShape = [0, []];
  let addScore = 0; // 加分
  const start = m < N ? 0 : m - N;
  const end = m > max - N + 1 ? max - 1 : m + N;
  const COUNT = (end - m) - (m - start + 1) ? (m - start + 1) : (end - m);
  for (let i = 0, _m = start; i < COUNT; i++, _m++) {
    const posArr = [];
    for (let j = _m; j <= _m + N; j++) {
      posArr.push(line[j] === color ? 1 : line[j] === 0 ? 0 : 2);
    }
    const shape5 = [posArr[0], posArr[1], posArr[2], posArr[3], posArr[4]];
    const shape6 = [posArr[0], posArr[1], posArr[2], posArr[3], posArr[4], posArr[5]];
    // shapes.push([shape5, shape6]);
    // console.log(shapes);
    const score5 = matchModel(shape5);
    const score6 = matchModel(shape6);
    let scoreShape = score5 > score6 ? [score5, shape5] : [score6, shape6];
    // if (scoreShape[0] === 0) {
    //   const otherScore = matchPoint(shape5);
    //   if (otherScore) {
    //     scoreShape = [10, shape5];
    //   }
    // }
    if (scoreShape[0] === Infinity) {
      allScoreShapes.push(scoreShape);
      return scoreShape[0];
    }
    if (scoreShape[0] > maxScoreShape[0]) {
      maxScoreShape = scoreShape;
    }
  }
  if (maxScoreShape[0]) {
    for (const ss of allScoreShapes) {
      if (compareArr(ss, maxScoreShape) && maxScoreShape[0] > 10 && ss[0] > 10) {
        addScore += ss[0] + maxScoreShape[0];
      }
    }
    allScoreShapes.push(maxScoreShape);
  }
  return addScore + maxScoreShape[0];
}

function matchModel(shape) {
  for (const [score, _shapeModel] of ShapeScore) {
    if (compareArr(shape, _shapeModel)) {
      return score;
    }
  }
  return 0;
}

function matchPoint(shape) {
  let count = 0;
  for (const s of shape) {
    if (s === 1) {
      count++;
    }
  }
  return 10 * count;
}

function compareArr(shape1, shape2) {
  let isEqual = true;
  for (let j = 0; j < shape1.length; j++) {
    if (shape1[j] !== shape2[j]) {
      isEqual = false;
      break;
    }
  }
  return isEqual;
}

function calPointScore(pattern, x, y, color, allScoreShapes) {
  let totalScore = 0;
  {
    /**
     * 横 - ，最多 5 个模型
     * |4|3|2|1|x|1|2|3|4|
     */
    const line = pattern[y];
    totalScore += calPointDirectionScore(line, x, COLUMN, color, allScoreShapes);
  }
  {
    /**
     * 竖 | ，最多 5 个模型
     * |4|
     * |3|
     * |2|
     * |1|
     * |x|
     * |1|
     * |2|
     * |3|
     * |4|
     */
    const line = [];
    for (let i = 0; i < COLUMN; i++) {
      line.push(pattern[i][x]);
    }
    totalScore += calPointDirectionScore(line, y, COLUMN, color, allScoreShapes);
  }
  {
    /**
     * 正斜 / 最多 5 个模型
     * |4|
     *   |3|
     *     |2|
     *       |1|
     *         |x|
     *           |1|
     *             |2|
     *               |3|
     *                 |4|
     */
    const line = [];
    const COUNT = COLUMN - Math.abs(COLUMN - x - 1 - y); // 获取当前正斜的元素数量
    let _x, _y, index;
    if (COLUMN - x - 1 > y ) { // 只要 COLUMN - x + 1 > y 就是在对角线的内
      _y = COUNT - 1;
      _x = 0;
    } else {
      _y = COLUMN - 1;
      _x = COLUMN - COUNT;
    }
    index = _y - y;
    if (COUNT >= N) { // 必须大于目标棋子才判断
      for (let i = 0; i < COUNT; i++, _x++, _y--) {
        line.push(pattern[_y][_x]);
      }
      totalScore += calPointDirectionScore(line, index, COUNT, color, allScoreShapes);
    }
  }
  {
    /**
     * 反斜 / 最多 5 个模型
                        |4|
                      |3|
                    |2|
                  |1|
                |x|
              |1|
            |2|
          |3|
        |4|
     */
    const line = [];
    const diff = Math.abs(x - y);
    const COUNT = COLUMN - diff; // 获取当前正斜的元素数量
    let _x, _y, index;
    if (x < y) { // 只要 x < y 就是在对角线的内
      _y = COLUMN - 1;
      _x = COUNT - 1;
    } else {
      _y = COUNT - 1;
      _x = COLUMN - 1;
    }
    index = _y - y;
    if (COUNT >= N) { // 必须大于目标棋子才判断
      for (let i = 0; i < COUNT; i++, _x--, _y--) {
        line.push(pattern[_y][_x]);
      }
      totalScore += calPointDirectionScore(line, index, COUNT, color, allScoreShapes);
    }
  }
  return totalScore;
}

function getDistanceBetweenTwoPoints(x1, y1, x2, y2){
  const a = x1 - x2;
  const b = y1 - y2;
  
  // c^2 = a^2 + b^2
  // a^2 = Math.pow(a, 2)
  // b^2 = Math.pow(b, 2)
  const result = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

  return result;
}

function bestChoice(pattern, x, y, color) {
  let maxScore = 0;
  let lastX = 0;
  let lastY = 0;
  let bp = null;
  const myAllScore = [];
  const myOppScore = [];
  for (let i = 0; i < COLUMN; i++) {
    for (let j = 0; j < COLUMN; j++) {
      if (pattern[i][j]) {
        continue;
      }
      const myScore = calPointScore(pattern, j, i, color, myAllScore);
      const oppScore = calPointScore(pattern, j, i, 3 - color, myOppScore);
      if ((myScore > 0) || (oppScore > 0))
        console.log('myscore', myScore, 'oppScore', oppScore, `(${j},${i})`);
      const diff = Math.abs(myScore - oppScore);
      // const diff = myScore;
        if (diff > maxScore) {
          maxScore = diff;
          lastY = i;
          lastX = j;
          bp = [j, i];
        } else if (diff === maxScore) { // 如果相等，则判断距离，最近优先
          const ab1 = getDistanceBetweenTwoPoints(j, i, x, y);
          const ab2 = getDistanceBetweenTwoPoints(lastX, lastY, x, y);
          if (ab1 < ab2) {
            lastY = i;
            lastX = j;
            bp = [j, i];
          }
        }
    }
  }
  return {
    point: bp,
    result: maxScore,
  };
}