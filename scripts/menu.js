let showMainMenu = true; // Whether to display the main menu
let showLevelMenu = false; // Whether to display the level menu
let showVictoryMenu = false; // Whether to display the victory settlement page
let showDefeatedMenu = false; // Whether to display the failure settlement page
let showGuideScrren = false;//Show the guide interface
let showDifficultyLevelMenu = false; //Show the difficulty level menu
let guideIndex = 1;
let guideEnd = 10;
let guideFingerX = -500;
let guideFingerY = -500;
let guideAlpha = 0;
let guideAngle = 0;

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

let btnEasy;
let btnNormal;
let btnHard;


function easyLevelClicked() {
    diffcultyLevel = "easy";
    defaultCash = 300;
    defaultHealth = 10;
    totalWaves = 2;

    loadMosterByEasy();
    initGame();
}

function normalLevelClicked() {
    diffcultyLevel = "normal";
    defaultCash = 500;
    defaultHealth = 10;
    totalWaves = 10;
    loadMosterByNormal();
    initGame();
}

function hardButtonClicked() {
    diffcultyLevel = "hard";
    defaultCash = 800;
    defaultHealth = 10;
    totalWaves = 10;
    loadMosterByHard();
    initGame();

}
function OnclickBtnSkipGuide() {
    showGuideScrren=false;
    guideIndex=1;
    paused =false;


}
function initMenu() {
    // Initialize the buttons of the main menu

// Difficulty selection button
    btnEasy = new MenuButton(width / 2, height - 6.9 * ts + ts, 400, 160, imgPlayButton, "EASY", color(255), easyLevelClicked);
    btnEasy.setTextSize(50);
    btnNormal = new MenuButton(width / 2, height - 5.176 * ts + ts, 400, 160, imgPlayButton, "NORMAL", color(255), normalLevelClicked);
    btnNormal.setTextSize(50);
    btnHard = new MenuButton(width / 2, height - 3.54 * ts + ts, 400, 160, imgPlayButton, "Hard", color(255), hardButtonClicked);
    btnHard.setTextSize(50);
    btn_bearkGuide =new  MenuButton(width / 2-125, height - 3.54 * ts+ts*2 , 250, 80, imgPlayButton,"skip the guidance", color(255),OnclickBtnSkipGuide);
    btn_bearkGuide.setTextSize(20);
    btnPlay = new MenuButton(gameWidth / 2 - 100, height - 300, 400, 160, imgPlayButton, "PLAY", color(255), onPlayButtonClicked);
    btnPlay.setTextSize(50);
    mainMenuButtons.push(btnPlay);


    btnPlay = new MenuButton(gameWidth / 2 - 100, height - 300, 400, 160, imgPlayButton, "PLAY", color(255), onPlayButtonClicked);
    btnPlay.setTextSize(50);
    mainMenuButtons.push(btnPlay);

    // Initialize the buttons on the level page
    levelSelectedIndex = 0;
    let space = 50;
    btnLeft = new MenuButton(space, height / 2 - 75, 75, 150, imgLeftArrowButton, "LEFT", color(255), onLeftArrowButtonClicked);
    btnRight = new MenuButton(gameWidth - space - 75, height / 2 - 75, 75, 150, imgRightArrowButton, "RIGHT", color(255), onRightArrowButtonClicked);
    btnStart = new MenuButton(gameWidth / 2 - 100, height - 250, 300, 150, imgStartButton, "START", color(255), onStartButtonClicked);
    btnReturn = new MenuButton(60/2, 20, 60, 50, imgReturnButton, "RETURN", color(255), onReturnButtonClicked);
    btnStart.setTextSize(50);

    btnStart.pulseSpeed = 0.08;
    btnStart.glowDirection = 1.5;
    levelMenuButtons.push(btnLeft);
    levelMenuButtons.push(btnRight);
    levelMenuButtons.push(btnStart);
    levelMenuButtons.push(btnReturn);

// Victory settlement page button initialization
    btnContinue = new MenuButton(gameWidth/2, height - ts*2, 200, 80, imgContinueButton, "CONTINUE", color(255), onContinueButtonClicked);
    btnGoBackForV = new MenuButton(gameWidth/2, height - ts, 200, 80, imgGoBackButton, "Menu", color(255), onGoBackButtonClicked);
    btnContinue.setTextSize(30);
    btnGoBackForV.setTextSize(30);
    victoryMenuButtons.push(btnContinue);
    victoryMenuButtons.push(btnGoBackForV);
    // Failed settlement page button initialization
    btnRetry = new MenuButton(gameWidth/2, height - ts*2, 200, 80, imgRetryButton, "RETRY", color(255), onRetryButtonClicked);
    btnGoBackForD = new MenuButton(gameWidth/2, height - ts, 200, 80, imgGoBackButton, "Menu", color(255), onGoBackButtonClicked);
    btnRetry.setTextSize(30);
    btnGoBackForD.setTextSize(30);
    defeatedMenuButtons.push(btnRetry);
    defeatedMenuButtons.push(btnGoBackForD);
}

function drawDifficultyLevelMenu() {
    if (!showDifficultyLevelMenu) {
        return;
    }
    btnEasy.draw();
    btnHard.draw();
    btnNormal.draw();



}

function updateMenuDisplay() {
    drawMainMenu();
    drawLevelMenu();
    drawDifficultyLevelMenu();


}

function lateUpdateMenuDisplay() {
    drawVictoryMenu();
    drawDefeatedMenu();
}

// ============================================ Page control ===========================================

// Open/Close: Main Menu
function toggleMainMenu(isShow) {
    showDifficultyLevelMenu = false;
    showMainMenu = isShow;
    for (let btn of mainMenuButtons) {
        btn.setVisible(isShow);
    }
    if (isShow) playStartBGM();
}

// Open/Close: Level page
function toggleLevelMenu(isShow) {
    showLevelMenu = isShow;
    for (let btn of levelMenuButtons) {
        btn.setVisible(isShow);
    }
    if (isShow) {
        checkLeftRightArrow();
        playStartBGM();
    } else {
        levelSelectedIndex = 0;
        levelMapRowCurXpos = 0;
        levelMapRowTargetXpos = 0;
    }
}

// Open/Close: Victory result page
function toggleVictoryMenu(isShow) {
    showVictoryMenu = isShow;
    for (let btn of victoryMenuButtons) {
        btn.setVisible(isShow);
    }
}

// Enable/disable: Failure result page
function toggleDefeatedMenu(isShow) {
    showDefeatedMenu = isShow;
    for (let btn of defeatedMenuButtons) {
        btn.setVisible(isShow);
    }
}

function openResultMenu(isSurvival) {
    console.log(`isSurvival:${isSurvival}`);
    if (isSurvival) {
        toggleVictoryMenu(true);
        toggleDefeatedMenu(false);
        // Have you completed the last level? If yes, don't show the continue button.
        if (mapData.id === levels[levels.length - 1].id) {
            btnContinue.setVisible(false);
        } else {
            btnContinue.setVisible(true);
        }
        btnGoBackForV.setVisible(true);
    } else {
        toggleDefeatedMenu(true);
        toggleVictoryMenu(false);
    }
}
let coverZoom = 1.0; // Current zoom value of the cover
let targetZoom = 1.02; // Target zoom value
let zoomDirection = 0.0002; // Zoom change step
const ZOOM_RANGE = 0.03; // Maximum zoom range
// ============================================ Page drawing ===============================================
// Draw: main menu
function drawMainMenu() {
    if (!showMainMenu) return;

    // Update the scale value (to create a breathing effect)
    updateCoverZoom();

// Calculate the scaled size and offset (keep it centered)
    let scaledWidth = width * coverZoom;
    let scaledHeight = height * coverZoom;
    let offsetX = (width - scaledWidth) / 2;
    let offsetY = (height - scaledHeight) / 2;

// Draw dynamic cover
    image(mainMenuCover, offsetX, offsetY, scaledWidth, scaledHeight);

    // Draw the button (not affected by cover scaling)
    for (let btn of mainMenuButtons) {
        btn.draw();
    }
}

function updateCoverZoom() {
    coverZoom += zoomDirection;
// Reverse direction when reaching the boundary
    if (coverZoom > 1 + ZOOM_RANGE || coverZoom < 1 - ZOOM_RANGE / 2) {
        zoomDirection *= -1;
    }
}

// Draw: Level page
function drawLevelMenu() {
    if (!showLevelMenu) return;
    background(0);
    imageMode(CORNER);
    levelMapRowCurXpos = lerp(levelMapRowCurXpos, levelMapRowTargetXpos, 0.1);
    for (var i = 0; i < levelMapsImage.length; i++) {
        var x = levelMapRowCurXpos + i * width;
        var img = levelMapsImage[i];


        image(img, x, 0, width, height);


    }

    noStroke();
    fill(0, 70);
    rect(0, 0, width, height);


    var levelName = levels[levelSelectedIndex].name;

    stroke(0);
    strokeWeight(8);
    fill(255);
    textFont(uiFont);
    textAlign(CENTER, CENTER);
    textSize(80 * widthRatio);
    let text_width = textWidth(levelName);
    text(levelName, width / 2, height / 2 + 300 * heightRatio);


    for (let btn of levelMenuButtons) {
        btn.draw();
    }

}

function drawVictoryMenu() {
    if (!showVictoryMenu) return;


    noStroke();
    fill(0, 80);
    rect(0, 0, gameWidth, height);


    imageMode(CENTER);

    image(imgResultVictory, gameWidth / 2, gameHeight / 2,imgResultVictory.width*widthRatio*0.5,imgResultVictory.height*widthRatio*0.5);

    let ratingImg = getRatingImage();
    image(ratingImg, gameWidth / 2, gameHeight/ 2 -200*widthRatio, ratingImg.width * widthRatio*0.5, ratingImg.height * widthRatio*0.5);


    for (let btn of victoryMenuButtons) {
        btn.draw();
    }
}

function drawDefeatedMenu() {
    if (!showDefeatedMenu) return;


    noStroke();
    fill(0, 80);
    rect(0, 0, gameWidth, height);


    imageMode(CENTER);
    let scale = 0.5;

    image(imgResultDefeated, gameWidth / 2, gameHeight / 2,imgResultVictory.width*widthRatio*0.5,imgResultVictory.height*widthRatio*0.5);
    // Rating
    let ratingImg = getRatingImage();
    image(ratingImg, gameWidth / 2, gameHeight/ 2 -200*widthRatio, ratingImg.width * widthRatio*0.5, ratingImg.height * widthRatio*0.5);

// Draw the button
    for (let btn of defeatedMenuButtons) {
        btn.draw();
    }
}

// =========================================== Button interaction detection ============================================

function menuButtonPressed() {
    if (showMainMenu) {
        for (let btn of mainMenuButtons) {
            if (btn) btn.press();
        }
    }
    if (showLevelMenu) {
        for (let btn of levelMenuButtons) {
            if (btn) btn.press();
        }
    }
    if (showVictoryMenu) {
        for (let btn of victoryMenuButtons) {
            if (btn) btn.press();
        }
    }
    if (showDefeatedMenu) {
        for (let btn of defeatedMenuButtons) {
            if (btn) btn.press();
        }
    }

    if(showDifficultyLevelMenu){
        btnEasy.press()
        btnHard.press()
        btnNormal.press()
    }


    if(showGuideScrren){
        btn_bearkGuide.press();
    }




}

function menuButtonReleased() {

    if (showMainMenu) {
        for (let btn of mainMenuButtons) {
            if (btn) btn.release();
        }
    }
    if (showLevelMenu) {
        for (let btn of levelMenuButtons) {
            if (btn) btn.release();
        }
    }
    if (showVictoryMenu) {
        for (let btn of victoryMenuButtons) {
            if (btn) btn.release();
        }
    }
    if (showDefeatedMenu) {
        for (let btn of defeatedMenuButtons) {
            if (btn) btn.release();
        }
    }
    if(showDifficultyLevelMenu){
        btnEasy.release()
        btnHard.release()
        btnNormal.release()
    }
    if(showGuideScrren){
        btn_bearkGuide.release();
    }
}
// ============================================ Button Click ============================================
function onPlayButtonClicked() {
    toggleLevelMenu(true);
    toggleMainMenu(false);
}

function onLeftArrowButtonClicked() {
    levelSelectedIndex--;
    checkLeftRightArrow();
    if (levelSelectedIndex < 0) {
        levelSelectedIndex = levels.length - 1;
        levelMapRowTargetXpos = -width * (levels.length - 1);
    } else {
        levelMapRowTargetXpos += width;
    }
}

function onRightArrowButtonClicked() {
    levelSelectedIndex++;
    checkLeftRightArrow();
    if (levelSelectedIndex >= levels.length) {
        levelSelectedIndex = 0;
        levelMapRowTargetXpos = 0;
    } else {
        levelMapRowTargetXpos -= width;
    }

}

function checkLeftRightArrow() {
    btnLeft.setVisible(levelSelectedIndex > 0);
    btnRight.setVisible(levelSelectedIndex < levels.length - 1);
}

function onStartButtonClicked() {
    showDifficultyLevelMenu = true;
    btnStart.setVisible(false);
}

//Initialize the game
function initGame() {
    let id = levels[levelSelectedIndex].id;
    showGuideScrren = true;
    guideIndex = 1;
    console.log(`Select map to start ${id}`);
    startGame(id);
    toggleLevelMenu(false);
    showDifficultyLevelMenu =false;
}

function onReturnButtonClicked() {
    toggleMainMenu(true);
    toggleLevelMenu(false);

}

function onContinueButtonClicked() {
// Next level
    let nextMapIndex;
    for (let i = 0; i < levels.length; i++) {
        if (mapData.id === levels[i].id) {
            nextMapIndex = i + 1;
            break;
        }
    }
    if (nextMapIndex < levels.length) {
        let nextMapId = levels[nextMapIndex].id;
        console.log(`Continue to the next level ${nextMapId}`);
        startGame(nextMapId);
    }
    toggleVictoryMenu(false);
}

function onGoBackButtonClicked() {
    toggleVictoryMenu(false);
    toggleDefeatedMenu(false);
    toggleLevelMenu(true);
    stopGame();
}

function onRetryButtonClicked() {
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
        // this.w =this.w*widthRatio;
        // this.h =this.h*heightRatio;
        // if(this.label=='easy'||this.label=='hard'){
        //     this.w =this.w*widthRatio;
        //     this.h =this.h*heightRatio;
        // }
    }

    // Update dynamic effects
    updateEffects() {
        // Pulse effect
        this.pulseSize = sin(frameCount * this.pulseSpeed) * this.pulseMax;

        // Halo breathing effect
        this.glowAlpha += this.glowDirection * this.glowSpeed;
        if (this.glowAlpha > this.glowMax || this.glowAlpha < 0) {
            this.glowDirection *= -1;
        }

        this.lastUpdate = millis();
    }

// Update dynamic effects
    updateDynamicEffects() {
        // Pulse effect
        this.pulseSize = sin(frameCount * this.pulseSpeed) * 10;

        // Halo breathing effect
        this.glowAlpha += this.glowDirection * 2;
        if (this.glowAlpha > 100 || this.glowAlpha < 0) {
            this.glowDirection *= -1;
        }

        // Overall effect size (for unified adjustment)
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

    // Check if the mouse is inside the button
    isMouseOver() {
        return mouseX > this.x - this.tarWidth * widthRatio / 2 && mouseX < this.x + this.tarWidth * widthRatio / 2 &&
            mouseY > this.y - this.tarHeight * widthRatio / 2 && mouseY < this.y + this.tarHeight * widthRatio / 2;
    }

// Render button
// Render button
    draw() {
        if (!this.isVisible) return;
        push();
        this.updateDynamicEffects(); // Update effect
        const {imgOffset, textOffset} = this.calculateButtonOffsets();
        this.updateButtonSize(imgOffset, textOffset);

        if (this.label === "START") {
            this.drawStartButtonEffects();
        }
        if (["PLAY", "START"].includes(this.label)) {
            this.drawCenterButton(imgOffset, textOffset);
        } else if (this.label === "RIGHT") {
            this.drawRightButton(imgOffset);
        } else if (this.label === "LEFT") {
            this.drawLeftButton(imgOffset);
        }
        else if (this.label === "RETURN") {
            this.drawReturnButton(imgOffset);
        }
        else {

//Apply additional effects to the START button
            const extraSize = this.label === "START" ? this.effectSize : 0;
            imageMode(CENTER);
            rectMode(CENTER);
            image(this.bg, this.x, this.y, this.tarWidth * widthRatio, this.tarHeight * widthRatio);

            if (this.label.length === 0) return;

            stroke(0);
            strokeWeight(this.tarFontSize / 6 * widthRatio);
            fill(this.labelColor);
            textFont(uiFont);
            textAlign(CENTER, CENTER);
            textSize(this.tarFontSize * widthRatio);
            text(this.label, this.x, this.y);


        }

        pop();
    }

    drawStartButtonEffects() {
// Rectangular glow effect
        noStroke();
        fill(255, 215, 0, this.glowAlpha); // Gold translucent

// Draw a rounded rectangular glow (matching the button shape)
        rectMode(CENTER);
        let glowWidth = this.w + this.effectSize * 2 - 60;
        let glowHeight = this.h + this.effectSize * 2 - 30;
        let cornerRadius = 15 + this.effectSize / 2; // The rounded corners get bigger with the effect

// Modify this line (add offset)
        const xOffset = -90; // 5 pixels to the left
        const yOffset = -40; // 5 pixels to the top

// Main glow (add offset)
        rect(this.x + this.w / 2 + xOffset, this.y + this.h / 2 + yOffset,
            glowWidth, glowHeight, cornerRadius);

// Highlight halo (also add offset)
        rect(this.x + this.w / 2 + xOffset, this.y + this.h / 2 + yOffset,
            glowWidth * 0.9, glowHeight * 0.9, cornerRadius * 0.9);

// Adjust the button size to include dynamic effects
        this.tarWidth += this.effectSize;
        this.tarHeight += this.effectSize;
        this.tarFontSize += this.effectSize / 3;
    }

    // Calculate button offset
    calculateButtonOffsets() {
        let imgOffset = 0;
        let textOffset = 0;

        if (this.isPressed) {
            imgOffset = -5;
            textOffset = -this.fontSize / 6;
        } else if (this.isMouseOver()) {
            imgOffset = 5;
            textOffset = this.fontSize / 6;
        }

        return {imgOffset, textOffset};
    }

// Update the button size
    updateButtonSize(imgOffset, textOffset) {
        this.tarWidth = lerp(this.tarWidth, this.w + imgOffset * 2, 0.5);
        this.tarHeight = lerp(this.tarHeight, this.h + imgOffset * 2, 0.5);
        this.tarFontSize = lerp(this.tarFontSize, this.fontSize + textOffset, 0.5);
    }

// Draw the center button (PLAY/START)
    drawCenterButton(imgOffset, textOffset) {
        this.x = width / 2;
        this.y = height / 2;
        // 对START按钮应用额外效果
        const extraSize = this.label === "START" ? this.effectSize : 0;
        imageMode(CENTER);
        rectMode(CENTER);
        image(this.bg, this.x, this.y, this.tarWidth * widthRatio, this.tarHeight * widthRatio);

        if (this.label.length === 0) return;

        stroke(0);
        strokeWeight(this.tarFontSize / 6 * widthRatio);
        fill(this.labelColor);
        textFont(uiFont);
        textAlign(CENTER, CENTER);
        textSize(this.tarFontSize * widthRatio);
        text(this.label, this.x, this.y);
    }

// Draw the right button
    drawRightButton(imgOffset) {
        this.x = width - this.tarWidth * widthRatio;
        this.y = height / 2;

        imageMode(CENTER);
        image(this.bg, this.x, this.y, this.tarWidth * widthRatio, this.tarHeight * widthRatio);
    }
// Draw the left button
    drawLeftButton(imgOffset) {
        this.x = this.tarHeight * widthRatio / 2;
        this.y = height / 2;

        imageMode(CENTER);
        image(this.bg, this.x, this.y, this.tarWidth * widthRatio, this.tarHeight * widthRatio);
    }

    // Draw the back button
    drawReturnButton(imgOffset) {
        this.x = this.tarWidth * widthRatio / 2;
        this.y = this.tarHeight * widthRatio;

        imageMode(CENTER);
        image(this.bg, this.x, this.y, this.tarWidth * widthRatio, this.tarHeight * widthRatio);


    }

    // Button pressed
    press() {
        if (!this.isVisible || this.isDisabled || !this.isMouseOver()) return;
        this.isPressed = true;
    }

    // The button is lifted, triggering the callback
    release() {
        if (this.isPressed && !this.isDisabled) {
            this.isPressed = false;
            if (this.isMouseOver()) {
                this.callback();
            }
        }
    }
}