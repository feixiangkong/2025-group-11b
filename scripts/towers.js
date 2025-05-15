function createTower(x, y, template) {
    const t = new Tower(x, y);
    t.gridPos = createVector(x, y); 
    t.upgrade(template);
    t.onCreate();
    return t;
}

var tower = {};

// ================================================================ Archer Tower ================================================================

// Modified tower definition, use texture to draw the tower's appearance, and fire bullets
tower.gun = {
// Basic properties
    name: 'Archer Tower',
    title: 'Archer Tower',
    cooldownMax: 72+30,
    cooldownMin: 48+30,
    cost: 50,
    damageMax: 12,
    damageMin: 8,
    range: 2,
    type: 'physical',
    arrowSpeed: 15, // Arrow speed
    get visual() { return tower1Img; }, // Style image of defense tower

// Set the appearance of the tower to be drawn using textures (the textures you preloaded before)
    hasBase: true,
    hasBarrel: false,
    draw: function () {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // Effect when selected
// According to the radius of the tower and the global ts Zoom in and draw the texture
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y); // Draw CD
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3); // Draw the upgrade button
        pop();
    },

// Custom attack effect: Create a Bullet object to simulate bullet flight
    onAim: function (e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
        if (!this.canFire()) return;
        this.resetCooldown();

        let bulletDamage = round(random(this.damageMin, this.damageMax));
        let b = new Arrow(this.pos.x, this.pos.y, e, bulletDamage, this.arrowSpeed);
        projectiles.push(b);

// Draw muzzle flash effect (optional) to make the shot more obvious
        push();
        stroke(255, 255, 0);
        strokeWeight(4);
        let barrelEnd = createVector(
            this.pos.x + cos(this.angle) * ts * 0.5,
            this.pos.y + sin(this.angle) * ts * 0.5
        );
        line(this.pos.x, this.pos.y, barrelEnd.x, barrelEnd.y);
        pop();

// If you need additional onHit post-processing, you can call it
        this.onHit(e);
    },

// Use the default target method of the Tower base class (select the target within the visible range)
    target: Tower.prototype.target,
// Upgrade options
    upgrades: [
        {
// Basic properties
            name: 'Archer PLUS Tower',
            title: 'Archer PLUS Tower',
            cooldownMax: 61,
            cooldownMin: 41,
            cost: 80,
            damageMax: 16,
            damageMin: 10,
            range: 2.5,
            arrowSpeed: 20, // Arrow speed
            get visual() { return t1_2Image; }, // Tower style image

            upgrades: [
                {
// Basic attributes
                    name: 'Archer MAX Tower',
                    title: 'Archer MAX Tower',
                    cooldownMax: 52,
                    cooldownMin: 35,
                    cost: 150,
                    damageMax: 21,
                    damageMin: 13,
                    range: 3,
                    arrowSpeed: 25, // Arrow speed
                    get visual() { return t1_3Image; }, // Tower style image

                }
            ]
        }
    ]
};

// ================================================================ oil Tower ================================================================
tower.oil = {
// Basic properties
    name: 'oil Tower',
    title: 'oil Tower',
    cooldownMax: 150,
    cooldownMin: 90,
    cost: 70,
    damageMax: 15,
    damageMin: 10,
    range: 1.5,
    type: 'fire',
    get visual() { return tower2Img; }, // Style image of the defense tower

// Set the appearance of the tower to be drawn using a texture (the texture you pre-loaded earlier)
    hasBase: true,
    hasBarrel: false,
    draw: function() {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // Effect when selected
// Draw the texture based on the radius of the tower and the global ts scale
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y); // Draw CD
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3); // Draw the upgrade button
        pop();
    },

// Custom attack effect: Create a Bullet object to simulate bullet flight
    onAim: function(e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
        if (!this.canFire()) return;
        this.resetCooldown();

        let bulletDamage = round(random(this.damageMin, this.damageMax));
// Instantiate a bullet and fly from the tower to the target
        let b = new FireBall(this.pos.x, this.pos.y, e, bulletDamage);
        projectiles.push(b);

// Draw the muzzle flash effect (optional) to make the launch more obvious
        push();
        stroke(255, 255, 0);
        strokeWeight(4);
        let barrelEnd = createVector(
            this.pos.x + cos(this.angle) * ts * 0.5,
            this.pos.y + sin(this.angle) * ts * 0.5
        );
        line(this.pos.x, this.pos.y, barrelEnd.x, barrelEnd.y);
        pop();

// If you need additional onHit post-processing, you can call it
        this.onHit(e);
    },

// Use the default target method of the Tower base class (select the target within the visible range)
    target: Tower.prototype.target,
    upgrades:[
        {
// Basic properties
            name: 'oil PLUS Tower',
            title: 'oil PLUS Tower',
            cooldownMax: 127,
            cooldownMin: 76,
            cost: 100,
            damageMax: 20,
            damageMin: 13,
            range: 2,
            type: 'fire',
            get visual() { return t2_2Image; }, // Style image of defense tower

            upgrades:[
                {
// Basic attributes
                    name: 'oil MAX Tower',
                    title: 'oil MAX Tower',
                    cooldownMax: 107,
                    cooldownMin: 98,
                    cost: 180,
                    damageMax: 26,
                    damageMin: 17,
                    range: 3,
                    type: 'fire',
                    get visual() { return t2_3Image; }, // Style image of defense tower
                }
            ]
        },
    ]
};

// ================================================================ Trebuchet Tower ================================================================
tower.trebuchet = {
// Properties
    name: 'trebuchet',
    title: 'Trebuchet Tower',
    cooldownMax: 210*1.5,
    cooldownMin: 150*1.5,
    cost: 120,
    damageMax: 30,
    damageMin: 20,
    range: 3,
    blastRadius: 1,
    particleAmt: 10,
    type: 'explosion',
    get visual() { return t4_1Image; }, // Style image of defense tower

    onAim(e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y); // Target lock
        image(imgAttackAim, e.pos.x - (ts * this.blastRadius) / 2, e.pos.y - (ts * this.blastRadius) / 2,
            ts * this.blastRadius, ts * this.blastRadius);
        if (!this.canFire()) return; // If you can't attack, return
        this.resetCooldown(); // Reset the cooldown time
        this.attack(e); // Attack the target
    },

    draw: function ()
    {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // Effect when selected
// Draw the map according to the radius of the tower and the global ts scaling
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y); // Draw CD
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3); // Draw the upgrade button
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
            cooldownMax: 179*1.5,
            cooldownMin: 128*1.5,
            cost: 150,
            damageMax: 40,
            damageMin: 30,
            range: 3.25,
            blastRadius: 1.2,
            get visual() { return t4_1Image; }, // Style image of defense tower

            upgrades: [
                {
                    name: 'trebuchet MAX Tower',
                    title: 'Trebuchet MAX Tower',
                    cooldownMax: 152*1.5,
                    cooldownMin: 109*1.5,
                    cost: 220,
                    damageMax: 50,
                    damageMin: 40,
                    range: 3.5,
                    blastRadius: 1.5,
                    get visual() { return t4_3Image; }, // Style image of defense tower
                }
            ]
        }
    ]
};

// ================================================================ Laser AA Tower ================================================================
tower.laser = {
// Display
    color: [25, 181, 254], // Blue laser
    length: 0.55,
    radius: 0.8,
    secondary: [149, 165, 166], // Secondary color
    width: 0.25,
    weight: 2, // Initial line thickness
    drawLine: true, // Draw trajectory line
    follow: true, // Track target
    get visual() { return t5_1Image; }, // Style image of defense tower

// Misc
    name: 'Laser AA Tower',
    title: 'Laser AA Tower',
    sound: 'laser', // Attack sound

// Stats
    cooldownMax: 24,
    cooldownMin: 12,
    cost: 150,
    damageMax: 0.6,
    damageMin: 0.4,
    range: 3,
    type: 'energy',

// Flash effect counter
    flashCounter: 0,
    draw: function() {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // Effect when selected
// Draw the texture according to the radius of the tower and the global ts scale
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y); // Draw CD
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3); // Draw the upgrade button
        pop();
    },

    frameIndex: 0,
    frameNumbers: 7,
// Attack logic
    onAim: function(e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
        if (!this.canFire()) return;

// Attack target
        this.attack(e);

// Draw trajectory line
        if (this.drawLine) {
// Calculate trajectory line thickness and color
            let weight = this.calculateWeight();
            let color = this.calculateColor();

// Draw trajectory line
            stroke(color);
            strokeWeight(weight);
            line(this.pos.x, this.pos.y, e.pos.x, e.pos.y);
            strokeWeight(1); // Restore default line thickness
//
            var dir = atan2(e.pos.y - this.pos.y, e.pos.x - this.pos.x);
            var distance = dist(e.pos.x, e.pos.y, this.pos.x, this.pos.y);

// Draw two lightning bolts
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

//Add halo effect
            this.addGlow(e);

            if (frameCount % 5 == 0)
            {
                this.frameIndex = (this.frameIndex + 1) % this.frameNumbers;
            }
        }

// Update flash counter
        this.flashCounter++;
    },
    // Calculate the thickness of the trajectory
    calculateWeight: function() {
// A complete flash cycle every 20 frames
        let cycle = this.flashCounter % 20;

        if (cycle < 10) {
// First 10 frames: gradually thicken from the initial thickness
            return this.weight + (cycle / 10) * 4; // Maximum thickness is initial thickness + 4
        } else {
// After 10 frames: gradually thin from the maximum thickness
            return this.weight + ((20 - cycle) / 10) * 4;
        }
    },

// Calculate the color of the trajectory
    calculateColor: function() {
// A complete color change cycle every 20 frames
        let cycle = this.flashCounter % 20;
        let r = 25 + 230 * abs(sin((cycle / 20) * TWO_PI)); // Red component
        let g = 181 + 74 * abs(sin((cycle / 20) * TWO_PI)); // Green component
        let b = 254; // Blue component is fixed
        return [r, g, b];
    },

// Add glow effect
    addGlow: function(e) {
        push();
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], 50); // Translucent glow
        ellipse(e.pos.x, e.pos.y, 20, 20); // Glow size
        pop();
    },

// Attack method
    attack: function(e) {
        if(frameCount%2==0) {
            var damage = round(random(this.damageMin, this.damageMax));
            e.dealDamage(damage, this.type);
            if (sounds.hasOwnProperty(this.sound)) {
                sounds[this.sound].play();
            }
            this.onHit(e);
        }

    },

// Use the default target method of the Tower base class (select a target within the visible range)
    target: Tower.prototype.target,

// Upgrade options
    upgrades: [
        {
// Display
            get visual() { return t5_2Image; }, // Style image of the defense tower

// Misc
            name: 'Laser AA PLUS Tower ',
            title: 'Laser AA PLUS Tower',

// Stats
            cooldownMax: 24,
            cooldownMin: 12,
            cost: 200,
            damageMax: 0.6,
            damageMin: 0.5,

            range: 3.5,

// Attack logic after upgrade
            attack: function(e) {
                if(frameCount%20==0) {
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
                }
            },
            upgrades:[
                {
// Display
                    get visual() { return t5_3Image; }, // Style image of defense tower

// Misc
                    name: 'Laser AA MAX Tower',
                    title: 'Laser AA MAX Tower',
                    sound: 'laser', // Attack sound

// Stats
                    cooldownMax: 24,
                    cooldownMin: 12,
                    cost: 300,
                    damageMax: 0.7,
                    damageMin: 0.6,
                    range: 4,

// Attack method
                    attack: function(e) {
                        if(frameCount%20==0) {
                            if (this.lastTarget === e) {
                                this.duration++;
                            } else {
                                this.lastTarget = e;
                                this.duration = 0;
                            }

                            var d = random(this.damageMin, this.damageMax);
                            var damage = d * sq(this.duration);
                            e.dealDamage(damage, this.type);
                            if (sounds.hasOwnProperty(this.sound)) {
                                sounds[this.sound].play();
                            }
                            this.onHit(e);



                        }
                    },
                }
            ]
        }
    ]
};

// ================================================================ slow Tower ================================================================
tower.slow = {
// Display
    baseOnTop: false,
    color: [75, 119, 190], // Base color
    drawLine: false,
    length: 1.1,
    radius: 0.9,
    secondary: [189, 195, 199], // Secondary color
    width: 0.3,
    get visual() { return t3_1Image; }, // Style image of defense tower
// Misc
    name: 'slow',
    title: 'Slow Tower',
// Stats
    cooldownMax: 90,
    cooldownMin: 60,
    cost: 60,
    damageMax: 0,
    damageMin: 0,
    range: 3, // Range
    type: 'slow',

// Wave effect counter
    waveCounter: 0,
    draw: function() {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // Effect when selected
// Draw the texture according to the radius of the tower and the global ts scale
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y); // Draw CD
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3); // Draw the upgrade button
        pop();
    },

// Methods
    drawBarrel: function() {
// fill(this.secondary);
// var back = -this.length * ts / 2;
// var side = this.width * ts / 2;
// rect(back, -side, this.length * ts, this.width * ts);
    },

// Attack logic
    onAim: function(e) {
        this.attack(e);
    },

// Attack effect
    onHit: function(e) {
        e.doEffect('slow', 40);
    },

// Target selection
    target: function(entities) {
        entities = this.visible(entities);
        if (entities.length === 0) return;
        if (!this.canFire()) return;
        this.resetCooldown();

// Draw the background color and wave effect
        this.drawEffect();

// Apply the effect to all enemies in range
        for (var i = 0; i < entities.length; i++) {
            let monster = entities[i];
            let d = dist(this.pos.x, this.pos.y, monster.pos.x, monster.pos.y);
            if (d <= this.range * ts) { // Make sure the enemy is in range
                this.onAim(monster);
            }
        }
    },

// Draw background color and wave effect
    drawEffect: function() {
// Draw background color
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], 50); // Translucent background color
        ellipse(this.pos.x, this.pos.y, this.range * 2 * ts, this.range * 2 * ts);

// Draw wave effect
        let waveRadius = (this.waveCounter % 40) / 40 * this.range * ts; // Wave radius (frequency increased by 1.5 times)
        noFill();
        stroke(255, 255, 255, 100); // Wave color is white, translucent
        strokeWeight(2);
        ellipse(this.pos.x, this.pos.y, waveRadius * 2, waveRadius * 2);

// Update wave counter
        this.waveCounter++;
    },

// Update logic
    update() {
        this.angle += PI / 60;
        if (this.cd > 0) this.cd--;
    },

// Upgrade options
    upgrades: [
        {
// Display
            get visual() { return t3_2Image; }, // Style image of defense tower

// Misc
            name: 'slow',
            title: 'Slow Tower',
// Stats
            cooldownMax: 75,
            cooldownMin: 50,
            cost: 80,
            damageMax: 0,
            damageMin: 0,
            range: 3, // Range

// Upgrade options
            upgrades: [
                {
// Display
                    get visual() { return t3_3Image; }, // Style image of defense tower

// Misc
                    name: 'slow',
                    title: 'Slow Tower',
// Stats
                    cooldownMax: 65,
                    cooldownMin: 40,
                    cost: 120,
                    damageMax: 0,
                    damageMin: 0,
                    range: 3, // range
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
    get visual() { return t4_1Image; }, // Style image of defense tower
// Misc
    name: 'Cannon Tower',
    title: 'Cannon Tower',
// Stats
    cooldownMax: 180*1.5,
    cooldownMin: 120*1.5,
    cost: 100,
    damageMax: 20,
    damageMin: 10,
    range: 2,
    blastRadius: 1,
    particleAmt: 1,
    type: 'explosion',

    draw: function() {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // Effect when selected
// Draw the texture according to the radius of the tower and the global ts scale
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y); // Draw CD
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3); // Draw the upgrade button
        pop();
    },
// Methods
    drawBarrel: function() {
// fill(this.secondary);
// rect(0, -this.width * ts / 2, this.length * ts, this.width * ts);
// fill(191, 85, 236);
// ellipse(0, 0, this.radius * ts * 2 / 3, this.radius * ts * 2 / 3);
// Draw the map based on the radius of the tower and the global ts scale

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
            get visual() { return t4_2Image; }, // Style image of defense tower
// Misc
            name: 'Cannon PLUS Tower',
            title: 'Cannon PLUS Tower',
// Stats
            cooldownMax: 153*1.5,
            cooldownMin: 102*1.5,
            cost: 120,
            damageMax: 30,
            damageMin: 20,
            range: 2.2,
            particleAmt: 4,

            upgrades:[
                {
// Display
                    radius: 1.1,
                    get visual() { return t4_3Image; }, // Style image of defense tower

// Misc
                    name: 'Cannon MAX Tower',
                    title: 'Cannon MAX Tower',
// Stats
                    cooldownMax: 130*1.5,
                    cooldownMin: 87*1.5,
                    cost: 180,
                    damageMax: 40,
                    damageMin: 30,
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
    color: [75, 119, 190], // Base color
    drawLine: false,
    length: 1.1,
    radius: 0.9,
    secondary: [189, 195, 199], // Secondary color
    width: 0.3,
    get visual() { return t7_1Image; }, // Style image of defense tower
// Misc
    name: 'slow2',
    title: 'Slow Tower',
// Stats
    cooldownMax: 0,
    cooldownMin: 0,
    cost: 150,
    damageMax: 0,
    damageMin: 0,
    range: 3, // Range
    type: 'slow2',

// Wave effect counter
    waveCounter: 0,
    draw: function() {
        push();
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // Effect when selected
// Draw the texture according to the radius of the tower and the global ts scale
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y); // Draw CD
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3); // Draw the upgrade button
        pop();
    },

// Methods
    drawBarrel: function() {
// fill(this.secondary);
// var back = -this.length * ts / 2;
// var side = this.width * ts / 2;
// rect(back, -side, this.length * ts, this.width * ts);
    },

// Attack logic
    onAim: function(e) {
        this.attack(e);
    },

// Attack effect
    onHit: function(e) {
        e.doEffect('slow2', 40);
    },

// Target selection
    target: function(entities) {
        entities = this.visible(entities);
        if (entities.length === 0) return;
        if (!this.canFire()) return;
        this.resetCooldown();

// Draw the background color and wave effect
        this.drawEffect();

// Apply the effect to all enemies in range
        for (var i = 0; i < entities.length; i++) {
            let monster = entities[i];
            let d = dist(this.pos.x, this.pos.y, monster.pos.x, monster.pos.y);
            if (d <= this.range * ts) { // Make sure the enemy is in range
                this.onAim(monster);
            }
        }
    },

// Draw background color and wave effect
    drawEffect: function() {
// Draw background color
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], 50); // Translucent background color
        ellipse(this.pos.x, this.pos.y, this.range * 2 * ts, this.range * 2 * ts);

// Draw wave effect
        let waveRadius = (this.waveCounter % 40) / 40 * this.range * ts; // Wave radius (frequency increased by 1.5 times)
        noFill();
        stroke(255, 255, 255, 100); // Wave color is white, translucent
        strokeWeight(2);
        ellipse(this.pos.x, this.pos.y, waveRadius * 2, waveRadius * 2);

// Update wave counter
        this.waveCounter++;
    },

// Update logic
    update() {
        this.angle += PI / 60;
        if (this.cd > 0) this.cd--;
    },

// Upgrade options
    upgrades: [
        {
// Display
            get visual() { return t7_2Image; }, // Style image of defense tower
// Misc
            name: 'slow2',
            title: 'Slow Tower',
// Stats
            cooldownMax: 0,
            cooldownMin: 0,
            cost: 120,
            damageMax: 0,
            damageMin: 0,
            range: 3.25, // Range

// Upgrade options
            upgrades: [
                {
// Display
                    get visual() { return t7_3Image; }, // Style image of defense tower
// Misc
                    name: 'slow',
                    title: 'Slow Tower',
// Stats
                    cooldownMax: 52,
                    cooldownMin: 33,
                    cost: 180,
                    damageMax: 0,
                    damageMin: 0,
                    range: 3.5, // range
                }
            ]
        }
    ]
};

// ================================================================ EMP Tower ================================================================
tower.emp = {
// Display
    color: [255, 245, 45], // background color
    get visual() { return t6_1Image; }, // style image of defense tower
// Misc
    name: 'EMP',
    title: 'EMP Tower',
// Stats
    cooldownMax: 0,
    cooldownMin: 0,
    cost: 200,
    damageMax: 0,
    damageMin: 0,
    range: 3, // range
    speed: 0.01, // speed
    radian: PI / 6, // radians
    type: 'stun',
    stunnedDuration: 150, // paralysis duration
    angleOffset: 0, // current rotation angle
    draw: function() {

// draw the arc of the interference range
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angleOffset);

        var r = this.range * ts;
        fill(this.color[0], this.color[1], this.color[2], 60);
        noStroke();
        arc(0, 0, r * 2, r * 2, 0, this.radian, PIE);

        pop();

// Draw tower
        imageMode(CENTER);
        if (this.selected == true) this.diaplayRange(this.pos.x, this.pos.y); // Effect when selected
// Draw texture according to the radius of the tower and global ts scaling
        image(this.visual, this.pos.x, this.pos.y, ts, ts);
        this.displayCD(this.pos.x, this.pos.y); // Draw CD
        this.displayUpgrade(this.pos.x + ts/3, this.pos.y - ts/3); // Draw upgrade button
    },

// Attack effect
    onHit: function (e) {
        if (e.isStunned == false)
        {
            e.dealDamage(0, this.type);
            e.doEffect('stun', this.stunnedDuration);
        }
    },

// Target selection
    target: function(entities) {
// Determine whether the enemy is hit
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

//Update logic
    update() {
        this.angleOffset = (this.angleOffset + this.speed) % TWO_PI;
    },

// Upgrade options
    upgrades: [
        {
            get visual() { return t6_2Image; }, // Style image of defense tower
// Misc
            name: 'EMP PLUS',
            title: 'EMP PLUS Tower',
// Stats
            cost: 250,
            range: 2.5, // Range
            speed: 0.02, // Speed
            radian: PI / 4, // Radians
            stunnedDuration: 200, // Paralysis duration

            upgrades: [
                {
                    get visual() { return t6_3Image; }, // Style image of defense tower
// Misc
                    name: 'EMP MAX',
                    title: 'EMP MAX Tower',
// Stats
                    cost: 350,
                    range: 3, // Range
                    speed: 0.03, // speed
                    radian: PI / 2, // radians
                    stunnedDuration: 300, // paralysis duration
                }
            ]
        }
    ]
};