class Hero {
    constructor(x, y) {  // Constructor to initialize the hero's position and attributes
        this.img = undefined;
        this.x = x;
        this.y = y;
        this.size = ts;
        this.speed = 3;
        this.range = 2;

        this.direction = 'down'; // Default facing downwards
        this.isMoving = false;
        this.animationFrame = 0;
        this.animationSpeed = 0.2;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.cd = 0;

        this.color = [0, 0, 0];     // Primary color
        this.follow = true;         // Whether to follow the target even when not attacking
        this.length = 0.7;          // Barrel length (in tile units)
        this.radius = 1;            // Base radius (in tile units)
        this.secondary = [0, 0, 0]; // Secondary color
        this.weight = 2;            // Laser stroke width
        this.width = 0.3;           // Barrel width (in tile units)
        this.health = 10;

        // Miscellaneous
        this.alive = true;          // Whether the hero is alive
        this.name = 'tower';        // Hero's name
        this.sound = null;          // Sound to play when attacking
        this.title = 'Tower';       // Hero's title
        this.selected = false;      // Whether the hero is selected

        // Position
        this.angle = 0;             // Hero's angle
        this.pos = createVector(x, y);  // Screen position

        // Stats
        this.cooldown = 0.01;       // Cooldown time
        this.cooldownMax = 72;      // Maximum cooldown time
        this.cooldownMin = 48;      // Minimum cooldown time
        this.cost = 0;              // Purchase cost of the hero
        this.damageMax = 20;        // Maximum damage
        this.damageMin = 1;         // Minimum damage
        this.totalCost = 0;         // Total cost
        this.type = 'physical';     // Damage type
        this.upgrades = [];         // List of available upgrades

        this.powerCd = 0;           // Power cooldown
        this.powerCoolDown = 0;     // Maximum power cooldown
        this.tower = undefined;     // Tower copied by the hero
        this.copyTower = undefined; // Tower whose abilities are being copied
        this.powerTowerPostionRect = undefined; // Position rectangle of the tower for power acquisition, prevents repeated acquisition
        this.createPower = false;   // Whether to create the power
    }


    // 更新位置
    updateStateAndPositon() {
        // reset move state
        this.isMoving = false;

        // update move
        if (this.moveLeft) {
            this.x -= this.speed;
            this.direction = 'left';
            this.isMoving = true;
        }
        if (this.moveRight) {
            this.x += this.speed;
            this.direction = 'right';
            this.isMoving = true;
        }
        if (this.moveUp) {
            this.y -= this.speed;

            this.isMoving = true;
        }
        if (this.moveDown) {
            this.y += this.speed;

            this.isMoving = true;
        }

        // 更新动画帧
        if (this.isMoving) {
            this.animationFrame += this.animationSpeed;
            if (this.animationFrame >= walkSprites['walk'].length) {
                this.animationFrame = 0;
            }
        } else {

            this.animationFrame = 0;
        }

        //  Check boundaries.
        this.x = constrain(this.x, this.size / 2, gameWidth - this.size / 2);
        this.y = constrain(this.y, this.size / 2, gameHeight - this.size / 2);
        this.pos = createVector(this.x, this.y);
    }


    setMove(keyCode, isMoving) {
        switch (keyCode) {
            case 37: // left arrow
                hero.moveLeft = isMoving;
                break;
            case 39: // right arrow
                hero.moveRight = isMoving;
                break;
            case 38: // up arrow
                hero.moveUp = isMoving;
                break;
            case 40: // down arrow
                hero.moveDown = isMoving;
                break;
        }
    }


    draw() {
        this.updateStateAndPositon();

        //check inRange
        if (mouseX >= this.x - this.size / 2 + gameX && mouseX <= this.x + this.size / 2 + gameX && mouseY >= this.y - this.size / 2 + gameY && mouseY <= this.y + this.size / 2 + gameY) {
            this.diaplayRange(this.x, this.y);
        }


        push();
        translate(this.x, this.y);
        let spriteArray = walkSprites['walk'];
        let frameIndex = floor(this.animationFrame) % spriteArray.length;

        // Flip the sprite based on direction
        if (this.direction == 'left') {
            scale(-1, 1);

        }


        imageMode(CENTER);
        image(spriteArray[frameIndex], 0, 0, this.size, this.size, 400, 0, 1000, 1000);


        pop();

        push();
        imageMode(CENTER);


        this.displayCD(this.pos.x, this.pos.y);   // 绘制cd

        pop();


    }


    canFire() {
        return this.cd <= 0; // If the cooldown is 0, it means the tower can attack
    }

    canGetPower() {
        return this.powerCd === 0;  // If the cooldown is 0, it means the hero can absorb tower abilities
    }

    visible(entities) {
        return getInRange(this.pos.x, this.pos.y, this.range, entities);  // Get entities within range
    }

    //使用塔的能力
    updateTowerPower() {

        if (this.tower != undefined) {
            this.tower.pos.x = this.x;
            this.tower.pos.y = this.y;

            if (!this.createPower) {
                this.tower.target(monsters);
                this.tower.displayCD(this.x, this.y);
                2
                this.tower.update();
            }

        }

    }

    getPowerByTowers(towers) {
        this.handlePowerCreation();

        let cancleCreate = true;

        for (var i = 0; i < towers.length; i++) {
            var t = towers[i];
            if (this.checkTowerCollision(t)) {
                cancleCreate = false;
                this.displayPoweCD(this.pos.x, this.pos.y);   // 绘制cd
                this.updatePowerCD();

                this.handlePowerAcquisition(t);
            }
        }

        if (cancleCreate) {
            this.resetPowerState();
        }
    }

    // Helper methods
    handlePowerCreation() {
        if (this.powerCd <= 0 && this.createPower) {
            this.tower = new Tower(this.x, this.y);
            this.tower.copyTower(this.copyTower);
            // this.tower.onCreate();
            this.createPower = false;
        }
    }

    checkTowerCollision(tower) {
        let rect1 = {
            x: this.x, y: this.y, width: ts, height: ts,
        };

        let rect2 = {
            x: tower.pos.x, y: tower.pos.y, width: ts, height: ts,
        };

        return checkRectCollision(rect1, rect2);
    }

    handlePowerAcquisition(tower) {
        if (this.powerTowerPostionRect === undefined) {
            this.initializePower(tower);
        } else {
            this.updateExistingPower(tower);
        }
    }

    initializePower(tower) {
        this.powerTowerPostionRect = {
            x: tower.pos.x, y: tower.pos.y, width: ts, height: ts,
        };

        this.resetPowerCoolDown();
        this.createPower = true;
        this.copyTower = tower;
        this.tower = undefined;
    }

    updateExistingPower(tower) {
        let heroRect = {
            x: this.x, y: this.y, width: ts, height: ts,
        };

        // Already have the ability, prevent acquiring the same tower again
        if (!checkRectCollision(heroRect, this.powerTowerPostionRect) && this.createPower == false) {
            this.reinitializePower(tower);
        }

        // If the tower at the same position has been upgraded, allow re-acquisition
        if (checkRectCollision(heroRect, this.powerTowerPostionRect)) {
            this.handleUpgradedTower(tower);
        }
    }

    reinitializePower(tower) {
        this.powerTowerPostionRect = {
            x: tower.pos.x, y: tower.pos.y, width: ts, height: ts,
        };

        this.resetPowerCoolDown();
        this.createPower = true;
        this.copyTower = tower;
    }

    handleUpgradedTower(tower) {
        if (this.createPower == false && this.tower.name != tower.name) {
            this.resetPowerCoolDown();
            this.createPower = true;
            this.copyTower = tower;
        }
    }

    resetPowerState() {
        this.createPower = false;
        this.powerCd = 0;
        this.powerCoolDown = 0;
    }

    target(entities) {

        entities = this.visible(entities);  // Get visible monsters

        if (entities.length === 0) return;  // Return if no visible monsters
        var t = getTaunting(entities);  // Get taunting monsters
        if (t.length > 0) entities = t;  // If there are taunting monsters, select them
        var e = getFirst(entities);  // Get the first monster
        if (typeof e === 'undefined') return;  // Return if no target found

        this.onAim(e);  // Lock on target and attack

    }


    onAim(e) {


        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
        if (!this.canFire()) return;
        this.resetCooldown();

        let bulletDamage = round(random(this.damageMin, this.damageMax));
        let b = new Arrow(this.pos.x, this.pos.y, e, bulletDamage, this.arrowSpeed);
        projectiles.push(b);

        // Draw muzzle flash effect (optional) to make the shot more visible
        push();
        stroke(255, 255, 0);
        strokeWeight(4);
        let barrelEnd = createVector(this.pos.x + cos(this.angle) * ts * 0.5, this.pos.y + sin(this.angle) * ts * 0.5);
        line(this.pos.x, this.pos.y, barrelEnd.x, barrelEnd.y);
        pop();

        // 如果你需要额外的 onHit 后续处理，可以调用它
        this.onHit(e);
        // 更新CD


    }


    // Adjust angle to point towards pixel position
    aim(x, y) {
        this.angle = atan2(y - this.pos.y, x - this.pos.x);
    }

    // Deal damage to monster
    attack(e) {

        var damage = round(random(this.damageMin, this.damageMax));  // 随机伤害
        e.dealDamage(damage, this.type);  // 伤害怪物
        if (sounds.hasOwnProperty(this.sound)) {  // 如果有声音，播放声音
            sounds[this.sound].play();
        }
        this.onHit(e);  // 对目标进行后续操作
    }


    // Returns damage range
    getDamage() {
        return rangeText(this.damageMin, this.damageMax);
    }

    // Returns average cooldown in seconds
    getCooldown() {
        return (this.cooldownMin + this.cooldownMax) / 120;
    }

    kill() {  // Mark the tower as dead
        this.alive = false;
    }

    isDead() {  // Check if the tower is dead
        return !this.alive;
    }

    onHit(e) {
    } // Operation when the target is hit


    dealDamage(amt, type) {


        if (this.health > 0) { // If health is greater than 0
            this.health -= amt; // Calculate final damage

        }
        if (this.health <= 0) this.kill(); // If health is less than or equal to 0, call death logic


    }

    resetCooldown() { // Reset Cooldown
        var cooldown = round(random(this.cooldownMin, this.cooldownMax)); // Randomly generate cooldown
        this.cd = cooldown; // Set cooldown
        this.cooldown = cooldown;
    }

    resetPowerCoolDown() { // Reset Cooldown
        var cooldown = round(random(this.cooldownMin, this.cooldownMax)); // Randomly generate cooldown
        this.powerCd = cooldown; // Set cooldown
        this.powerCoolDown = cooldown;
    }

// Sell price // Tower selling price
    sellPrice() {
        return floor(this.totalCost * sellConst); // Return selling price
    }

// Target correct monster // Target the correct monster

    updateCD() { // Update CD status
        if (this.cd > 0) this.cd--; // If the cooldown is greater than 0, reduce the cooldown
    }

    updatePowerCD() { // Update cd status
        if (this.powerCd > 0) this.powerCd
        this.powerCd--; // If the cooldown time is greater than 0, reduce the cooldown time
    }

// Use template to set attributes // Use template to set tower attributes
    upgrade(template) {
        template = typeof template === 'undefined' ? {} : template; // If no template is passed, use an empty object
        var keys = Object.keys(template); // Get all keys of the template
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i]; // Traverse template keys
            this[key] = template[key]; // Set attributes
        }
        if (template.cost) this.totalCost += template.cost; // If there is a cost, increase the total cost
    }

    // Returns array of visible entities out of passed array
    visible(entities) {
        return getInRange(this.pos.x, this.pos.y, this.range, entities); // Get entities in the range
    }

    // Draw the attack range
    diaplayRange(cx, cy) {
        stroke(255, 237, 102);
        strokeWeight(2);
        fill(this.color[0], this.color[1], this.color[2], 40);

        var r = this.range * ts * 2;
        circle(cx, cy, r);
    }

    // Display remaining CD
    displayCD(cx, cy) {
        let cdRatio = this.cd / this.cooldown;
        if (cdRatio < 0.001) return;
        strokeWeight(2);
        stroke(255);
        fill(100);
        rect(cx - ts / 3, cy + ts / 5, 2 * ts / 3, ts / 5);
        noStroke();
        fill(0, 12, 188);
        let wid = lerp(0, 2 * ts / 3, cdRatio);
        rect(cx - ts / 3, cy + ts / 5, wid, ts / 5);

        this.updateCD();


    }


    displayPoweCD(cx, cy) {


        let wt = map(this.powerCd, this.powerCoolDown, 0, 0, 2 * ts / 3);
        if (this.powerCd <= 0) {
            return;
        }
        strokeWeight(2);
        stroke(255);
        fill(100);
        rect(cx - ts / 3, cy + ts / 5, 2 * ts / 3, ts / 5);


        fill(random(255), random(255), random(255));
        rect(cx - ts / 3, cy + ts / 5, wt, ts / 5);


    }

    displayUpgrade(cx, cy) {
        let hasUpgrade = this.upgrades.length > 0;
        if (!hasUpgrade) return;
        let enoughCash = cash > this.upgrades[0].cost;
        let icon = enoughCash ? iconUpgrade : iconUpgradeGrey;
        let scale = 0.2;
        image(icon, cx, cy, ts * scale, ts * scale); // Removed floating effect
    }


}
