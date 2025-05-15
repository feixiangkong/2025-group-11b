new p5(); // p5.js global mode

// Check if it is roughly in the center of the grid
function atTileCenter(x, y, col, row) {
    var c = center(col, row);
    var t = ts / 24;
    return between(x, c.x - t, c.x + t) && between(y, c.y - t, c.y + t);
}

// Check if the number is in the range (excluding the boundaries)
function between(num, min, max) {
    return num >= Math.min(min, max) && num <= Math.max(min, max);
}

// Build a two-dimensional array and fill it with the specified value
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

// Return the position of the center of the grid
function center(col, row) {
    return createVector(col*ts + ts/2, row*ts + ts/2);
}

// Copy a two-dimensional array
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

// Convert grid coordinates to strings
function cts(col, row) {
    return col + ',' + row;
}

// Return an array of entities with a specific name
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

// Get the first monster (the one closest to the exit)
// TODO Fix more accurate selection system to avoid being confused by loops
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

// Get entities in range (radius in grid units)
// TODO set minimum and maximum range
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

// Get the entity closest to the entity
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

// Get the monster with the most health
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

// Get all taunted monsters
function getTaunting(entities) {
    var results = [];
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        if (e.taunt) results.push(e);
    }
    return results;
}

//Detect collision and overlap between two centered rectangles
function checkRectCollision(rect1, rect2) {
// rect1 and rect2 are both objects containing x, y, width, height properties
// x, y represent the center point coordinates

// Calculate the half width and height of the two rectangles on the x-axis and y-axis
    let rect1HalfWidth = rect1.width / 2;
    let rect1HalfHeight = rect1.height / 2;
    let rect2HalfWidth = rect2.width / 2;
    let rect2HalfHeight = rect2.height / 2;

// Check if there is overlap on the x-axis and y-axis
    let xCollision = abs(rect1.x - rect2.x) < (rect1HalfWidth + rect2HalfWidth);
    let yCollision = abs(rect1.y - rect2.y) < (rect1HalfHeight + rect2HalfHeight);

// Collision only occurs when both the x-axis and y-axis overlap
    return xCollision && yCollision;
}

// Return grid coordinates
function gridPos(x, y) {
    return createVector(floor((x) / ts), floor((y) / ts));
}
function gridPosByLastest(x, y) {

    return createVector(floor((x-gameX) / ts), floor((y-gameY) / ts));

}

// Check if the point is inside the circle
function insideCircle(x, y, cx, cy, r) {
    return sq(x - cx) + sq(y - cy) < sq(r);
}

// Check if the mouse is inside the map
function mouseInMap() {
    const inX = between(mouseX, gameX, gameX + gameWidth);
    const inY = between(mouseY, gameY, gameY + gameHeight);
    const inside = inX && inY;

    return inside;
}
// Return the orthogonal neighbors of a value
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

// Check if the point is outside the rectangle
function outsideRect(x, y, cx, cy, w, h) {
    return x < cx || y < cy || x > cx + w || y > cy + h;
}

// Draw a polygon
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

// Return a random integer, the parameters are the same as random() in p5.js
function randint() {
    return floor(random(...arguments));
}

// Display the range of numbers
function rangeText(min, max) {
    if (min === max) {
        return String(min);
    } else {
        return String(min) + '-' + String(max);
    }
}

// Remove empty temporary spawn points
function removeTempSpawns() {
    for (var i = tempSpawns.length - 1; i >= 0; i--) {
        if (tempSpawns[i][1] === 0) tempSpawns.splice(i, 1);
    }
}

// Convert string to vector
function stv(str) {
    var arr = str.split(',');
    return createVector(parseInt(arr[0]), parseInt(arr[1]));
}

// Convert vector to string
function vts(v) {
    return v.x + ',' + v.y;
}

/**
 * Find the entire path from grid value 0 (start) to grid value 4 (end).
 * @param {number[][]} grid - 2D array in the form of maps.customMap.grid above
 * @returns {Array<{col:number, row:number}>} path coordinate list
 */
function findPathBFS(grid) {
// 1. Find the starting point (0) and the end point (4)
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
        console.log('Start or end point not found');
        return [];
    }

// 2. Queues and markers required for BFS
    let queue = [];
    let visited = new Set();
    let cameFrom = new Map();
    let distance = {}; // Used to store the distance from each grid to the end point

// Start point joins the queue
    queue.push(startPos);
    visited.add(posKey(startPos.col, startPos.row));
    distance[posKey(startPos.col, startPos.row)] = 0; // The distance from the start point is 0

// 3. BFS main loop
    while (queue.length > 0) {
        let current = queue.shift();
        if (current.col === endPos.col && current.row === endPos.row) {
// Found the end point => backtrack to get the path
            return backtrackPath(cameFrom, startPos, endPos);
        }
// Get the traversable neighbors (value is 1 or 4)
        let nb = getWalkableNeighbors(grid, current.col, current.row);
        for (let nxt of nb) {
            let k = posKey(nxt.col, nxt.row);
            if (!visited.has(k)) {
                visited.add(k);
                cameFrom.set(k, current);
                queue.push(nxt);
// Update the distance of the current neighbor
                distance[k] = distance[posKey(current.col, current.row)] + 1;
            }
        }
    }

// No end point found, return empty
    return [];
}
/** Returns the neighbors above, below, left, and right of the current position, with values ​​of 1 (path) or 4 (end point) */
function getWalkableNeighbors(grid, c, r) {
    let results = [];
// Up
    if (r > 0 && (grid[c][r-1] === 1 || grid[c][r-1] === 4)) {
        results.push({col:c, row:r-1});
    }
// Down
    if (r < grid[c].length-1 && (grid[c][r+1] === 1 || grid[c][r+1] === 4)) {
        results.push({col:c, row:r+1});
    }
// Left
    if (c > 0 && (grid[c-1][r] === 1 || grid[c-1][r] === 4)) {
        results.push({col:c-1, row:r});
    }
//right
    if (c < grid.length-1 && (grid[c+1][r] === 1 || grid[c+1][r] === 4)) {
        results.push({col:c+1, row:r});
    }
    return results;
}

/** Trace back cameFrom and construct the complete path */
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

// Determine whether the point is within the sector
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