// 声明全局变量
let BanditImg;
let dragonImg;
let myTowerImg

let bgImg;  // 声明背景图变量

let moneyImg;//钱图像
let moneyBarImg;//钱图像
let healthBarImg;
let monsterBarImg;


let tower1Img;
let tower2Img;

let m1Images = [];
let m_2Image;

let m2Images = [];
let m3Image;
let m3Images = [];


let m4Image;
let m4Images = [];

let m5Image;
let m5Images = [];


let m6Image;
let m6Images = [];
let t1Image;//箭
let fireBallImage;//火球


let t1_2Image;
let t1_3Image;

let t2_2Image;
let t2_3Image

let t3_1Image;
let t3_2Image;
let t3_3Image;
let t4_1Image;
let t4_2Image;
let t4_3Image;
let t5_1Image;
let t5_2Image;
let t5_3Image;

let t6_1Image;
let t6_2Image;
let t6_3Image;

let t7_1Image;
let t7_2Image;
let t7_3Image;

let imgAttackAim;
let imgAttackArrow;
let imgAttackStone;
let imgAttackBullet;
let imgAttackCannonExplosion;
let imgAttackLightning;
let imgAttackStun;
let imgUpgradeShine;

let bgmStart;
let bgmLevel1;
let bgmLevel2;
let bgmLevel3;


let widthRatio = 0;
let heightRatio = 0;
let pageScale = 0;

let pg; // 定义图层

//英雄行动
let walkSprites = {};

let hero;
function preload() {
    // 加载塔图片（确保图片路径正确）

    loadImages();
    loadSounds();
    preloadUIAssets();


}

function loadImages() {
    t3_1Image = loadImage("images/t3_1.png");
    t3_2Image = loadImage("images/t3_2.png");
    t3_3Image = loadImage("images/t3_3.png");
    t4_1Image = loadImage("images/t4_1.png");
    t4_2Image = loadImage("images/t4_2.png");
    t4_3Image = loadImage("images/t4_3.png");
    t5_1Image = loadImage("images/t5_1.png");
    t5_2Image = loadImage("images/t5_2.png");
    t5_3Image = loadImage("images/t5_3.png");
    t6_1Image = loadImage("images/t6_1.png");
    t6_2Image = loadImage("images/t6_2.png");
    t6_3Image = loadImage("images/t6_3.png");
    t7_1Image = loadImage("images/t7_1.png");
    t7_2Image = loadImage("images/t7_2.png");
    t7_3Image = loadImage("images/t7_3.png");

    t1_2Image = loadImage("images/t1_2.png");
    t1_3Image = loadImage("images/t1_3.png");

    t2_2Image = loadImage("images/t2_2.png");
    t2_3Image = loadImage("images/t2_3.png");

    myTowerImg = loadImage("images/leftrole.jpeg");
    BanditImg = loadImage("images/m1.png");
    m_2Image = loadImage("images/g1.png");
    dragonImg = loadImage("images/dragon.png");
    moneyImg = loadImage("images/money.png");
    moneyBarImg = loadImage("images/moneyBar.png");
    healthBarImg = loadImage("images/healthBar.png");
    monsterBarImg = loadImage("images/monsterBar.png");
    tower1Img = loadImage("images/tower1.png");
    tower2Img = loadImage("images/tower2.png");

    m1Images.push(loadImage("images/m1.png"));
    m1Images.push(loadImage("images/m2.png"));
    m1Images.push(loadImage("images/m3.png"));
    m1Images.push(loadImage("images/m4.png"));
    m1Images.push((loadImage("images/m5.png")));

    t1Image = loadImage("images/t1.png");
    fireBallImage = loadImage("images/t2.png");

    //dragon
    for (let i = 0; i < 4; i++) {
        m2Images.push((loadImage("images/g" + (i + 1) + ".png")));
    }
    m3Image = loadImage("images/m3_1.png");
    for (let i = 0; i < 5; i++) {
        m3Images.push((loadImage("images/m3_" + (i + 1) + ".png")));
    }

    m4Image = loadImage("images/m4_1.png");
    for (let i = 0; i < 6; i++) {
        m4Images.push((loadImage("images/m4_" + (i + 1) + ".png")));
    }

    m5Image = loadImage("images/m5_1.png");
    for (let i = 0; i < 6; i++) {
        m5Images.push((loadImage("images/m5_" + (i + 1) + ".png")));
    }


    m6Image = loadImage("images/m6_1.png");
    for (let i = 0; i < 5; i++) {
        m6Images.push((loadImage("images/m6_" + (i + 1) + ".png")));
    }

    imgAttackAim =  loadImage("images/tower/icon_aim.png");
    imgAttackArrow =  loadImage("images/tower/arrow.png");
    imgAttackStone =  loadImage("images/tower/stone.png");
    imgAttackBullet =  loadImage("images/tower/bullet.png");
    imgAttackCannonExplosion =  loadImage("images/tower/sprites_explosion.png");
    imgAttackLightning =  loadImage("images/tower/sprites_lightning.png");
    imgAttackStun =  loadImage("images/tower/sprites_stun.png");
    imgUpgradeShine =  loadImage("images/tower/sprites_upgrade_shine.png");

    //英雄图片
    walkSprites.walk = [
        loadImage('images/hero/1_KNIGHT/Knight_01__WALK_000.png'),
        loadImage('images/hero/1_KNIGHT/Knight_01__WALK_001.png'),
        loadImage('images/hero/1_KNIGHT/Knight_01__WALK_002.png'),
        loadImage('images/hero/1_KNIGHT/Knight_01__WALK_003.png'),
        loadImage('images/hero/1_KNIGHT/Knight_01__WALK_004.png'),
        loadImage('images/hero/1_KNIGHT/Knight_01__WALK_005.png'),
        loadImage('images/hero/1_KNIGHT/Knight_01__WALK_006.png'),
        loadImage('images/hero/1_KNIGHT/Knight_01__WALK_007.png'),
        loadImage('images/hero/1_KNIGHT/Knight_01__WALK_008.png'),
        loadImage('images/hero/1_KNIGHT/Knight_01__WALK_009.png'),
    ];

}



function setup() {
    let div = document.getElementById("game-area");
    let rect = div.getBoundingClientRect();
    console.log(`宽度: ${rect.width}, 高度: ${rect.height}`);

    cols = 12;
    rows = 8;


    console.log("[setup] windowWidth:", windowWidth, "windowHeight:", windowHeight);
    console.log("[setup] cols:", cols, "rows:", rows);
    gameWidth = windowWidth/5*4;
    ts = min(gameWidth / cols,windowHeight/rows); // 取最小值，确保是正方形
    gameWidth =ts*cols;
    gameX = 0; // 补上这一
    console.log("[setup] ts:", ts);
    console.log("[setup] gameWidth:", gameWidth);
    //宽比高小
    let mapRatio = gameWidth / cols;
    let screenRatio = windowHeight / rows;
    
    if (mapRatio < screenRatio) {
        gameX = 0;
        gameY = (windowHeight - rows * mapRatio) / 2;
    } else {
        gameX = (windowWidth / 5 * 4 - cols * screenRatio) / 2;
        gameY = 0;
    }
    console.log("[setup] gameX:", gameX, "gameY:", gameY);
    // alert(ts);


    // console.log(ts);
    let  cnvs = createCanvas(windowWidth, rows * ts);

    gameHeight =rows * ts;
 

    background(255);
    cnvs.parent('main-holder');
    // 通过 position() 方法将 canvas 居中

    // Add a class attribute to the canvas.
    cnvs.class('pinkborder');


    // Select the canvas by its class.
  


    // Style its border.
    cnvs.style('display', 'block');  // 确保 canvas 被当作块级元素






    paused = true;
    healthBarImg.resize(healthBarImg.width * 0.7, healthBarImg.height * 0.7)
    monsterBarImg.resize(monsterBarImg.width * 0.6, monsterBarImg.height * 0.6)

    playStartBGM();
    onGameSetup();
    loadMoster();

    towerWidth = (rect.width/5);
    towerY = 0;
    towerX =  width -  towerWidth;
    towerHeight = rows * ts;
    towerTipPaneHeight = towerHeight/10;

     pageWidth = (towerWidth/12*8) ;
     pageX = (towerWidth-pageWidth)/2-towerWidth/40;
     arrowButtonWidth = towerWidth/12;
     pageHeight = 2 * (pageWidth/ 2 + towerWidth/20);

    // 创建两组页面
    let page1 = new Page(towerX+pageX,towerTipPaneHeight+towerWidth/24 , pageWidth, pageHeight);
    let page2 = new Page(towerX+pageX, towerTipPaneHeight+towerWidth/24, pageWidth, pageHeight);



    // 给每个页面添加按钮
    let labels = ['Archer Tower', 'Boiling Oil Tower', 'Cannon Tower', 'Net Thrower Tower', ];
    for (let i = 0; i < 4; i++) {
        let row = Math.floor(i / 2);
        let col = i % 2;
        page1.addButton(row, col, labels[i]);
    }

    let labels2 = ['Laser AA Tower', 'EMP Disruptor Tower', 'Trebuchet Tower', 'EMP Tower'];
    for (let i = 0; i < 4; i++) {
        let row = Math.floor(i / 2);
        let col = i % 2;
        page2.addButton(row, col, labels2[i]);
    }

    // 将页面添加到页面数组
    pages.push(page1, page2);

    // 向左和向右的箭头按钮
    leftArrowBtn = new Button(towerX+towerWidth/24, pageHeight/2+towerWidth/6/2+towerWidth/15, towerWidth/12, towerWidth/6, null, "<");
    rightArrowBtn = new Button(width - towerWidth/12-towerWidth/24, pageHeight/2+towerWidth/6/2+towerWidth/15, towerWidth/12, towerWidth/6, null, ">");
    towerInfoPane = new SlidePane(towerX,pageHeight+towerTipPaneHeight+pageWidth/12,towerWidth,towerHeight/2, towerHeight/2);

    pg = createGraphics(gameWidth, gameHeight); // 创建一个新的图层
    

}

// Load all sounds
function loadSounds() {
    sounds = {};

    // Missile explosion
    sounds.boom = loadSound('sounds/boom.wav');
    sounds.boom.setVolume(0.3);

    // Monster death
    sounds.pop = loadSound('sounds/pop.wav');
    sounds.pop.setVolume(0.4);

    // Railgun
    sounds.railgun = loadSound('sounds/railgun.wav');
    sounds.railgun.setVolume(0.3);

    // Sniper rifle shot
    sounds.sniper = loadSound('sounds/sniper.wav');
    sounds.sniper.setVolume(0.2);

    // Tesla coil
    sounds.spark = loadSound('sounds/spark.wav');
    sounds.spark.setVolume(0.3);

    // Taunt monster death
    sounds.taunt = loadSound('sounds/taunt.wav');
    sounds.taunt.setVolume(0.3);

    bgmStart = loadSound("sounds/Main-Titles.mp3");
    bgmLevel1 = loadSound('sounds/Treasure-Hunt.mp3');
    bgmLevel2 = loadSound('sounds/Fire-Nation.mp3');
    bgmLevel3 = loadSound('sounds/To-the-Ends-of-the-Galaxy-Instrumental.mp3');
    bgmStart.setVolume(0.3);
    bgmLevel1.setVolume(0.3);
    bgmLevel2.setVolume(0.3);
    bgmLevel3.setVolume(0.3);
    
}
