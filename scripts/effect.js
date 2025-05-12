class Effect { // 定义 Effect 类
    constructor(duration) { // 构造函数，接受持续时间参数
        // Display // 显示属性
        this.color = [0, 0, 0]; // 颜色，默认为黑色

        // Misc // 其他属性
        this.alive = true; // 存活状态，默认为存活
        this.duration = duration; // 持续时间
        this.name = 'status'; // 效果名称，默认值为 'status'
        this.count =0;
    }

    isDead() { // 判断效果是否结束
        return !this.alive; // 返回存活状态的反值
    }

    kill() { // 终止效果
        this.alive = false; // 设置存活状态为 false
    }

    onEnd(e) {} // 效果结束时的回调函数（空函数）
    onStart(e) {} // 效果开始时的回调函数（空函数）
    onTick(e) {} // 每次更新时的回调函数（空函数）

    update(e) { // 更新函数
        this.onTick(e); // 调用 onTick 方法
        if (this.duration > 0) this.duration--; // 持续时间递减
        if (this.duration === 0) { // 当持续时间归零
            this.onEnd(e); // 调用 onEnd 方法
            this.kill(); // 终止效果
        }
    }
}

class UpgradeFX extends Effect{
    constructor(duration, x, y, ) {
        super(duration);
        this.xpos = x;
        this.ypos = y;
        this.frameIdx = 0;
        this.frameNum = 12;
    }

    update(e) {
        super.update(e);

        if (this.frameIdx >= this.frameNum) {
            this.onEnd(e); // 调用 onEnd 方法
            this.kill(); // 终止效果
        }

        let sprites = imgUpgradeShine;
        let frameWidth = sprites.width / this.frameNum;
        let frameHeight = sprites.height;
        let frameX = this.frameIdx * frameWidth;
        imageMode(CENTER);
        image(sprites, this.xpos, this.ypos, ts, ts, frameX, 0, frameWidth, frameHeight);

        if (frameCount % 2 == 0) this.frameIdx++;
    }
}