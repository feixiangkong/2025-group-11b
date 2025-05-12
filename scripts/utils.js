new p5();   // p5.js global mode

// 检查是否大致在格子的中心
function atTileCenter(x, y, col, row) {
    var c = center(col, row);
    var t = ts / 24;
    return between(x, c.x - t, c.x + t) && between(y, c.y - t, c.y + t);
}

// 检查数字是否在范围内（不包含边界）
function between(num, min, max) {
    return num >= Math.min(min, max) && num <= Math.max(min, max);
}

// 构建一个二维数组，填充指定值
function buildArray(cols, rows, val) {
    var arr = [];
    for (var x = 0; x < cols; x++) {
        arr[x] = [];
        for (var y = 0; y < rows; y++) {
            arr[x][y] = val;
        }
    }
    return arr;
}

// 返回格子中心的位置
function center(col, row) {
    return createVector(col*ts + ts/2, row*ts + ts/2);
}

// 复制二维数组
function copyArray(arr) {
    var newArr = [];
    for (var x = 0; x < arr.length; x++) {
        newArr[x] = [];
        for (var y = 0; y < arr[x].length; y++) {
            newArr[x][y] = arr[x][y];
        }
    }
    return newArr;
}

// 将网格坐标转换为字符串
function cts(col, row) {
    return col + ',' + row;
}

// 返回具有特定名称的实体数组
function getByName(entities, names) {
    var results = [];
    if (typeof names === 'string') names = [names];
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        for (var j = 0; j < names.length; j++) {
            if (e.name === names[j]) results.push(e);
        }
    }
    return results;
}

// 获取第一个怪物（即离出口最近的怪物）
// TODO 确定更准确的选择系统，避免被循环迷惑
function getFirst(entities) {
    var leastDist = 10000;
    var chosen = entities[0];
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        var t = gridPos(e.pos.x, e.pos.y);
        var dist = dists[t.x][t.y];
        if (dist < leastDist) {
            leastDist = dist;
            chosen = e;
        }
    }
    return chosen;
}

// 获取范围内的实体（半径以格子为单位）
// TODO 设置最小和最大范围
function getInRange(cx, cy, radius, entities) {
    var results = [];
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i];

        if(dist(e.pos.x, e.pos.y, cx, cy)<radius*ts){
            results.push(e);
        }

    }
    return results;
}

// 获取离实体最近的实体
function getNearest(entities, pos, ignore) {
    var lowestDist = 10000;
    var chosen = entities[0];
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        if (typeof ignore !== 'undefined' && ignore.includes(e)) continue;
        var dist = pos.dist(e.pos);
        if (dist < lowestDist) {
            lowestDist = dist;
            chosen = e;
        }
    }
    return chosen;
}

// 获取血量最多的怪物
function getStrongest(entities) {
    var mostHealth = 0;
    var chosen = entities[0];
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        if (e.health > mostHealth) {
            mostHealth = e.health;
            chosen = e;
        }
    }
    return chosen;
}

// 获取所有嘲讽的怪物
function getTaunting(entities) {
    var results = [];
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        if (e.taunt) results.push(e);
    }
    return results;
}

//检测两个居中矩形的碰撞，重叠
function checkRectCollision(rect1, rect2) {
    // rect1和rect2都是包含x,y,width,height属性的对象
    // x,y表示中心点坐标

    // 计算两个矩形在x轴和y轴上的半宽高
    let rect1HalfWidth = rect1.width / 2;
    let rect1HalfHeight = rect1.height / 2;
    let rect2HalfWidth = rect2.width / 2;
    let rect2HalfHeight = rect2.height / 2;

    // 检查x轴和y轴上是否有重叠
    let xCollision = abs(rect1.x - rect2.x) < (rect1HalfWidth + rect2HalfWidth);
    let yCollision = abs(rect1.y - rect2.y) < (rect1HalfHeight + rect2HalfHeight);

    // 只有当x轴和y轴都有重叠时才发生碰撞
    return xCollision && yCollision;
}

// 返回网格坐标
function gridPos(x, y) {
    return createVector(floor((x) / ts), floor((y) / ts));
}

function gridPosByLastest(x, y) {

    return createVector(floor((x-gameX) / ts), floor((y-gameY) / ts));



}

// 检查点是否在圆内
function insideCircle(x, y, cx, cy, r) {
    return sq(x - cx) + sq(y - cy) < sq(r);
}

// 检查鼠标是否在地图内
function mouseInMap() {
    const inX = between(mouseX, gameX, gameX + gameWidth);
    const inY = between(mouseY, gameY, gameY + gameHeight);
    const inside = inX && inY;

    return inside;
}
// 返回某个值的正交邻居
function neighbors(grid, col, row, val) {
    var neighbors = [];
    if (col !== 0 && grid[col - 1][row] === val) {
        neighbors.push(cts(col - 1, row));
    }
    if (row !== 0 && grid[col][row - 1] === val) {
        neighbors.push(cts(col, row - 1));
    }
    if (col !== grid.length - 1 && grid[col + 1][row] === val) {
        neighbors.push(cts(col + 1, row));
    }
    if (row !== grid[col].length - 1 && grid[col][row + 1] === val) {
        neighbors.push(cts(col, row + 1));
    }
    return neighbors;
}

// 检查点是否在矩形外
function outsideRect(x, y, cx, cy, w, h) {
    return x < cx || y < cy || x > cx + w || y > cy + h;
}

// 绘制多边形
function polygon(x, y, radius, npoints) {
    var angle = TWO_PI / npoints;
    beginShape();
    for (var a = 0; a < TWO_PI; a += angle) {
        var sx = x + cos(a) * radius;
        var sy = y + sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

// 返回一个随机整数，参数与 p5.js 的 random() 相同
function randint() {
    return floor(random(...arguments));
}

// 显示数字范围
function rangeText(min, max) {
    if (min === max) {
        return String(min);
    } else {
        return String(min) + '-' + String(max);
    }
}

// 移除空的临时生成点
function removeTempSpawns() {
    for (var i = tempSpawns.length - 1; i >= 0; i--) {
        if (tempSpawns[i][1] === 0) tempSpawns.splice(i, 1);
    }
}

// 将字符串转换为向量
function stv(str) {
    var arr = str.split(',');
    return createVector(parseInt(arr[0]), parseInt(arr[1]));
}

// 将向量转换为字符串
function vts(v) {
    return v.x + ',' + v.y;
}

/**
 * 寻找从格子值 0（开始）到格子值 4（终点）的整条路径。
 * @param {number[][]} grid - 上面 maps.customMap.grid 形式的二维数组
 * @returns {Array<{col:number, row:number}>} 路径坐标列表
 */
function findPathBFS(grid) {
    // 1. 找到起点(0) 和 终点(4)
    let startPos = null;
    let endPos = null;
    for (let c = 0; c < grid.length; c++) {
        for (let r = 0; r < grid[c].length; r++) {
            if (grid[c][r] === 0) {
                startPos = {col: c, row: r};
            } else if (grid[c][r] === 4) {
                endPos = {col: c, row: r};
            }
        }
    }
    if (!startPos || !endPos) {
        console.log('未找到起点或终点');
        return [];
    }

    // 2. BFS 所需队列、标记
    let queue = [];
    let visited = new Set();
    let cameFrom = new Map();
    let distance = {}; // 用来存储每个格子到终点的距离

    // 起点入队
    queue.push(startPos);
    visited.add(posKey(startPos.col, startPos.row));
    distance[posKey(startPos.col, startPos.row)] = 0;  // 起点的距离是 0

    // 3. BFS 主循环
    while (queue.length > 0) {
        let current = queue.shift();
        if (current.col === endPos.col && current.row === endPos.row) {
            // 找到终点 => 回溯得到路径
            return backtrackPath(cameFrom, startPos, endPos);
        }
        // 获取可通行的邻居(值为 1 或 4)
        let nb = getWalkableNeighbors(grid, current.col, current.row);
        for (let nxt of nb) {
            let k = posKey(nxt.col, nxt.row);
            if (!visited.has(k)) {
                visited.add(k);
                cameFrom.set(k, current);
                queue.push(nxt);
                // 更新当前邻居的距离
                distance[k] = distance[posKey(current.col, current.row)] + 1;
            }
        }
    }

    // 没搜到终点，返回空
    return [];
}

/** 返回当前位置上下左右、值为1(路径)或4(终点)的邻居 */
function getWalkableNeighbors(grid, c, r) {
    let results = [];
    // 上
    if (r > 0 && (grid[c][r-1] === 1 || grid[c][r-1] === 4)) {
        results.push({col:c, row:r-1});
    }
    // 下
    if (r < grid[c].length-1 && (grid[c][r+1] === 1 || grid[c][r+1] === 4)) {
        results.push({col:c, row:r+1});
    }
    // 左
    if (c > 0 && (grid[c-1][r] === 1 || grid[c-1][r] === 4)) {
        results.push({col:c-1, row:r});
    }
    // 右
    if (c < grid.length-1 && (grid[c+1][r] === 1 || grid[c+1][r] === 4)) {
        results.push({col:c+1, row:r});
    }
    return results;
}

/** 回溯 cameFrom，构造完整路径 */
function backtrackPath(cameFrom, startPos, endPos) {
    let path = [];
    let current = endPos;
    let startKey = posKey(startPos.col, startPos.row);
    while (true) {
        path.push(current);
        if (posKey(current.col, current.row) === startKey) {
            break;
        }
        current = cameFrom.get(posKey(current.col, current.row));
    }
    path.reverse();
    return path;
}

function posKey(c, r) {
    return c + ',' + r;
}

// 判断点是否在扇形内
function isPointInSector(x, y, centerX, centerY, radius, startAngle, endAngle) {
    let dx = x - centerX;
    let dy = y - centerY;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance > radius) return false;
    
    let angle = atan2(dy, dx);
    if (angle < 0) angle += TWO_PI;
    if (startAngle > endAngle) {
      return (angle >= startAngle || angle <= endAngle);
    } else {
      return (angle >= startAngle && angle <= endAngle);
    }
}