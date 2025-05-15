function createMonster(x, y, template) {
// Key: store the BFS path in e.path
    let bfsPath = findPathBFS(grid); // Use BFS to find the path

    let e = new Monster(x, y, bfsPath); // Create a monster instance
    e.path = bfsPath || []; // Assign path information

// Assign the properties in monster[name] to e
    Object.assign(e, template); // Copy template properties to monster instance

// Make sure all keys are filled in e
    template = typeof template === 'undefined' ? {} : template; // Handle undefined templates
    var keys = Object.keys(template); // Get all keys of the template
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        e[key] = template[key]; // Assign each key to the monster instance
    }
    e.onBorn(); // Trigger birth event
    return e; // Return the created monster
}

var monster = {}; // Define monster object to store different types of monsters


function loadMosterByEasy() {

    monster.Bandit = {
        color: [0, 255, 0], // color
        name: 'Bandit', // name
        image: BanditImg, // image
        cash: 15, // reward money after defeating
        health: 50, // health value
        speed: 0.6, // movement speed
        imageIndex: 0, // record current animation frame
        draw() {

            push();
            imageMode(CENTER); // set image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // rotation angle

// attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// draw enemy
            image(m1Images[this.imageIndex], 0, 0, ts, ts);
// attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m1Images.length; // Switch animation frame
                }
            }
        }
    };

// Define the battering ram monster BatteringRam
    monster.BatteringRam = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'BatteringRam', // name
        speed: 0.4, // speed
        cash: 30, // reward money after defeating
        health: 200, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m_2Image, // image
        imageIndex: 0, // record animation index
        animationSpeed: 25, // Control animation speed
        facingRight: true, // facing right
        immune: ['regen'], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // Set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // Position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// Draw the enemy
            image(m2Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m2Images.length; // Switch animation frame
                }
            }
        }
    };

    monster.Mouse = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'Mouse', // name
        speed: 0.75, // speed
        cash: 20, // reward money after defeating
        health: 30, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m3Image, // image
        imageIndex: 0, // record animation index
        animationSpeed: 25, // control animation speed
        facingRight: true, // facing right
        immune: ['regen'], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // rotation angle

// Attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// Draw the enemy
            image(m3Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m3Images.length; // Switch animation frame
                }
            }
        }
    };

    monster.PirateRaider = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'PirateRaider', // name
        speed: 0.5, // speed
        cash: 50, // reward money after defeating
        health: 150, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m4Image, // image
        imageIndex: 0, // record animation index
        animationSpeed: 25, // control animation speed
        facingRight: true, // facing right
        immune: ['regen'], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // rotation angle

// Attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// Draw the enemy
            image(m4Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m4Images.length; // Switch animation frame
                }
            }
        },
        onAim(e) {
// if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
// if (!this.canFire()) return;
// this.resetCooldown();

            let bulletDamage = round(random(0.5, 1));
// Instantiate a bullet and fly it from the tower to the target
            if (frameCount % 60 == 0) {
                let b = new Bullet2(this.pos.x, this.pos.y, e, bulletDamage);
                projectiles.push(b);
            }

// // If you need additional onHit post-processing, you can call it
// this.onHit(e);

        }
    };

    monster.DroneSwarm = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'DroneSwarm', // name
        speed: 0.4, // speed
        cash: 50, // reward money after defeating
        health: 120, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m5Image, // image
        imageIndex: 0, // Record animation index
        animationSpeed: 25, // Control animation speed
        facingRight: true, // Is it facing right
        immune: ['regen'], // Immune attribute
        draw() {
            push();
            imageMode(CENTER); // Set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // Position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// Draw the enemy
            image(m5Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m5Images.length; // Switch animation frame
                }
            }
        }
    };

    monster.AIMech = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'AIMech', // name
        speed: 0.2, // speed
        cash: 120, // reward money after defeating
        health: 300, // health value
        frameIndex: 0, // record current animation frame index
        frameCount: 3, // total number of frames
        image: m6Image, // image
        imageIndex: 0, // record animation index
        animationSpeed: 25, // control animation speed
        facingRight: true, // facing right
        immune: [], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // set image mode to center alignment
            translate(this.pos.x, this.pos.y); // Position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack special effects (filters)
            this.drawImageTintEffect(this.flashType);
// Draw enemies
            image(m6Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effects
            this.drawDamageVisual(this.flashType);

            this.count++;

// if(this.count<20){
            if (frameCount % 20 == 0) {

            }
            if (random(1) < 0.5) {
                this.isProtect = !this.isProtect;
            }

// }

            if (this.isProtect) {
                fill(0, random(100));
                ellipse(0, 0, ts * 0.8, ts * 0.8);
            }

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m6Images.length; // Switch animation frame
                }
            }
        }
    };

}

function loadMosterByNormal() {

    monster.Bandit = {
        color: [0, 255, 0], // color
        name: 'Bandit', // name
        image: BanditImg, // image
        cash: 15, // reward money after defeating
        health: 80, // health value
        speed: 0.8, // movement speed
        imageIndex: 0, // record current animation frame
        draw() {

            push();
            imageMode(CENTER); // set image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // rotation angle

// attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// draw enemy
            image(m1Images[this.imageIndex], 0, 0, ts, ts);
// attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m1Images.length; // Switch animation frame
                }
            }
        }
    };

// Define the battering ram monster BatteringRam
    monster.BatteringRam = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'BatteringRam', // name
        speed: 0.4, // speed
        cash: 30, // reward money after defeating
        health: 250, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m_2Image, // image
        imageIndex: 0, // record animation index
        animationSpeed: 25, // Control animation speed
        facingRight: true, // facing right
        immune: ['regen'], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // Set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // Position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// Draw the enemy
            image(m2Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m2Images.length; // Switch animation frame
                }
            }
        }
    };

    monster.Mouse = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'Mouse', // name
        speed: 1, // speed
        cash: 20, // reward money after defeating
        health: 60, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m3Image, // image
        imageIndex: 0, // record animation index
        animationSpeed: 25, // control animation speed
        facingRight: true, // facing right
        immune: ['regen'], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // rotation angle

// Attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// Draw the enemy
            image(m3Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m3Images.length; // Switch animation frame
                }
            }
        }
    };

    monster.PirateRaider = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'PirateRaider', // name
        speed: 0.56, // speed
        cash: 50, // reward money after defeating
        health: 150, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m4Image, // image
        imageIndex: 0, // record animation index
        animationSpeed: 25, // control animation speed
        facingRight: true, // facing right
        immune: ['regen'], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // rotation angle

// Attack special effects (filters)
            this.drawImageTintEffect(this.flashType);
// Draw enemies
            image(m4Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effects
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m4Images.length; // Switch animation frames
                }
            }
        },
        onAim(e) {
// if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
// if (!this.canFire()) return;
// this.resetCooldown();

            let bulletDamage = round(random(0.5, 1));
// Instantiate a bullet and fly it from the tower to the target
            if (frameCount % 60 == 0) {
                let b = new Bullet2(this.pos.x, this.pos.y, e, bulletDamage);
                projectiles.push(b);
            }

// // If you need additional onHit post-processing, you can call it
// this.onHit(e);

        }
    };

    monster.DroneSwarm = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'DroneSwarm', // name
        speed: 0.8, // speed
        cash: 50, // reward money after defeating
        health: 200, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m5Image, // image
        imageIndex: 0, // Record animation index
        animationSpeed: 25, // Control animation speed
        facingRight: true, // Is it facing right
        immune: ['regen'], // Immune attribute
        draw() {
            push();
            imageMode(CENTER); // Set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // Position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// Draw the enemy
            image(m5Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m5Images.length; // Switch animation frame
                }
            }
        }
    };

    monster.AIMech = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'AIMech', // name
        speed: 0.3, // speed
        cash: 120, // reward money after defeating
        health: 250, // health value
        frameIndex: 0, // record current animation frame index
        frameCount: 3, // total number of frames
        image: m6Image, // image
        imageIndex: 0, // record animation index
        animationSpeed: 25, // control animation speed
        facingRight: true, // facing right
        immune: [], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // set image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack special effects (filters)
            this.drawImageTintEffect(this.flashType);
// Draw enemies
            image(m6Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effects
            this.drawDamageVisual(this.flashType);

            this.count++;

// if(this.count<20){
            if (frameCount % 20 == 0) {

            }
            if (random(1) < 0.5) {
                this.isProtect = !this.isProtect;
            }

// }

            if (this.isProtect) {
                fill(0, random(100));
                ellipse(0, 0, ts * 0.8, ts * 0.8);
            }

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m6Images.length; // Switch animation frame
                }
            }
        }
    };

}

/**
 *  cash:  The game rewards money for defeating the monsters.
 *  imageIndex:Record the current animation frame.
 *  frameIndex:  Record the index of the current animation frame.
 *  frameCount: total animation frame.
 *  immune: ['regen']:Immunity attributes
 *
 *
 */
function loadMosterByHard() {

    monster.Bandit = {
        color: [0, 255, 0],
        name: 'Bandit',
        image: BanditImg,
        cash: 20,
        health: 80,
        speed: 0.6,
        imageIndex: 0,
        draw() {


            push();
            imageMode(CENTER);
            translate(this.pos.x, this.pos.y);
            rotate(this.vel.heading());

// Attack effects (filters)
            this.drawImageTintEffect(this.flashType);

            image(m1Images[this.imageIndex], 0, 0, ts, ts);
// Attack environmental effects
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) {
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m1Images.length;
                }
            }
        }
    };

// Define the BatteringRam monster.
    monster.BatteringRam = {
        color: [255, 0, 0],
        radius: 0.6,
        name: 'BatteringRam',
        speed: 0.4,
        cash: 40,
        health: 300,
        frameIndex: 0,
        frameCount: 3,
        image: m_2Image,
        imageIndex: 0,
        animationSpeed: 25,
        facingRight: true,
        immune: ['regen'],
        draw() {
            push();
            imageMode(CENTER); // Set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // Position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// Draw the enemy
            image(m2Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m2Images.length; // Switch animation frame
                }
            }
        }
    };

    monster.Mouse = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'Mouse', // name
        speed: 1, // speed
        cash: 80, // Reward money after defeating
        health: 60, // health value
        frameIndex: 0, // Record the current animation frame index
        frameCount: 3, // total number of frames
        image: m3Image, // picture
        imageIndex: 0, // record animation index
        animationSpeed: 25, // control animation speed
        facingRight: true, // facing right
        immune: ['regen'], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // rotation angle

// attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// draw enemy
            image(m3Images[this.imageIndex], 0, 0, ts, ts);
// attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // if the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m3Images.length; // Switch animation frame
                }
            }
        }
    };

    monster.PirateRaider = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'PirateRaider', // name
        speed: 0.3, // speed
        cash: 150, // reward money after defeating
        health: 200, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m4Image, // image
        imageIndex: 0, // record animation index
        animationSpeed: 25, // control animation speed
        facingRight: true, // facing right
        immune: ['regen'], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // rotation angle

// Attack special effects (filters)
            this.drawImageTintEffect(this.flashType);
// Draw enemies
            image(m4Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effects
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m4Images.length; // Switch animation frames
                }
            }
        },
        onAim(e) {
// if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
// if (!this.canFire()) return;
// this.resetCooldown();

            let bulletDamage = round(random(0.5, 1));
// Instantiate a bullet and fly it from the tower to the target
            if (frameCount % 60 == 0) {
                let b = new Bullet2(this.pos.x, this.pos.y, e, bulletDamage);
                projectiles.push(b);
            }

// // If you need additional onHit post-processing, you can call it
// this.onHit(e);

        }
    };

    monster.DroneSwarm = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'DroneSwarm', // name
        speed: 0.4, // speed
        cash: 100, // reward money after defeating
        health: 80, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m5Image, // image
        imageIndex: 0, // Record animation index
        animationSpeed: 25, // Control animation speed
        facingRight: true, // Is it facing right
        immune: ['regen'], // Immune attribute
        draw() {
            push();
            imageMode(CENTER); // Set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // Position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// Draw the enemy
            image(m5Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m5Images.length; // Switch animation frame
                }
            }
        }
    };

    monster.AIMech = {
        color: [255, 0, 0],
        radius: 0.6,
        name: 'AIMech',
        speed: 0.2,
        cash: 250, // Reward money after defeating
        health: 300, // Health value
        frameIndex: 0, // Record the current animation frame index
        frameCount: 3, // Total number of frames
        image: m6Image, // Image
        imageIndex: 0, // Record animation index
        animationSpeed: 25, // Control animation speed
        facingRight: true, // Is it facing right
        immune: [], // Immune property
        draw() {
            push();
            imageMode(CENTER); // Set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // Position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// Draw the enemy
            image(m6Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effect
            this.drawDamageVisual(this.flashType);

            this.count++;

// if(this.count<20){
            if (frameCount % 20 == 0) {

            }
            if (random(1) < 0.5) {
                this.isProtect = !this.isProtect;
            }

// }

            if (this.isProtect) {
                fill(0, random(100));
                ellipse(0, 0, ts * 0.8, ts * 0.8);
            }

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m6Images.length; // Switch animation frame
                }
            }
        }
    };

}


function loadMoster() {
// Define the bandit monster Bandit
    monster.Bandit = {
        color: [0, 255, 0], // color
        name: 'Bandit', // name
        image: BanditImg, // picture
        cash: 8, // reward money after defeating
        health: 50, // health value
        speed: 5, // moving speed
        imageIndex: 0, // record the current animation frame
        draw() {

            push();
            imageMode(CENTER); // set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // rotation angle

// attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// draw the enemy
            image(m1Images[this.imageIndex], 0, 0, ts, ts);
// attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m1Images.length; // Switch animation frame
                }
            }
        }
    };

// Define the battering ram monster BatteringRam
    monster.BatteringRam = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'BatteringRam', // name
        speed: 0.4, // speed
        cash: 15, // reward money after defeating
        health: 200, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m_2Image, // image
        imageIndex: 0, // Record animation index
        animationSpeed: 25, // Control animation speed
        facingRight: true, // Is it facing right
        immune: ['regen'], // Immune attribute
        draw() {
            push();
            imageMode(CENTER); // Set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // Position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// Draw the enemy
            image(m2Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m2Images.length; // Switch animation frame
                }
            }
        }
    };

    monster.Mouse = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'Mouse', // name
        speed: 0.75, // speed
        cash: 5, // reward money after defeating
        health: 30, // health value
        frameIndex: 0, // record current animation frame index
        frameCount: 3, // total number of frames
        image: m3Image, // image
        imageIndex: 0, // record animation index
        animationSpeed: 25, // control animation speed
        facingRight: true, // facing right
        immune: ['regen'], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // set image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack special effects (filters)
            this.drawImageTintEffect(this.flashType);
// Draw enemies
            image(m3Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effects
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m3Images.length; // Switch animation frames
                }
            }
        }
    };

    monster.PirateRaider = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'PirateRaider', // name
        speed: 0.5, // speed
        cash: 12, // reward money after defeating
        health: 150, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m4Image, // image
        imageIndex: 0, // record animation index
        animationSpeed: 25, // control animation speed
        facingRight: true, // facing right
        immune: ['regen'], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // rotation angle

// Attack special effects (filters)
            this.drawImageTintEffect(this.flashType);
// Draw enemies
            image(m4Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effects
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m4Images.length; // Switch animation frames
                }
            }
        },
        onAim(e) {
// if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
// if (!this.canFire()) return;
// this.resetCooldown();

            let bulletDamage = round(random(0.1, 0.2));
// Instantiate a bullet and fly it from the tower to the target
            if (frameCount % 60 == 0) {
                let b = new Bullet2(this.pos.x, this.pos.y, e, bulletDamage);
                projectiles.push(b);
            }

// // If you need additional onHit post-processing, you can call it
// this.onHit(e);

        }
    };

    monster.DroneSwarm = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'DroneSwarm', // name
        speed: 0.4, // speed
        cash: 15, // reward money after defeating
        health: 120, // health value
        frameIndex: 0, // record the current animation frame index
        frameCount: 3, // total number of frames
        image: m5Image, // image
        imageIndex: 0, // Record animation index
        animationSpeed: 25, // Control animation speed
        facingRight: true, // Is it facing right
        immune: ['regen'], // Immune attribute
        draw() {
            push();
            imageMode(CENTER); // Set the image mode to center alignment
            translate(this.pos.x, this.pos.y); // Position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack effect (filter)
            this.drawImageTintEffect(this.flashType);
// Draw the enemy
            image(m5Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effect
            this.drawDamageVisual(this.flashType);

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m5Images.length; // Switch animation frame
                }
            }
        }
    };

    monster.AIMech = {
        color: [255, 0, 0], // color
        radius: 0.6, // radius
        name: 'AIMech', // name
        speed: 0.2, // speed
        cash: 120, // reward money after defeating
        health: 300, // health value
        frameIndex: 0, // record current animation frame index
        frameCount: 3, // total number of frames
        image: m6Image, // image
        imageIndex: 0, // record animation index
        animationSpeed: 25, // control animation speed
        facingRight: true, // facing right
        immune: [], // immune attribute
        draw() {
            push();
            imageMode(CENTER); // set image mode to center alignment
            translate(this.pos.x, this.pos.y); // position movement
            rotate(this.vel.heading()); // Rotation angle

// Attack special effects (filters)
            this.drawImageTintEffect(this.flashType);
// Draw enemies
            image(m6Images[this.imageIndex], 0, 0, ts, ts);
// Attack environment effects
            this.drawDamageVisual(this.flashType);

            this.count++;

// if(this.count<20){
            if (frameCount % 20 == 0) {

            }
            if (random(1) < 0.5) {
                this.isProtect = !this.isProtect;
            }

// }

            if (this.isProtect) {
                fill(0, random(100));
                ellipse(0, 0, ts * 0.8, ts * 0.8);
            }

            pop();

            if (paused == false) { // If the game is not paused
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m6Images.length; // Switch animation frame
                }
            }
        }
    };

}
