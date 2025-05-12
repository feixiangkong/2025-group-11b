class Monster {
    constructor(x, y, thePath) { // 构造函数，初始化怪物
        // Display
        this.color = [0, 0, 0]; // 怪物颜色
        this.radius = 0.5; // 半径（以格子为单位）
        this.path = thePath; // 把参数赋给 this.path

        // Misc
        this.alive = true; // 是否存活
        this.effects = []; // 状态效果
        this.name = 'monster'; // 怪物名称
        this.sound = 'pop'; // 死亡音效

        // Position
        this.pos = createVector(x, y); // 位置向量
        this.vel = createVector(0, 0); // 速度向量

        this.pathIndex = 0; // 当前走到第几个节点

        // Stats
        this.cash = 0; // 击杀奖励
        this.damage = 1; // 对玩家的伤害
        this.health = 1; // 生命值
        this.immune = []; // 免疫的伤害类型
        this.resistant = []; // 抵抗的伤害类型
        this.weak = []; // 易伤的伤害类型
        this.speed = 1; // 移动速度（4 是最大值）
        this.taunt = false; // 是否嘲讽（强制塔攻击）
        this.isStunned = false; // 是否麻痹

        // frame defalt set
        this.frameIndex = 0; // 当前帧索引
        this.frameCount = 4; // 总帧数
        this.animationSpeed = 5; // 控制动画切换速度
        this.facingRight = true; // 默认朝右
        this.flashType ='';
        this.range =4;//攻擊范圍
        this.isSlow2=false;
        this.count =0;
        this.oldSpeed;
        this.isProtect = false;
        
        this.stunFrameIndex = 0;
        this.stunFrameCount = 12;
    }
    
    draw() { // 绘制怪物
        push(); // 保存当前绘图状态
        translate(this.pos.x, this.pos.y); // 移动到怪物位置
        rotate(this.vel.heading()); // 根据速度方向旋转

        // 设置图片模式，以中心点对齐
        imageMode(CENTER);

        // 如果图片未加载，则使用默认颜色
        stroke(0); // 设置描边颜色
        fill(this.getColor()); // 设置填充颜色
        var back = -0.7 * ts / 3; // 计算四边形后部位置
        var front = back + 0.7 * ts; // 计算四边形前部位置
        var side = 0.9 * ts / 2; // 计算四边形侧边位置
        quad(back, -side, 0, 0, back, side, front, 0); // 绘制四边形
        pop(); // 恢复绘图状态
    }

    // 怪物被攻击时加点效果
    dealDamage(amt, type) { // 处理伤害

        var mult; // 伤害倍数
        if (this.immune.includes(type)) { // 如果免疫该类型伤害
            mult = 0; // 免疫：不受伤害
        } else if (this.resistant.includes(type)) { // 如果抵抗该类型伤害
            mult = 1 - resistance; // 伤害减少 resistance
        } else if (this.weak.includes(type)) { // 如果易伤该类型伤害
            mult = 1 + weakness; // 受到多 weakness 伤害
        } else { // 默认情况
            // type = 'physical'; // 默认物理攻击
            mult = 1; // 正常伤害
        }
        if(this.isProtect==false){
            if (this.health > 0) { // 如果生命值大于 0
                this.health -= amt * mult; // 计算最终伤害

                this.flash(type, 60); // 触发对应类型的特效
            }
        }

        if (this.health <= 0) this.onKilled(); // 如果生命值小于等于 0，调用死亡逻辑


    }

    // 绘制图片滤镜效果
    drawImageTintEffect(type)
    {
        if (type === 'physical') tint(255, 0, 0);           // 物理攻击（红色）
        else if (type === 'water') tint(0, 191, 255);       // 水攻击（蓝色）
        else if (type === 'fire') tint(255, 69, 0);         // 火攻击（橙红色）
        else if (type === 'line') tint(255, 215, 0);   // 雷电攻击（黄色）
        else if (type === 'slow') tint(173, 216, 230);      // 冰霜（浅蓝色）
        else noTint();                                      // 正常颜色
    }

    // 绘制伤害效果
    drawDamageVisual(type)
    {
        if (type === 'physical') this.createGlowEffect([255, 0, 0]);            // 物理攻击光晕
        else if (type === 'water') this.createRippleEffect([0, 191, 255]);      // 水波纹
        else if (type === 'fire') this.createGlowEffect([255, 69, 0]);          // 火焰光晕
        else if (type === 'line') this.createLightningEffect([255, 215, 0]);   // 电弧
        else if (type === 'slow') this.createIceEffect([173, 216, 230]);        // 冰霜冻结
        else noTint();                                                          // 正常颜色
    }

    // flash(color, duration) { // 闪烁效果
    //     let originalColor = this.color; // 记录原始颜色
    //     let flashCount = 5; // 闪烁 5 次
    //
    //     let interval = setInterval(() => { // 设置闪烁间隔
    //         this.color = this.color === originalColor ? color : originalColor; // 闪烁颜色
    //     }, duration * 5); // 频率更快
    //
    //     setTimeout(() => { // 设置闪烁结束
    //         clearInterval(interval); // 停止闪烁
    //         this.color = originalColor; // 恢复原色
    //     }, duration * flashCount); // 总共闪烁 flashCount 次
    // }

    createGlowEffect(color) { // 创建光晕效果
        noFill(); // 取消填充
        stroke(color[0], color[1], color[2], 100); // 设置描边颜色
        strokeWeight(4); // 设置描边粗细

        for (let i = 0; i < 3; i++) { // 绘制多层光晕
            let size = ts * (1.2 + i * 0.2); // 计算光晕大小
            ellipse(0, 0, size, size); // 绘制光晕
        }
    }

    flash(type, duration) { // 闪烁效果
        this.flashType = type; // 记录攻击类型
        this.flashActive = true; // 启动闪烁

        setTimeout(() => { // 设置闪烁结束
            this.flashActive = false; // 关闭特效
            this.flashType = null; // 恢复正常颜色
        }, duration * 10); // 闪烁持续时间
    }

    // Apply new status effect
    // Only one of each is allowed at a time
    // 被塔施加效果，与 dealDamage 区别
    doEffect(name, duration) { // 施加状态效果
        if (this.immune.includes(name)) return; // 如果免疫该效果，则返回
        if (getByName(this.effects, name).length > 0) return; // 如果已有该效果，则返回

            var e = createEffect(duration, effects[name]);


        e.onStart(this);
        e.onTick(this);
        this.effects.push(e);
    }

    createRippleEffect(color) { // 创建涟漪效果
        noFill(); // 取消填充
        stroke(color[0], color[1], color[2], 150); // 设置描边颜色
        strokeWeight(2); // 设置描边粗细

        for (let i = 0; i < 3; i++) { // 绘制多层涟漪
            let size = ts * (1.0 + i * 0.2); // 计算涟漪大小
            ellipse(0, 0, size, size); // 绘制涟漪
        }
    }

    createLightningEffect(color) { // 创建闪电效果
        stroke(color[0], color[1], color[2]); // 设置描边颜色
        strokeWeight(3); // 设置描边粗细
        let boltX = random(-this.radius * ts, this.radius * ts); // 随机闪电起点
        let boltY = random(-this.radius * ts, this.radius * ts); // 随机闪电起点
        line(0, 0, boltX, boltY); // 绘制闪电
        line(boltX, boltY, boltX + random(-5, 5), boltY + random(-5, 5)); // 绘制闪电分支
    }

    createIceEffect(color) { // 创建冰冻效果
        stroke(color[0], color[1], color[2], 180); // 设置描边颜色
        strokeWeight(2); // 设置描边粗细
        for (let i = 0; i < 6; i++) { // 绘制多条冰刺
            let angle = (TWO_PI / 6) * i; // 计算冰刺角度
            let x = cos(angle) * this.radius * ts; // 计算冰刺位置
            let y = sin(angle) * this.radius * ts; // 计算冰刺位置
            line(0, 0, x, y); // 绘制冰刺
        }
    }

    
    // 创建麻痹效果（由effects.stun调用）
    createStunnedEffect() {
        let sprites = imgAttackStun;
        let frameWidth = sprites.gameWidth / this.stunFrameCount;
        let frameHeight = sprites.height;
        let frameX = this.stunFrameIndex * frameWidth;
        imageMode(CENTER);
        image(sprites, this.pos.x + 15, this.pos.y + 0, ts, ts, frameX, 0, frameWidth, frameHeight);
        this.stunFrameIndex = (this.stunFrameIndex + 1) % this.stunFrameCount;
    }
    

    shake(amount) { // 震动效果
        let originalX = this.pos.x; // 记录原始 X 位置
        let originalY = this.pos.y; // 记录原始 Y 位置
        let shakeCount = 5; // 抖动次数

        let interval = setInterval(() => { // 设置震动间隔
            this.pos.x = originalX + random(-amount, amount); // 随机震动 X 位置
            this.pos.y = originalY + random(-amount, amount); // 随机震动 Y 位置
        }, 50); // 每 50ms 震动一次

        setTimeout(() => { // 设置震动结束
            clearInterval(interval); // 停止震动
            this.pos.x = originalX; // 恢复原始 X 位置
            this.pos.y = originalY; // 恢复原始 Y 位置
        }, shakeCount * 50); // 震动 shakeCount 次
    }

    // Draw health bar
    showHealth() { // 显示生命条
        var percent = this.health / this.maxHealth;
        if (percent <= 0 || percent >= 1.0) return;
        
        push();
        translate(this.pos.x, this.pos.y);

        var edge = 0.7 * ts / 2;
        var gameWidth = edge * percent * 2;
        var top = 0.2 * ts;
        var height = 0.15 * ts;

        // 血条
        noStroke();
        fill(207, 0, 15);
        rect(-edge, top, gameWidth, height);
        // 血槽
        stroke(255);
        strokeWeight(2);
        noFill();
        rect(-edge, top, edge * 2, height);

        pop();
    }

    getColor() { // 获取颜色
        var l = this.effects.length; // 获取效果数量
        if (l > 0) return this.effects[l - 1].color; // 如果有效果，返回效果颜色
        return this.color; // 否则返回默认颜色
    }

    ifDie() { // 判断是否死亡
        return !this.alive; // 返回是否存活
    }

    kill() { // 杀死怪物
        this.alive = false; // 设置存活状态为 false
    }

    onBorn() { // 出生时调用
        this.maxHealth = this.health; // 设置最大生命值
    }

    quit() { // 退出逻辑
        health -= this.damage; // 扣除玩家生命值
        this.kill(); // 杀死怪物
    }

    onKilled() { // 死亡时调用
        if (this.alive) { // 如果存活
            cash += this.cash; // 增加玩家金钱
            this.kill(); // 杀死怪物
            if (sounds.hasOwnProperty(this.sound)) { // 如果有音效
                sounds[this.sound].play(); // 播放音效
            }
        }
    }

    onTick() {} // 每帧调用

    // Return speed in pixels per tick
    // Adjusted to not be affected by zoom level
    pxSpeed() { // 计算每帧移动速度
        return this.speed * ts / 24 * monsterSpeedMultiplier; // 返回速度
    }

    // Change direction based on pathfinding map
    move() { // 移动逻辑
        // 如果没有预先设定的 BFS 路径，或者路径是空，就不移动
        if (!this.path || this.path.length === 0) return;

        // 如果已经走到或超过 path.length，说明怪物到终点了
        if (this.pathIndex >= this.path.length) {
            // 你可以在这里扣血、kill 怪物等操作
            // this.quit(); // 或 something
            return;
        }

        // 要前往的下一个节点
        let tile = this.path[this.pathIndex];
        // 把网格坐标转为像素坐标
        let targetPos = center(tile.col, tile.row);

        // 计算本帧移动
        let dir = p5.Vector.sub(targetPos, this.pos);
        let dist = dir.mag();
        let step = this.pxSpeed(); // 每帧走的像素距离

        if (dist <= step) {
            // 一帧之内就能到达目标点
            this.pos = targetPos.copy();
            this.pathIndex++; // 前进到下一个点

            // 如果已经是终点，可以额外处理
            if (this.pathIndex >= this.path.length) {
                // 抵达终点 => 扣血 + kill
                this.quit();
            }
        } else {
            // 还在路上 => 继续往目标前进
            dir.normalize();
            dir.mult(step);
            this.pos.add(dir);
        }
    }
    visible(entities) {
        return getInRange(this.pos.x, this.pos.y, this.range, entities);  // 获取在范围内的实体
    }
    target(entities) {
        entities = this.visible(entities);  // 获取可见的怪物
        if (entities.length === 0) return;  // 如果没有可见怪物，返回

        var e = getFirst(entities);  // 获取第一个怪物
        if (typeof e === 'undefined') return;  // 如果没有目标，返回
        this.onAim(e);  // 锁定目标并攻击
    }
    onAim(e) {

    }

    update() { // 更新逻辑
        // Apply status effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            let e = this.effects[i];
            e.update(this);

            if (e.isDead()) this.effects.splice(i, 1);
        }

        // Movement
        // this.vel.limit(96 / ts);
        this.vel.limit(this.pxSpeed());
        this.pos.add(this.vel);
    }
}