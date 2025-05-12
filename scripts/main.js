// 初始默认生命值和金钱
const defaultHealth = 100;
const defaultCash = 1000;

let mapData = maps.customMap;  // 获取自定义地图数据


let debugMap = false;  // 是否显示调试地图
let enableShakeEffect = true;   // 是否开启画面震动
let enableHeartbeatEffect = true;   // 是否开启心跳效果

// 开场白开始游戏
var isStartGame = false;  // 游戏是否开始

var monsters = [];  // 存放怪物的数组
var projectiles = [];  // 存放投射物的数组
var systems = [];  // 存放系统的数组
var towers = [];  // 存放塔的数组
var newMonsters = [];  // 存放新怪物的数组
var newProjectiles = [];  // 存放新投射物的数组
var newTowers = [];  // 存放新塔的数组
var vfx = [];   // 存放视觉效果的数组

var cols = 12;  // 地图的列数
var rows = 8;  // 地图的行数
var tileZoom = 2;  // 瓦片的缩放倍率
var ts = 110;  // 单元格大小

var zoomDefault = ts;  // 默认的瓦片大小

var particleAmt = 32;  // 每次爆炸绘制的粒子数量

var custom;  // 自定义地图的JSON数据
var display;  // 图形显示瓦片
var displayDir;  // 显示瓦片的方向
// (0 = 无方向, 1 = 左, 2 = 上, 3 = 右, 4 = 下)
var dists = buildArray(12, 8, null);  // 创建一个12列8行的数组，默认值为null
// 到出口的距离
var grid;  // 瓦片类型
// (0 = 空, 1 = 墙, 2 = 路径, 3 = 塔,
// 4 = 仅怪物行走路径)
var metadata;  // 瓦片元数据
var paths;  // 到出口的路径方向
var visitMap;  // 是否可以到达出口
var walkMap;  // 可行走地图

var exit;  // 出口
var spawnpoints = [];  // 怪物的生成点
var tempSpawns = [];  // 临时生成点

var cash;  // 当前的金钱
var health;  // 当前的生命值
let prevHealth = 0; // 上一帧生命值
var maxHealth;  // 最大生命值
var wave;  // 当前波次

var spawnCool;  // 怪物生成的冷却时间

var bg;  // 背景色

var selected;  // 当前选中的对象
var towerType;  // 当前塔的类型

var sounds;  // 所有音效的字典

var paused;  // 游戏是否暂停
var randomWaves = true;  // 是否使用随机波次
var scd;  // 下一次生成怪物的倒计时
var skipToNext = false;  // 是否跳过当前波次直接开始下一波
var toCooldown;  // 用于重置生成冷却时间的标志
var toPathfind;  // 用于更新怪物寻路的标志
var toPlace;  // 用于放置塔的标志
var toWait;  // 用于等待下一波的标志
var wcd;  // 下一波的倒计时

var minDist = 15;  // 生成点和出口的最小距离
var resistance = 0.5;  // 伤害抵抗百分比
var sellConst = 0.8;  // 塔出售价格与购买价格的比例
var waveCool = 120;  // 波次之间的冷却时间（单位：ticks）
var weakness = 0.5;  // 弱点造成的伤害增加百分比

var totalWaves = 10;  // 每一关固定总波数为2波
var gameEnded = false;  // 游戏是否结束的标志
var resultRating = 0;   // 关卡结算分（0~3 星）

var monsterSpeedMultiplier = 1;  // 怪物的速度倍率，默认1倍速度

let bgm;    // 背景音乐

// 创建Tooltip对象
let tooltip;  // 创建一个提示工具对象

let cnvs;
let towerY;
let towerX;
let towerWidth;
let towerHeight;

let gameWidth;
let gameHeight;
let gameY;
let gameX;


let towerTipPaneHeight;

let leftArrowBtn, rightArrowBtn;
let pages = []; // 用来存储多组按钮
let currentPage = 0; // 当前显示的页面


let pageWidth;
let pageX;
let arrowButtonWidth;
let pageHeight;


let towerInfoPane;


// Misc functions

// Spawn a group of monsters, alternating if multiple types
function addGroup(group) {
    var count = group.pop();
    for (var i = 0; i < count; i++) {
        for (var j = 0; j < group.length; j++) {
            newMonsters.push(group[j]);
        }
    }
}

// Prepare a wave
function addWave(pattern) {
    spawnCool = pattern.shift();
    curWaveMonstersInfo = JSON.parse(JSON.stringify(pattern));
    calculateMonsterTotalNumber();
    for (var i = 0; i < pattern.length; i++) {
        addGroup(pattern[i]);
    }
}

// 购买并放置防御塔（当玩家资金充足时）
function buy(t) {
    const { x, y } = t.gridPos || {};
    const canPlaceHere = typeof x !== 'undefined' && typeof y !== 'undefined' && canPlace(x, y);

    if (t && canPlaceHere && cash >= t.cost) {
        cash -= t.cost;
        toPlace = false;
        selected = t;
        toPathfind = true;

        towerInfoPane.t = t;
        towerInfoPane.isExpanded = false;
        towerInfoPane.toggle();
        towerInfoPane.isPlaceTower = true;

        newTowers.push(t);
        grid[x][y] = 3;

        console.log("[buy] 成功放置塔", t);
    } else {
        console.warn("[buy] 放置失败，条件不足", {
            tower: t,
            canPlaceHere,
            hasCash: cash >= (t?.cost || 0),
            gridVal: grid?.[x]?.[y],
        });
    }
}





function canPlace(col, row) {
    if (!toPlace) return false;
    // 检查 grid 是否存在以及索引是否在有效范围内
    if (!grid || !grid[col] || typeof grid[col][row] === 'undefined') {
        return false;
    }
    return grid[col][row] === 3;
}

// Check if spawn cooldown is done and monsters are available to spawn
function canSpawn() {
    return newMonsters.length > 0 && scd === 0;
}

// Clear tower information
function clearInfo() {
    document.getElementById('info-div').style.display = 'none';
}


// Check if all conditions for showing a range are true
function doRange() {
    return mouseInMap() && toPlace && typeof towerType !== 'undefined';
}

// Check if tile is empty
function empty(col, row) {
    // Check if not walkable
    if (!walkable(col, row)) return false;

    // Check if spawnpoint
    for (var i = 0; i < spawnpoints.length; i++) {
        var s = spawnpoints[i];
        if (s.x === col && s.y === row) return false;
    }

    // Check if exit
    if (typeof exit !== 'undefined') {
        if (exit.x === col && exit.y === row) return false;
    }

    return true;
}


// Find tower at specific tile, otherwise return null
function getTower(col, row) {
    for (var i = 0; i < towers.length; i++) {
        var t = towers[i];
        if (t.gridPos.x === col && t.gridPos.y === row) return t;
    }
    return null;
}

// Return map of visitability
function getVisitMap(walkMap) {
    var frontier = [];
    var target = vts(exit);
    frontier.push(target);
    var visited = {};
    visited[target] = true;

    // Fill visited for every tile
    while (frontier.length !== 0) {
        var current = frontier.shift();
        var t = stv(current);
        var adj = neighbors(walkMap, t.x, t.y, true);

        for (var i = 0; i < adj.length; i++) {
            var next = adj[i];
            if (!(next in visited)) {
                frontier.push(next);
                visited[next] = true;
            }
        }
    }

    return visited;
}

// Return walkability map
function getWalkMap() {
    var walkMap = [];
    for (var x = 0; x < cols; x++) {
        walkMap[x] = [];
        for (var y = 0; y < rows; y++) {
            walkMap[x][y] = walkable(x, y);
        }
    }
    return walkMap;
}

// Load a map from a map string
function importMap(str) {
    try {
        custom = JSON.parse(LZString.decompressFromBase64(str));
        document.getElementById('custom').selected = true;
        resetGame();
    } catch (err) {
    }
}

// Check if wave is at least min and less than max
function isWave(min, max) {
    if (typeof max === 'undefined') return wave >= min;
    return wave >= min && wave < max;
}

// Load map from template
// Always have an exit and spawnpoints if you do not have a premade grid
function loadMap(mapID) {
//     // 优先使用隐藏的 #map（初始选关时由 start 按钮设置），否则退回到 #initial-map
//     var mapElement = document.getElementById('map') || document.getElementById('initial-map');

// // 获取地图名称
//     var name = mapElement.value;


// 获取地图数据
    var m = maps[mapID];
    mapData = m;
    console.log(mapID);
    // 地图
    if (mapID == "customMap") bgImg = levelMapsImage[0];
    else if (mapID == "map2") bgImg = levelMapsImage[1];
    else if (mapID == "map3") bgImg = levelMapsImage[2];
    console.log(`获取地图数据${m}`);

// 复制地图显示层数据
    display = copyArray(m.display);

// 复制地图方向数据
    displayDir = copyArray(m.displayDir);

// 复制地图网格数据
    grid = copyArray(m.grid);

// 复制地图元数据
    metadata = copyArray(m.metadata);

// 设置出口位置
    exit = createVector(m.exit[0], m.exit[1]);

// 初始化出生点数组
    spawnpoints = [];

// 复制出生点数据
    for (var i = 0; i < m.spawnpoints.length; i++) {
        var s = m.spawnpoints[i];
        spawnpoints.push(createVector(s[0], s[1]));
    }

// 设置地图背景颜色
    bg = m.bg;

// 设置地图列数
    cols = m.cols;

// 设置地图行数
    rows = m.rows;

// 调整画布适应窗口
//     resizeFit();

// 初始化临时出生点数组
    tempSpawns = [];

}


// Increment wave counter and prepare wave
function nextWave() {
    //isStartGame = false;
// 根据游戏模式添加敌人波次（随机生成或使用自定义配置）
    addWave(randomWaves ? randomWave() : customWave());
// 条件运算符决定波次生成策略：当randomWaves为true时调用随机生成函数，否则调用自定义配置函数
    wave++;
}

// Check if no more monsters
function noMoreMonster() {
    return monsters.length === 0 && newMonsters.length === 0;
}

function outsideMap(e) {
    return outsideRect(e.pos.x, e.pos.y, 0, 0, gameWidth, height);
}

// Toggle pause state
function pause() {
    paused = !paused;
}


// Generate a random wave
// 数组格式：[怪兽出现间隔，[怪物类型，怪物数量],[怪物类型，怪物数量]...]
// 这里原本逻辑有问题，目前只支持push单个数组，如果连续push多个数组，后面的怪物数组不会生效
function randomWave() {
    var waves = [];

    if (mapData == maps["customMap"]) {
        if (isWave(0, 1)) {
            waves.push([116, ['Bandit', 5]]);
        }
        if (isWave(1, 2)) {
            waves.push([112, ['Bandit', 8]]);
        }
        if (isWave(2, 3)) {
            waves.push([108, ['Bandit', 6], ['BatteringRam', 1]]);
        }
        if (isWave(3, 4)) {
            waves.push([104, ['BatteringRam', 2]]);
        }
        if (isWave(4, 5)) {
            waves.push([100, ['Bandit', 12]]);
        }
        if (isWave(5, 6)) {
            waves.push([96, ['Bandit', 8], ['BatteringRam', 2]]);
        }
        if (isWave(6, 7)) {
            waves.push([92, ['BatteringRam', 4]]);
        }
        if (isWave(7, 8)) {
            waves.push([88, ['Bandit', 15], ['BatteringRam', 1]]);
        }
        if (isWave(8, 9)) {
            waves.push([84, ['Bandit', 10], ['BatteringRam', 3]]);
        }
        if (isWave(9, 10)) {
            waves.push([80, ['BatteringRam', 5]]);
        }
    }
    if (mapData == maps["map2"]) {
        if (isWave(0, 1)) {
            waves.push([110, ['Mouse', 6]]);
        }
        if (isWave(1, 2)) {
            waves.push([107, ['Mouse', 10]]);
        }
        if (isWave(2, 3)) {
            waves.push([103, ['PirateRaider', 2]]);
        }
        if (isWave(3, 4)) {
            waves.push([97, ['Mouse', 8], ['PirateRaider', 1]]);
        }
        if (isWave(4, 5)) {
            waves.push([92, ['Mouse', 15]]);
        }
        if (isWave(5, 6)) {
            waves.push([88, ['PirateRaider', 4]]);
        }
        if (isWave(6, 7)) {
            waves.push([83, ['Mouse', 12], ['PirateRaider', 2]]);
        }
        if (isWave(7, 8)) {
            waves.push([79, ['PirateRaider', 6]]);
        }
        if (isWave(8, 9)) {
            waves.push([75, ['Mouse', 20]]);
        }
        if (isWave(9, 10)) {
            waves.push([70, ['Mouse', 15], ['PirateRaider', 5]]);
        }
    }
    if (mapData == maps["map3"]) {
        if (isWave(0, 1)) {
            waves.push([100, ['DroneSwarm', 2]]);
        }
        if (isWave(1, 2)) {
            waves.push([96, ['AIMech', 1]]);
        }
        if (isWave(2, 3)) {
            waves.push([93, ['DroneSwarm', 4]]);
        }
        if (isWave(3, 4)) {
            waves.push([90, ['DroneSwarm', 1], ['AIMech', 1]]);
        }
        if (isWave(4, 5)) {
            waves.push([85, ['DroneSwarm', 3]]);
        }
        if (isWave(5, 6)) {
            waves.push([81, ['AIMech', 2]]);
        }
        if (isWave(6, 7)) {
            waves.push([79, ['DroneSwarm', 4]]);
        }
        if (isWave(7, 8)) {
            waves.push([73, ['DroneSwarm', 4], ['AIMech', 2]]);
        }
        if (isWave(8, 9)) {
            waves.push([68, ['AIMech', 3]]);
        }
        if (isWave(9, 10)) {
            waves.push([62, ['DroneSwarm', 5], ['AIMech', 1]]);
        }
    }


    return random(waves);
}

// 开始游戏逻辑入口
function startGame(id) {
    loadGame(id);
    resetGame();
    // 自动开始游戏
    paused = false;
    isStartGame = true;
    onGameStart();
    switchBGM();
}

// 停止游戏
function stopGame() {
    isStartGame = false;
    onLevelFinished();
}


// 加载游戏地图
function loadGame(mapID) {
    loadMap(mapID);
    console.log(`成功加载地图${mapID}, 路径为${grid}`);
}


// 重置关卡
function resetGame() {

    hero = new Hero(ts, gameHeight - ts);
    // 清空所有实体
    monsters = [];
    projectiles = [];
    systems = [];
    towers = [];
    newMonsters = [];
    newProjectiles = [];
    newTowers = [];
    vfx = [];

    // // 这里可以获取一次全局路径
    // window._globalPath = findPathBFS(grid);
    // console.log('全局路径 = ', window._globalPath);
    // 重置状态
    health = defaultHealth;    // 初始化玩家生命值
    cash = defaultCash;   // 初始化玩家金钱
    maxHealth = health;
    prevHealth = health;
    wave = 0;          // 重置波数
    gameEnded = false;   // 重置游戏结束标记
    resultRating = 0;   // 重置结算
    toWait = false;
    // 重置各项标志
    paused = true;
    scd = 0;
    toCooldown = false;
    toPathfind = false;
    toPlace = false;
    // 启动第一波（此时 nextWave() 会使 wave 变为 1）
    nextWave();

    tooltip = new Tooltip("Here comes the " + wave + " wave of enemies!", cols * ts / 2, rows * ts / 2);
}


// Resizes cols, rows, and canvas based on tile size
function resizeMax() {
    var div = document.getElementById('main-holder');
    cols = 12
    rows = 8;
    resizeCanvas(cols * 110, rows * 110, true);


    var div = document.getElementById('main-holder');
    cols = floor(div.offsetWidth / ts);
    rows = floor(div.offsetHeight / ts);
    resizeCanvas(cols * ts, rows * ts, true);
}

// Sell a tower
function sell(t) {
    selected = null;
    if (grid[t.gridPos.x][t.gridPos.y] === 0) toPathfind = true;
    // clearInfo();
    cash += t.sellPrice();
    t.kill();
}

// Set a tower to place
function setPlace(t) {
    towerType = t;
    toPlace = true;
    towerInfoPane.t = createTower(0, 0, tower[towerType]);
    towerInfoPane.isExpanded = false;
    towerInfoPane.toggle();
    towerInfoPane.isPlaceTower = false;
    console.log("[setPlace] 设置塔类型为:", t);
}


// Visualize range of tower
function showRange(t, cx, cy) {
    push();
    // translate(gameX,gameY);
    stroke(255);
    fill(t.color[0], t.color[1], t.color[2], 63);
    var r = (t.range + 0.5) * ts * 2;
    ellipse(cx, cy, r, r);
    pop();
}

// Display tower information
function updateInfo(t) {
    var name = document.getElementById('name');
    name.innerHTML = '<span style="color:rgb(' + t.color + ')">' + t.title +
        '</span>';
    document.getElementById('cost').innerHTML = 'Cost: $' + t.totalCost;
    document.getElementById('sellPrice').innerHTML = 'Sell price: $' +
        t.sellPrice();
    document.getElementById('upPrice').innerHTML = 'Upgrade price: ' +
        (t.upgrades.length > 0 ? '$' + t.upgrades[0].cost : 'N/A');
    document.getElementById('damage').innerHTML = 'Damage: ' + t.getDamage();
    document.getElementById('type').innerHTML = 'Type: ' +
        t.type.toUpperCase();
    document.getElementById('range').innerHTML = 'Range: ' + t.range;
    document.getElementById('cooldown').innerHTML = 'Avg. Cooldown: ' +
        t.getCooldown().toFixed(2) + 's';
    var buttons = document.getElementById('info-buttons');
    buttons.style.display = toPlace ? 'none' : 'flex';
    document.getElementById('info-div').style.display = 'block';
}

// Update pause button
function updatePause() {
    // document.getElementById('pause').innerHTML = paused ? 'Start' : 'Pause';
}


function upgrade(t) {      // 定义升级函数，接收升级配置对象t作为参数
    if (cash >= t.cost) {    // 校验当前资金是否满足升级所需费用
        cash -= t.cost;      // 扣除升级消耗的资金
        selected.upgrade(t); // 执行目标对象的升级逻辑
        selected.upgrades = t.upgrades ? t.upgrades : [];  // 更新可用升级项列表（存在则继承，否则重置为空）
        //  // 刷新界面显示最新信息
        towerInfoPane.t = selected;
        towerInfoPane.isExpanded = false;
        towerInfoPane.toggle();
        towerInfoPane.isPlaceTower = true;

        // 绘制升级效果
        vfx.push(new UpgradeFX(60, selected.pos.x, selected.pos.y));
    }
}

// Return whether tile is walkable
function walkable(col, row) {
    // Check if wall or tower-only tile
    if (grid[col][row] === 1 || grid[col][row] === 3) return false;
    // Check if tower
    if (getTower(col, row)) return false;
    return true;
}


function drawTower() {
    fill(100);
    rect(towerX, towerY, towerWidth, towerHeight);
}

// Main p5 functionsS
function draw() {
    push();
    updateMenuDisplay();

    if (!isStartGame) return;
    if (!grid) {
        console.log("没有地图");
        background(0);
        return;
    }

    drawGameView();
    drawTowerPane();

    pop();
}

// === 游戏主画面逻辑 ===
function drawGameView() {
    push();
    translate(gameX, gameY);
    background(50);

    if (enableShakeEffect) drawShakeEffect();
    image(bgImg, 0, 0, gameWidth, height);

    updatePause();

    if (!paused) {
        if (scd > 0) scd--;
        if (wcd > 0 && toWait) wcd--;
    }

    drawHero();
    spawnMonsters();
    updateMonsters();
    updateTowers();
    updateParticles();
    updateProjectiles();
    handlePlacementPreview();
    checkSelected();
    removeTempSpawns();
    appendNewEntities();
    checkGameState();
    drawHeartbeatEffectIfEnabled();

    updateMonsterStateUI();
    animationDraw();
    updateGameStateUI();
    lateUpdateMenuDisplay();

    if (debugMap) drawMapGrid();
    pop();
    drawRedFlashOverlay();
}

// === 英雄绘制与更新 ===
function drawHero() {
    hero.draw();
    if (!paused) {
        hero.getPowerByTowers(towers);
        hero.updateTowerPower();
    }
}

// === 生成怪物 ===
function spawnMonsters() {
    if (canSpawn() && !paused) {
        var name = newMonsters.shift();

        for (var i = 0; i < spawnpoints.length; i++) {
            var s = spawnpoints[i];
            var c = center(s.x, s.y);
            monsters.push(createMonster(c.x, c.y, monster[name]));
        }

        for (var i = 0; i < tempSpawns.length; i++) {
            var s = tempSpawns[i];
            if (s[1] === 0) continue;
            s[1]--;
            var c = center(s[0].x, s[0].y);
            monsters.push(createMonster(c.x, c.y, monster[name]));
        }

        toCooldown = true;
    }
}

// === 怪物更新与绘制 ===
function updateMonsters() {
    for (let i = monsters.length - 1; i >= 0; i--) {
        let e = monsters[i];

        if (!paused) {
            e.move();
            e.target(towers);
            e.draw();
            e.update();
            e.onTick();
        }

        if (outsideMap(e)) e.kill();
        if (atTileCenter(e.pos.x, e.pos.y, exit.x, exit.y)) e.quit();
        if (e.ifDie()) monsters.splice(i, 1);
    }

    for (var i = 0; i < monsters.length; i++) {
        monsters[i].showHealth();
    }
}

// === 塔更新与绘制 ===
function updateTowers() {
    for (let i = 0; i < towers.length; i++) {
        let t = towers[i];

        if (!paused) {
            t.target(monsters);
            t.update();
        }

        if (outsideMap(t)) t.kill();
        t.draw();
        if (t.isDead()) towers.splice(i, 1);
    }
}

// === 粒子系统 ===
function updateParticles() {
    for (let i = systems.length - 1; i >= 0; i--) {
        let ps = systems[i];
        ps.run();
        if (ps.isDead()) systems.splice(i, 1);
    }

    for (let i = vfx.length - 1; i >= 0; i--) {
        let v = vfx[i];
        v.update();
        if (v.isDead()) vfx.splice(i, 1);
    }
}

// === 子弹系统 ===
function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];

        if (!paused) {
            p.steer();
            p.update();
        }

        if (p.reachedTarget()) p.explode();
        if (outsideMap(p)) p.kill();
        p.draw();
        if (p.isDead()) projectiles.splice(i, 1);
    }
}

// === 鼠标放置塔显示范围 ===
function handlePlacementPreview() {
    if (mouseX >= gameX && mouseY >= gameY && mouseX <= gameX + gameWidth && mouseY <= gameY + gameHeight) {
        if (doRange()) {
            var p = gridPosByLastest(mouseX, mouseY);
            var c = center(p.x, p.y);
            var t = createTower(0, 0, tower[towerType]);
            showRange(t, c.x, c.y);

            if (!canPlace(p.x, p.y)) {
                push();
                translate(c.x, c.y);
                rotate(PI / 4);
                noStroke();
                fill(207, 0, 15);
                var edge = 0.1 * ts;
                var len = 0.9 * ts / 2;
                rect(-edge, len, edge * 2, -len * 2);
                rotate(PI / 2);
                rect(-edge, len, edge * 2, -len * 2);
                pop();
            }
        }
    }
}

// === 合并新生成实体 ===
function appendNewEntities() {
    projectiles = projectiles.concat(newProjectiles);
    towers = towers.concat(newTowers);
    newProjectiles = [];
    newTowers = [];
}

// === 游戏状态判定与切换波次 ===
function checkGameState() {
    if (health <= 0) gameover(false);

    if ((toWait && wcd === 0) || (skipToNext && newMonsters.length === 0)) {
        if (wave < totalWaves) {
            toWait = false;
            wcd = 0;
            onBeforeNextwave();
        } else {
            endLevel(true);
        }
    }

    if (noMoreMonster() && !toWait) {
        wcd = waveCool;
        toWait = true;
    }

    if (toCooldown) {
        scd = spawnCool;
        toCooldown = false;
    }
}

// === 画面心跳效果 ===
function drawHeartbeatEffectIfEnabled() {
    if (enableHeartbeatEffect) drawHeartbeatEffect();
}

// === 塔界面UI ===
function drawTowerPane() {
    push();
    drawTower();

    fill(255);
    rect(towerX, towerY, towerWidth, towerTipPaneHeight, 15);
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(towerWidth / 10);
    noStroke();
    text("TOWER", towerX + towerWidth / 2, towerY + towerTipPaneHeight / 2);

    pages[currentPage].display();
    leftArrowBtn.display();
    rightArrowBtn.display();

    towerInfoPane.update();
    towerInfoPane.display();
    pop();
}


let shakeAmount = 0;


class SlidePane {
    constructor(x, y, w, h, contentHeight) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h; // 面板最大展开高度
        this.contentHeight = contentHeight; // 内容总高度
        this.t = undefined;
        this.isPlaceTower = true;

        this.offsetY = 0;  // 当前滑动偏移量
        this.targetY = 0;  // 目标滑动位置
        this.scrollSpeed = 0.2; // 平滑滚动速度

        this.isDragging = false;
        this.lastY = 0;

        this.isExpanded = false; // 是否展开
        this.targetHeight = 50; // 目标高度（初始收起）
        this.currentHeight = 50; // 实时面板高度
    }

    update() {
        // **平滑调整面板高度**
        this.currentHeight = lerp(this.currentHeight, this.targetHeight, 0.1);
        this.offsetY = lerp(this.offsetY, this.targetY, this.scrollSpeed);
    }

    display() {
        push();
        translate(this.x, this.y);
        
        this.drawPanelBase();
        this.drawTitleBar();
        
        if (this.isExpanded) {
            this.drawExpandedContent();
        }
        
        pop();
    }
    
    // 绘制面板基础
    drawPanelBase() {
        fill(255);
        stroke(180);
        strokeWeight(2);
        rect(0, 0, this.w, this.currentHeight, 15);
    }
    
    // 绘制标题栏
    drawTitleBar() {
        fill(255);
        rect(0, 0, this.w, 50, 15);
        
        fill(0);
        textFont(uiFont);
        textSize(towerWidth / 10);
        textAlign(CENTER, CENTER);
        text(this.isExpanded ? "🔼 TOWER INFO" : "🔽 TOWER INFO", this.w / 2, 25);
    }
    
    // 绘制展开内容
    drawExpandedContent() {
        if (this.t === undefined) return;
        
        push();
        this.drawTowerInfo();
        
        if (this.isPlaceTower) {
            this.drawActionButtons();
        }
        pop();
    }
    
    // 绘制塔信息
    drawTowerInfo() {
        const startX = towerWidth / 12;
        const startY = 60;
        const fontSize = towerWidth / 15;
        const lineHeight = fontSize * 1.5;
        
        fill(this.t.color);
        noStroke();
        textSize(fontSize);
        textAlign(LEFT, TOP);
        
        // 绘制各项信息
        const infoLines = [
            this.t.title,
            `Cost:$${this.t.totalCost}`,
            `Sell Price:$${this.t.sellPrice()}`,
            `Upgrade Price:${this.t.upgrades.length > 0 ? '$' + this.t.upgrades[0].cost : 'N/A'}`,
            `Damage:${this.t.getDamage()}`,
            `Type:${this.t.type.toUpperCase()}`,
            `Range:${this.t.range}`,
            `Avg. Cooldown:${this.t.getCooldown().toFixed(2)}s`
        ];
        
        infoLines.forEach((line, i) => {
            fill(i === 0 ? this.t.color : 0);
            text(line, startX, startY + lineHeight * i);
        });
    }
    
    // 绘制操作按钮
    drawActionButtons() {
        const startX = towerWidth / 12;
        const startY = 60;
        const fontHeight = towerWidth / 20;
        const btnY = startY + fontHeight * 9;
        
        // 绘制按钮背景
        fill(100, 150, 200);
        rect(startX, btnY, towerWidth / 3, towerWidth / 10, 10);
        rect(startX + towerWidth / 3 + towerWidth / 5, btnY, towerWidth / 3, towerWidth / 10, 10);
        
        // 绘制按钮文字
        fill(255);
        textAlign(CENTER, CENTER);
        text("SELL", startX + towerWidth/6, btnY + towerWidth/20);
        text("UPGRADE", startX + towerWidth/3 + towerWidth/5 + towerWidth/6, btnY + towerWidth/20);
    }

    toggle() {
        if (this.isExpanded) {
            this.targetHeight = 50; // 收起
        } else {
            this.targetHeight = this.h; // 展开
        }
        this.isExpanded = !this.isExpanded;
    }

    checkButtonClick(mx, my) {
        if (this.isExpanded) {
            if (this.isPlaceTower) {
                let startX = towerWidth / 12;
                let startY = 60;
                let fontHeight = towerWidth / 20;


                // let bx1 = startX;
                // let by1 = startY+fontHeight*9;
                let b1Width = towerWidth / 3;
                let b1Height = towerWidth / 10;

                let b2Width = towerWidth / 3;
                let b2Height = towerWidth / 10;

                let bx1 = this.x + startX;
                let by1 = this.y + startY + fontHeight * 9;
                let bx2 = this.x + startX + towerWidth / 3 + towerWidth / 5;
                let by2 = this.y + startY + fontHeight * 9;

                if (mx > bx1 && mx < bx1 + b1Width && my > by1 && my < by1 + b1Height) {
                    // alert("你点击了按钮 1");


                    if (selected) {
                        sell(selected);
                    }

                }
                if (mx > bx2 && mx < bx2 + b2Width && my > by2 && my < by2 + b2Height) {
                    // alert("你点击了按钮 2");
                    if (selected && selected.upgrades.length > 0) upgrade(selected.upgrades[0]);
                }
            }
        }
    }
}

class Page {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.buttons = [];
    }

    // 添加按钮
    addButton(row, col, label) {
        let btnX = this.x + col * (this.w / 2 + towerWidth / 20); // 设置按钮的X坐标
        let btnY = this.y + row * (this.w / 2 + towerWidth / 20); // 设置按钮的Y坐标
        this.buttons.push(new Button(btnX, btnY, this.w / 2, this.w / 2, null, label));
    }

    // 显示页面上的所有按钮
    display() {
        for (let btn of this.buttons) {
            btn.display();
        }
    }

    // 检查点击事件
    checkClicked() {
        for (let btn of this.buttons) {
            if (btn.clicked()) {
                if (btn.label == "Archer Tower") {
                    setPlace('gun');

                }
                if (btn.label == "Boiling Oil Tower") {
                    setPlace('oil');
                }

                if (btn.label == "Cannon Tower") {
                    setPlace('bomb');
                }

                if (btn.label == "Net Thrower Tower") {
                    setPlace('slow');
                }

                if (btn.label == "Laser AA Tower") {
                    setPlace('laser');
                }
                if (btn.label == "EMP Disruptor Tower") {
                    setPlace('slow2');
                }

                if (btn.label == "Trebuchet Tower") {
                    setPlace('trebuchet');
                }

                if (btn.label == "EMP Tower") {
                    setPlace('emp');
                }
                towerInfoPane.isPlaceTower = false;
                console.log(`按钮 ${btn.label} 被点击`);
            }
        }
    }
}

class Button {
    constructor(x, y, w, h, img, label) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        // this.img = img;
        this.imgSize = 0.8;
        this.label = label;
        this.isHovered = false;
    }

    display() {
        this.isHovered = this.isMouseOver();
        fill(this.isHovered ? color(200, 200, 255) : color(220));
        stroke(180);
        strokeWeight(2);
        rect(this.x, this.y, this.w, this.h, 15);

        // if (this.img) {
        //     let imgW = this.w * this.imgSize;
        //     let imgH = this.h * this.imgSize;
        //     image(this.img, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
        // }

        if (this.label == "Archer Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(tower1Img, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
        } else if (this.label == "Boiling Oil Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(tower2Img, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
        } else if (this.label == "Cannon Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(t4_1Image, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
        } else if (this.label == "Net Thrower Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(t3_1Image, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
        } else if (this.label == "EMP Disruptor Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(t7_1Image, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
        } else if (this.label == "Laser AA Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(t5_1Image, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
        } else if (this.label == "Trebuchet Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(t4_1Image, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
        } else if (this.label == "EMP Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(t6_1Image, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
        } else {
            fill(0);
            stroke(0);

            textAlign(CENTER, CENTER);
            textFont('Arial');
            textSize(towerWidth / 15);
            text(this.label, this.x + this.w / 2, this.y + this.h / 2);
        }


    }

    isMouseOver() {
        return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h;
    }

    clicked() {
        return this.isHovered;
    }
}

function windowResized() {

    window.location.href = window.location.href;


    let div = document.getElementById("game-area");
    let rect = div.getBoundingClientRect();


    gameWidth = windowWidth / 5 * 4;
    ts = min(gameWidth / cols, windowHeight / rows); // 取最小值，确保是正方形
    gameWidth = ts * cols;
    console.log("[debug] windowWidth =", windowWidth);
    console.log("[debug] windowHeight =", windowHeight);
    console.log("[debug] cols =", cols);
    console.log("[debug] rows =", rows);
    console.log("[debug] ts =", ts);
    //宽比高小
    if (gameWidth / cols < gameWidth / (windowHeight / rows)) {
        gameX = 0;
        gameY = (windowHeight - windowHeight / rows) / 2;
    } else {
        gameX = (windowWidth / 5 * 4 - gameWidth) / 2;
        gameY = 0;
    }
    console.log("[debug] gameWidth =", gameWidth);
    console.log("[debug] gameX =", gameX);

    widthRatio = ts / 110;
    heightRatio = ts / 110;
    pageScale = ts / 110;

    resizeCanvas(windowWidth, rows * ts);  // 窗口大小改变时调整画布大小

    // console.log(ts);
    let canvas = createCanvas(windowWidth, rows * ts);

    gameHeight = rows * ts;
    cnvs = canvas;

    // 通过 position() 方法将 canvas 居中

    // Add a class attribute to the canvas.
    cnvs.class('pinkborder');


    // Select the canvas by its class.
    cnvs = select('.pinkborder');


    // Style its border.
    cnvs.style('display', 'block');  // 确保 canvas 被当作块级元素


    // 创建按钮
    var buttonHeight = gameY + 20 * heightRatio;
    btnQuit.remove();
    btnReset.remove();
    btnResume.remove(); // 删除按钮
    btnPause.remove();
    btnSpeed.remove();


    btnQuit = createButton('');
    btnQuit.position(0, buttonHeight);
    btnQuit.size(60 * widthRatio, 50 * heightRatio);
    btnQuit.class('button-quit');

    var btnSize = 50 * widthRatio;
    var space = 20 * widthRatio;
    //

    btnReset = createButton('');
    btnReset.position(gameWidth - btnSize - space, buttonHeight);
    btnReset.size(btnSize, btnSize);
    btnReset.class('button-reset');


    btnResume = createButton('');
    btnResume.position(btnReset.position().x - btnSize - space, buttonHeight)
    btnResume.size(btnSize, btnSize);
    btnResume.class('button-resume');

    btnPause = createButton('');
    btnPause.position(btnResume.position().x, buttonHeight)
    btnPause.size(btnSize, btnSize);
    btnPause.class('button-pause');

    btnSpeed = createButton("x" + getCurrentSpeed().toString());
    btnSpeed.position(btnPause.position().x - btnSize - space * 5, buttonHeight + 5);
    btnSpeed.size(80 * widthRatio, 40 * heightRatio);
    btnSpeed.class('button-speed');
    //
    //
    // // 添加按钮点击事件
    btnResume.mousePressed(onClickBtnResume);
    btnPause.mousePressed(onClickBtnPause);
    btnReset.mousePressed(onClickBtnReset);
    btnQuit.mousePressed(onClickBtnQuit);
    btnSpeed.mousePressed(onClickBtnSpeed);

    if (isStartGame == false) {
        onLevelFinished();
    }


}

// User input

function keyPressed() {
    hero.setMove(keyCode, true);
    switch (keyCode) {


        case 27:
            // Esc
            toPlace = false;
            // clearInfo();
            break;
        case 32:
            // Space
            pause();
            break;
        case 49:
            // 1
            setPlace('gun');
            break;
        case 50:
            // 2
            setPlace('laser');
            break;
        case 51:
            // 3
            setPlace('slow');
            break;
        case 52:
            // 4
            setPlace('sniper');
            break;
        case 53:
            // 5
            setPlace('rocket');
            break;
        case 54:
            // 6
            setPlace('bomb');
            break;
        case 55:
            // 7
            setPlace('tesla');
            break;
        case 77:
            // M
            importMap(prompt('Input map string:'));
            break;
        case 82:
            // R
            resetGame();
            break;
        case 83:
            // S
            if (selected) sell(selected);
            break;
        case 85:
            // U
            if (selected && selected.upgrades.length > 0) {
                upgrade(selected.upgrades[0]);
            }
            break;
        case 87:
            // W
            skipToNext = !skipToNext;
            break;
        case 90:
            // Z
            ts = zoomDefault;
            resizeMax();
            resetGame();
            break;
        case 219:
            // Left bracket
            if (ts > 16) {
                ts -= tileZoom;
                resizeMax();
                resetGame();
            }
            break;
        case 221:
            // Right bracket
            if (ts < 40) {
                ts += tileZoom;
                resizeMax();
                resetGame();
            }
            break;
    }
}

function keyReleased() {
    hero.setMove(keyCode, false);

}


function mousePressed() {
    console.log("[mousePressed] 全局点击触发");
  
    if (leftArrowBtn.clicked() && currentPage > 0) currentPage--;
    if (rightArrowBtn.clicked() && currentPage < pages.length - 1) currentPage++;
  
    pages[currentPage].checkClicked();
  
    const inTowerHeader =
      mouseX > towerInfoPane.x && mouseX < towerInfoPane.x + towerInfoPane.w &&
      mouseY > towerInfoPane.y && mouseY < towerInfoPane.y + 50;
  
    const inTowerPane =
      mouseX > towerInfoPane.x && mouseX < towerInfoPane.x + towerInfoPane.w &&
      mouseY > towerInfoPane.y && mouseY < towerInfoPane.y + towerInfoPane.currentHeight;
  
    if (inTowerHeader) {
      towerInfoPane.toggle();
      return;
    } else if (inTowerPane) {
      towerInfoPane.checkButtonClick(mouseX, mouseY);
      return;
    }
  
    menuButtonPressed();
  
    if (!mouseInMap()) {
      console.warn("[mousePressed] 鼠标不在地图区域");
      return;
    }
  
    
  
    const p = gridPosByLastest(mouseX, mouseY);
    const t = getTower(p.x, p.y);
  
    console.log("[mousePressed] 点击位置:", p);
    console.log("[mousePressed] grid 值:", grid?.[p.x]?.[p.y]);
    console.log("[mousePressed] towerType:", towerType);
    console.log("[mousePressed] toPlace:", toPlace);
  
    if (t) {
      // 点击了已有塔
      selected = t;
      toPlace = false;
      towerInfoPane.t = t;
      towerInfoPane.isExpanded = false;
      towerInfoPane.toggle();
      towerInfoPane.isPlaceTower = true;
      console.log("[mousePressed] 点击了已有塔，展示信息");
    } else if (typeof towerType !== 'undefined' && toPlace && [0, 3].includes(grid?.[p.x]?.[p.y])) {
        console.log("[mousePressed] 点击格子位置:", p);
console.log("[mousePressed] towerType:", towerType);
console.log("[mousePressed] toPlace:", toPlace);
console.log("[mousePressed] grid at pos:", grid?.[p.x]?.[p.y]);
      let newTower = createTower(p.x, p.y, tower[towerType]);
      newTower.gridPos = createVector(p.x, p.y);
      buy(newTower);
  
      if (!toPlace) {
        selected = null;
        towerInfoPane.t = undefined;
        towerInfoPane.isExpanded = true;
        towerInfoPane.toggle();
      }
    } else {
      console.warn("[mousePressed] 不能放置塔", {
        gridVal: grid?.[p.x]?.[p.y],
        towerType,
        toPlace
      });
  
      selected = null;
      towerInfoPane.isExpanded = true;
      towerInfoPane.toggle();
      towerInfoPane.t = undefined;
    }
  
    if (mouseButton === RIGHT) {
      debugMap = !debugMap;
    }
  }
  

function mouseReleased() {
    menuButtonReleased();
}

// 游戏失败
function gameover(isSurvival) {
    endLevel(isSurvival);
}

// 关卡结束
function endLevel(isSurvival) {
    if (!gameEnded) {
        console.log("endLevel");
        gameEnded = true;
        paused = true;
        onLevelFinished();

        // 计算游戏结果
        resultRating = calculateRating(health, maxHealth);
        // 开启关卡结算页面
        openResultMenu(isSurvival);
    }
}

// 根据剩余血量（health）与最大血量（maxHealth）计算星级（0~3 星）
function calculateRating(health, maxHealth) {
    if (health >= maxHealth * 0.85) return 3;
    else if (health >= maxHealth * 0.5) return 2;
    else if (health > 0) return 1;
    else return 0;
}

// 在关卡结束时调用，更新当前关卡的星级记录
function updateLevelRating(levelId, health, maxHealth) {
    var newRating = calculateRating(health, maxHealth);
    var storedRating = parseInt(localStorage.getItem("rating_" + levelId)) || 0;
    if (newRating > storedRating) {
        localStorage.setItem("rating_" + levelId, newRating);
    }
}


function updateMonsterPanel() {
    var monsterList = document.getElementById("monster-list");
    if (!monsterList) return;  // 如果页面中没有该元素，则退出
    monsterList.innerHTML = ""; // 清空原有内容
    // 遍历 global monster 对象中的所有键（每个键对应一种敌人类型）
    for (var key in monster) {
        if (monster.hasOwnProperty(key)) {
            // 创建一个新 div 元素作为敌人项
            var item = document.createElement("div");
            item.className = "monster-item";

            // 创建 img 作为敌人图像
            var monsterImage = document.createElement("img");
            monsterImage.className = "monster-image";

            // 检查是否有贴图
            if (monster[key].image) {
                monsterImage.src = monster[key].image;
            } else {
                // 创建一个显示颜色的小圆点
                var colorCircle = document.createElement("span");
                colorCircle.className = "monster-color";
                var col = monster[key].color;
                // 如果 color 是数组，则转换为 rgb 字符串
                if (Array.isArray(col)) {
                    colorCircle.style.backgroundColor = "rgb(" + col.join(",") + ")";
                } else {
                    colorCircle.style.backgroundColor = col;
                }
                item.appendChild(colorCircle);
            }

            // 创建一个文本节点，显示敌人的名称（key）
            var nameText = document.createTextNode(key);
            // 添加元素
            item.appendChild(monsterImage);
            item.appendChild(nameText);
            monsterList.appendChild(item);
        }
    }
}

let prevSelected = null;

function checkSelected() {
    if (selected != null) {
        if (prevSelected != null) {
            if (selected != prevSelected) {
                selected.selected = true;
                prevSelected.selected = false;
            }
        } else {
            selected.selected = true;
        }
    } else {
        if (prevSelected != null) {
            prevSelected.selected = false;
        }
    }

    prevSelected = selected;
}

function playStartBGM() {
    if (bgm != null) {
        if (bgm != bgmStart) {
            bgm.stop();
        } else {
            return;
        }
    }
    bgm = bgmStart;
    bgm.loop();
    bgm.play();
}

function switchBGM() {
    if (bgm != null) bgm.stop();
    if (mapData.id === "customMap") bgm = bgmLevel1;
    else if (mapData.id === "map2") bgm = bgmLevel2;
    else if (mapData.id === "map3") bgm = bgmLevel3;
    else bgm = bgmStart;
    bgm.loop();
    bgm.play();
}

class Tooltip {
    constructor(message, x, y) {
        this.message = message;  // 提示信息
        this.x = x;  // 提示位置X坐标
        this.y = y;  // 提示位置Y坐标
        this.alpha = 0;  // 初始透明度为0，表示隐藏
        // this.displayDuration = 3000;  // 提示显示的持续时间（毫秒）
        this.fadeDurationInt = 2000;  // 渐变显示和隐藏的持续时间（毫秒）
        this.fadeDurationOut = 2000;  // 渐变显示和隐藏的持续时间（毫秒）
        this.speed = 20;//显示速度
        this.isVisible = true;  // 是否显示

    }

    // 显示提示


    // 更新提示状态
    update() {
        if (this.fadeDurationInt > 0) {
            this.fadeDurationInt -= this.speed;
            this.alpha = map(this.fadeDurationInt, 2000, 0, 0, 255);
        }


        if (this.fadeDurationInt == 0) {
            if (this.fadeDurationOut > 0) ;
            {
                this.fadeDurationOut -= this.speed;
                this.alpha = map(this.fadeDurationOut, 2000, 0, 255, 0);
            }
        }

        if (this.fadeDurationOut == 0) {


            this.isVisible = false;
        }


    }

    // 显示文本
    display() {
        if (this.isVisible) {
            noStroke();
            fill(255, 0, 0, this.alpha);  // 设置文本颜色和透明度
            textSize(50);
            textAlign(CENTER, CENTER);
            text(this.message, this.x, this.y);  // 显示文本
        }

    }
}