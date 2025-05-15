/*
* This script is mainly responsible for implementing
* Game status, game progress UI display and data processing logic
* Display of intermediate cutscenes and the next wave of enemies
*/

let mainMenuCover; // Main menu cover

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

let levelMapsImage = []; // All level maps

// Text box background image: waves, health, money, remaining number of monsters

let bgTextWave;
let bgTextHealth;
let bgTextCash;
let bgTextMonsterRemainBar;
let bgTextMonsterRemainFill
let iconMonsterAttack;
let iconUpgrade;
let iconUpgradeGrey;

// Buttons: Continue, Pause, Reset, Exit, Speed ​​Multiplier
let btnResume;
let btnPause;
let btnReset;
let btnQuit;
let btnSpeed;
let btn_bearkGuide;

// Enemy thumbnail
let thumbBandit;
let thumbBatteringRam;
let thumbPirateRaider;
let thumbMouse;
let thumbDroneSwarm;
let thumbAIMech;

// Font
let uiFont;
let fontSize = 20;

let speedIdx = 0; // Current speed multiplier index
let speedSet = [1, 2, 4]; // Speed ​​multiplier option set

var curWaveMonstersInfo = []; // The current wave of monsters to be generated
var curWaveMonstersNumber; // The current wave of monsters to be generated
var showMonsterInfo = []; // Monster information displayed in the cutscene

// Adjustable parameters for cutscenes:
let colNum = 1; // Number of columns
let stopTime = 1; // Waiting time
let spd = 0.5; // Animation speed
let offsetFactor = Math.PI / (colNum * 4); // Offset
let loopTime = 1; // Number of animation loops (usually 1 time)

// Private parameters for cutscenes
let angle;
let colWidth;
let isAllowTween;
let isFadeIn;
let isCountingDown;
let countdownTimeMs;
let startTime;
let loopCounter;
let animationEventCallbacks = []; // Animation end callback

function preloadUIAssets()
{
//Read UI background image
    mainMenuCover = loadImage("images/ui/start_cover2.png");
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
    bgTextWave= loadImage("images/ui/bg_text_waves.png");
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

// Load font
    uiFont = loadFont('fonts/Savory Curry.ttf');
}

// Called when the game is initialized
function onGameSetup()
{
// Initialize UI and cutscenes
    uiSetup();
    animationSetup();
// Add cutscene callbacks
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

// Reset acceleration
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
// Called before the next wave starts
function onBeforeNextwave()
{
    nextWave();
// Pause the game
    pause();
    console.log("onBeforeNextwave");
    btnPause.attribute('disabled', true);
    btnPause.addClass('disabled');
    DoAnimation();
// Record monster information
    recordMonsterInfo();
}

// Called when the transition animation ends
function onNextWaveTransitionFinshed()
{
// Continue the game
    pause();
    btnPause.removeAttribute('disabled');
    btnPause.removeClass('disabled');
}

// Get the position of the canvas on the screen
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
        console.error("Canvas element not found");
    }
}

// UI initialization
function uiSetup()
{
    initMenu();
// Get canvas position
    let canvasInfo = getCanvasInfo();

    console.log(canvasInfo);
    widthRatio = ts/110;

    heightRatio =widthRatio;

    pageScale = widthRatio;
// Resize the image
    bgTextHealth.resize(190*widthRatio, 50*heightRatio);
    bgTextCash.resize(160*widthRatio, 45*heightRatio);
    bgTextWave.resize(190*widthRatio, 50*heightRatio);

    bgTextMonsterRemainBar.resize(800*widthRatio, 40*heightRatio);
    bgTextMonsterRemainFill.resize(800*widthRatio, 40*heightRatio);
    iconMonsterAttack.resize(60*widthRatio, 60*heightRatio);

//Create button
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

// // Add button click event

    btnResume.mousePressed(onClickBtnResume);
    btnPause.mousePressed(onClickBtnPause);
    btnReset.mousePressed(onClickBtnReset);
    btnQuit.mousePressed(onClickBtnQuit);
    btnSpeed.mousePressed(onClickBtnSpeed);

// Hide button by default
    onLevelFinished();
}

function onClickBtnResume()
{
    if(showGuideScrren){
        return;
    }
// The original sidebar button call event logic is in index.html
    btnResume.hide();
    btnPause.show();
    pause();
}

function onClickBtnPause()
{
    if(showGuideScrren){
        return;
    }
// The original sidebar button call event logic is in index.html
    btnResume.show();
    btnPause.hide();
    pause();
}
function onClickBtnReset()
{
    if(showGuideScrren){
        return;
    }
// Replay the current level
    startGame(mapData.id);
}

function onClickBtnQuit()
{
    stopGame();
    setTimeout(() => {
        toggleLevelMenu(true);
        showGuideScrren=false;
    }, 10);
}

function onClickBtnSpeed()
{
// The original sidebar button call event logic is in main.js
    speedIdx++;
    let spd = getCurrentSpeed();
    monsterSpeedMultiplier = spd;
    btnSpeed.html("x" + spd.toString());
}

function updateGameStateUI()

{

// If the pause screen is paused && it is not the guide screen
// if (paused && !isAllowTween)
    if (paused && !isAllowTween&&!showGuideScrren)
    {
        fill(0, 90);
        rect(0, 0, width, height);
        fill(255);
        textSize(gameWidth/20);

        text("II PAUSE", gameX+gameWidth / 2, gameY+gameHeight / 2);
    }

// Refresh game status UI
    var displayWave = wave > totalWaves ? totalWaves : wave;
    var waveText = 'Wave: ' + displayWave + ' / ' + totalWaves;
    var healthText = 'H: ' + health + ' / ' + maxHealth;
    var cashText = '$: ' + cash;

    setFont();

    var space = 50*pageScale;
    var cashXPos = width / 2 - 160*widthRatio / 2;
    var healthXPos = cashXPos*widthRatio - space*widthRatio - 190*widthRatio;
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
// Refresh the remaining enemy UI
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

// 0=start, 1=path, 2=cannot place tower, 3=tower can be placed, 4=end point
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
                    msg = "tower cannot be placed";
                    break;
                case 3:
                    c = color(255, 255, 73);
                    msg = "tower can be placed";
                    break;
                case 4:
                    c = color(255, 165, 0);
                    msg = "end point";
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
// Traverse and trigger callbacks for all events
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
    if (!isAllowTween) return; //background(255);

// If the countdown is in progress, the animation will not be refreshed
    if(isCountingDown)
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

// Check if the last column is completed, if so, start timing
            if (i === colNum - 1)
            {
                if (isFadeIn && height - colHeight < 0.01 || !isFadeIn && colHeight - 0.01 < 0)
                {
// Switch state
                    isFadeIn = !isFadeIn;
                    angle = isFadeIn ? 0 : Math.PI / 2;

// Check if the number of playbacks has exceeded
                    loopCounter++;
                    if (loopCounter >= loopTime * 2)
                    {
                        isAllowTween = false;
                        triggerAnimationEvent(); // trigger callback
                    }
// if not, count down
                    else
                    {
                        startTime = millis(); // record the time when the countdown starts
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

// Display countdown
    var msg = "Next wave will arrive in " + remainingTime.toFixed(0) + "s";
    textSize(36);
    textAlign(LEFT, BASELINE);
    text(msg, gameWidth / 2 - 275, height / 2 - 50);

//Display enemy information
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
//curWaveMonstersInfo: ['aaa', 12], ['bbb', 43], ['ccc', 58]
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
// Heartbeat screen effect
function drawHeartbeatEffect()
{
    if (paused) return;
    let threshold = maxHealth / 2; // Effect starts after half of health value
    if (health > threshold) return;
    let amt = health / threshold;

    let speed = lerp(0.1, 0.08, amt); // Speed
    let r = lerp(130, 255, amt); // Color
    let alphaIntensity = lerp(50, 0, amt);
    let alpha = sin(hbAngle) * alphaIntensity;
    let c = color(r, 0, 0, alpha);
    noStroke();
    fill(c)
    rect(0, 0, gameWidth, height);

    hbAngle += speed;
}
let redFlashAlpha = 0; // Screen red light transparency control
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
        resetMatrix(); // Reset all translate/scale, etc., and draw to the original screen coordinates
        noStroke();
        fill(255, 0, 0, redFlashAlpha);
        rect(0, 0, width, height);
        redFlashAlpha -= 10; // Fade
        pop();
    }
}