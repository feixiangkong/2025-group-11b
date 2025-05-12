class Tower {  // 创建塔的类
    constructor(col, row) {  // 构造函数，初始化塔的位置和属性
        // Display  // 渲染相关
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
        this.gridPos = createVector(col, row);  // 格子位置
        this.pos = createVector(col*ts + ts/2, row*ts + ts/2);  // 屏幕位置

        // Stats  // 塔的属性
        this.cooldown = 0.01;       // 冷却时间
        this.cooldownMax = 0;       // 最大冷却时间
        this.cooldownMin = 0;       // 最小冷却时间
        this.cost = 0;              // 塔的购买成本
        this.damageMax = 20;        // 最大伤害
        this.damageMin = 1;         // 最小伤害
        this.range = 3;             // 攻击范围（瓦片单位）
        this.totalCost = 0;         // 总成本
        this.type = 'physical';     // 伤害类型
        this.upgrades = [];         // 升级列表
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

    // Check if cooldown is completed  // 检查冷却时间是否完成
    canFire() {
        return this.cd === 0;  // 如果冷却时间为0，表示可以攻击
    }

    // 辅助深克隆方法
    deepClone(obj, hash = new WeakMap()) {
        // 基本类型直接返回
        if (obj === null || typeof obj !== 'object') return obj;

        // 如果已经克隆过，直接返回克隆后的对象
        if (hash.has(obj)) return hash.get(obj);

        let clone;

        // 处理数组
        if (Array.isArray(obj)) {
            clone = [];
            hash.set(obj, clone); // 记录当前对象
            clone = obj.map(item => this.deepClone(item, hash));
            return clone;
        }

        // 处理普通对象
        clone = {};
        hash.set(obj, clone); // 记录当前对象

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clone[key] = this.deepClone(obj[key], hash);
            }
        }

        return clone;
    }
    copyTower(template) {
        // 如果没有传入模板，使用空对象
        template = typeof template === 'undefined' ? {} : template;

        // 获取模板的所有键
        var keys = Object.keys(template);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = template[key];

            // 深克隆逻辑
            if (value && typeof value === 'object') {
                // 如果是数组，创建新数组并递归克隆元素
                if (Array.isArray(value)) {
                    this[key] = value.map(item =>
                        item && typeof item === 'object' ? this.deepClone(item) : item
                    );
                }
                // 如果是普通对象，递归克隆
                else {
                    this[key] = this.deepClone(value);
                }
            }
            // 基本类型直接赋值
            else {
                this[key] = value;
            }
        }
    }
    draw() {  // 绘制塔
        // Draw turret base  // 绘制塔基
        if (this.hasBase && !this.baseOnTop) this.drawBase();
        // Draw barrel  // 绘制炮管
        if (this.hasBarrel) {
            push();
            translate(this.pos.x, this.pos.y);
            rotate(this.angle);  // 旋转炮管
            this.drawBarrel();  // 绘制炮管
            pop();
        }
        // Draw turret base  // 再次绘制塔基
        if (this.hasBase && this.baseOnTop) this.drawBase();
    }

    // Draw barrel of tower (moveable part)  // 绘制塔的炮管（可移动部分）
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

    // Functionality once entity has been targeted  // 目标被选中后的操作
    onAim(e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);  // 目标锁定
        if (!this.canFire()) return;  // 如果不能攻击，返回
        this.resetCooldown();  // 重置冷却时间
        this.attack(e);  // 攻击目标
        // Draw line to target  // 绘制攻击目标的连线
        if (!this.drawLine) return;
        stroke(this.color);  // 设置线条颜色
        strokeWeight(this.weight);  // 设置线条宽度
        line(this.pos.x, this.pos.y, e.pos.x, e.pos.y);  // 绘制连线
        strokeWeight(1);  // 重置线条宽度
    }

    onCreate() {  // 创建时的初始化
        this.cd = 0;  // 设置冷却时间为0
    }

    onHit(e) {}  // 目标被击中时的操作

    // 塔被攻击时加点效果
    dealDamage(amt, type) { // 处理伤害



        if (this.health > 0) { // 如果生命值大于 0
            this.health -= amt ; // 计算最终伤害


        }
        if (this.health <= 0) this.kill(); // 如果生命值小于等于 0，调用死亡逻辑


    }

    resetCooldown() {  // 重置冷却时间
        var cooldown = round(random(this.cooldownMin, this.cooldownMax));  // 随机生成冷却时间
        this.cd = cooldown;  // 设置冷却时间
        this.cooldown = cooldown;
    }

    // Sell price  // 塔的出售价格
    sellPrice() {
        return floor(this.totalCost * sellConst);  // 返回出售价格
    }

    // Target correct monster  // 锁定正确的怪物
    target(entities) {
        entities = this.visible(entities);  // 获取可见的怪物
        if (entities.length === 0) return;  // 如果没有可见怪物，返回
        var t = getTaunting(entities);  // 获取挑衅的怪物
        if (t.length > 0) entities = t;  // 如果有挑衅的怪物，选择它们
        var e = getFirst(entities);  // 获取第一个怪物
        if (typeof e === 'undefined') return;  // 如果没有目标，返回
        this.onAim(e);  // 锁定目标并攻击
    }

    update() {  // 更新塔的状态
        if (this.cd > 0) this.cd--;  // 如果冷却时间大于0，减少冷却时间
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
    diaplayRange(cx, cy)
    {
        stroke(255, 237, 102);
        strokeWeight(2);
        fill(this.color[0], this.color[1], this.color[2], 40);
        //fill(100, 40);
        // 攻击范围半径
        var r = this.range * ts * 2;
        circle(cx, cy, r);
    }

    // 显示剩余cd
    displayCD(cx, cy)
    {
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
    }
    displayUpgrade(cx, cy) {
        let hasUpgrade = this.upgrades.length > 0;
        if (!hasUpgrade) return;
        let enoughCash = cash > this.upgrades[0].cost;
        let icon = enoughCash ? iconUpgrade : iconUpgradeGrey;
        let scale = 0.2;
        image(icon, cx, cy, ts * scale, ts * scale); // 移除 sin(angle) 浮动计算
    }
}
