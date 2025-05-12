let showMainMenu = true;        // 是否显示主菜单
let showLevelMenu = false;      // 是否显示关卡菜单
let showVictoryMenu = false;    // 是否显示胜利结算页面
let showDefeatedMenu = false;   // 是否显示失败结算页面

let mainMenuButtons = [];
let levelMenuButtons = [];
let victoryMenuButtons = [];
let defeatedMenuButtons = [];

let levelSelectedIndex = 0;
let levelMapRowCurXpos = 0;
let levelMapRowTargetXpos = 0;

let btnPlay;
let btnLeft;
let btnRight
let btnStart;
let btnReturn;
let btnContinue;
let btnRetry;
let btnGoBackForV;
let btnGoBackForD;

function initMenu()
{
    // 主菜单的按钮初始化
    btnPlay = new MenuButton(gameWidth / 2 - 100, height - 300, 400, 160, imgPlayButton, "PLAY", color(255), onPlayButtonClicked);
    btnPlay.setTextSize(50);
    mainMenuButtons.push(btnPlay);

    // 关卡页面的按钮初始化
    levelSelectedIndex = 0;
    let space = 50;
    btnLeft = new MenuButton(space, height / 2 - 75, 75, 150, imgLeftArrowButton, "LEFT", color(255), onLeftArrowButtonClicked);
    btnRight = new MenuButton(gameWidth - space - 75, height / 2 - 75, 75, 150, imgRightArrowButton, "RIGHT", color(255), onRightArrowButtonClicked);
    btnStart = new MenuButton(gameWidth / 2 - 100, height - 250, 300, 150, imgStartButton, "START", color(255), onStartButtonClicked);
    btnReturn = new MenuButton(0, 20, 60, 50, imgReturnButton, "RETURN", color(255), onReturnButtonClicked);
    btnStart.setTextSize(50);
   
    btnStart.pulseSpeed = 0.08;
    btnStart.glowDirection = 1.5;
    levelMenuButtons.push(btnLeft);
    levelMenuButtons.push(btnRight);
    levelMenuButtons.push(btnStart);
    levelMenuButtons.push(btnReturn);

    // 胜利结算页面按钮初始化
    btnContinue = new MenuButton(gameWidth / 2 - 100, height - 250, 200, 80, imgContinueButton, "CONTINUE", color(255), onContinueButtonClicked);
    btnGoBackForV = new MenuButton(gameWidth / 2 - 100, height - 150, 200, 80, imgGoBackButton, "RETURN", color(255), onGoBackButtonClicked);
    btnContinue.setTextSize(30);
    btnGoBackForV.setTextSize(30);
    victoryMenuButtons.push(btnContinue);
    victoryMenuButtons.push(btnGoBackForV);
    // 失败结算页面按钮初始化
    btnRetry = new MenuButton(gameWidth / 2 - 100, height - 250, 200, 80, imgRetryButton, "RETRY", color(255), onRetryButtonClicked);
    btnGoBackForD = new MenuButton(gameWidth / 2 - 100, height - 150, 200, 80, imgGoBackButton, "RETURN", color(255), onGoBackButtonClicked);
    btnRetry.setTextSize(30);
    btnGoBackForD.setTextSize(30);
    defeatedMenuButtons.push(btnRetry);
    defeatedMenuButtons.push(btnGoBackForD);
}

function updateMenuDisplay()
{
    drawMainMenu();
    drawLevelMenu();
}

function lateUpdateMenuDisplay()
{
    drawVictoryMenu();
    drawDefeatedMenu();
}

// ========================================= 页面控制 ==========================================

// 开启/关闭：主菜单
function toggleMainMenu(isShow)
{
    showMainMenu = isShow;
    for (let btn of mainMenuButtons) {
        btn.setVisible(isShow);
    }
    if (isShow) playStartBGM();
}
// 开启/关闭：关卡页面
function toggleLevelMenu(isShow)
{
    showLevelMenu = isShow;
    for (let btn of levelMenuButtons) {
        btn.setVisible(isShow);
    }
    if (isShow)
    {
        checkLeftRightArrow();
        playStartBGM();
    }
    else
    {
        levelSelectedIndex = 0;
        levelMapRowCurXpos = 0;
        levelMapRowTargetXpos = 0;
    }
}

// 开启/关闭：胜利结果页
function toggleVictoryMenu(isShow)
{
    showVictoryMenu = isShow;
    for (let btn of victoryMenuButtons) {
        btn.setVisible(isShow);
    }
}

// 开启/关闭：失败结果页
function toggleDefeatedMenu(isShow)
{
    showDefeatedMenu = isShow;
    for (let btn of defeatedMenuButtons) {
        btn.setVisible(isShow);
    }
}

// 开启结算页面
function openResultMenu(isSurvival)
{
    console.log(`isSurvival:${isSurvival}`);
    if (isSurvival)
    {
        toggleVictoryMenu(true);
        toggleDefeatedMenu(false);
        // 是否完成了最后一关，是的话不显示继续按钮
        if (mapData.id === levels[levels.length - 1].id) {
            btnContinue.setVisible(false);
        }
        else {
            btnContinue.setVisible(true);
        }
        btnGoBackForV.setVisible(true);
    }
    else
    {
        toggleDefeatedMenu(true);
        toggleVictoryMenu(false);
    }
}

let coverZoom = 1.0;          // 封面当前缩放值
let targetZoom = 1.02;        // 目标缩放值 
let zoomDirection = 0.0002;   // 缩放变化步长
const ZOOM_RANGE = 0.03;      // 最大缩放幅度
// ========================================= 页面绘制 ==========================================

// 绘制：主菜单
function drawMainMenu() {
    if (!showMainMenu) return;
    
    // 更新缩放值（产生呼吸效果）
    updateCoverZoom();
    
    // 计算缩放后的尺寸和偏移（保持居中）
    let scaledWidth = width * coverZoom;
    let scaledHeight = height * coverZoom;
    let offsetX = (width - scaledWidth) / 2;
    let offsetY = (height - scaledHeight) / 2;
    
    // 绘制动态封面
    image(mainMenuCover, offsetX, offsetY, scaledWidth, scaledHeight);

    // 绘制按钮（不受封面缩放影响）
    for (let btn of mainMenuButtons) {
        btn.draw();
    }
}
function updateCoverZoom() {
    coverZoom += zoomDirection;
    
    // 到达边界时反转方向
    if (coverZoom > 1 + ZOOM_RANGE || coverZoom < 1 - ZOOM_RANGE/2) {
        zoomDirection *= -1;
    }
}
// 绘制：关卡页面
function drawLevelMenu()
{
    if (!showLevelMenu) return;
    background(0);
    // 绘制背景
    imageMode(CORNER);
    levelMapRowCurXpos = lerp(levelMapRowCurXpos, levelMapRowTargetXpos, 0.1);
    for (var i = 0; i < levelMapsImage.length; i++)
    {
        var x = levelMapRowCurXpos + i * width;
        var img = levelMapsImage[i];


            image(img, x, 0, width, height);


    }
    
    noStroke();
    fill(0, 70);
    rect(0, 0, width, height);

    // 绘制地图名称
    var levelName = levels[levelSelectedIndex].name;

    stroke(0);
    strokeWeight(8);
    fill(255);
    textFont(uiFont);
    textAlign(CENTER, CENTER);
    textSize(80*widthRatio);
    text(levelName, width / 2, height / 2 + 150*heightRatio);
    
    // 绘制按钮
    for (let btn of levelMenuButtons) {
        btn.draw();
    }
    //遮住地圖连接画面
    // fill(0);
    // rect(gameWidth,0,windowWidth,gameHeight);
}

// 绘制胜利结算页面
function drawVictoryMenu()
{
    if (!showVictoryMenu) return;

    // 背景
    noStroke();
    fill(0, 80);
    rect(0, 0, gameWidth, height);

    // 图标
    imageMode(CENTER);
    let scale = 0.5;
    image(imgResultVictory, gameWidth/2, height/2, imgResultVictory.gameWidth * scale, imgResultVictory.height * scale);
    // 评分
    let ratingImg = getRatingImage();
    image(ratingImg, gameWidth/2, height/2 - 200, ratingImg.gameWidth * scale, ratingImg.height * scale);
    
    // 绘制按钮
    for (let btn of victoryMenuButtons) {
        btn.draw();
    }
}

function drawDefeatedMenu()
{
    if (!showDefeatedMenu) return;

    // 背景
    noStroke();
    fill(0, 80);
    rect(0, 0, gameWidth, height);

    // 图标
    imageMode(CENTER);
    let scale = 0.5;
    image(imgResultDefeated, gameWidth/2, height/2, imgResultDefeated.gameWidth * scale, imgResultDefeated.height * scale);
    // 评分
    let ratingImg = getRatingImage();
    image(ratingImg, gameWidth/2, height/2 - 200, ratingImg.gameWidth * scale, ratingImg.height * scale);

    for (let btn of defeatedMenuButtons) {
        btn.draw();
    }
}

// ========================================= 按钮交互检测 ==========================================

function menuButtonPressed()
{
    if (showMainMenu) {
        for (let btn of mainMenuButtons) {
            if(btn) btn.press();
        }
    }
    if (showLevelMenu) {
        for (let btn of levelMenuButtons) {
            if(btn) btn.press();
        }
    }
    if (showVictoryMenu) {
        for (let btn of victoryMenuButtons) {
            if(btn) btn.press();
        }
    }
    if (showDefeatedMenu) {
        for (let btn of defeatedMenuButtons) {
            if(btn) btn.press();
        }
    }
}

function menuButtonReleased()
{
    if (showMainMenu) {
        for (let btn of mainMenuButtons) {
            if(btn) btn.release();
        }
    }
    if (showLevelMenu) {
        for (let btn of levelMenuButtons) {
            if(btn) btn.release();
        }
    }
    if (showVictoryMenu) {
        for (let btn of victoryMenuButtons) {
            if(btn) btn.release();
        }
    }
    if (showDefeatedMenu) {
        for (let btn of defeatedMenuButtons) {
            if(btn) btn.release();
        }
    }
}

// ========================================= 按钮点击 ==========================================

function onPlayButtonClicked()
{
    toggleLevelMenu(true); 
    toggleMainMenu(false);
}

function onLeftArrowButtonClicked()
{
    levelSelectedIndex--;
    checkLeftRightArrow();
    if (levelSelectedIndex < 0) {
        levelSelectedIndex = levels.length - 1;
        levelMapRowTargetXpos = - width * (levels.length - 1);
    }
    else
    {
        levelMapRowTargetXpos += width;
    }
}

function onRightArrowButtonClicked()
{
    levelSelectedIndex++;
    checkLeftRightArrow();
    if (levelSelectedIndex >= levels.length) {
        levelSelectedIndex = 0;
        levelMapRowTargetXpos = 0;
    }
    else
    {
        levelMapRowTargetXpos -= width;
    }
    
}

function checkLeftRightArrow()
{
    btnLeft.setVisible(levelSelectedIndex > 0);
    btnRight.setVisible(levelSelectedIndex < levels.length - 1);
}

function onStartButtonClicked()
{
    let id = levels[levelSelectedIndex].id;
    console.log(`选择地图开始${id}`);
    startGame(id);
    toggleLevelMenu(false);
}

function onReturnButtonClicked()
{
    toggleMainMenu(true);
    toggleLevelMenu(false); 
}

function onContinueButtonClicked()
{
    // 下一关
    let nextMapIndex;
    for (let i = 0; i < levels.length; i++)
    {
        if (mapData.id === levels[i].id) {
            nextMapIndex = i + 1;
            break;
        }
    }
    if (nextMapIndex < levels.length) {
        let nextMapId = levels[nextMapIndex].id;
        console.log(`继续下一关${nextMapId}`);
        startGame(nextMapId);
    }
    toggleVictoryMenu(false);
}

function onGoBackButtonClicked()
{
    toggleVictoryMenu(false);
    toggleDefeatedMenu(false);
    toggleLevelMenu(true); 
    stopGame();
}

function onRetryButtonClicked()
{
    // 重玩当前关
    startGame(mapData.id);
    toggleDefeatedMenu(false);
}



// 菜单按钮类
class MenuButton {
    constructor(x, y, w, h, bg, label, c, callback) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.bg = bg;
        this.label = label;
        this.labelColor = c;
        this.callback = callback;
        this.isVisible = true;
        this.isHovered = false;
        this.isPressed = false;
        this.isDisabled = false;

        this.tarWidth = 0;
        this.tarHeight = 0;
        this.tarFontSize = 0;
        this.fontSize = 20;
        this.pulseSize = 0;
        this.pulseSpeed = 0.05;
        this.glowAlpha = 0;
        this.glowDirection = 1;
        this.effectSize = 0; // 统一效果尺寸
    }
     // 更新动态效果
    updateEffects() {
        // 脉冲效果
        this.pulseSize = sin(frameCount * this.pulseSpeed) * this.pulseMax;
        
        // 光晕呼吸效果
        this.glowAlpha += this.glowDirection * this.glowSpeed;
        if (this.glowAlpha > this.glowMax || this.glowAlpha < 0) {
        this.glowDirection *= -1;
        }
        
        this.lastUpdate = millis();
    }
    // 更新动态效果
    updateDynamicEffects() {
        // 脉冲效果
        this.pulseSize = sin(frameCount * this.pulseSpeed) * 10;
        
        // 光晕呼吸效果
        this.glowAlpha += this.glowDirection * 2;
        if (this.glowAlpha > 100 || this.glowAlpha < 0) {
          this.glowDirection *= -1;
        }
        
        // 综合效果尺寸（用于统一调整）
        this.effectSize = this.pulseSize * (this.isMouseOver() ? 1.5 : 1);
      }
    setVisible(isShow) {
        this.isVisible = isShow;
    }

    setDisabled(state) {
      this.isDisabled = state;
    }
  
    setTextSize(size) {
        this.fontSize = size;
    }

    // 检测鼠标是否在按钮内
    isMouseOver() {
      return mouseX > this.x-this.tarWidth/2 && mouseX < this.x + this.tarWidth/2 &&
             mouseY > this.y-this.tarHeight/2 && mouseY < this.y + this.tarHeight/2;
    }
  
    
    // 渲染按钮
  // 渲染按钮
    draw() {
        if (!this.isVisible) return;
        push();
        this.updateDynamicEffects(); // 更新效果
        const { imgOffset, textOffset } = this.calculateButtonOffsets();
        this.updateButtonSize(imgOffset, textOffset);
         
        if (this.label === "START") {
            this.drawStartButtonEffects();
        }
        if (["PLAY", "START"].includes(this.label)) {
            this.drawCenterButton(imgOffset, textOffset);
        } 
        else if (this.label === "RIGHT") {
            this.drawRightButton(imgOffset);
        }
        else if (this.label === "LEFT") {
            this.drawLeftButton(imgOffset);
        }
        else if (this.label === "RETURN") {
            this.drawReturnButton(imgOffset);
        }
        
        pop();
    }

    drawStartButtonEffects() {
        // 矩形光晕效果
        noStroke();
        fill(255, 215, 0, this.glowAlpha); // 金色半透明
        
        // 绘制圆角矩形光晕（匹配按钮形状）
        rectMode(CENTER);
        let glowWidth = this.w + this.effectSize * 2-60;
        let glowHeight = this.h + this.effectSize * 2-30;
        let cornerRadius = 15 + this.effectSize/2; // 圆角随效果变大
        
          // 修改这行（添加偏移量）
        const xOffset = -90; // 往左偏移5像素
        const yOffset = -40; // 往上偏移5像素
        
        // 主光晕（添加偏移）
        rect(this.x + this.w/2 + xOffset, this.y + this.h/2 + yOffset, 
            glowWidth, glowHeight, cornerRadius);
        
        // 高光光晕（同样添加偏移）
        rect(this.x + this.w/2 + xOffset, this.y + this.h/2 + yOffset, 
            glowWidth * 0.9, glowHeight * 0.9, cornerRadius * 0.9);

        // 调整按钮尺寸以包含动态效果
        this.tarWidth += this.effectSize;
        this.tarHeight += this.effectSize;
        this.tarFontSize += this.effectSize / 3;
    }
    // 计算按钮偏移量
    calculateButtonOffsets() {
        let imgOffset = 0;
        let textOffset = 0;
        
        if (this.isPressed) {
            imgOffset = -5;
            textOffset = -this.fontSize / 6;
        } 
        else if (this.isMouseOver()) {
            imgOffset = 5;
            textOffset = this.fontSize / 6;
        }
        
        return { imgOffset, textOffset };
    }

    // 更新按钮尺寸
    updateButtonSize(imgOffset, textOffset) {
        this.tarWidth = lerp(this.tarWidth, this.w + imgOffset * 2, 0.5);
        this.tarHeight = lerp(this.tarHeight, this.h + imgOffset * 2, 0.5);
        this.tarFontSize = lerp(this.tarFontSize, this.fontSize + textOffset, 0.5);
    }

    // 绘制居中按钮（PLAY/START）
    drawCenterButton(imgOffset, textOffset) {
        this.x = width/2;
        this.y = height/2;
         // 对START按钮应用额外效果
        const extraSize = this.label === "START" ? this.effectSize : 0;
        imageMode(CENTER);
        rectMode(CENTER);
        image(this.bg, this.x, this.y, this.tarWidth*widthRatio, this.tarHeight*widthRatio);

        if (this.label.length === 0) return;
        
        stroke(0);
        strokeWeight(this.tarFontSize / 6 * widthRatio);
        fill(this.labelColor);
        textFont(uiFont);
        textAlign(CENTER, CENTER);
        textSize(this.tarFontSize * widthRatio);
        text(this.label, this.x, this.y);
    }

    // 绘制右侧按钮
    drawRightButton(imgOffset) {
        this.x = width - this.tarWidth * widthRatio;
        this.y = height/2;
        
        imageMode(CENTER);
        image(this.bg, this.x, this.y, this.tarWidth*widthRatio, this.tarHeight*widthRatio);
    }

    // 绘制左侧按钮
    drawLeftButton(imgOffset) {
        this.x = this.tarHeight * widthRatio/2;
        this.y = height/2;
        
        imageMode(CENTER);
        image(this.bg, this.x, this.y, this.tarWidth*widthRatio, this.tarHeight*widthRatio);
    }

    // 绘制返回按钮
    drawReturnButton(imgOffset) {
        this.x = this.tarWidth * widthRatio/2;
        this.y = this.tarHeight * widthRatio;
        
        imageMode(CENTER);
        image(this.bg, this.x, this.y, this.tarWidth*widthRatio, this.tarHeight*widthRatio);
    }
  
    // 按钮按下
    press() {
      if (!this.isVisible || this.isDisabled || !this.isMouseOver()) return;
      this.isPressed = true;
    }
  
    // 按钮抬起，触发回调
    release() {
      if (this.isPressed && !this.isDisabled) {
        this.isPressed = false;
        if (this.isMouseOver()) {
          this.callback();
        }
      }
    }
  }