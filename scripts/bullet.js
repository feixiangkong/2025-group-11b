// 定义 Bullet 类：用于模拟子弹飞行效果
class Bullet {
    constructor(x, y, target, damage, speed = 10) { // 构造函数，初始化子弹属性
        this.pos = createVector(x, y); // 设置子弹位置
        this.target = target; // 目标对象
        this.damage = damage; // 伤害值
        this.speed = speed; // 移动速度

        // 计算单位方向向量
        this.dir = p5.Vector.sub(target.pos, createVector(x, y)).normalize();
        this.alive = true; // 子弹存活状态

        // 子弹尺寸（基于 ts 缩放）
        this.gameWidth = ts * 0.5; // 子弹宽度
        this.height = ts * 0.2; // 子弹高度
    }

    // 新增方法：判断子弹是否存活
    isDead() {
        return !this.alive; // 返回存活状态的反值
    }

    // 新增一个空的 steer 方法，避免调用时出错
    steer() {
        // Bullet 不需要额外的转向逻辑
    }

    // 判断子弹是否到达目标附近
    reachedTarget() {
        return this.pos.dist(this.target.pos) < this.target.radius * ts * 0.8;
    }

    update() { // 更新子弹状态
        // 每帧更新目标方向
        this.dir = p5.Vector.sub(this.target.pos, this.pos).normalize();
        this.pos.add(p5.Vector.mult(this.dir, this.speed)); // 按方向移动

        if (this.reachedTarget()) { // 如果到达目标
            this.explode(); // 触发爆炸
        }
    }

    draw() { // 绘制子弹
        push();
        translate(this.pos.x, this.pos.y); // 移动坐标到子弹位置
        rotate(this.dir.heading()); // 旋转子弹方向
        // noStroke();
        // fill(255, 204, 0); // 子弹主体为亮黄色
        //
        // // 绘制一个带圆角的矩形模拟子弹体
        // rectMode(CENTER);
        // rect(0, 0, this.gameWidth, this.height, 3);
        //
        // // 在前端绘制一个小三角形作为子弹尖
        // fill(255, 255, 100);
        // triangle(this.gameWidth / 2, -this.height / 2, this.gameWidth / 2, this.height / 2, this.gameWidth / 2 + 4, 0);

        image(t1Image,0,0,this.gameWidth*1.5, this.height*1.5);
        pop();
    }

    // **添加 `explode()` 方法**
    explode() {
        if (this.alive) { // 只有存活状态才触发爆炸
            this.target.dealDamage(this.damage, 'physical'); // 造成物理伤害
            this.alive = false; // 设置子弹为死亡状态

            // 这里可以添加粒子效果，比如火花、烟雾等
            let explosion = new RocketExplosion(this.pos.x, this.pos.y);
            for (let i = 0; i < 10; i++) {
                explosion.addParticle();
            }
            systems.push(explosion); // 添加到粒子系统
        }
    }

    // **添加 `kill()` 方法**
    kill() {
        this.alive = false; // 设置子弹为死亡状态
    }
}

// 定义 Bullet 类：用于模拟子弹飞行效果
class Bullet2 {
    constructor(x, y, target, damage, speed = 10) { // 构造函数，初始化子弹属性
        this.pos = createVector(x, y); // 设置子弹位置
        this.target = target; // 目标对象
        this.damage = damage; // 伤害值
        this.speed = speed; // 移动速度

        // 计算单位方向向量
        this.dir = p5.Vector.sub(target.pos, createVector(x, y)).normalize();
        this.alive = true; // 子弹存活状态

        // 子弹尺寸（基于 ts 缩放）
        this.gameWidth = ts * 0.5; // 子弹宽度
        this.height = ts * 0.2; // 子弹高度
    }

    // 新增方法：判断子弹是否存活
    isDead() {
        return !this.alive; // 返回存活状态的反值
    }

    // 新增一个空的 steer 方法，避免调用时出错
    steer() {
        // Bullet 不需要额外的转向逻辑
    }

    // 判断子弹是否到达目标附近
    reachedTarget() {
        return this.pos.dist(this.target.pos) < this.target.radius * ts * 0.8;
    }

    update() { // 更新子弹状态
        // 每帧更新目标方向
        this.dir = p5.Vector.sub(this.target.pos, this.pos).normalize();
        this.pos.add(p5.Vector.mult(this.dir, this.speed)); // 按方向移动

        if (this.reachedTarget()) { // 如果到达目标
            this.explode(); // 触发爆炸
        }
    }

    draw() { // 绘制子弹
        push();
        translate(this.pos.x, this.pos.y); // 移动坐标到子弹位置
        rotate(this.dir.heading()); // 旋转子弹方向
        // noStroke();
        // fill(255, 204, 0); // 子弹主体为亮黄色
        //
        // // 绘制一个带圆角的矩形模拟子弹体
        // rectMode(CENTER);
        // rect(0, 0, this.gameWidth, this.height, 3);
        //
        // // 在前端绘制一个小三角形作为子弹尖
        // fill(255, 255, 100);
        // triangle(this.gameWidth / 2, -this.height / 2, this.gameWidth / 2, this.height / 2, this.gameWidth / 2 + 4, 0);
        fill(0);
        ellipse(0,0,10,10);

        pop();
    }

    // **添加 `explode()` 方法**
    explode() {
        if (this.alive) { // 只有存活状态才触发爆炸
            this.target.dealDamage(this.damage, 'physical'); // 造成物理伤害
            this.alive = false; // 设置子弹为死亡状态

            // 这里可以添加粒子效果，比如火花、烟雾等
            let explosion = new RocketExplosion(this.pos.x, this.pos.y);
            for (let i = 0; i < 10; i++) {
                explosion.addParticle();
            }
            systems.push(explosion); // 添加到粒子系统
        }
    }

    // **添加 `kill()` 方法**
    kill() {
        this.alive = false; // 设置子弹为死亡状态
    }
}


// 定义 Bullet 类：用于模拟子弹飞行效果
class FireBall extends Bullet{
     // 绘制FireBall
    draw() {
        push();
        translate(this.pos.x, this.pos.y); // 移动坐标到子弹位置
        rotate(this.dir.heading()); // 旋转子弹方向

        image(fireBallImage,0,0,this.gameWidth*3, this.height*3);
        pop();
    }

    // **添加 `explode()` 方法**
    explode() {
        if (this.alive) { // 只有存活状态才触发爆炸

            this.target.dealDamage(this.damage, 'fire'); // 造成物理伤害
            this.alive = false; // 设置子弹为死亡状态
        }
    }
}


class Arrow extends Bullet{
    constructor(x, y, target, damage, speed = 10) {
      super(x, y, target, damage, speed);
      
      // 尺寸
      this.gameWidth = ts * 0.5;
      this.height = ts * 0.2;
    }
    // 重写绘制
    draw() {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.dir.heading());
      
      // 绘制
      image(imgAttackArrow, -this.gameWidth / 2, -this.height / 2, this.gameWidth, this.height);
      
      pop();
    }
}
  
class SparkBullet extends Bullet{
constructor(x, y, target, damage, speed = 10) {
    super(x, y, target, damage, speed);
    
    // 尺寸
    this.gameWidth = ts * 0.5;
    this.height = ts * 0.2;
}
// 重写绘制
draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.dir.heading());
    
    // 绘制
    image(imgAttackBullet, -this.gameWidth / 2, -this.height / 2, this.gameWidth, this.height);
    
    pop();
}
}


