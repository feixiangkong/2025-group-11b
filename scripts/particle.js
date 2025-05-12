class Particle {  // 定义粒子类
    constructor(pos, speed) {  // 构造函数，接受位置 pos 和速度 speed 作为参数
        this.pos = pos.copy();  // 复制 pos 位置，确保不会修改原始位置
        this.vel = p5.Vector.random2D().mult(random(-1, 1) * speed * ts / 24);  // 生成随机方向的速度向量，并根据 speed 调整
        this.lifespan = 255;  // 设定粒子的初始生命值
        this.decay = 2;  // 设定粒子的衰减速度
        this.color = [0, 0, 0];  // 设定粒子的颜色（默认黑色）
        this.radius = 4;  // 设定粒子的半径
    }

    draw() {  // 绘制粒子
        stroke(0, this.lifespan);  // 设定描边颜色，透明度随 lifespan 变化
        fill(this.color[0], this.color[1], this.color[2], this.lifespan);  // 设定填充颜色，并应用透明度
        var r = this.radius * ts / 24 * 2;  // 计算粒子大小
        ellipse(this.pos.x, this.pos.y, r, r);  // 以圆形绘制粒子
    }

    isDead() {  // 判断粒子是否消亡
        return this.lifespan < 0;  // 如果生命值小于 0，返回 true
    }

    run() {  // 运行粒子（更新状态并绘制）
        if (!paused) this.update();  // 如果未暂停，更新粒子状态
        this.draw();  // 绘制粒子
    }

    update() {  // 更新粒子状态
        this.pos.add(this.vel);  // 位置按速度移动
        this.lifespan -= this.decay;  // 生命值减少（衰减）
    }
}


class Fire extends Particle {  // 继承 Particle 类，定义火焰粒子
    constructor(pos, speed) {  // 构造函数
        super(pos, speed);  // 调用父类构造函数
        this.angle = random(TWO_PI);  // 设定初始角度（随机方向）
        this.angVel = random(-1, 1);  // 设定角速度（随机旋转速度）
        this.decay = random(3, 6);  // 设定衰减速度（火焰粒子消失更快）
        this.color = [200 + random(55), random(127), random(31)];  // 设定火焰颜色（橙红色范围）
        this.radius = randint(2, 6);  // 设定火焰粒子的半径（随机大小）
    }

    draw() {  // 绘制火焰粒子
        stroke(0, this.lifespan);  // 设定描边颜色
        fill(this.color[0], this.color[1], this.color[2], this.lifespan);  // 设定填充颜色
        rectMode(CENTER);  // 设定矩形模式为中心对齐
        push();  // 保存当前绘图状态
        translate(this.pos.x, this.pos.y);  // 移动到粒子位置
        rotate(this.angle);  // 旋转粒子
        var r = this.radius * ts / 24 * 2;  // 计算粒子大小
        rect(0, 0, r, r);  // 以矩形绘制火焰粒子
        pop();  // 恢复绘图状态
        rectMode(CORNER);  // 恢复矩形模式为默认（左上角对齐）
    }

    update() {  // 更新火焰粒子状态
        this.pos.add(this.vel);  // 位置按速度移动
        this.angle += this.angVel;  // 角度随角速度变化（产生旋转效果）
        this.lifespan -= this.decay;  // 生命值减少（衰减）
    }
}


class Bomb extends Particle {  // 继承 Particle 类，定义炸弹粒子
    constructor(pos, speed) {  // 构造函数
        super(pos, speed);  // 调用父类构造函数
        this.decay = random(8, 10);  // 设定较快的衰减速度
        this.color = [151 + random(80), 45 + random(60), 200 + random(55)];  // 设定炸弹颜色（紫色调）
        this.radius = randint(2, 6);  // 设定炸弹粒子的半径
    }
}


class Shrapnel extends Fire {  // 继承 Fire 类，定义弹片粒子
    constructor(pos, speed) {  // 构造函数
        super(pos, speed);  // 调用父类构造函数
        this.decay = random(8, 10);  // 设定较快的衰减速度
        var r = 63 + random(127);  // 设定颜色为灰色（从深灰到浅灰）
        this.color = [r, r, r];  // 设定弹片颜色
        this.radius = randint(2, 6);  // 设定弹片粒子的半径
    }
}


class Stone extends Particle {
    
    constructor(pos, speed) {
        super(pos, speed);
        this.decay = random(8, 10);
        this.color = [151 + random(80), 45 + random(60), 200 + random(55)];
        this.radius = random(0.2, 0.5);
        this.rotAngle = random(TWO_PI);
        this.rotateSpd = random(0.1);
    }

    draw()
    {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rotAngle);
        let rad = this.radius * ts;
        

        image(imgAttackStone, 0, 0, rad, rad);

        pop();
    }

    update()
    {
        super.update();
        this.rotAngle += this.rotateSpd;
    }

}

class Cannon extends Particle{

    constructor(pos, speed, radius) {
        super(pos, speed);
        this.radius = radius;
        this.rotAngle = random(TWO_PI);
        this.frameIndex = 0;
        this.frameNumbers = 7;
    }

    draw()
    {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rotAngle);

        let rad = this.radius * ts;
        let sprties = imgAttackCannonExplosion;
        let frameWidth = sprties.gameWidth / this.frameNumbers;
        let frameHeight = sprties.height;
        let frameX = this.frameIndex * frameWidth;
        imageMode(CENTER);
        image(sprties, 0, 0, rad, rad, frameX, 0, frameWidth, frameHeight);

        pop();
    }

    isDead() {
        return this.frameIndex >= this.frameNumbers;
    }

    update()
    {
        if (frameCount % 5 == 0)
        {
            this.frameIndex ++;
        }
    }
}