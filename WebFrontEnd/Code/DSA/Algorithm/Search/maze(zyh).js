let matrix, end, res;
/**
 * find the shortest path of Martrix by DF or DF
 * @param {String} type - traverse method
 * @param {Array} matrix - path of the maze, MATRIX 
 */
function walkmaze(maze, type) {
  let start, path;
  matrix = maze;
  end = [matrix.length - 1, matrix[0].length - 1];
  start = [0, 0];
  path = [start];
  res = [];
  if (type == 'DF') {
    // 深度优先
    DFWalk(start, path)
  } else {
    // 广度优先
    start.basicPath = [[0, 0]]; //记录路径
    BFWalk([start], path)
  }
  displayRes(type)
}
/**
 * display the result
 * @param {*} type 
 */
function displayRes(type) {
  if (res.length) {
    let bestPath = [res[0]]
    for (let i = 1; i < res.length; i++) {
      const path = res[i];
      if (path.length < bestPath[0].length) {
        bestPath = [path]
      } else if (path.length === bestPath[0].length) {
        bestPath.push(path)
      }
    }
    bestPath.forEach((path, index) => {
      console.log(`${type} best path ${index}:`);
      path.forEach(cor => {
        console.log(cor)
      })
    })
  } else {
    console("Done:未找到可通行路径")
  }
}
/**
 * DF
 * @param {*} cur 
 * @param {*} path 
 */
function DFWalk(cur, path) {
  if (cur.toString() == end.toString()) {
    res.push([...path, cur])
    return  //终点结束
  }
  let stack = [];
  let nextSteps = getValidCoordinate(cur, path);
  if (!nextSteps.length) {
    path.pop()
    return //无路可走结束
  } else {
    stack.push(...nextSteps); //可行路径入栈
  }
  while (stack.length > 0) {
    const basicPath = path.slice(0);
    const next = stack.pop()
    basicPath.push(next)
    DFWalk(next, basicPath)
  }
}
function BFWalk(layer) {
  let nextLayer = [];
  while (layer.length > 0) {
    const next = layer.shift();
    const basicPath = next.basicPath;
    let nextSteps = getValidCoordinate(next, basicPath);
    nextSteps.forEach(step => {
      if (step.toString() == end.toString()) { // 终点结束
        res.push([...next.basicPath, step])
      } else {
        step.basicPath = [...next.basicPath, step];
        nextLayer.push(step); // 构建下一层队列
      }
    })
  }
  if (nextLayer.length) { //无路可走结束
    BFWalk(nextLayer)
  }
}
/**
 * judge whether the coordinate is out of the boundary
 * @param {Array}  coordinate 
 */
function isInBoundary(coordinate) {
  if (!Array.isArray(coordinate) || coordinate.length != 2) {
    throw new Error(`coordinate:${coordinate} must be an array and containt two elements`)
  }
  return coordinate[0] >= 0 && coordinate[1] >= 0 && coordinate[0] <= end[0] && coordinate[1] <= end[1];
}
/**
 * judge whether the coordinate has been walked
 * @param {Array} coordinate 
 */
function isWalked(coordinate, path) {
  let res = path.some(item => {
    return item.toString() === coordinate.toString()
  })
  return res
}
/**
 * judge whether the coordinate is valided
 * @param {Array} coordinate 
 */
function isValided(coordinate, path) {
  return isInBoundary(coordinate) && matrix[coordinate[0]][coordinate[1]] == 0 && !isWalked(coordinate, path)
}
/**
 * find next valid coordinates
 * @param {Array} coordinate 
 */
function getValidCoordinate(coordinate, path) {
  const valids = []
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
  directions.forEach(dirItem => {
    const nextCor = [coordinate[0] + dirItem[0], coordinate[1] + dirItem[1]]
    if (isValided(nextCor, path)) valids.push(nextCor)
  })
  return valids;
}

const maze = [
  [0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0],
  [0, 1, 1, 0, 0],
  [0, 1, 1, 0, 1],
  [0, 0, 0, 0, 0],
];

walkmaze(maze, 'BF');
walkmaze(maze, 'DF');