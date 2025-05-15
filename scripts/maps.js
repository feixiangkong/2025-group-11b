// ------------------- maps.js -------------------
var maps = {};

maps.customMap = {
    id: "customMap",
// Redefine a new 2D array (12 columns × 8 rows)
// Meaning of each element:
// 0=start, 1=path, 2=can place towers, 3=cannot place towers, 4=end
    grid: [
// col=0
        [3, 3, 3, 0, 3, 3, 3, 3],
// col=1
        [3, 3, 3, 1, 3, 3, 3, 3],
// col=2
        [3, 3, 3, 1, 3, 3, 3, 3],
// col=3
        [3, 1, 1, 1, 3, 3, 3, 3],
// col=4
        [3, 1, 3, 3, 3, 3, 3, 3],
// col=5
        [3, 1, 3, 3, 3, 3, 3, 3],
// col=6
        [3, 1, 1, 1, 3, 3, 3, 3],
// col=7
        [3, 3, 3, 1, 3, 3, 3, 3],
// col=8
        [3, 3, 3, 1, 3, 3, 3, 3],
// col=9
        [3, 3, 3, 1, 3, 3, 3, 3],
// col=10
        [3, 3, 3, 1, 1, 1, 3, 3],
// col=11
        [3, 3, 3, 3, 3, 4, 3, 3]
    ],
// Starting point (column 0, row 3)
    spawnpoints: [[0, 3]],
// End point (column 11, row 6)
    exit: [11, 5],
// Map size: 12 columns × 8 rows
    cols: 12,
    rows: 8,
    display: [], // Fill in an empty array
    displayDir: [],
    metadata: [],
// Other optional fields
    bg: [0, 0, 0],
    metadata: Array(12).fill().map(() => Array(8).fill(null))
};
maps.map2 = {
    id: "map2",
// Redefine a new two-dimensional array (12 columns × 8 rows)
// The meaning of each element:
// 0 = start, 1 = path, 2 = tower can be placed, 3 = tower cannot be placed, 4 = end point
    grid: [
// col=0
        [3, 3, 3, 3, 3, 0, 3, 3],
// col=1
        [3, 3, 3, 1, 1,1, 3, 3],
//col=2
        [3, 3, 3, 1, 3, 3, 3, 3],
//col=3
        [3, 3, 3, 1, 3, 3, 3, 3],
//col=4
        [3, 3, 3, 1, 3, 3, 3, 3],
//col=5
        [3, 3, 3, 1, 3, 3, 3, 3],
//col=6
        [3, 3, 1, 1, 1, 3, 3, 3],
//col=7
        [3, 3, 1, 3, 1, 3, 3, 3],
//col=8
        [3, 3, 1, 3, 1, 3, 3, 3], // col=9
        [3, 3, 1, 3, 1, 3, 3, 3],
// col=10
        [3, 3, 1, 1, 1, 3, 3, 3],
// col=11
        [3, 3, 3, 4, 3, 3, 3, 3]
    ],
// Start point (column 0, row 3)
    spawnpoints: [[0, 5]],
// End point (column 11, row 6)
    exit: [11, 3],
// Map size: 12 columns × 8 rows
    cols: 12,
    rows: 8,
    display: [], // Fill in an empty array
    displayDir: [],
    metadata: [],
// Other optional fields
    bg: [0, 0, 0],
    metadata: Array(12).fill().map(() => Array(8).fill(null))
};

maps.map3 = {
    id: "map3",
// Redefine a new 2D array (12 columns × 8 rows)
// Meaning of each element:
// 0=start, 1=path, 2=can place tower, 3=cannot place tower, 4=end
    grid: [
// col=0
        [3, 0, 3, 3, 3, 3, 3, 3],
// col=1
        [3, 1, 3, 3, 3, 3, 3, 3, 3],
// col=2
        [3, 1, 3, 3, 3, 3, 3, 3, 3],
// col=3
        [3, 1, 1, 1, 3, 3, 3, 3],
// col=4
        [3, 3, 3, 1, 3, 3, 3, 3],
// col=5
        [3, 3, 3, 1, 3, 3, 3, 3],
// col=6
        [3, 3, 3, 1, 1, 1, 3, 3],
// col=7
        [3, 3, 3, 3, 3, 1, 3, 3],
// col=8
        [3, 3, 3, 3, 3, 1, 3, 3],
// col=9
        [3, 3, 3, 1, 1, 1, 3, 3],
// col=10
        [3, 3, 3, 1, 3, 3, 3, 3],
// col=11
        [3, 3, 3, 4, 3, 3, 3, 3],
    ],
// Starting point (column 0, row 3)
    spawnpoints: [[0, 1]],
// End point (column 11, row 6)
    exit: [11, 3],
// Map size: 12 columns × 8 rows
    cols: 12,
    rows: 8,
    display: [], // Fill in an empty array
    displayDir: [],
    metadata: [],
// Other optional fields
    bg: [0, 0, 0],
    metadata: Array(12).fill().map(() => Array(8).fill(null))
};

function drawMapGrid()
{
    if (grid.length < 0) return;
    for (let x = 0; x < grid.length; x++)
    {
        for (let y = 0; y < grid[x].length; y++)
        {
            let value = grid[x][y];

            stroke(255, 0, 0);
            strokeWeight(2);
            noFill();
            rect(x * ts, y * ts, ts, ts);

// 0 = start, 1 = path, 2 = can't place tower, 3 = can place tower, 4 = end
            stroke(0);
            let c;
            let msg;
            switch (value) {
                case 0:
                    c = color(0, 255, 0);
                    msg = "start";
                    break;
                case 1:
                    c = color(113, 219, 255);
                    msg = "path";
                    break;
                case 2:
                    c = color(255, 0, 0);
                    msg = "can't place tower";
                    break;
                case 3:
                    c = color(255, 255, 73);
                    msg = "can place tower";
                    break;
                case 4:
                    c = color(255, 165, 0);
                    msg = "end";
                    break;
                default:
                    col = color(200); // default gray
            }
            fill(c);
            textFont("Arial");
            textAlign(CENTER, CENTER);
            textSize(16);
            text(`${value}(${msg})`, x * ts + ts / 2, y * ts + ts / 2);
        }
    }
}