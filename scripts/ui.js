/*
 * 该脚本主要负责实现
 * 游戏状态、游戏进度的UI显示和数据处理逻辑
 * 中间过场动画的显示、下一波敌人的情况显示
 */

let mainMenuCover; // 主菜单封面

let imgLevelButton;
let imgPlayButton;
let imgLeftArrowButton;
let imgRightArrowButton;
let imgStartButton;
let imgReturnButton;
let imgResultVictory;
let imgResultDefeated;
let imgResultStar0;
let imgResultStar1;
let imgResultStar2;
let imgResultStar3;
let imgContinueButton;
let imgRetryButton;
let imgGoBackButton;

let levelMapsImage = []; // 所有关卡地图

// 文本框背景图片：波次、生命值、金钱、剩余怪物数量
let bgTextWave;
let bgTextHealth;
let bgTextCash;
let bgTextMonsterRemainBar;
let bgTextMonsterRemainFill
let iconMonsterAttack;
let iconUpgrade;
let iconUpgradeGrey;


// 按钮：继续、暂停、重置、退出、速度倍率
let btnResume;
let btnPause;
let btnReset;
let btnQuit;
let btnSpeed;

// 敌人缩略图
let thumbBandit;
let thumbBatteringRam;
let thumbPirateRaider;
let thumbMouse;
let thumbDroneSwarm;
let thumbAIMech;

// 字体
let uiFont;
let fontSize = 20;

let speedIdx = 0;           // 当前速度倍率索引
let speedSet = [1, 2, 4];   // 速度倍率选项集

var curWaveMonstersInfo = [];   // 当前波次要生成的怪物情况
var curWaveMonstersNumber;      // 当前波次要生成怪物数量
var showMonsterInfo = [];       // 过场动画显示的怪物信息

// 过场动画可调参数：
let colNum = 1;                        // 列数
let stopTime = 1;                       // 等待时间
let spd = 0.5;                         // 动效速度
let offsetFactor = Math.PI / (colNum * 4);  // 偏移量
let loopTime = 1;                       // 动画循环次数（一般为1次）

// 过场动画私有参数
let angle;
let colWidth;
let isAllowTween;
let isFadeIn;
let isCountingDown;
let countdownTimeMs;
let startTime;
let loopCounter;
let animationEventCallbacks = [];       // 动画结束回调

function preloadUIAssets()
{
    // 读取UI背景图片
    mainMenuCover = loadImage("images/ui/start_cover.png");
    imgPlayButton = loadImage("images/ui/bg_button_play.png");
    imgLeftArrowButton = loadImage("images/ui/bg_button_left_arrow.png");
    imgRightArrowButton = loadImage("images/ui/bg_button_right_arrow.png");
    imgStartButton = loadImage("images/ui/bg_button_start.png");
    imgReturnButton = loadImage("images/ui/bg_button_quit.png");
    imgResultVictory = loadImage("images/ui/bg_result_victory.png");
    imgResultDefeated = loadImage("images/ui/bg_result_defeat.png");
    imgResultStar0 = loadImage("images/ui/result_star_0.png");
    imgResultStar1 = loadImage("images/ui/result_star_1.png");
    imgResultStar2 = loadImage("images/ui/result_star_2.png");
    imgResultStar3 = loadImage("images/ui/result_star_3.png");
    imgContinueButton = loadImage("images/ui/bg_button_continue.png");
    imgRetryButton = loadImage("images/ui/bg_button_retry.png");
    imgGoBackButton = loadImage("images/ui/bg_button_go_back.png");
    

    bgTextHealth = loadImage("images/ui/bg_text_health.png");
    bgTextWave = loadImage("images/ui/bg_text_waves.png");
    bgTextCash = loadImage("images/ui/bg_text_cash.png");
    bgTextMonsterRemainBar = loadImage("images/ui/bg_monster_remain_bar.png");
    bgTextMonsterRemainFill = loadImage("images/ui/bg_monster_remain_fill.png");
    iconMonsterAttack = loadImage("images/ui/icon_attack.png");
    iconUpgrade = loadImage("images/ui/icon_upgrad.png");
    iconUpgradeGrey = loadImage("images/ui/icon_upgrad_grey.png");

    thumbBandit = loadImage("images/thumb/thumb_bandit.png");
    thumbBatteringRam = loadImage("images/thumb/thumb_batteringram.png");
    thumbPirateRaider = loadImage("images/thumb/thumb_pirateraider.png");
    thumbMouse = loadImage("images/thumb/thumb_rat.png");
    thumbDroneSwarm = loadImage("images/thumb/thumb_swarm.png");
    thumbAIMech = loadImage("images/thumb/thumb_ai_mech.png");

    levels.forEach(level => {
        if (level.id === "customMap") levelMapsImage.push(loadImage("images/maps/map_level1.png"));
        else if (level.id === "map2") levelMapsImage.push(loadImage("images/maps/map_level2.png"));
        else if (level.id === "map3") levelMapsImage.push(loadImage("images/maps/map_level3.png"));
    });

    // 加载字体
    uiFont = loadFont('fonts/Savory Curry.ttf');
}

// 游戏初始化时调用
function onGameSetup()
{
    // 初始化ui和过场动画
    uiSetup();
    animationSetup();
    // 添加过场动画回调
    addAnimationEventListener("NextWave", onNextWaveTransitionFinshed)
}

function onGameStart()
{
    btnQuit.show();
    btnReset.show();
    btnResume.show();
    btnPause.show();
    if (paused) btnPause.hide();
    else btnResume.hide();
    btnSpeed.show();
    // 重置加速
    speedIdx = -1; 
    onClickBtnSpeed();
}

function onLevelFinished()
{
    btnQuit.hide();
    btnReset.hide();
    btnResume.hide();
    btnPause.hide();
    btnSpeed.hide();
}

// 当下一波开始前调用
function onBeforeNextwave()
{   
    nextWave();
    // 暂停游戏
    pause();
    console.log("onBeforeNextwave");
    btnPause.attribute('disabled', true);
    btnPause.addClass('disabled');
    DoAnimation();
    // 记录怪物信息
    recordMonsterInfo();
}

// 当转场动画结束调用
function onNextWaveTransitionFinshed()
{
    // 继续游戏
    pause();
    btnPause.removeAttribute('disabled');
    btnPause.removeClass('disabled');
}

// 获取画布在屏幕的位置
function getCanvasInfo() {
    let cnv = document.getElementById("defaultCanvas0");
    if (cnv) {
      let rect = cnv.getBoundingClientRect();
        return {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            width: rect.width,
            height: rect.height
        };
    } else {
      console.error("未找到画布元素");
    }
  }

// UI初始化
function uiSetup()
{
    initMenu();
    // 获取画布位置
    let canvasInfo = getCanvasInfo();

    console.log(canvasInfo);
    widthRatio = ts/110;
    heightRatio =widthRatio;
    pageScale = widthRatio;
    // 重新调整图片大小
    bgTextHealth.resize(190*widthRatio, 50*heightRatio);
    bgTextCash.resize(160*widthRatio, 45*heightRatio);
    bgTextWave.resize(190*widthRatio, 50*heightRatio);

    bgTextMonsterRemainBar.resize(800*widthRatio, 40*heightRatio);
    bgTextMonsterRemainFill.resize(800*widthRatio, 40*heightRatio);
    iconMonsterAttack.resize(60*widthRatio, 60*heightRatio);

    // 创建按钮
    var buttonHeight = canvasInfo.top + 20*heightRatio;

    btnQuit = createButton('');
    btnQuit.position(gameX, buttonHeight);
    btnQuit.size(60*widthRatio,50*heightRatio);
    btnQuit.class('button-quit');

    var btnSize = 50*widthRatio;
    var space = 20*widthRatio;
    //
    btnReset = createButton('');
    btnReset.position(gameWidth - btnSize - space, buttonHeight);
    btnReset.size(btnSize,btnSize);
    btnReset.class('button-reset');

    btnResume = createButton('');
    btnResume.position(btnReset.position().x - btnSize - space, buttonHeight)
    btnResume.size(btnSize,btnSize);
    btnResume.class('button-resume');

    btnPause = createButton('');
    btnPause.position(btnResume.position().x, buttonHeight)
    btnPause.size(btnSize,btnSize);
    btnPause.class('button-pause');

    btnSpeed = createButton("x" + getCurrentSpeed().toString());
    btnSpeed.position(btnPause.position().x - btnSize - space*5, buttonHeight + 5);
    btnSpeed.size(80*widthRatio,40*heightRatio);
    btnSpeed.class('button-speed');
    //
    //
    // // 添加按钮点击事件
    btnResume.mousePressed(onClickBtnResume);
    btnPause.mousePressed(onClickBtnPause);
    btnReset.mousePressed(onClickBtnReset);
    btnQuit.mousePressed(onClickBtnQuit);
    btnSpeed.mousePressed(onClickBtnSpeed);

    // 默认情况隐藏按钮
    onLevelFinished();
}


function onClickBtnResume()
{
    // 原侧边栏按钮的调用事件逻辑在在index.html里
    btnResume.hide();
    btnPause.show();
    pause();
}

function onClickBtnPause()
{
    // 原侧边栏按钮的调用事件逻辑在在index.html里
    btnResume.show();
    btnPause.hide();
    pause();
}

function onClickBtnReset()
{
    // 重玩当前关
    startGame(mapData.id);
}

function onClickBtnQuit()
{
    stopGame();
    setTimeout(() => {
        toggleLevelMenu(true); 
    }, 10);
}

function onClickBtnSpeed()
{
    // 原侧边栏按钮的调用事件逻辑在main.js里
    speedIdx++;
    let spd = getCurrentSpeed();
    monsterSpeedMultiplier = spd;
    btnSpeed.html("x" + spd.toString());
}

function updateGameStateUI() 
{
    // 如果暂停绘制暂停画面
    if (paused && !isAllowTween)
    {
        fill(0, 90);
        rect(0, 0, width, height);
        fill(255);
        textSize(50);
        text("II PAUSE", width / 2, height / 2);
    }

    // 刷新游戏状态UI
    var displayWave = wave > totalWaves ? totalWaves : wave;
    var waveText = 'Wave: ' + displayWave + ' / ' + totalWaves;
    var healthText = 'H: ' + health + ' / ' + maxHealth;
    var cashText = '$: ' + cash;

    setFont();

    var space = 50*pageScale;
    var cashXPos = width / 2 - 160*widthRatio / 2;
    var healthXPos = cashXPos*widthRatio - space*widthRatio  - 190*widthRatio;
    var waveXPos = cashXPos*widthRatio + bgTextCash.width + space;
    var ypos = 20*heightRatio;
    var textYOffest = 34*heightRatio;


    let startX = width*0.08;

    imageMode(CORNER);
    // image(bgTextHealth, healthXPos, ypos,190*widthRatio,50*heightRatio);
    // text(healthText, healthXPos + 110*widthRatio, ypos + textYOffest);
    image(bgTextHealth, startX, ypos,190*widthRatio,50*heightRatio);
    text(healthText, startX + 110*widthRatio, ypos + textYOffest);


    let startX2 = width*0.08+190*widthRatio +width*0.01;
    image(bgTextCash,startX2, ypos + 3*heightRatio,160*widthRatio,45*heightRatio);
    text(cashText, startX2 + 90*widthRatio, ypos + textYOffest);

    // image(bgTextCash, cashXPos*widthRatio, ypos + 3*heightRatio,160*widthRatio,45*heightRatio);
    // text(cashText, cashXPos*widthRatio + 90*widthRatio, ypos + textYOffest);

    let startX3 = width*0.08+190*widthRatio +width*0.01+160*widthRatio+width*0.01;
    image(bgTextWave, startX3, ypos,190*widthRatio,50*heightRatio);
    text(waveText, startX3 + 115*widthRatio, ypos + textYOffest);

}


function updateMonsterStateUI()
{
    imageMode(CORNER);
    // 刷新剩余敌人UI
    setFont();
    var totalMonster = curWaveMonstersNumber;
    var ratio = newMonsters.length > 0 && totalMonster > 0
        ? float(newMonsters.length) / float(totalMonster)
        : 0.01;
    var fillWidth = lerp(0, 800*widthRatio, ratio);

    var xpos = gameWidth / 2 - 800*widthRatio / 2;
    var ypos = height - bgTextMonsterRemainBar.height - 30*heightRatio;



    image(bgTextMonsterRemainBar, xpos, ypos,800*widthRatio, 40*heightRatio);
    image(bgTextMonsterRemainFill, xpos, ypos, fillWidth, 40*heightRatio);
    image(iconMonsterAttack, xpos - 20, ypos-10,60*widthRatio, 60*heightRatio);
    var monsterRemain = newMonsters.length;
    text("Remaining enemies: "+ monsterRemain, gameWidth/2, ypos + 28*heightRatio);
}

function setFont()
{
    textFont(uiFont);
    textSize(fontSize*widthRatio);
    strokeWeight(4*widthRatio);
    stroke(0);
    fill(255);
    textAlign(CENTER, BASELINE);
}

function getCurrentSpeed()
{
    return speedSet[speedIdx % speedSet.length];
}

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


function DoAnimation() 
{
    loopCounter = 0;
    isAllowTween = true;
}

function addAnimationEventListener(eventId, callback) 
{
    if (!animationEventCallbacks[eventId]) 
    {
        animationEventCallbacks[eventId] = [];
    }
    animationEventCallbacks[eventId].push(callback);
}
function removeAnimationEventListener(eventId)
{
    if (!animationEventCallbacks[eventId]) return;
    animationEventCallbacks[eventId] = animationEventCallbacks[eventId].filter(cb => cb !== callback);
    if (animationEventCallbacks[eventId].length === 0) {
        delete animationEventCallbacks[eventId];
    }
}
  
function triggerAnimationEvent() 
{
    // 遍历并触发所有事件的回调
    for (let event in animationEventCallbacks) 
    {
        animationEventCallbacks[event].forEach(callback => callback());
    }
}

function animationSetup() 
{
    angle = 0;
    colWidth = gameWidth / colNum;
    isAllowTween = false;
    isFadeIn = true;
    isCountingDown = false;
    countdownTimeMs = stopTime * 1000;
    loopCounter = 0;
    noStroke();
}

function animationDraw()
{
    if (!isAllowTween) return;
    //background(255);

    // 如果正在倒数中，则不刷新动画
    if (isCountingDown) 
    {
        let elapsedTime = millis() - startTime;
        let remainingTime = countdownTimeMs - elapsedTime;
        if (remainingTime <= 0) {
            isCountingDown = false;
            remainingTime = 0;
        }
        if (!isFadeIn) {
            fill(0);
            rect(0, 0, gameWidth, height);
        }
        onCountingDown(remainingTime / 1000);
        return;
    } 
    else 
    {
        let minimum = isFadeIn ? -colNum * offsetFactor : 0;
        let dir = isFadeIn ? -1.0 : 1.0;

        for (let i = 0; i < colNum; i++) 
        {
            let toAngle = angle + i * offsetFactor * dir;
            toAngle = constrain(toAngle, minimum, Math.PI / 2);
            let colHeight = Math.sin(toAngle) * height;
            let xpos = i * colWidth;
            let ypos = i % 2 === 0 ? 0 : height - colHeight;
            fill(0);
            rect(xpos, ypos, colWidth, colHeight);

            // 判断最后一个柱子是否完成，是的话开始计时
            if (i === colNum - 1) 
            {
                if (isFadeIn && height - colHeight < 0.01 || !isFadeIn && colHeight - 0.01 < 0) 
                {
                    // 切换状态
                    isFadeIn = !isFadeIn;
                    angle = isFadeIn ? 0 : Math.PI / 2;

                    // 检查超过播放次数
                    loopCounter++;
                    if (loopCounter >= loopTime * 2) 
                    {
                        isAllowTween = false;
                        triggerAnimationEvent();    // 触发回调
                    }
                    // 没有的话计时
                    else 
                    {
                        startTime = millis();  // 记录倒计时开始的时间
                        isCountingDown = true;
                    }
                }
            }
        }

        angle -= spd * dir;
    }
}

function onCountingDown(remainingTime)
{
    
    fill(255);
    
    // 显示倒计时
    var msg = "Next wave will arrive in " + remainingTime.toFixed(0) + "s";
    textSize(36);
    textAlign(LEFT, BASELINE);
    text(msg, gameWidth / 2 - 275, height / 2 - 50);

    // 显示敌人信息
    if (showMonsterInfo.length <= 0) return;

    var monsterNumber = showMonsterInfo.length / 2;
    var size = 80;
    var space = 20;
    var ypos = 400;
    var startXpos = gameWidth / 2 - monsterNumber / 2 * size - space;
    
    for (var i = 0; i < monsterNumber; i++)
    {
        var name = showMonsterInfo[i*2];
        var count = showMonsterInfo[i*2 + 1];

        var xpos = startXpos + i * size + (i - 1) * space;
        var img = getMonsterImage(name);
        if (img != null)
        {
            image(img, xpos, ypos, size, size);
        }
        else
        {
            textSize(10);
            textAlign(CENTER, CENTER);
            text(name, xpos + size/2, ypos + size/2);
        }
        textSize(20);
        textAlign(CENTER, BASELINE);
        text(count.toString(), xpos + size/2, ypos + size + 10);
    }
}

function calculateMonsterTotalNumber()
{
    var tmpTotal = 0;
    for (var i = 0; i < curWaveMonstersInfo.length; i++) 
    {
        var subArray = curWaveMonstersInfo[i];
        var count = subArray[subArray.length - 1];
        for(var j = 0; j < subArray.length - 1; j++)
        {
            tmpTotal += count;
        }
    }
    curWaveMonstersNumber = tmpTotal;
}


function recordMonsterInfo()
{
    //curWaveMonstersInfo： ['aaa', 12], ['bbb', 43],['ccc', 58]
    showMonsterInfo = [];
    for (var i = 0; i < curWaveMonstersInfo.length; i++) 
    {
        var subArray = curWaveMonstersInfo[i];
        var count = subArray[subArray.length - 1];
        for(var j = 0; j < subArray.length - 1; j++)
        {
            var monsterName = subArray[j];
            showMonsterInfo.push(monsterName);
            showMonsterInfo.push(count);
        }
    }
}

function getMonsterImage(name)
{
    if (name == "Bandit") return thumbBandit;
    else if (name == "BatteringRam") return thumbBatteringRam;
    else if (name == "Mouse") return thumbMouse;
    else if (name == "PirateRaider") return thumbPirateRaider;
    else if (name == "DroneSwarm") return thumbDroneSwarm;
    else if (name == "AIMech") return thumbAIMech;

    return null;
}
function getRatingImage()
{
    if (resultRating <= 0) return imgResultStar0;
    else if (resultRating > 0 && resultRating <= 1) return imgResultStar1;
    else if (resultRating > 1 && resultRating <= 2) return imgResultStar2;
    else if (resultRating > 2 && resultRating <= 3) return imgResultStar3;
    else return imgResultStar0;
}


let hbAngle = 0;
// 心跳画面效果
function drawHeartbeatEffect()
{
    if (paused) return;
    let threshold = maxHealth / 2;  // 生命值到一半后开始效果
    if (health > threshold) return;
    let amt = health / threshold;
    
    
    let speed = lerp(0.1, 0.08, amt);     // 速度
    let r = lerp(130, 255, amt);        // 颜色
    let alphaIntensity = lerp(50, 0, amt);
    let alpha = sin(hbAngle) * alphaIntensity;
    let c = color(r, 0, 0, alpha);
    noStroke();
    fill(c)
    rect(0, 0, gameWidth, height);
    
    hbAngle += speed;
}
let redFlashAlpha = 0;  // 屏幕红光透明度控制
function drawShakeEffect() {
    if (prevHealth != health) {
        shakeAmount = 10;
        redFlashAlpha = 150;
    }

    if (shakeAmount > 0) {
        let offsetX = random(-shakeAmount, shakeAmount);
        let offsetY = random(-shakeAmount, shakeAmount);
        translate(offsetX, offsetY);
        shakeAmount -= 0.5;
    }

    prevHealth = health;
}
function drawRedFlashOverlay() {
    if (redFlashAlpha > 0) {
        push();
        resetMatrix();  // 重置所有 translate / scale 等，画到原始屏幕坐标
        noStroke();
        fill(255, 0, 0, redFlashAlpha);
        rect(0, 0, width, height);
        redFlashAlpha -= 10;  // 渐隐
        pop();
    }
}