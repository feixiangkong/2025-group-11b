class Hero {  // 创建塔的类
    constructor(x, y) {  // 构造函数，初始化塔的位置和属性
        this.img = undefined;
        this.x = x;
        this.y = y;
        this.size = ts;
        this.speed = 3;
        this.range = 2;

        this.direction = 'down'; // 默认面朝下方
        this.isMoving = false;
        this.animationFrame = 0;
        this.animationSpeed = 0.2;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.cd = 0;


        this.baseOnTop = true;      // 是否在炮管上方绘制塔基
        this.color = [0, 0, 0];     // 主色
        this.drawLine = true;       // 是否绘制攻击目标的连线
        this.follow = true;         // 是否跟随目标，即使不攻击
        this.hasBarrel = true;      // 是否有炮管
        this.hasBase = true;        // 是否有塔基
        this.length = 0.7;          // 炮管长度（以瓦片为单位）
        this.radius = 1;            // 塔基半径（以瓦片为单位）
        this.secondary = [0, 0, 0]; // 辅助色
        this.weight = 2;            // 激光描边宽度
        this.width = 0.3;           // 炮管宽度（以瓦片为单位）
        this.health = 10;

        // Misc  // 杂项
        this.alive = true;          // 塔是否存活
        this.name = 'tower';        // 塔的名称
        this.sound = null;          // 发射时播放的声音
        this.title = 'Tower';       // 塔的标题
        this.selected = false;      // 是否被选中

        // Position  // 塔的位置
        this.angle = 0;             // 塔的角度

        this.pos = createVector(x, y);  // 屏幕位置

        // Stats  // 塔的属性
        this.cooldown = 0.01;       // 冷却时间


        this.cooldownMax = 72;       // 最大冷却时间
        this.cooldownMin = 48;       // 最小冷却时间
        this.cost = 0;              // 塔的购买成本
        this.damageMax = 20;        // 最大伤害
        this.damageMin = 1;         // 最小伤害

        this.totalCost = 0;         // 总成本
        this.type = 'physical';     // 伤害类型
        this.upgrades = [];         // 升级列表


        this.powerCd = 0;
        this.powerCoolDown = 0;
        this.tower = undefined;//英雄复制的塔
        this.copyTower = undefined; //拷贝能力的塔
        this.powerTowerPostionRect = undefined;//获取塔能力，塔相关的位置方块，防止重复获取
        this.createPower = false;

    }


    // 更新位置
    updateStateAndPositon() {
        // 重置移动状态
        this.isMoving = false;

        // 处理移动
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
            // 静止时显示第一帧
            this.animationFrame = 0;
        }

        // 边界检查
        this.x = constrain(this.x, this.size / 2, gameWidth - this.size / 2);
        this.y = constrain(this.y, this.size / 2, gameHeight - this.size / 2);
        this.pos = createVector(this.x, this.y);  // 屏幕位置
    }


    setMove(keyCode, isMoving) {
        switch (keyCode) {
            case 37: // 左箭头
                hero.moveLeft = isMoving;
                break;
            case 39: // 右箭头
                hero.moveRight = isMoving;
                break;
            case 38: // 上箭头
                hero.moveUp = isMoving;
                break;
            case 40: // 下箭头
                hero.moveDown = isMoving;
                break;
        }
    }


    draw() {  // 绘制塔
        this.updateStateAndPositon();

        //如果鼠标在角色格子内 显示范围
        if (mouseX >= this.x - this.size / 2 + gameX && mouseX <= this.x + this.size / 2 + gameX && mouseY >= this.y - this.size / 2 + gameY && mouseY <= this.y + this.size / 2 + gameY) {
            this.diaplayRange(this.x, this.y);
        }


        // stroke(255, 237, 102);
        // strokeWeight(2);
        // fill(0, 10);
        // //fill(100, 40);
        // // 攻击范围半径
        // var r = this.range * ts * 2;
        // circle(0, 0, r);
        push();
        translate(this.x, this.y);
        let spriteArray = walkSprites['walk'];
        let frameIndex = floor(this.animationFrame) % spriteArray.length;

        // 根据方向决定是否翻转
        if (this.direction == 'left') {
            scale(-1, 1);
            // translate(-this.size*2, 0);
        }

        // stroke('red');
        // strokeWeight(3);
        // rectMode(CENTER);
        // rect(0, 0, this.size, this.size);
        // 绘制精灵，居中显示

        imageMode(CENTER);
        image(spriteArray[frameIndex], 0, 0, this.size, this.size, 400, 0, 1000, 1000);


        pop();

        push();
        imageMode(CENTER);


        this.displayCD(this.pos.x, this.pos.y);   // 绘制cd

        pop();


    }


    canFire() {
        return this.cd <= 0;  // 如果冷却时间为0，表示可以攻击
    }

    canGetPower() {
        return this.powerCd === 0;  // 如果冷却时间为0，表示可以获取塔能力
    }

    visible(entities) {
        return getInRange(this.pos.x, this.pos.y, this.range, entities);  // 获取在范围内的实体
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
            x: this.x,
            y: this.y,
            width: ts,
            height: ts,
        };
    
        let rect2 = {
            x: tower.pos.x,
            y: tower.pos.y,
            width: ts,
            height: ts,
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
            x: tower.pos.x,
            y: tower.pos.y,
            width: ts,
            height: ts,
        };
    
        this.resetPowerCoolDown();
        this.createPower = true;
        this.copyTower = tower;
        this.tower = undefined;
    }
    
    updateExistingPower(tower) {
        let heroRect = {
            x: this.x,
            y: this.y,
            width: ts,
            height: ts,
        };
    
        // 已经有能力，禁止重复获取相同的塔
        if (!checkRectCollision(heroRect, this.powerTowerPostionRect) && this.createPower == false) {
            this.reinitializePower(tower);
        }
    
        // 已经有能力，相同位置的塔升级了 可以重新获取
        if (checkRectCollision(heroRect, this.powerTowerPostionRect)) {
            this.handleUpgradedTower(tower);
        }
    }
    
    reinitializePower(tower) {
        this.powerTowerPostionRect = {
            x: tower.pos.x,
            y: tower.pos.y,
            width: ts,
            height: ts,
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

        entities = this.visible(entities);  // 获取可见的怪物

        if (entities.length === 0) return;  // 如果没有可见怪物，返回
        var t = getTaunting(entities);  // 获取挑衅的怪物
        if (t.length > 0) entities = t;  // 如果有挑衅的怪物，选择它们
        var e = getFirst(entities);  // 获取第一个怪物
        if (typeof e === 'undefined') return;  // 如果没有目标，返回

        this.onAim(e);  // 锁定目标并攻击

    }


    onAim(e) {


        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
        if (!this.canFire()) return;
        this.resetCooldown();

        let bulletDamage = round(random(this.damageMin, this.damageMax));
        let b = new Arrow(this.pos.x, this.pos.y, e, bulletDamage, this.arrowSpeed);
        projectiles.push(b);

        // 绘制枪口闪光效果（可选），让发射更明显
        push();
        stroke(255, 255, 0);
        strokeWeight(4);
        let barrelEnd = createVector(
            this.pos.x + cos(this.angle) * ts * 0.5,
            this.pos.y + sin(this.angle) * ts * 0.5
        );
        line(this.pos.x, this.pos.y, barrelEnd.x, barrelEnd.y);
        pop();

        // 如果你需要额外的 onHit 后续处理，可以调用它
        this.onHit(e);
        // 更新CD


    }


    // Adjust angle to point towards pixel position  // 调整角度指向目标
    aim(x, y) {
        this.angle = atan2(y - this.pos.y, x - this.pos.x);  // 计算角度
    }

    // Deal damage to monster  // 对怪物造成伤害
    attack(e) {

        var damage = round(random(this.damageMin, this.damageMax));  // 随机伤害
        e.dealDamage(damage, this.type);  // 伤害怪物
        if (sounds.hasOwnProperty(this.sound)) {  // 如果有声音，播放声音
            sounds[this.sound].play();
        }
        this.onHit(e);  // 对目标进行后续操作
    }

    drawBarrel() {
        fill(this.secondary);  // 设置填充颜色
        rect(0, -this.width * ts / 2, this.length * ts, this.width * ts);  // 绘制矩形炮管
    }

    // Draw base of tower (stationary part)  // 绘制塔基（固定部分）
    drawBase() {
        fill(this.color);  // 设置填充颜色
        ellipse(this.pos.x, this.pos.y, this.radius * ts, this.radius * ts);  // 绘制椭圆形塔基
    }

    // Returns damage range  // 返回伤害范围
    getDamage() {
        return rangeText(this.damageMin, this.damageMax);  // 返回伤害文本
    }

    // Returns average cooldown in seconds  // 返回平均冷却时间（秒）
    getCooldown() {
        return (this.cooldownMin + this.cooldownMax) / 120;  // 计算冷却时间
    }

    kill() {  // 将塔标记为死亡
        this.alive = false;
    }

    isDead() {  // 检查塔是否死亡
        return !this.alive;
    }

    onHit(e) {
    }  // 目标被击中时的操作

    // 塔被攻击时加点效果
    dealDamage(amt, type) { // 处理伤害


        if (this.health > 0) { // 如果生命值大于 0
            this.health -= amt; // 计算最终伤害


        }
        if (this.health <= 0) this.kill(); // 如果生命值小于等于 0，调用死亡逻辑


    }

    resetCooldown() {  // 重置冷却时间
        var cooldown = round(random(this.cooldownMin, this.cooldownMax));  // 随机生成冷却时间
        this.cd = cooldown;  // 设置冷却时间
        this.cooldown = cooldown;
    }

    resetPowerCoolDown() {  // 重置冷却时间
        var cooldown = round(random(this.cooldownMin, this.cooldownMax));  // 随机生成冷却时间
        this.powerCd = cooldown;  // 设置冷却时间
        this.powerCoolDown = cooldown;
    }

    // Sell price  // 塔的出售价格
    sellPrice() {
        return floor(this.totalCost * sellConst);  // 返回出售价格
    }

    // Target correct monster  // 锁定正确的怪物


    updateCD() {  // 更新cd状态
        if (this.cd > 0) this.cd--;  // 如果冷却时间大于0，减少冷却时间
    }

    updatePowerCD() {  // 更新cd状态
        if (this.powerCd > 0) this.powerCd
        this.powerCd--;  // 如果冷却时间大于0，减少冷却时间
    }


    // Use template to set attributes  // 使用模板设置塔的属性
    upgrade(template) {
        template = typeof template === 'undefined' ? {} : template;  // 如果没有传入模板，使用空对象
        var keys = Object.keys(template);  // 获取模板的所有键
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];  // 遍历模板键
            this[key] = template[key];  // 设置属性
        }
        if (template.cost) this.totalCost += template.cost;  // 如果有成本，增加总成本
    }

    // Returns array of visible entities out of passed array  // 返回可见实体的数组
    visible(entities) {
        return getInRange(this.pos.x, this.pos.y, this.range, entities);  // 获取在范围内的实体
    }

    // 绘制攻击范围
    diaplayRange(cx, cy) {
        stroke(255, 237, 102);
        strokeWeight(2);
        fill(this.color[0], this.color[1], this.color[2], 40);
        //fill(100, 40);
        // 攻击范围半径
        var r = this.range * ts * 2;
        circle(cx, cy, r);
    }

    // 显示剩余cd
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

        // let cdRatio =  this.cooldown/this.cd ;
        // if (cdRatio >=100) return;
        let wt = map(this.powerCd, this.powerCoolDown, 0, 0, 2 * ts / 3);
        if (this.powerCd <= 0) {
            return;
        }
        strokeWeight(2);
        stroke(255);
        fill(100);
        rect(cx - ts / 3, cy + ts / 5, 2 * ts / 3, ts / 5);

        // noStroke();
        fill(random(255), random(255), random(255));
        rect(cx - ts / 3, cy + ts / 5, wt, ts / 5);


    }

    displayUpgrade(cx, cy) {
        let hasUpgrade = this.upgrades.length > 0;
        if (!hasUpgrade) return;
        let enoughCash = cash > this.upgrades[0].cost;
        let icon = enoughCash ? iconUpgrade : iconUpgradeGrey;
        let scale = 0.2;
        image(icon, cx, cy, ts * scale, ts * scale); // 移除了浮动效果
    }


}
