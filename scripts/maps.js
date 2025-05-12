// ------------------- maps.js -------------------
var maps = {};

maps.customMap = {
  id: "customMap",
  // 重新定义一个新的二维数组 (12 列 × 8 行)
  // 每个元素的含义: 
  // 0=开始, 1=路径, 2=可放塔, 3=不可放塔, 4=终点
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
    [3, 1, 2, 2, 3, 3, 3, 3],
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

  // 起点(列0，行3)
  spawnpoints: [[0, 3]],
  // 终点(列11，行6)
  exit: [11, 5],
  // 地图尺寸：12列 × 8行
  cols: 12,
  rows: 8,
  display: [],       // 补个空数组
  displayDir: [],
  metadata: [],
  // 其它可选字段
  bg: [0, 0, 0],
  metadata: Array(12).fill().map(() => Array(8).fill(null))
};

maps.map2 = {
  id: "map2",
  // 重新定义一个新的二维数组 (12 列 × 8 行)
  // 每个元素的含义:
  // 0=开始, 1=路径, 2=可放塔, 3=不可放塔, 4=终点
  grid: [
    // col=0
    [3, 3, 3, 3, 3, 0, 3, 3],
    // col=1
    [3, 3, 3, 1, 1,1, 3, 3],
    // col=2
    [3, 3, 3, 1, 3, 3, 3, 3],
    // col=3
    [3, 3, 3, 1, 3, 3, 3, 3],
    // col=4
    [3, 3, 3, 1, 3, 3, 3, 3],
    // col=5
    [3, 3, 3, 1, 3, 3, 3, 3],
    // col=6
    [3, 3, 1, 1, 1, 3, 3, 3],
    // col=7
    [3, 3, 1, 3, 1, 3, 3, 3],
    // col=8
    [3, 3, 1, 3, 1, 3, 3, 3],
    // col=9
    [3, 3, 1, 3, 1, 3, 3, 3],
    // col=10
    [3, 3, 1, 1, 1, 3, 3, 3],
    // col=11
    [3, 3, 3, 4, 3, 3, 3, 3]
  ],

  // 起点(列0，行3)
  spawnpoints: [[0, 5]],
  // 终点(列11，行6)
  exit: [11, 3],
  // 地图尺寸：12列 × 8行
  cols: 12,
  rows: 8,
  display: [],       // 补个空数组
  displayDir: [],
  metadata: [],
  // 其它可选字段
  bg: [0, 0, 0],
  metadata: Array(12).fill().map(() => Array(8).fill(null))
};

maps.map3 = {
  id: "map3",
  // 重新定义一个新的二维数组 (12 列 × 8 行)
  // 每个元素的含义:
  // 0=开始, 1=路径, 2=可放塔, 3=不可放塔, 4=终点
  grid: [
    // col=0
    [3, 0, 3, 3, 3, 3, 3, 3],
    // col=1
    [3, 1, 3, 3, 3, 3, 3, 3],
    // col=2
    [3, 1, 3, 3, 3, 3, 3, 3],
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

  // 起点(列0，行3)
  spawnpoints: [[0, 1]],
  // 终点(列11，行6)
  exit: [11, 3],
  // 地图尺寸：12列 × 8行
  cols: 12,
  rows: 8,
  display: [],       // 补个空数组
  displayDir: [],
  metadata: [],
  // 其它可选字段
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

            // 0=开始, 1=路径, 2=不可放塔, 3=可放塔, 4=终点
            stroke(0);
            let c;
            let msg;
            switch (value) {
                case 0:
                    c = color(0, 255, 0);
                    msg = "开始";
                    break;
                case 1:
                    c = color(113, 219, 255);
                    msg = "路径";
                    break;
                case 2:
                    c = color(255, 0, 0);
                    msg = "不可放塔";
                    break;
                case 3:
                    c = color(255, 255, 73);
                    msg = "可放塔";
                    break;
                case 4:
                    c = color(255, 165, 0);
                    msg = "终点";
                    break;
                default:
                    col = color(200); // 默认灰色
            }
            fill(c);
            textFont("Arial");
            textAlign(CENTER, CENTER);
            textSize(16);
            text(`${value}(${msg})`, x * ts + ts / 2, y * ts + ts / 2);
        }
    }
}