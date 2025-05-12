function createTower(x, y, template) {
    const t = new Tower(x, y);
    t.gridPos = createVector(x, y); 
    t.upgrade(template);
    t.onCreate();
    return t;
}

var tower = {};

// ================================================================ Archer Tower ================================================================

// 修改后的塔定义，使用贴图绘制塔的外观，同时发射子弹
tower.gun = {
    // 基本属性
    name: 'Archer Tower',
    title: 'Archer Tower',
    cooldownMax: 72,
    cooldownMin: 48,
    cost: 50,
    damageMax: 12,
    damageMin: 8,
    range: 2,
    type: 'physical',
    arrowSpeed: 15,     // 弓箭速度
    get visual() { return tower1Img; }, // 防御塔的样式图片
    

    // 设置使用贴图绘制塔的外观（你之前预加载的贴图）
    hasBase: true,
    hasBarrel: false,
    draw: function () {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // 被选中时效果
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y);   // 绘制cd
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3);  //绘制升级按钮
        pop();
    },
    
    // 自定义攻击效果：创建一个 Bullet 对象模拟子弹飞行
    onAim: function (e) {
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
    },
    
    // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
    target: Tower.prototype.target,
    // 升级选项
    upgrades: [
        {
            // 基本属性
            name: 'Archer PLUS Tower',
            title: 'Archer PLUS Tower',
            cooldownMax: 61,
            cooldownMin: 41,
            cost: 80,
            damageMax: 16,
            damageMin: 10,
            range: 2.5,
            arrowSpeed: 20,     // 弓箭速度
            get visual() { return t1_2Image; }, // 防御塔的样式图片
            
            upgrades: [
                {
                    // 基本属性
                    name: 'Archer MAX Tower',
                    title: 'Archer MAX Tower',
                    cooldownMax: 52,
                    cooldownMin: 35,
                    cost: 150,
                    damageMax: 21,
                    damageMin: 13,
                    range: 3,
                    arrowSpeed: 25,     // 弓箭速度
                    get visual() { return t1_3Image; }, // 防御塔的样式图片
                    
                }
            ]
        }
    ]
};

// ================================================================ oil Tower ================================================================
tower.oil = {
    // 基本属性
    name: 'oil Tower',
    title: 'oil Tower',
    cooldownMax: 150,
    cooldownMin: 90,
    cost: 70,
    damageMax: 15,
    damageMin: 10,
    range: 1.5,
    type: 'fire',
    get visual() { return tower2Img; }, // 防御塔的样式图片

    // 设置使用贴图绘制塔的外观（你之前预加载的贴图）
    hasBase: true,
    hasBarrel: false,
    draw: function() {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // 被选中时效果
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y);   // 绘制cd
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3);  //绘制升级按钮
        pop();
    },

    // 自定义攻击效果：创建一个 Bullet 对象模拟子弹飞行
    onAim: function(e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
        if (!this.canFire()) return;
        this.resetCooldown();

        let bulletDamage = round(random(this.damageMin, this.damageMax));
        // 实例化一个子弹，从塔的位置飞向目标
        let b = new FireBall(this.pos.x, this.pos.y, e, bulletDamage);
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
    },

    // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
    target: Tower.prototype.target,
    upgrades:[
        {
            // 基本属性
            name: 'oil PLUS Tower',
            title: 'oil PLUS Tower',
            cooldownMax: 127,
            cooldownMin: 76,
            cost: 100,
            damageMax: 20,
            damageMin: 13,
            range: 2,
            type: 'fire',
            get visual() { return t2_2Image; }, // 防御塔的样式图片

            upgrades:[
                {
                    // 基本属性
                    name: 'oil MAX Tower',
                    title: 'oil MAX Tower',
                    cooldownMax: 107,
                    cooldownMin: 98,
                    cost: 180,
                    damageMax: 26,
                    damageMin: 17,
                    range: 3,
                    type: 'fire',
                    get visual() { return t2_3Image; }, // 防御塔的样式图片
                }
            ]
        },
    ]
};

// ================================================================ Trebuchet Tower ================================================================
tower.trebuchet = {
    // 属性
    name: 'trebuchet',
    title: 'Trebuchet Tower',
    cooldownMax: 210,
    cooldownMin: 150,
    cost: 120,
    damageMax: 30,
    damageMin: 40,
    range: 3,
    blastRadius: 1,
    particleAmt: 10,
    type: 'explosion',
    get visual() { return t4_1Image; }, // 防御塔的样式图片

    onAim(e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);  // 目标锁定
        image(imgAttackAim, e.pos.x - (ts * this.blastRadius) / 2, e.pos.y - (ts * this.blastRadius) / 2,
            ts * this.blastRadius, ts * this.blastRadius);
        if (!this.canFire()) return;  // 如果不能攻击，返回
        this.resetCooldown();  // 重置冷却时间
        this.attack(e);  // 攻击目标
    },

    draw: function ()
    {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // 被选中时效果
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y);   // 绘制cd
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3);  //绘制升级按钮
        pop();
    },
    
    
    onHit: function(e) {
        var s = new StoneExplosion(e.pos.x, e.pos.y);
        for (var i = 0; i < this.particleAmt; i++)
        {
            s.addParticle();
        }
        systems.push(s);

        var inRadius = getInRange(e.pos.x, e.pos.y, this.blastRadius, monsters);
        for (var i = 0; i < inRadius.length; i++)
        {
            var h = inRadius[i];
            var amt = round(random(this.damageMin, this.damageMax));
            h.dealDamage(amt, this.type);
        }
    },
    upgrades: [
        {
            name: 'trebuchet PLUS Tower',
            title: 'Trebuchet PLUS Tower',
            cooldownMax: 179,
            cooldownMin: 128,
            cost: 150,
            damageMax: 52,
            damageMin: 39,
            range: 3.25,
            blastRadius: 1.2,
            get visual() { return t4_1Image; }, // 防御塔的样式图片

            upgrades: [
                {
                    name: 'trebuchet MAX Tower',
                    title: 'Trebuchet MAX Tower',
                    cooldownMax: 152,
                    cooldownMin: 109,
                    cost: 220,
                    damageMax: 68,
                    damageMin: 51,
                    range: 3.5,
                    blastRadius: 1.5,
                    get visual() { return t4_3Image; }, // 防御塔的样式图片
                }
            ]
        }
    ]
};

// ================================================================ Laser AA Tower ================================================================
tower.laser = {
    // Display
    color: [25, 181, 254], // 蓝色激光
    length: 0.55,
    radius: 0.8,
    secondary: [149, 165, 166], // 次要颜色
    width: 0.25,
    weight: 2, // 初始线条粗细
    drawLine: true, // 绘制弹道线
    follow: true, // 跟踪目标
    get visual() { return t5_1Image; }, // 防御塔的样式图片

    // Misc
    name: 'Laser AA Tower',
    title: 'Laser AA Tower',
    sound: 'laser', // 攻击音效

    // Stats
    cooldownMax: 24,
    cooldownMin: 12,    
    cost: 150,
    damageMax: 3,
    damageMin: 2,
    range: 3,
    type: 'energy',

    // 闪烁效果计数器
    flashCounter: 0,
    draw: function() {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // 被选中时效果
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y);   // 绘制cd
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3);  //绘制升级按钮
        pop();
    },

    frameIndex: 0,
    frameNumbers: 7,
    // 攻击逻辑
    onAim: function(e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
        if (!this.canFire()) return;

        // 攻击目标
        this.attack(e);

        // 绘制弹道线
        if (this.drawLine) {
            // 计算弹道线粗细和颜色
            let weight = this.calculateWeight();
            let color = this.calculateColor();

            // 绘制弹道线
            stroke(color);
            strokeWeight(weight);
            line(this.pos.x, this.pos.y, e.pos.x, e.pos.y);
            strokeWeight(1); // 恢复默认线条粗细
            //
            var dir = atan2(e.pos.y - this.pos.y, e.pos.x - this.pos.x);
            var distance = dist(e.pos.x, e.pos.y, this.pos.x, this.pos.y);

            // 画两条闪电
            push();
            translate(this.pos.x, this.pos.y);
            rotate(dir);
           
            let lightning = imgAttackLightning;
            let frameWidth = lightning.width / this.frameNumbers;
            let frameHeight = lightning.height;
            let frameX = this.frameIndex * frameWidth;
            let w = distance;
            let h = w / 5.275;

            let ypos1 = random(- h / 2, - h / 4);
            image(lightning, 0, ypos1, distance, distance / 5.275, frameX, 0, frameWidth, frameHeight);
            scale(1, -1);
            let ypos2 = random(- h / 2, - h / 4);
            image(lightning, 0, ypos2, distance, distance / 5.275, frameX, 0, frameWidth, frameHeight);

            pop();

            // 添加光晕效果
            this.addGlow(e);

            if (frameCount % 5 == 0)
            {
                this.frameIndex = (this.frameIndex + 1) % this.frameNumbers;
            }
        }

        // 更新闪烁计数器
        this.flashCounter++;
    },

    // 计算弹道线粗细
    calculateWeight: function() {
        // 每 20 帧一个完整的闪烁周期
        let cycle = this.flashCounter % 20;

        if (cycle < 10) {
            // 前 10 帧：从初始粗细逐渐变粗
            return this.weight + (cycle / 10) * 4; // 最大粗细为初始粗细 + 4
        } else {
            // 后 10 帧：从最大粗细逐渐变细
            return this.weight + ((20 - cycle) / 10) * 4;
        }
    },

    // 计算弹道线颜色
    calculateColor: function() {
        // 每 20 帧一个完整的颜色变化周期
        let cycle = this.flashCounter % 20;
        let r = 25 + 230 * abs(sin((cycle / 20) * TWO_PI)); // 红色分量
        let g = 181 + 74 * abs(sin((cycle / 20) * TWO_PI)); // 绿色分量
        let b = 254; // 蓝色分量固定
        return [r, g, b];
    },

    // 添加光晕效果
    addGlow: function(e) {
        push();
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], 50); // 半透明光晕
        ellipse(e.pos.x, e.pos.y, 20, 20); // 光晕大小
        pop();
    },

    // 攻击方法
    attack: function(e) {
        var damage = round(random(this.damageMin, this.damageMax));
        e.dealDamage(damage, this.type);
        if (sounds.hasOwnProperty(this.sound)) {
            sounds[this.sound].play();
        }
        this.onHit(e);
    },

    // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
    target: Tower.prototype.target,

    // 升级选项
    upgrades: [
        {
            // Display
            get visual() { return t5_2Image; }, // 防御塔的样式图片

            // Misc
            name: 'Laser AA PLUS Tower ',
            title: 'Laser AA PLUS Tower',

            // Stats
            cooldownMax: 20,
            cooldownMin: 10,    
            cost: 200,
            damageMax: 4,
            damageMin: 3,
            range: 3.5,
            
            // 升级后的攻击逻辑
            attack: function(e) {
                if (this.lastTarget === e) {
                    this.duration++;
                } else {
                    this.lastTarget = e;
                    this.duration = 0;
                }
                var d = random(this.damageMin, this.damageMax);
                var damage = d * sq(this.duration);
                e.dealDamage(damage, this.type);
                this.onHit(e);
            },
            upgrades:[
                {
                    // Display
                    get visual() { return t5_3Image; }, // 防御塔的样式图片

                    // Misc
                    name: 'Laser AA MAX Tower',
                    title: 'Laser AA MAX Tower',
                    sound: 'laser', // 攻击音效

                    // Stats
                    cooldownMax: 17,
                    cooldownMin: 9,    
                    cost: 300,
                    damageMax: 5,
                    damageMin: 4,
                    range: 4,

                    // 攻击方法
                    attack: function(e) {
                        var damage = round(random(this.damageMin, this.damageMax));
                        e.dealDamage(damage, this.type);
                        if (sounds.hasOwnProperty(this.sound)) {
                            sounds[this.sound].play();
                        }
                        this.onHit(e);
                    },
                }
            ]
        }
    ]
};

// tower.laserfire = {
//     // Display
//     color: [254, 81, 25], //
//     length: 0.55,
//     radius: 0.8,
//     secondary: [166, 65, 99], // 次要颜色
//     width: 0.25,
//     weight: 2, // 初始线条粗细
//     drawLine: true, // 绘制弹道线
//     follow: true, // 跟踪目标
//
//     name: 'laserfire',
//     title: 'Laserfire Tower',
//     sound: 'laserfire', // 攻击音效
//
//     // Stats
//     cooldownMax: 1, // 攻击冷却时间
//     cost: 75, // 建造价格
//     damageMax: 3, // 最大伤害
//     range: 2, // 攻击范围
//     type: 'energy', // 伤害类型
//
//     // 闪烁效果计数器
//     flashCounter: 0,
//
//     // 攻击逻辑
//     onAim: function(e) {
//         if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
//         if (!this.canFire()) return;
//
//         // 攻击目标
//         this.attack(e);
//
//         // 绘制弹道线
//         if (this.drawLine) {
//             // 计算弹道线粗细和颜色
//             let weight = this.calculateWeight();
//             let color = this.calculateColor();
//
//             // 绘制弹道线
//             stroke(color);
//             strokeWeight(weight);
//             line(this.pos.x, this.pos.y, e.pos.x, e.pos.y);
//             strokeWeight(1); // 恢复默认线条粗细
//
//             // 添加光晕效果
//             this.addGlow(e);
//         }
//
//         // 更新闪烁计数器
//         this.flashCounter++;
//     },
//
//     // 计算弹道线粗细
//     calculateWeight: function() {
//         // 每 20 帧一个完整的闪烁周期
//         let cycle = this.flashCounter % 20;
//
//         if (cycle < 10) {
//             // 前 10 帧：从初始粗细逐渐变粗
//             return this.weight + (cycle / 10) * 4; // 最大粗细为初始粗细 + 4
//         } else {
//             // 后 10 帧：从最大粗细逐渐变细
//             return this.weight + ((20 - cycle) / 10) * 4;
//         }
//     },
//
//     // 计算弹道线颜色
//     calculateColor: function() {
//         // 每 20 帧一个完整的颜色变化周期
//         let cycle = this.flashCounter % 20;
//         let r = 200 + 55 * abs(sin((cycle / 20) * TWO_PI)); // 红色分量
//         let g = 50 + 104 * abs(sin((cycle / 20) * TWO_PI)); // 绿色分量
//         let b = 2; // 蓝色分量固定
//         return [r, g, b];
//     },
//
//     // 添加光晕效果
//     addGlow: function(e) {
//         push();
//         noStroke();
//         fill(this.color[0], this.color[1], this.color[2], 50); // 半透明光晕
//         ellipse(e.pos.x, e.pos.y, 20, 20); // 光晕大小
//         pop();
//     },
//
//     // 攻击方法
//     attack: function(e) {
//         var damage = round(random(this.damageMin, this.damageMax));
//         e.dealDamage(damage, this.type);
//         if (sounds.hasOwnProperty(this.sound)) {
//             sounds[this.sound].play();
//         }
//         this.onHit(e);
//     },
//
//     // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
//     target: Tower.prototype.target,
//
//     // 升级选项
//     upgrades: [
//         {
//             // Display
//             color: [178, 55, 96], // 升级后的颜色
//             length: 0.65,
//             radius: 0.9,
//             secondary: [191, 191, 191], // 升级后的次要颜色
//             weight: 3, // 升级后的初始线条粗细
//             width: 0.35,
//
//             // Misc
//             name: 'beamEmitter',
//             title: 'Beam Emitter',
//
//             // Stats
//             cooldownMax: 0, // 升级后无冷却
//             cost: 200, // 升级价格
//             damageMax: 0.1, // 升级后的最大伤害
//             damageMin: 0.001, // 升级后的最小伤害
//             range: 3, // 升级后的攻击范围
//
//             // 升级后的攻击逻辑
//             attack: function(e) {
//                 if (this.lastTarget === e) {
//                     this.duration++;
//                 } else {
//                     this.lastTarget = e;
//                     this.duration = 0;
//                 }
//                 var d = random(this.damageMin, this.damageMax);
//                 var damage = d * sq(this.duration);
//                 e.dealDamage(damage, this.type);
//                 this.onHit(e);
//             }
//         }
//     ]
// };

// ================================================================ slow Tower ================================================================
tower.slow = {
    // Display
    baseOnTop: false,
    color: [75, 119, 190], // 底色
    drawLine: false,
    length: 1.1,
    radius: 0.9,
    secondary: [189, 195, 199], // 次要颜色
    width: 0.3,
    get visual() { return t3_1Image; }, // 防御塔的样式图片
    // Misc
    name: 'slow',
    title: 'Slow Tower',
    // Stats
    cooldownMax: 90,
    cooldownMin: 60,
    cost: 60,
    damageMax: 0,
    damageMin: 0,
    range: 3, // 作用范围
    type: 'slow',

    // 波动效果计数器
    waveCounter: 0,
    draw: function() {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // 被选中时效果
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y);   // 绘制cd
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3);  //绘制升级按钮
        pop();
    },

    // Methods
    drawBarrel: function() {
        // fill(this.secondary);
        // var back = -this.length * ts / 2;
        // var side = this.width * ts / 2;
        // rect(back, -side, this.length * ts, this.width * ts);
    },

    // 攻击逻辑
    onAim: function(e) {
        this.attack(e);
    },

    // 攻击效果
    onHit: function(e) {
        e.doEffect('slow', 40);
    },

    // 目标选择
    target: function(entities) {
        entities = this.visible(entities);
        if (entities.length === 0) return;
        if (!this.canFire()) return;
        this.resetCooldown();

        // 绘制底色和波动效果
        this.drawEffect();

        // 对范围内的所有敌人应用效果
        for (var i = 0; i < entities.length; i++) {
            let monster = entities[i];
            let d = dist(this.pos.x, this.pos.y, monster.pos.x, monster.pos.y);
            if (d <= this.range * ts) { // 确保敌人在作用范围内
                this.onAim(monster);
            }
        }
    },

    // 绘制底色和波动效果
    drawEffect: function() {
        // 绘制底色
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], 50); // 半透明底色
        ellipse(this.pos.x, this.pos.y, this.range * 2 * ts, this.range * 2 * ts);

        // 绘制波动效果
        let waveRadius = (this.waveCounter % 40) / 40 * this.range * ts; // 波动半径（频率提高 1.5 倍）
        noFill();
        stroke(255, 255, 255, 100); // 波动颜色为白色，半透明
        strokeWeight(2);
        ellipse(this.pos.x, this.pos.y, waveRadius * 2, waveRadius * 2);

        // 更新波动计数器
        this.waveCounter++;
    },

    // 更新逻辑
    update() {
        this.angle += PI / 60;
        if (this.cd > 0) this.cd--;
    },

    // 升级选项
    upgrades: [
        {
            // Display
            get visual() { return t3_2Image; }, // 防御塔的样式图片

            // Misc
            name: 'slow',
            title: 'Slow Tower',
            // Stats
            cooldownMax: 75,
            cooldownMin: 50,
            cost: 80,
            damageMax: 0,
            damageMin: 0,
            range: 3, // 作用范围

            // 升级选项
            upgrades: [
                {
                    // Display
                    get visual() { return t3_3Image; }, // 防御塔的样式图片

                    // Misc
                    name: 'slow',
                    title: 'Slow Tower',
                    // Stats
                    cooldownMax: 65,
                    cooldownMin: 40,
                    cost: 120,
                    damageMax: 0,
                    damageMin: 0,
                    range: 3, // 作用范围
                }
            ]
        }
    ]
};

// ================================================================ Cannon Tower ================================================================
tower.bomb = {
    // Display
    baseOnTop: false,
    color: [102, 51, 153],
    drawLine: false,
    length: 0.6,
    width: 0.35,
    secondary: [103, 128, 159],
    get visual() { return t4_1Image; }, // 防御塔的样式图片
    // Misc
    name: 'Cannon Tower',
    title: 'Cannon Tower',
    // Stats
    cooldownMax: 180,
    cooldownMin: 120,
    cost: 100,
    damageMax: 30,
    damageMin: 20,
    range: 2,
    blastRadius: 1,
    particleAmt: 1,
    type: 'explosion',

    draw: function() {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // 被选中时效果
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y);   // 绘制cd
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3);  //绘制升级按钮
        pop();
    },
    // Methods
    drawBarrel: function() {
        // fill(this.secondary);
        // rect(0, -this.width * ts / 2, this.length * ts, this.width * ts);
        // fill(191, 85, 236);
        // ellipse(0, 0, this.radius * ts * 2 / 3, this.radius * ts * 2 / 3);
        // 根据塔的 radius 和全局 ts 缩放绘制贴图

        // push();
        // imageMode(CENTER);
        // image(t3_1Image, 0, 0, ts,ts);
        // pop();
    },
    onHit: function(e) {
        var s = new CannonExplosion(e.pos.x, e.pos.y, this.particleAmt);
        systems.push(s);
        var inRadius = getInRange(e.pos.x, e.pos.y, this.blastRadius, monsters);
        for (var i = 0; i < inRadius.length; i++)
        {
            var h = inRadius[i];
            var amt = round(random(this.damageMin, this.damageMax));
            h.dealDamage(amt, this.type);
        }
    },
    upgrades: [
        {
            // Display
            radius: 1.1,
            get visual() { return t4_2Image; }, // 防御塔的样式图片
            // Misc
            name: 'Cannon PLUS Tower',
            title: 'Cannon PLUS Tower',
            // Stats
            cooldownMax: 153,
            cooldownMin: 102,
            cost: 120,
            damageMax: 39,
            damageMin: 26,
            range: 2.2,
            particleAmt: 4,
            
            upgrades:[
                {
                    // Display
                    radius: 1.1,
                    get visual() { return t4_3Image; }, // 防御塔的样式图片

                    // Misc
                    name: 'Cannon MAX Tower',
                    title: 'Cannon MAX Tower',
                    // Stats
                    cooldownMax: 130,
                    cooldownMin: 87,
                    cost: 180,
                    damageMax: 51,
                    damageMin: 34,
                    range: 2.5,
                    particleAmt: 6,
                }
            ]
        }
    ]
};

// ================================================================ slow2 Tower ================================================================
tower.slow2 = {
    // Display
    baseOnTop: false,
    color: [75, 119, 190], // 底色
    drawLine: false,
    length: 1.1,
    radius: 0.9,
    secondary: [189, 195, 199], // 次要颜色
    width: 0.3,
    get visual() { return t7_1Image; }, // 防御塔的样式图片
    // Misc
    name: 'slow2',
    title: 'Slow Tower',
    // Stats
    cooldownMax: 0,
    cooldownMin: 0,
    cost: 150,
    damageMax: 0,
    damageMin: 0,
    range: 3, // 作用范围
    type: 'slow2',

    // 波动效果计数器
    waveCounter: 0,
    draw: function() {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // 被选中时效果
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y);   // 绘制cd
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3);  //绘制升级按钮
        pop();
    },

    // Methods
    drawBarrel: function() {
        // fill(this.secondary);
        // var back = -this.length * ts / 2;
        // var side = this.width * ts / 2;
        // rect(back, -side, this.length * ts, this.width * ts);
    },

    // 攻击逻辑
    onAim: function(e) {
        this.attack(e);
    },

    // 攻击效果
    onHit: function(e) {
        e.doEffect('slow2', 40);
    },

    // 目标选择
    target: function(entities) {
        entities = this.visible(entities);
        if (entities.length === 0) return;
        if (!this.canFire()) return;
        this.resetCooldown();

        // 绘制底色和波动效果
        this.drawEffect();

        // 对范围内的所有敌人应用效果
        for (var i = 0; i < entities.length; i++) {
            let monster = entities[i];
            let d = dist(this.pos.x, this.pos.y, monster.pos.x, monster.pos.y);
            if (d <= this.range * ts) { // 确保敌人在作用范围内
                this.onAim(monster);
            }
        }
    },

    // 绘制底色和波动效果
    drawEffect: function() {
        // 绘制底色
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], 50); // 半透明底色
        ellipse(this.pos.x, this.pos.y, this.range * 2 * ts, this.range * 2 * ts);

        // 绘制波动效果
        let waveRadius = (this.waveCounter % 40) / 40 * this.range * ts; // 波动半径（频率提高 1.5 倍）
        noFill();
        stroke(255, 255, 255, 100); // 波动颜色为白色，半透明
        strokeWeight(2);
        ellipse(this.pos.x, this.pos.y, waveRadius * 2, waveRadius * 2);

        // 更新波动计数器
        this.waveCounter++;
    },

    // 更新逻辑
    update() {
        this.angle += PI / 60;
        if (this.cd > 0) this.cd--;
    },

    // 升级选项
    upgrades: [
        {
            // Display
            get visual() { return t7_2Image; }, // 防御塔的样式图片
            // Misc
            name: 'slow2',
            title: 'Slow Tower',
            // Stats
            cooldownMax: 0,
            cooldownMin: 0,
            cost: 120,
            damageMax: 0,
            damageMin: 0,
            range: 3.25, // 作用范围

            // 升级选项
            upgrades: [
                {
                    // Display
                    get visual() { return t7_3Image; }, // 防御塔的样式图片
                    // Misc
                    name: 'slow',
                    title: 'Slow Tower',
                    // Stats
                    cooldownMax: 52,
                    cooldownMin: 33,
                    cost: 180,
                    damageMax: 0,
                    damageMin: 0,
                    range: 3.5, // 作用范围
                }
            ]
        }
    ]
};

// ================================================================ EMP Tower ================================================================
tower.emp = {
    // Display
    color: [255, 245, 45], // 底色
    get visual() { return t6_1Image; }, // 防御塔的样式图片
    // Misc
    name: 'EMP',
    title: 'EMP Tower',
    // Stats
    cooldownMax: 0,
    cooldownMin: 0,
    cost: 200,
    damageMax: 0,
    damageMin: 0,
    range: 3,       // 作用范围
    speed: 0.01,    // 速度
    radian: PI / 6,  // 弧度
    type: 'stun',
    stunnedDuration: 150, // 麻痹时长
    
    
    angleOffset: 0,      // 当前旋转的角度
    draw: function() {
        
        // 绘制干扰范围的弧形
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angleOffset);

        var r = this.range * ts;
        fill(this.color[0], this.color[1], this.color[2], 60);
        noStroke();
        arc(0, 0, r * 2, r * 2, 0, this.radian, PIE);

        pop();

        // 绘制塔
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // 被选中时效果
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y);   // 绘制cd
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3);  //绘制升级按钮
    },

    // 攻击效果
    onHit: function (e) {
        if (e.isStunned == false)
        {
            e.dealDamage(0, this.type);
            e.doEffect('stun', this.stunnedDuration);
        }
    },

    // 目标选择
    target: function(entities) {
        // 判断击中敌人
        entities = this.visible(entities);
        let startAngle = this.angleOffset;
        let endAngle = this.angleOffset + this.radian;
        for (var i = 0; i < entities.length; i++) {
            let enermy = entities[i];
            if (isPointInSector(enermy.pos.x, enermy.pos.y, this.pos.x, this.pos.y, this.range * ts, startAngle, endAngle)) {
                this.onHit(enermy);
            }
        }
    },

    // 更新逻辑
    update() {
        this.angleOffset = (this.angleOffset + this.speed) % TWO_PI;
    },

    // 升级选项
    upgrades: [
        {
            get visual() { return t6_2Image; }, // 防御塔的样式图片
            // Misc
            name: 'EMP PLUS',
            title: 'EMP PLUS Tower',
            // Stats
            cost: 250,
            range: 2.5,       // 作用范围
            speed: 0.02,    // 速度
            radian: PI / 4,  // 弧度
            stunnedDuration: 200, // 麻痹时长

            upgrades: [
                {
                    get visual() { return t6_3Image; }, // 防御塔的样式图片
                    // Misc
                    name: 'EMP MAX',
                    title: 'EMP MAX Tower',
                    // Stats
                    cost: 350,
                    range: 3,       // 作用范围
                    speed: 0.03,    // 速度
                    radian: PI / 2,  // 弧度
                    stunnedDuration: 300, // 麻痹时长
                }
            ]
        }
    ]
};