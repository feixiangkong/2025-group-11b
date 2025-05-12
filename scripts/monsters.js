function createMonster(x, y, template) {
    // 关键：再把 BFS 路径存进 e.path 里
    let bfsPath = findPathBFS(grid); // 使用 BFS 寻找路径

    let e = new Monster(x, y, bfsPath); // 创建一个怪物实例
    e.path = bfsPath || []; // 赋值路径信息

    // 把 monster[name] 里的属性赋到 e 上
    Object.assign(e, template); // 复制模板属性到怪物实例

    // 确保所有键都填充到 e 上
    template = typeof template === 'undefined' ? {} : template; // 处理未定义的模板
    var keys = Object.keys(template); // 获取模板的所有键
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        e[key] = template[key]; // 赋值每个键到怪物实例
    }
    e.onBorn(); // 触发出生事件
    return e; // 返回创建的怪物
}

var monster = {}; // 定义怪物对象存储不同类型的怪物

function loadMoster() {
    // 定义强盗怪物 Bandit
    monster.Bandit = {
        color: [0, 255, 0], // 颜色
        name: 'Bandit', // 名称
        image: BanditImg, // 图片
        cash: 8, // 击败后奖励金钱
        health: 50, // 生命值
        speed: 0.6, // 移动速度
        imageIndex: 0, // 记录当前动画帧
        draw() {


            push();
            imageMode(CENTER); // 设置图片模式为中心对齐
            translate(this.pos.x, this.pos.y); // 位置移动
            rotate(this.vel.heading()); // 旋转角度

            // 被攻击特效（滤镜）
            this.drawImageTintEffect(this.flashType);
            // 绘制敌人
            image(m1Images[this.imageIndex], 0, 0, ts, ts);
            // 被攻击环境效果
            this.drawDamageVisual(this.flashType);
            
            pop();

            if (paused == false) { // 如果游戏未暂停
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m1Images.length; // 切换动画帧
                }
            }
        }
    };

    // 定义攻城槌怪物 BatteringRam
    monster.BatteringRam = {
        color: [255, 0, 0], // 颜色
        radius: 0.6, // 半径
        name: 'BatteringRam', // 名称
        speed: 0.4, // 速度
        cash: 15, // 击败后奖励金钱
        health: 200, // 生命值
        frameIndex: 0, // 记录当前动画帧索引
        frameCount: 3, // 总帧数
        image: m_2Image, // 图片
        imageIndex: 0, // 记录动画索引
        animationSpeed: 25, // 控制动画速度
        facingRight: true, // 是否朝右
        immune: ['regen'], // 免疫属性
        draw() {
            push();
            imageMode(CENTER); // 设置图片模式为中心对齐
            translate(this.pos.x, this.pos.y); // 位置移动
            rotate(this.vel.heading()); // 旋转角度

            // 被攻击特效（滤镜）
            this.drawImageTintEffect(this.flashType);
            // 绘制敌人
            image(m2Images[this.imageIndex], 0, 0, ts, ts);
            // 被攻击环境效果
            this.drawDamageVisual(this.flashType);
            
            pop();
            
            if (paused == false) { // 如果游戏未暂停
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m2Images.length; // 切换动画帧
                }
            }
        }
    };


    monster.Mouse = {
        color: [255, 0, 0], // 颜色
        radius: 0.6, // 半径
        name: 'Mouse', // 名称
        speed: 0.75, // 速度
        cash: 5, // 击败后奖励金钱
        health: 30, // 生命值
        frameIndex: 0, // 记录当前动画帧索引
        frameCount: 3, // 总帧数
        image: m3Image, // 图片
        imageIndex: 0, // 记录动画索引
        animationSpeed: 25, // 控制动画速度
        facingRight: true, // 是否朝右
        immune: ['regen'], // 免疫属性
        draw() {
            push();
            imageMode(CENTER); // 设置图片模式为中心对齐
            translate(this.pos.x, this.pos.y); // 位置移动
            rotate(this.vel.heading()); // 旋转角度

            // 被攻击特效（滤镜）
            this.drawImageTintEffect(this.flashType);
            // 绘制敌人
            image(m3Images[this.imageIndex], 0, 0, ts, ts);
            // 被攻击环境效果
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // 如果游戏未暂停
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m3Images.length; // 切换动画帧
                }
            }
        }
    };

    monster.PirateRaider = {
        color: [255, 0, 0], // 颜色
        radius: 0.6, // 半径
        name: 'PirateRaider', // 名称
        speed: 0.5, // 速度
        cash: 12, // 击败后奖励金钱
        health: 150, // 生命值
        frameIndex: 0, // 记录当前动画帧索引
        frameCount: 3, // 总帧数
        image: m4Image, // 图片
        imageIndex: 0, // 记录动画索引
        animationSpeed: 25, // 控制动画速度
        facingRight: true, // 是否朝右
        immune: ['regen'], // 免疫属性
        draw() {
            push();
            imageMode(CENTER); // 设置图片模式为中心对齐
            translate(this.pos.x, this.pos.y); // 位置移动
            rotate(this.vel.heading()); // 旋转角度

            // 被攻击特效（滤镜）
            this.drawImageTintEffect(this.flashType);
            // 绘制敌人
            image(m4Images[this.imageIndex], 0, 0, ts, ts);
            // 被攻击环境效果
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // 如果游戏未暂停
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m4Images.length; // 切换动画帧
                }
            }
        },
        onAim(e) {
            // if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
            // if (!this.canFire()) return;
            // this.resetCooldown();

            let bulletDamage = round(random(0.1,0.2));
            // 实例化一个子弹，从塔的位置飞向目标
            if(frameCount%60==0){
                let b = new Bullet2(this.pos.x, this.pos.y, e, bulletDamage);
                projectiles.push(b);
            }



            // // 如果你需要额外的 onHit 后续处理，可以调用它
            // this.onHit(e);

        }
    };

    monster.DroneSwarm = {
        color: [255, 0, 0], // 颜色
        radius: 0.6, // 半径
        name: 'DroneSwarm', // 名称
        speed: 0.4, // 速度
        cash: 15, // 击败后奖励金钱
        health: 120, // 生命值
        frameIndex: 0, // 记录当前动画帧索引
        frameCount: 3, // 总帧数
        image: m5Image, // 图片
        imageIndex: 0, // 记录动画索引
        animationSpeed: 25, // 控制动画速度
        facingRight: true, // 是否朝右
        immune: ['regen'], // 免疫属性
        draw() {
            push();
            imageMode(CENTER); // 设置图片模式为中心对齐
            translate(this.pos.x, this.pos.y); // 位置移动
            rotate(this.vel.heading()); // 旋转角度

            // 被攻击特效（滤镜）
            this.drawImageTintEffect(this.flashType);
            // 绘制敌人
            image(m5Images[this.imageIndex], 0, 0, ts, ts);
            // 被攻击环境效果
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // 如果游戏未暂停
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m5Images.length; // 切换动画帧
                }
            }
        }
    };


    monster.AIMech = {
        color: [255, 0, 0], // 颜色
        radius: 0.6, // 半径
        name: 'AIMech', // 名称
        speed: 0.2, // 速度
        cash: 120, // 击败后奖励金钱
        health: 300, // 生命值
        frameIndex: 0, // 记录当前动画帧索引
        frameCount: 3, // 总帧数
        image: m6Image, // 图片
        imageIndex: 0, // 记录动画索引
        animationSpeed: 25, // 控制动画速度
        facingRight: true, // 是否朝右
        immune: [], // 免疫属性
        draw() {
            push();
            imageMode(CENTER); // 设置图片模式为中心对齐
            translate(this.pos.x, this.pos.y); // 位置移动
            rotate(this.vel.heading()); // 旋转角度

            // 被攻击特效（滤镜）
            this.drawImageTintEffect(this.flashType);
            // 绘制敌人
            image(m6Images[this.imageIndex], 0, 0, ts, ts);
            // 被攻击环境效果
            this.drawDamageVisual(this.flashType);

            this.count ++;

            // if(this.count<20){
                if(frameCount%20==0){

                }   if(random(1)<0.5){
                this.isProtect=! this.isProtect;
            }


            // }

            if(this.isProtect){
                fill(0,random(100));
                ellipse(0,0,ts*0.8, ts*0.8);
            }

            pop();

            if (paused == false) { // 如果游戏未暂停
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m6Images.length; // 切换动画帧
                }
            }
        }
    };


}
