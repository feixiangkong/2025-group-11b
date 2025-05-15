// Initial default health and money
let defaultHealth = 1;
let defaultCash = 100;

let mapData = maps.customMap; // Get custom map data

let debugMap = false; // Whether to display the debug map
let enableShakeEffect = true; // Whether to enable screen vibration
let enableHeartbeatEffect = true; // Whether to enable the heartbeat effect

// Opening remarks to start the game
var isStartGame = false; // Whether the game has started

var monsters = []; // Array for storing monsters
var projectiles = []; // Array for storing projectiles
var systems = []; // Array for storing systems
var towers = []; // Array for storing towers
var newMonsters = []; // Array for storing new monsters
var newProjectiles = []; // Array for storing new projectiles
var newTowers = []; // Array for storing new towers
var vfx = []; // Array for storing visual effects

var cols = 12; // Number of columns in the map
var rows = 8; // Number of rows in the map
var tileZoom = 2; // Zoom factor of the tile
var ts = 110; // Cell size
var zoomDefault = ts; // Default tile size
var particleAmt = 32; // Number of particles drawn per explosion
var custom; // JSON data for custom maps
var display; // Graphics display tile
var displayDir; // Direction of display tile
// (0 = no direction, 1 = left, 2 = up, 3 = right, 4 = down)
var dists = buildArray(12, 8, null); // Create an array with 12 columns and 8 rows, with a default value of null
// Distance to the exit
var grid; // Tile type
// (0 = empty, 1 = wall, 2 = path, 3 = tower,
// 4 = Only monster walking path)
var metadata; // Tile metadata
var paths; // Path direction to the exit
var visitMap; // Can you reach the exit?
var walkMap; // Walkable map

var exit; // Exit
var spawnpoints = []; // Monster spawn point
var tempSpawns = []; // Temporary spawn point

var cash; // Current money
var health; // Current health
let prevHealth = 0; // Health value in the previous frame
var maxHealth; // Maximum health value
var wave; // Current wave
var totalWaves = 2; // Each level has a fixed total of 2 waves

var spawnCool; // Cooldown time for monster spawning

var bg; // Background color

var selected; // Currently selected object
var towerType; // Current tower type

var sounds; // Dictionary of all sound effects

var paused; // Is the game paused?
var randomWaves = true; // Whether to use random waves
var scd; // Countdown to the next monster spawn
var skipToNext = false; // Whether to skip the current wave and start the next wave directly
var toCooldown; // Flag for resetting the spawn cooldown
var toPathfind; // Flag for updating monster pathfinding
var toPlace; // Flag for placing towers
var toWait; // Flag for waiting for the next wave
var wcd; // Countdown to the next wave
var minDist = 15; // Minimum distance between the spawn point and the exit
var resistance = 0.5; // Damage resistance percentage
var sellConst = 0.8; // Ratio of the tower selling price to the purchase price
var waveCool = 120; // Cooldown between waves (unit: ticks)
var weakness = 0.5; // Increased percentage of damage caused by weaknesses
var gameEnded = false; // Flag for whether the game is over
var resultRating = 0; // Level settlement score (0~3 stars)
var monsterSpeedMultiplier = 1; // Monster speed multiplier, default 1x speed

let bgm; // Background music

// Create Tooltip object
let tooltip; // Create a tooltip object

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
let pages = []; // Used to store multiple groups of buttons
let currentPage = 0; // Currently displayed page

let pageWidth;
let pageX;
let arrowButtonWidth;
let pageHeight;

let towerInfoPane;
let diffcultyLevel;


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
    if (!pattern) return; 
    spawnCool = pattern.shift();
    curWaveMonstersInfo = JSON.parse(JSON.stringify(pattern));
    calculateMonsterTotalNumber();
    for (var i = 0; i < pattern.length; i++) {
        addGroup(pattern[i]);
    }
}

// 购买并放置防御塔（当玩家资金充足时）
function buy(t) {
    const {x, y} = t.gridPos || {};
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

        console.log("[buy] Successfully placed tower", t);
    } else {
        console.warn("[buy] placement failed, insufficient conditions", {
            tower: t,
            canPlaceHere,
            hasCash: cash >= (t?.cost || 0),
            gridVal: grid?.[x]?.[y],
        });
    }
}


function canPlace(col, row) {
    if (!toPlace) return false;
    // Check if the grid exists and the index is in the valid range
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


// Get the map data
    var m = maps[mapID];
    mapData = m;
    console.log(mapID);
// Map
    if (mapID == "customMap") bgImg = levelMapsImage[0];
    else if (mapID == "map2") bgImg = levelMapsImage[1];
    else if (mapID == "map3") bgImg = levelMapsImage[2];
    console.log(`Get map data${m}`);

// Copy map display layer data
    display = copyArray(m.display);

// Copy map direction data
    displayDir = copyArray(m.displayDir);

// Copy map grid data
    grid = copyArray(m.grid);

// Copy map metadata
    metadata = copyArray(m.metadata);

// Set exit location
    exit = createVector(m.exit[0], m.exit[1]);

// Initialize spawn point array
    spawnpoints = [];

// Copy spawn point data
    for (var i = 0; i < m.spawnpoints.length; i++) {
        var s = m.spawnpoints[i];
        spawnpoints.push(createVector(s[0], s[1]));
    }

// Set the map background color
    bg = m.bg;

// Set the number of map columns
    cols = m.cols;

// Set the number of map rows
    rows = m.rows;

// Initialize the temporary spawn point array
    tempSpawns = [];

}


// Increment wave counter and prepare wave
function nextWave() {
// Add enemy waves according to the game mode (randomly generate or use custom configuration)
    addWave(randomWaves ? randomWave() : customWave());
// The conditional operator determines the wave generation strategy: when randomWaves is true, call the random generation function, otherwise call the custom configuration function
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
// Array format: [Monster appearance interval, [Monster type, Monster number], [Monster type, Monster number]...]
// The original logic here is wrong. Currently, only a single array can be pushed. If multiple arrays are pushed continuously, the following monster arrays will not take effect
function randomWave() {

    if (diffcultyLevel == 'easy') {
        return randomWaveEasy();
    }

    if (diffcultyLevel == 'normal') {
        return randomWaveNormal();
    }


    if (diffcultyLevel == 'hard') {
        return randomWaveHard();
    }

}


function randomWaveEasy() {
    var waves = [];

    if (mapData == maps["customMap"]) {
        if (isWave(0, 1)) {
            waves.push([116, ['Bandit', 5]]);
        }

        if (isWave(1, 2)) {

            waves.push([112, ['Bandit', 8]]);
        }
        // if (isWave(2, 3)) {
        //     waves.push([108, ['Bandit', 6], ['BatteringRam', 1]]);
        // }
        // if (isWave(3, 4)) {

        //     waves.push([104, ['BatteringRam', 2]]);
        // }
        // if (isWave(4, 5)) {
        //     waves.push([100, ['Bandit', 12]]);
        // }
        // if (isWave(5, 6)) {
        //     waves.push([96, ['Bandit', 8], ['BatteringRam', 2]]);
        // }
        // if (isWave(6, 7)) {
        //     waves.push([92, ['BatteringRam', 4]]);
        // }
        // if (isWave(7, 8)) {
        //     waves.push([88, ['Bandit', 15], ['BatteringRam', 1]]);
        // }
        // if (isWave(8, 9)) {
        //     waves.push([84, ['Bandit', 10], ['BatteringRam', 3]]);
        // }
        // if (isWave(9, 10)) {
        //     waves.push([80, ['BatteringRam', 5]]);
        // }
    }

    if (mapData == maps["map2"]) {
        if (isWave(0, 1)) {
            waves.push([110, ['Mouse', 6]]);
            // waves.push([100, ['PirateRaider', 2]]);
        }
        if (isWave(1, 2)) {
            waves.push([107, ['Mouse', 10]]);
        }
        // if (isWave(2, 3)) {
        //     waves.push([100, ['PirateRaider', 3]]);
        // }
        // if (isWave(3, 4)) {
        //     waves.push([97, ['Mouse', 8], ['PirateRaider', 1]]);
        // }
        // if (isWave(4, 5)) {
        //     waves.push([92, ['Mouse', 15]]);
        // }
        // if (isWave(5, 6)) {
        //     waves.push([88, ['PirateRaider', 4]]);
        // }
        // if (isWave(6, 7)) {
        //     waves.push([83, ['Mouse', 12], ['PirateRaider', 2]]);
        // }
        // if (isWave(7, 8)) {
        //     waves.push([79, ['PirateRaider', 6]]);
        // }
        // if (isWave(8, 9)) {
        //     waves.push([75, ['Mouse', 20]]);
        // }
        // if (isWave(9, 10)) {
        //     waves.push([70, ['Mouse', 15], ['PirateRaider', 5]]);
        // }
    }
    if (mapData == maps["map3"]) {
        if (isWave(0, 1)) {
            waves.push([100, ['DroneSwarm', 2]]);
        }
        if (isWave(1, 2)) {
            waves.push([96, ['AIMech', 1]]);
        }
        // if (isWave(2, 3)) {
        //     waves.push([93, ['DroneSwarm', 4]]);
        // }
        // if (isWave(3, 4)) {
        //     waves.push([90, ['DroneSwarm', 1], ['AIMech', 1]]);
        // }
        // if (isWave(4, 5)) {
        //     waves.push([85, ['DroneSwarm', 3]]);
        // }
        // if (isWave(5, 6)) {
        //     waves.push([81, ['AIMech', 2]]);
        // }
        // if (isWave(6, 7)) {
        //     waves.push([79, ['DroneSwarm', 4]]);
        // }
        // if (isWave(7, 8)) {
        //     waves.push([73, ['DroneSwarm', 4], ['AIMech', 2]]);
        // }
        // if (isWave(8, 9)) {
        //     waves.push([68, ['AIMech', 3]]);
        // }
        // if (isWave(9, 10)) {
        //     waves.push([62, ['DroneSwarm', 5], ['AIMech', 1]]);
        // }
    }


    return random(waves);
}

function randomWaveNormal() {
    var waves = [];

    if (mapData == maps["customMap"]) {
        if (isWave(0, 1)) {
            waves.push([50, ['Bandit', 8]]);
        }
        if (isWave(1, 2)) {
            waves.push([112, ['Bandit', 8]]);
        }
        // if (isWave(2, 3)) {
        //     waves.push([50, ['Bandit', 4], ['BatteringRam', 1]]);
        // }
        // if (isWave(3, 4)) {
        //     waves.push([80, ['BatteringRam', 2]]);
        // }
        // if (isWave(4, 5)) {
        //     waves.push([50, ['Bandit', 12]]);
        // }
        // if (isWave(5, 6)) {
        //     waves.push([50, ['Bandit', 8], ['BatteringRam', 2]]);
        // }
        // if (isWave(6, 7)) {
        //     waves.push([92, ['BatteringRam', 4]]);
        // }
        // if (isWave(7, 8)) {
        //     waves.push([50, ['Bandit', 15], ['BatteringRam', 1]]);
        // }
        // if (isWave(8, 9)) {
        //     waves.push([10, ['Bandit', 10], ['BatteringRam', 3]]);
        // }
        // if (isWave(9, 10)) {
        //     waves.push([80, ['BatteringRam', 5]]);
        // }
    }
    if (mapData == maps["map2"]) {
        if (isWave(0, 1)) {
            waves.push([50, ['Mouse', 6]]);
        }
        if (isWave(1, 2)) {
            waves.push([80, ['Mouse', 10]]);
        }
        // if (isWave(2, 3)) {
        //     waves.push([103, ['PirateRaider', 2]]);
        // }
        // if (isWave(3, 4)) {
        //     waves.push([97, ['Mouse', 4], ['PirateRaider', 1]]);
        // }
        // if (isWave(4, 5)) {
        //     waves.push([20, ['Mouse', 15]]);
        // }
        // if (isWave(5, 6)) {
        //     waves.push([100, ['PirateRaider', 4]]);
        // }
        // if (isWave(6, 7)) {
        //     waves.push([50, ['Mouse', 12], ['PirateRaider', 2]]);
        // }
        // if (isWave(7, 8)) {
        //     waves.push([60, ['PirateRaider', 6]]);
        // }
        // if (isWave(8, 9)) {
        //     waves.push([65, ['Mouse', 20]]);
        // }
        // if (isWave(9, 10)) {
        //     waves.push([70, ['Mouse', 15], ['PirateRaider', 5]]);
        // }
    }
    if (mapData == maps["map3"]) {
        if (isWave(0, 1)) {
            waves.push([80, ['DroneSwarm', 3]]);
        }
        if (isWave(1, 2)) {
            waves.push([96, ['AIMech', 1], ['PirateRaider', 1]]);
        }
        // if (isWave(2, 3)) {
        //     waves.push([93, ['DroneSwarm', 5]]);
        // }
        // if (isWave(3, 4)) {
        //     waves.push([90, ['DroneSwarm', 1], ['AIMech', 1]]);
        // }
        // if (isWave(4, 5)) {
        //     waves.push([85, ['DroneSwarm', 3]]);
        // }
        // if (isWave(5, 6)) {
        //     waves.push([81, ['AIMech', 2], ['PirateRaider', 1]]);
        // }
        // if (isWave(6, 7)) {
        //     waves.push([79, ['DroneSwarm', 4]]);
        // }
        // if (isWave(7, 8)) {
        //     waves.push([73, ['DroneSwarm', 4], ['AIMech', 2]]);
        // }
        // if (isWave(8, 9)) {
        //     waves.push([68, ['AIMech', 3], ['PirateRaider', 1]]);
        // }
        // if (isWave(9, 10)) {
        //     waves.push([62, ['DroneSwarm', 5], ['AIMech', 1]]);
        // }
    }


    return random(waves);
}

function randomWaveHard() {
    var waves = [];

    if (mapData == maps["customMap"]) {
        if (isWave(0, 1)) {
            waves.push([80, ['Bandit', 8]]);
        }
        if (isWave(1, 2)) {
            waves.push([30, ['Bandit', 4], ['BatteringRam', 2]]);
        }
        if (isWave(2, 3)) {
            waves.push([50, ['Bandit', 6], ['BatteringRam', 4]]);
        }
        // if (isWave(3, 4)) {
        //     waves.push([80, ['BatteringRam', 4],]);
        // }
        // if (isWave(4, 5)) {
        //     waves.push([50, ['Bandit', 15]]);
        // }
        // if (isWave(5, 6)) {
        //     waves.push([50, ['Bandit', 10], ['BatteringRam', 5]]);
        // }
        // if (isWave(6, 7)) {
        //     waves.push([92, ['BatteringRam', 8]]);
        // }
        // if (isWave(7, 8)) {
        //     waves.push([50, ['Bandit', 15], ['BatteringRam', 4]]);
        // }
        // if (isWave(8, 9)) {
        //     waves.push([10, ['Bandit', 10], ['BatteringRam', 6]]);
        // }
        // if (isWave(9, 10)) {
        //     waves.push([30, ['BatteringRam', 20]]);
        // }
    }
    if (mapData == maps["map2"]) {
        if (isWave(0, 1)) {
            waves.push([50, ['Mouse', 10]]);
        }
        if (isWave(1, 2)) {
            waves.push([50, ['Mouse', 10], ['PirateRaider', 2]]);
        }
        if (isWave(2, 3)) {
            waves.push([103, ['PirateRaider', 4]]);
        }
        // if (isWave(3, 4)) {
        //     waves.push([97, ['Mouse', 4], ['PirateRaider', 2]]);
        // }
        // if (isWave(4, 5)) {
        //     waves.push([20, ['Mouse', 15], ['PirateRaider', 2]]);
        // }
        // if (isWave(5, 6)) {
        //     waves.push([100, ['PirateRaider', 6]]);
        // }
        // if (isWave(6, 7)) {
        //     waves.push([50, ['Mouse', 12], ['PirateRaider', 4]]);
        // }
        // if (isWave(7, 8)) {
        //     waves.push([60, ['PirateRaider', 8]]);
        // }
        // if (isWave(8, 9)) {
        //     waves.push([65, ['Mouse', 30], ['PirateRaider', 10]]);
        // }
        // if (isWave(9, 10)) {
        //     waves.push([70, ['Mouse', 30], ['PirateRaider', 10]]);
        // }
    }
    if (mapData == maps["map3"]) {
        if (isWave(0, 1)) {
            waves.push([50, ['DroneSwarm', 8], ['PirateRaider', 2]]);
        }
        if (isWave(1, 2)) {
            waves.push([96, ['AIMech', 3], ['PirateRaider', 3]]);
        }
        if (isWave(2, 3)) {
            waves.push([93, ['DroneSwarm', 10], ['PirateRaider', 3], ['AIMech', 2]]);
        }
        // if (isWave(3, 4)) {
        //     waves.push([90, ['DroneSwarm', 5], ['AIMech', 2], ['PirateRaider', 3]]);
        // }
        // if (isWave(4, 5)) {
        //     waves.push([85, ['DroneSwarm', 6], ['PirateRaider', 6]]);
        // }
        // if (isWave(5, 6)) {
        //     waves.push([81, ['AIMech', 2], ['PirateRaider', 5], ['PirateRaider', 3]]);
        // }
        // if (isWave(6, 7)) {
        //     waves.push([79, ['DroneSwarm', 8]], ['PirateRaider', 8]);
        // }
        // if (isWave(7, 8)) {
        //     waves.push([73, ['DroneSwarm', 7], ['AIMech', 2], ['PirateRaider', 3]]);
        // }
        // if (isWave(8, 9)) {
        //     waves.push([68, ['AIMech', 3], ['PirateRaider', 5], ['PirateRaider', 3]]);
        // }
        // if (isWave(9, 10)) {
        //     waves.push([62, ['DroneSwarm', 10], ['AIMech', 5], ['PirateRaider', 10]]);
        // }
    }


    return random(waves);
}


// 开始游戏逻辑入口
function startGame(id) {

    loadGame(id);
    resetGame();
    // 自动开始游戏

    //先展示指引界面
    if (showGuideScrren == true) {
        paused = true;
    } else {
        paused = false;
    }
    isStartGame = true;

    onGameStart();
    switchBGM();
}

// Stop the game
function stopGame() {
    isStartGame = false;
    onLevelFinished();
}

// Load the game map
function loadGame(mapID) {
    loadMap(mapID);
    console.log(`Successfully loaded map ${mapID}, path is ${grid}`);
}

// Reset level
function resetGame() {

    hero = new Hero(ts * 4, gameHeight - ts * 3);
// Clear all entities
    monsters = [];
    projectiles = [];
    systems = [];
    towers = [];
    newMonsters = [];
    newProjectiles = [];
    newTowers = [];
    vfx = [];

// Reset state
    health = defaultHealth; // Initialize player health
    cash = defaultCash; // Initialize player money
    maxHealth = health;
    prevHealth = health;
    wave = 0; // Reset wave number
    gameEnded = false; // Reset game end mark
    resultRating = 0; // Reset settlement
    toWait = false;
// Reset various flags
    paused = true;
    scd = 0;
    toCooldown = false;
    toPathfind = false;
    toPlace = false;
// Start the first wave (at this time nextWave() will change wave to 1)
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

function upgrade(t) { // Define the upgrade function, receive the upgrade configuration object t as a parameter
    if (cash >= t.cost) { // Check whether the current funds meet the cost of the upgrade
        cash -= t.cost; // Deduct the funds consumed by the upgrade
        selected.upgrade(t); // Execute the upgrade logic of the target object
        selected.upgrades = t.upgrades ? t.upgrades : []; // Update the list of available upgrade items (inherit if it exists, otherwise reset to empty)
// // Refresh the interface to display the latest information
        towerInfoPane.t = selected;
        towerInfoPane.isExpanded = false;
        towerInfoPane.toggle();
        towerInfoPane.isPlaceTower = true;

// Draw the upgrade effect
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
//Just updated the menu component
    updateMenuDisplay();

    if (!isStartGame) return;
    if (!grid) {
        console.log("No map");
        background(0);
        return;
    }

    drawGameView();
    drawTowerPane();

    drawGuideScreen();

}

// === Game main screen logic ===
function drawGameView() {
    push();
    translate(gameX, gameY);
    // translate(gameX, 0);
    background(50);

    if (enableShakeEffect) drawShakeEffect();
    image(bgImg, 0, 0, gameWidth, height);

    // updatePause();

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
    //Pause drawing
    updateGameStateUI();
    lateUpdateMenuDisplay();

    //Grid debug
    // if (debugMap) drawMapGrid();
    pop();
    drawRedFlashOverlay();


}


function drawGuideScreen() {

    push();
    translate(gameX, gameY);
    if (showGuideScrren) {
        noStroke();
        fill(0, 90);
        rect(0, 0, width, height);

        // Introducing the health bar
        if (guideIndex == 1) {
            let startX = width * 0.08;
            let ypos = 20 * heightRatio;
            let overX = startX;
            let overY = ypos + 50 * heightRatio;
            guideFingerX = lerp(guideFingerX, overX, 0.1);
            guideFingerY = lerp(guideFingerY, overY, 0.1);

            if (guideFingerX == overX) ;
            guideAlpha += 3;
            fill(255, guideAlpha);
            textSize(ts * 0.2);
            // noStroke();
            let txt = "Life bar. When the enemy reaches the end, the health value decreases by 1.";
            let text_width = textWidth(txt);
            text(txt, guideFingerX + text_width / 2, guideFingerY + ts * 1.5);

        }
        ////Introduce enemy
        if (guideIndex == 2) {

            image(BanditImg, gameX + spawnpoints[0].x * ts, gameY + spawnpoints[0].y * ts, ts, ts);
            let startX = width * 0.08;
            let ypos = 20 * heightRatio;
            let overX = gameX + spawnpoints[0].x * ts;
            let overY = gameY + spawnpoints[0].y * ts + ts;
            guideFingerX = lerp(guideFingerX, overX, 0.1);
            guideFingerY = lerp(guideFingerY, overY, 0.1);

            if (guideFingerX == overX) ;
            guideAlpha += 3;
            fill(255, guideAlpha);
            textSize(ts * 0.2);
            // noStroke();
            let txt = "Enemies have different characteristics for each type. Eliminate the enemies to obtain gold coins.";
            let text_width = textWidth(txt);
            text(txt, guideFingerX + text_width / 2, guideFingerY + ts * 1.5);

        }

        //Introduction to Gold Coin
        if (guideIndex == 3) {
            image(BanditImg, gameX + spawnpoints[0].x * ts, gameY + spawnpoints[0].y * ts, ts, ts);
            let startX2 = width * 0.08 + 190 * widthRatio + width * 0.01;
            let ypos = 20 * heightRatio;
            let overX = startX2;
            let overY = ypos + 50 * heightRatio;
            guideFingerX = lerp(guideFingerX, overX, 0.1);
            guideFingerY = lerp(guideFingerY, overY, 0.1);

            if (guideFingerX == overX) ;
            guideAlpha += 3;
            fill(255, guideAlpha);
            textSize(ts * 0.2);
            // noStroke();
            let txt = "Gold coins can be used to purchase towers.";
            let text_width = textWidth(txt);
            text(txt, guideFingerX + text_width / 2, guideFingerY + ts * 1.5);

        }
        //Introduction to tower use
        if (guideIndex == 4) {
            image(BanditImg, gameX + spawnpoints[0].x * ts, gameY + spawnpoints[0].y * ts, ts, ts);

            let overX = towerInfoPane.x + ts / 2;
            let overY = pages[0].buttons[0].y + ts / 2;
            guideFingerX = lerp(guideFingerX, overX, 0.1);
            guideFingerY = lerp(guideFingerY, overY, 0.1);

            if (guideFingerX == overX) ;
            guideAlpha += 3;
            fill(255, guideAlpha);
            textSize(ts * 0.2);
            // noStroke();
            let txt = "Select the tower you want to purchase, and detailed information will appear below.";
            let text_width = textWidth(txt);
            text(txt, guideFingerX - text_width * 0.5, guideFingerY + ts);
        }

        //Place a tower, and it will show that it cannot be placed.
        if (guideIndex == 5) {
            image(BanditImg, gameX + spawnpoints[0].x * ts, gameY + spawnpoints[0].y * ts, ts, ts);

            //draw place
            let c = center(3, 3);

            push();
            // translate(gameX,gameY);
            stroke(255);
            fill(0, 63);
            var r = (2 + 0.5) * ts * 2;
            ellipse(c.x, c.y, r, r);
            pop();

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

            //draw finger
            let overX = c.x;
            let overY = c.y + ts / 2;
            guideFingerX = lerp(guideFingerX, overX, 0.1);
            guideFingerY = lerp(guideFingerY, overY, 0.1);

            if (guideFingerX == overX) ;
            guideAlpha += 3;
            fill(255, guideAlpha);
            textSize(ts * 0.2);
            // noStroke();
            let txt = "Towers cannot be placed in the passage.";
            let text_width = textWidth(txt);
            text(txt, guideFingerX + text_width / 2, guideFingerY + ts);


        }
        //Tower placement instructions
        if (guideIndex == 6) {
            image(BanditImg, gameX + spawnpoints[0].x * ts, gameY + spawnpoints[0].y * ts, ts, ts);


            //draw place
            let c = center(4, 3);
            image(tower1Img, c.x - ts / 2, c.y - ts / 2, ts, ts);

            //draw finger
            let overX = c.x;
            let overY = c.y + ts / 2;
            guideFingerX = lerp(guideFingerX, overX, 0.1);
            guideFingerY = lerp(guideFingerY, overY, 0.1);

            if (guideFingerX == overX) ;
            guideAlpha += 3;
            fill(255, guideAlpha);
            textSize(ts * 0.2);
            // noStroke();
            let txt = "If the purchase and placement are successful,\n the tower will start to attack the enemies within its range.";
            let text_width = textWidth(txt);
            textAlign(LEFT, CENTER);
            text(txt, guideFingerX + ts, guideFingerY + ts);
            textAlign(CENTER, CENTER);

        }

        //Hero Description
        if (guideIndex == 7) {
            image(BanditImg, gameX + spawnpoints[0].x * ts, gameY + spawnpoints[0].y * ts, ts, ts);
            //draw finger
            let overX = ts * 4;
            let overY = gameHeight - ts * 3;
            guideFingerX = lerp(guideFingerX, overX, 0.1);
            guideFingerY = lerp(guideFingerY, overY, 0.1);

            image(keyboardImg, overX + ts * 2, overY - ts, ts, ts);

            if (guideFingerX == overX) ;
            guideAlpha += 3;
            fill(255, guideAlpha);
            textSize(ts * 0.2);
            // noStroke();
            let txt = "Use the keyboard to move the hero. \nWhen the hero moves to the position of the tower, \n" +
                "it can absorb the tower's abilities and unleash the tower's skills.";
            let text_width = textWidth(txt);
            textAlign(LEFT, CENTER);
            text(txt, guideFingerX + ts, guideFingerY + ts);
            textAlign(CENTER, CENTER);
        }

        if (guideIndex == 8) {
            image(BanditImg, gameX + spawnpoints[0].x * ts, gameY + spawnpoints[0].y * ts, ts, ts);
            //draw finger
            let overX = gameWidth - ts * 3;
            let overY = ts * 0.8;
            guideFingerX = lerp(guideFingerX, overX, 0.1);
            guideFingerY = lerp(guideFingerY, overY, 0.1);


            if (guideFingerX == overX) ;
            guideAlpha += 3;
            fill(255, guideAlpha);
            textSize(ts * 0.2);
            // noStroke();
            let txt = "If you are satisfied with the placement of the towers, \n" +
                "you can freely switch to a faster speed to accelerate the progress.";
            let text_width = textWidth(txt);
            textAlign(LEFT, CENTER);
            text(txt, guideFingerX - ts * 4, guideFingerY + ts * 1.2);
            textAlign(CENTER, CENTER);
        }

        if (guideIndex == 9) {
            image(BanditImg, gameX + spawnpoints[0].x * ts, gameY + spawnpoints[0].y * ts, ts, ts);
            //draw finger
            let overX = gameWidth - ts * 3;
            let overY = ts * 0.8;
            guideFingerX = lerp(guideFingerX, overX, 0.1);
            guideFingerY = lerp(guideFingerY, overY, 0.1);


            if (guideFingerX == overX) ;
            guideAlpha += 3;
            fill(255, guideAlpha);
            textSize(ts * 0.4);
            // noStroke();
            let txt = "OK, go for it, my warrior!";

            textAlign(CENTER, CENTER);
            text(txt, gameX + gameWidth / 2, gameY + gameHeight / 2);

        }
        guideAngle += 0.1;
        image(guideFingerImg, guideFingerX, guideFingerY, ts * 0.6 + sin(guideAngle) * ts * 0.1, ts * 0.8 + sin(guideAngle) * ts * 0.1);

        fill("yellow");
        textSize(ts * 0.4);
        let txt = "Press the left mouse button to continue.";
        text(txt, gameX + gameWidth / 2, gameY + gameHeight - ts);

    }
    pop();
    if (showGuideScrren) {
        btn_bearkGuide.draw();
    }

}

// === Hero drawing and updating ===
function drawHero() {
    hero.draw();
    if (!paused) {
        hero.getPowerByTowers(towers);
        hero.updateTowerPower();
    }
}

// === Spawn Monster ===
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

// === Monster Update and Draw ===
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

// === Tower update and drawing ===
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

// === Particle System ===
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

// === Bullet System ===
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

// === Display range of tower when mouse is placed ===
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

// === Merge newly generated entities ===
function appendNewEntities() {
    projectiles = projectiles.concat(newProjectiles);
    towers = towers.concat(newTowers);
    newProjectiles = [];
    newTowers = [];
}

// === Game status determination and wave switching ===
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

// === Screen heartbeat effect ===
function drawHeartbeatEffectIfEnabled() {
    if (enableHeartbeatEffect) drawHeartbeatEffect();
}

// === Tower UI ===
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
        this.h = h; // Maximum expanded height of the panel
        this.contentHeight = contentHeight; // Total content height
        this.t = undefined;
        this.isPlaceTower = true;

        this.offsetY = 0; // Current sliding offset
        this.targetY = 0; // Target sliding position
        this.scrollSpeed = 0.2; // Smooth scrolling speed

        this.isDragging = false;
        this.lastY = 0;

        this.isExpanded = false; // Expand or not
        this.targetHeight = 50; // Target height (initial collapse)
        this.currentHeight = 50; // Real-time panel height
    }

    update() {
        // **Smoothly adjust panel height**
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

    // Draw the panel basics
    drawPanelBase() {
        fill(255);
        stroke(180);
        strokeWeight(2);
        rect(0, 0, this.w, this.currentHeight, 15);
    }

    // Draw the title bar
    drawTitleBar() {
        fill(255);
        rect(0, 0, this.w, 50, 15);

        fill(0);
        textFont(uiFont);
        textSize(towerWidth / 10);
        textAlign(CENTER, CENTER);
        text(this.isExpanded ? "🔼 TOWER INFO" : "🔽 TOWER INFO", this.w / 2, 25);
    }

    // Draw the expanded content
    drawExpandedContent() {
        if (this.t === undefined) return;

        push();
        this.drawTowerInfo();

        if (this.isPlaceTower) {
            this.drawActionButtons();
        }
        pop();
    }

    // Draw tower information
    drawTowerInfo() {
        const startX = towerWidth / 12;
        const startY = 60;
        const fontSize = towerWidth / 15;
        const lineHeight = fontSize * 1.5;

        fill(this.t.color);
        noStroke();
        textSize(fontSize);
        textAlign(LEFT, TOP);

        // Draw various information
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

    // Draw the operation button
    drawActionButtons() {
        const startX = towerWidth / 12;
        const startY = 60;
        const fontHeight = towerWidth / 20;
        const btnY = startY + fontHeight * 18;

        // Draw the button background
        fill(100, 150, 200);
        rect(startX, btnY, towerWidth / 3, towerWidth / 10, 10);
        rect(startX + towerWidth / 3 + towerWidth / 5, btnY, towerWidth / 3, towerWidth / 10, 10);

        // Draw the button text
        fill(255);
        textAlign(CENTER, CENTER);
        text("SELL", startX + towerWidth / 6, btnY + towerWidth / 20);
        text("UPGRADE", startX + towerWidth / 3 + towerWidth / 5 + towerWidth / 6, btnY + towerWidth / 20);
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
                let by1 = this.y + startY + fontHeight * 18;
                let bx2 = this.x + startX + towerWidth / 3 + towerWidth / 5;
                let by2 = this.y + startY + fontHeight * 18;


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


    addButton(row, col, label) {
        let btnX = this.x + col * (this.w / 2 + towerWidth / 20); // Set the button's X coordinate
        let btnY = this.y + row * (this.w / 2 + towerWidth / 20); // Set the button's Y coordinate
        this.buttons.push(new Button(btnX, btnY, this.w / 2, this.w / 2, null, label));
    }


    display() {
        for (let btn of this.buttons) {
            btn.display();
        }
    }


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
                // console.log(`Button ${btn.label} was clicked`);
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


        if (this.label == "Archer Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(tower1Img, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
            this.fillRectByMoney();
            fill("yellow");
            textSize(imgH / 4);
            // textAlign(CENTER,CENTER);
            text("$ 50", this.x + (this.w - imgW) / 2 + imgW / 2, this.y + (this.h - imgH / 3))
        } else if (this.label == "Boiling Oil Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(tower2Img, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
            this.fillRectByMoney();
            fill("yellow");
            textSize(imgH / 4);
            // textAlign(CENTER,CENTER);
            text("$ 70", this.x + (this.w - imgW) / 2 + imgW / 2, this.y + (this.h - imgH / 3))
        } else if (this.label == "Cannon Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(t4_1Image, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
            this.fillRectByMoney();
            fill("yellow");
            textSize(imgH / 4);
            // textAlign(CENTER,CENTER);
            text("$ 100", this.x + (this.w - imgW) / 2 + imgW / 2, this.y + (this.h - imgH / 3))
        } else if (this.label == "Net Thrower Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(t3_1Image, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
            this.fillRectByMoney();
            fill("yellow");
            textSize(imgH / 4);
            // textAlign(CENTER,CENTER);
            text("$ 60", this.x + (this.w - imgW) / 2 + imgW / 2, this.y + (this.h - imgH / 3))
        } else if (this.label == "EMP Disruptor Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(t7_1Image, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
            this.fillRectByMoney();
            fill("yellow");
            textSize(imgH / 4);
            // textAlign(CENTER,CENTER);
            text("$ 150", this.x + (this.w - imgW) / 2 + imgW / 2, this.y + (this.h - imgH / 3))
        } else if (this.label == "Laser AA Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(t5_1Image, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
            this.fillRectByMoney();
            fill("yellow");
            textSize(imgH / 4);
            // textAlign(CENTER,CENTER);
            text("$ 150", this.x + (this.w - imgW) / 2 + imgW / 2, this.y + (this.h - imgH / 3))
        } else if (this.label == "Trebuchet Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(t4_1Image, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
            this.fillRectByMoney();
            fill("yellow");
            textSize(imgH / 4);
            // textAlign(CENTER,CENTER);
            text("$ 120", this.x + (this.w - imgW) / 2 + imgW / 2, this.y + (this.h - imgH / 3))
        } else if (this.label == "EMP Tower") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            image(t6_1Image, this.x + (this.w - imgW) / 2, this.y + (this.h - imgH) / 2, imgW, imgH);
            this.fillRectByMoney();
            fill("yellow");
            textSize(imgH / 4);
            // textAlign(CENTER,CENTER);
            text("$ 200", this.x + (this.w - imgW) / 2 + imgW / 2, this.y + (this.h - imgH / 3))
        } else {
            fill(0);
            stroke(0);

            textAlign(CENTER, CENTER);
            textFont('Arial');
            textSize(towerWidth / 15);
            text(this.label, this.x + this.w / 2, this.y + this.h / 2);
        }


    }

    fillRectByMoney() {
        if (this.label != "<" && this.label != ">") {
            let imgW = this.w * this.imgSize;
            let imgH = this.h * this.imgSize;
            fill(255);
            rect(this.x + (this.w - imgW) / 2, this.y + (this.h - imgH / 3), imgW, imgH / 4, 10)
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

    if (mouseButton === RIGHT) {
        debugMap = !debugMap;
        showGuideScrren = false;

    } else {
        if (showGuideScrren) {

            if (guideAlpha >= 255) {
                guideIndex += 1;
                //介绍塔，模拟点击塔
                if (guideIndex == 4) {
                    setPlace('gun');
                    toPlace = false;
                }
                if (guideIndex == 6) {
                    toPlace = false;
                    selected = null;
                    towerInfoPane.t = undefined;
                    towerInfoPane.isExpanded = true;
                    towerInfoPane.toggle();
                }
                guideAlpha = 0;
            }
            if (guideIndex == guideEnd) {
                showGuideScrren = false;
                paused = false;
            }

        }
    }

    menuButtonPressed();
    //如果是指导页面，则不能点击塔
    if (showGuideScrren) {
        return;
    }
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
        // Clicked on an existing tower
        selected = t;
        toPlace = false;
        towerInfoPane.t = t;
        towerInfoPane.isExpanded = false;
        towerInfoPane.toggle();
        towerInfoPane.isPlaceTower = true;
        console.log("[mousePressed] Clicked on an existing tower, displaying information");
    } else if (typeof towerType !== 'undefined' && toPlace && [0, 3].includes(grid?.[p.x]?.[p.y])) {
        console.log("[mousePressed] Clicked on grid position:", p);
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
        console.warn("[mousePressed] cannot place tower", {
            gridVal: grid?.[p.x]?.[p.y],
            towerType,
            toPlace
        });

        selected = null;
        towerInfoPane.isExpanded = true;
        towerInfoPane.toggle();
        towerInfoPane.t = undefined;
    }


}


function mouseReleased() {
    menuButtonReleased();
}

// Game failed
function gameover(isSurvival) {
    endLevel(isSurvival);
}

// End of level
function endLevel(isSurvival) {
    if (!gameEnded) {
        console.log("endLevel");
        gameEnded = true;
        paused = true;
        onLevelFinished();

        // Calculate game results
        resultRating = calculateRating(health, maxHealth);
        // Open the level settlement page
        openResultMenu(isSurvival);
    }
}

// Calculate the star rating (0~3 stars) based on the remaining health (health) and the maximum health (maxHealth)
function calculateRating(health, maxHealth) {
    if (health >= maxHealth * 0.85) return 3;
    else if (health >= maxHealth * 0.5) return 2;
    else if (health > 0) return 1;
    else return 0;
}

//Called at the end of the level to update the star rating of the current level
function updateLevelRating(levelId, health, maxHealth) {
    var newRating = calculateRating(health, maxHealth);
    var storedRating = parseInt(localStorage.getItem("rating_" + levelId)) || 0;
    if (newRating > storedRating) {
        localStorage.setItem("rating_" + levelId, newRating);
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
        this.message = message; // prompt information
        this.x = x; // prompt position X coordinate
        this.y = y; // prompt position Y coordinate
        this.alpha = 0; // initial transparency is 0, indicating hidden
        // this.displayDuration = 3000; // prompt display duration (milliseconds)
        this.fadeDurationInt = 2000; // gradient display and hide duration (milliseconds)
        this.fadeDurationOut = 2000; // gradient display and hide duration (milliseconds)
        this.speed = 20;//display speed
        this.isVisible = true; // whether to display

    }

    // Display prompt

// Update prompt status
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

    // Display text
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

function initLevelEasy() {
    loadMosterByEasy();
}

function initLevelNormal() {
    loadMosterByNormal();
}


function initLevelHard() {
    loadMosterByHard();
}