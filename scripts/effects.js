function createEffect(duration, template) { // 创建效果函数
    var e = new Effect(duration); // 创建新的 Effect 实例
    // Fill in all keys // 填充所有键值
    template = typeof template === 'undefined' ? {} : template; // 如果模板未定义，则赋值为空对象
    var keys = Object.keys(template); // 获取模板对象的所有键
    for (var i = 0; i < keys.length; i++) { // 遍历所有键
        var key = keys[i]; // 取出当前键
        e[key] = template[key]; // 将模板的属性赋值给效果实例
    }
    return e; // 返回创建的效果实例
}


var effects = {}; // 存储所有效果的对象


effects.slow = { // 定义减速效果
    // Display // 显示属性
    color: [68, 108, 179], // 颜色（蓝色）

    // Misc // 其他属性
    name: 'slow', // 效果名称

    // Methods // 方法
    onEnd: function(e) { // 效果结束时
        e.speed = this.oldSpeed; // 还原原始速度
    },
    onStart: function(e) { // 效果开始时
        this.oldSpeed = e.speed; // 记录原始速度
        this.speed = e.speed / 2; // 速度减半
        e.speed = this.speed; // 赋值给目标
    }
};
effects.slow2 = { // 定义减速效果
    // Display // 显示属性
    color: [68, 108, 179], // 颜色（蓝色）

    // Misc // 其他属性
    name: 'slow2', // 效果名称
    count: 0, // 初始化 count 属性

    // Methods // 方法
    onEnd: function(e) { // 效果结束时
        e.speed = e.oldSpeed; // 还原原始速度
        // e.isSlow2 = true;
    },
    onStart: function(e) { // 效果开始时

        // 如果没有应用该减速效果
        if (e.isSlow2 == false) {
            e.oldSpeed = e.speed; // 记录原始速度
            e.isSlow2 = true; // 标记该对象已经处于减速状态
        }

        e.count++; // 每次调用 onStart 时，count 增加

        // 判断是否达到2000次
        if (e.count < 10) {
            e.speed = 0; // 在2000次之前将速度设置为0
        } else {
            e.speed = e.oldSpeed/2; // 在2000次之前将速度设置为0
        }
    }
};


effects.poison = { // 定义中毒效果
    // Display // 显示属性
    color: [102, 204, 26], // 颜色（绿色）

    // Misc // 其他属性
    name: 'poison', // 效果名称

    // Methods // 方法
    onTick: function(e) { // 每次更新时
        e.dealDamage(10, 'poison'); // 造成 1 点毒伤害
    }
};

effects.regen = { // 定义生命恢复效果
    // Display // 显示属性
    color: [210, 82, 127], // 颜色（粉色）

    // Misc // 其他属性
    name: 'regen', // 效果名称

    // Methods // 方法
    onTick: function(e) { // 每次更新时
        if (e.health < e.maxHealth && random() < 0.2) e.health++; // 20% 概率恢复 1 点生命值
    }
};

// 麻痹效果
effects.stun = { 
    color: [60, 87, 100],
    name: 'stun',

    onEnd: function(e) {
        e.speed = this.oldSpeed;
        e.isStunned = false;
    },
    onStart: function(e) { 
        this.oldSpeed = e.speed;
        this.speed = 0;
        e.speed = this.speed;
        e.isStunned = true;
    },
    onTick: function (e) {
        e.createStunnedEffect();
    }
};