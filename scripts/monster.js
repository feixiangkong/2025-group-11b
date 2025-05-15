class Monster {
    constructor(x, y, thePath) { // Constructor, initialize monster
        this.color = [0, 0, 0]; // Monster color
        this.radius = 0.5; // Radius (in grids)
        this.path = thePath; // Assign parameters to this.path

// Misc
        this.alive = true; // Is it alive
        this.effects = []; // Status effects
        this.name = 'monster'; // Monster name
        this.sound = 'pop'; // Death sound effect

// Position
        this.pos = createVector(x, y); // Position vector
        this.vel = createVector(0, 0); // Velocity vector

        this.pathIndex = 0; // Current node

// Stats
        this.cash = 0; // Kill reward
        this.damage = 1; // Damage to the player
        this.health = 1; // Health value
        this.immune = []; // Immune damage type
        this.resistant = []; // Resistant damage type
        this.weak = []; // Vulnerable damage type
        this.speed = 1; // Movement speed (4 is the maximum value)
        this.taunt = false; // Taunt (force tower attack)
        this.isStunned = false; // Paralyzed

        // frame defalt set
        this.frameIndex = 0; // Current frame index
        this.frameCount = 4; // Total frames
        this.animationSpeed = 5; // Control animation switching speed
        this.facingRight = true; // Default facing right
        this.flashType ='';
        this.range =4;//Attack range
        this.isSlow2=false;
        this.count =0;
        this.oldSpeed;
        this.isProtect = false;

        this.stunFrameIndex = 0;
        this.stunFrameCount = 12;
    }

    draw() { // Draw the monster
        push(); // Save the current drawing state
        translate(this.pos.x, this.pos.y); // Move to the monster position
        rotate(this.vel.heading()); // Rotate according to the speed direction
// Set the image mode to align with the center point
        imageMode(CENTER);

// If the image is not loaded, use the default color
        stroke(0); // Set the stroke color
        fill(this.getColor()); // Set the fill color
        var back = -0.7 * ts / 3; // Calculate the back position of the quadrilateral
        var front = back + 0.7 * ts; // Calculate the front position of the quadrilateral
        var side = 0.9 * ts / 2; // Calculate the side position of the quadrilateral
        quad(back, -side, 0, 0, back, side, front, 0); // Draw the quadrilateral
        pop(); // Restore the drawing state
    }

// Add some effects when the monster is attacked
    dealDamage(amt, type) { // Deal damage

        var mult; // Damage multiplier
        if (this.immune.includes(type)) { // If immune to this type of damage
            mult = 0; // Immune: No damage
        } else if (this.resistant.includes(type)) { // If resistant to this type of damage
            mult = 1 - resistance; // Damage reduction resistance
        } else if (this.weak.includes(type)) { // If vulnerable to this type of damage
            mult = 1 + weakness; // How much weakness damage is taken
        } else { // Default
// type = 'physical'; // Default physical attack
            mult = 1; // Normal damage
        }
        if(this.isProtect==false){
            if (this.health > 0) { // If health is greater than 0
                this.health -= amt * mult; // Calculate final damage

                this.flash(type, 60); // Trigger special effects of corresponding types
            }
        }

        if (this.health <= 0) this.onKilled(); // If the health value is less than or equal to 0, call the death logic

    }

// Draw the image filter effect
    drawImageTintEffect(type)
    {
        if (type === 'physical') tint(255, 0, 0); // Physical attack (red)
        else if (type === 'water') tint(0, 191, 255); // Water attack (blue)
        else if (type === 'fire') tint(255, 69, 0); // Fire attack (orange-red)
        else if (type === 'line') tint(255, 215, 0); // Lightning attack (yellow)
        else if (type === 'slow') tint(173, 216, 230); // Frost (light blue)
        else noTint(); // Normal color
    }

// Draw damage effects
    drawDamageVisual(type)
    {
        if (type === 'physical') this.createGlowEffect([255, 0, 0]); // Physical attack halo
        else if (type === 'water') this.createRippleEffect([0, 191, 255]); // Water ripples
        else if (type === 'fire') this.createGlowEffect([255, 69, 0]); // Fire halo
        else if (type === 'line') this.createLightningEffect([255, 215, 0]); // Arc
        else if (type === 'slow') this.createIceEffect([173, 216, 230]); // Frost freeze
        else noTint(); // Normal color
    }


    createGlowEffect(color) { // Create a glow effect
        noFill(); // Cancel fill
        stroke(color[0], color[1], color[2], 100); // Set the stroke color
        strokeWeight(4); // Set the stroke thickness
        for (let i = 0; i < 3; i++) { // Draw multiple layers of glow
            let size = ts * (1.2 + i * 0.2); // Calculate the size of the glow
            ellipse(0, 0, size, size); // Draw the glow
        }
    }

    flash(type, duration) { // Flash effect
        this.flashType = type; // Record attack type
        this.flashActive = true; // Start flashing
        setTimeout(() => { // Set the flash end
            this.flashActive = false; // Turn off the special effect
            this.flashType = null; // Restore normal color
        }, duration * 10); // Flash duration
    }

// Apply new status effect
// Only one of each is allowed at a time
// Effect applied by tower, different from dealDamage
    doEffect(name, duration) { // Apply status effect
        if (this.immune.includes(name)) return; // Return if immune to the effect
        if (getByName(this.effects, name).length > 0) return; // Return if the effect already exists

        var e = createEffect(duration, effects[name]);

        e.onStart(this);
        e.onTick(this);
        this.effects.push(e);
    }

    createRippleEffect(color) { // Create ripple effect
        noFill(); // Cancel fill
        stroke(color[0], color[1], color[2], 150); // Set stroke color
        strokeWeight(2); // Set stroke weight

        for (let i = 0; i < 3; i++) { // Draw multi-layer ripples
            let size = ts * (1.0 + i * 0.2); // Calculate ripple size
            ellipse(0, 0, size, size); // Draw ripples
        }
    }

    createLightningEffect(color) { // Create lightning effect
        stroke(color[0], color[1], color[2]); // Set stroke color
        strokeWeight(3); // Set stroke weight
        let boltX = random(-this.radius * ts, this.radius * ts); // Random lightning starting point
        let boltY = random(-this.radius * ts, this.radius * ts); // Random lightning starting point
        line(0, 0, boltX, boltY); // Draw lightning
        line(boltX, boltY, boltX + random(-5, 5), boltY + random(-5, 5)); // Draw lightning branches
    }

    createIceEffect(color) { // Create a freezing effect
        stroke(color[0], color[1], color[2], 180); // Set the stroke color
        strokeWeight(2); // Set the stroke thickness
        for (let i = 0; i < 6; i++) { // Draw multiple ice spikes
            let angle = (TWO_PI / 6) * i; // Calculate the angle of the ice spike
            let x = cos(angle) * this.radius * ts; // Calculate the position of the ice spike
            let y = sin(angle) * this.radius * ts; // Calculate the position of the ice spike
            line(0, 0, x, y); // Draw the ice spike
        }
    }

// Create a paralysis effect (called by effects.stun)
    createStunnedEffect() {
        let sprites = imgAttackStun;
        let frameWidth = sprites.gameWidth / this.stunFrameCount;
        let frameHeight = sprites.height;
        let frameX = this.stunFrameIndex * frameWidth;
        imageMode(CENTER);
        image(sprites, this.pos.x + 15, this.pos.y + 0, ts, ts, frameX, 0, frameWidth, frameHeight);
        this.stunFrameIndex = (this.stunFrameIndex + 1) % this.stunFrameCount;
    }
    shake(amount) { // shake effect
        let originalX = this.pos.x; // record original X position
        let originalY = this.pos.y; // record original Y position
        let shakeCount = 5; // shake count
        let interval = setInterval(() => { // set shake interval
            this.pos.x = originalX + random(-amount, amount); // random shake X position
            this.pos.y = originalY + random(-amount, amount); // random shake Y position
        }, 50); // shake every 50ms
        setTimeout(() => { // set shake end
            clearInterval(interval); // stop shaking
            this.pos.x = originalX; // restore original X position
            this.pos.y = originalY; // restore original Y position
        }, shakeCount * 50); // shake shakeCount times
    }
// Draw health bar
    showHealth() { // show health bar
        var percent = this.health / this.maxHealth;
        if (percent <= 0 || percent >= 1.0) return;

        push();
        translate(this.pos.x, this.pos.y);

        var edge = 0.7 * ts / 2;
        var gameWidth = edge * percent * 2;
        var top = 0.2 * ts;
        var height = 0.15 * ts;

// health bar
        noStroke();
        fill(207, 0, 15);
        rect(-edge, top, gameWidth, height);
// health tank
        stroke(255);
        strokeWeight(2);
        noFill();
        rect(-edge, top, edge * 2, height);

        pop();
    }

    getColor() { // Get color
        var l = this.effects.length; // Get the number of effects
        if (l > 0) return this.effects[l - 1].color; // If there is an effect, return the effect color
        return this.color; // Otherwise return the default color
    }

    ifDie() { // Determine if dead
        return !this.alive; // Return if alive
    }

    kill() { // Kill the monster
        this.alive = false; // Set the alive status to false
    }

    onBorn() { // Called when born
        this.maxHealth = this.health; // Set the maximum health value
    }

    quit() { // Exit logic
        health -= this.damage; // Deduct player health value
        this.kill(); // Kill the monster
    }

    onKilled() { // Called when dead
        if (this.alive) { // If alive
            cash += this.cash; // Increase player money
            this.kill(); // Kill the monster
            if (sounds.hasOwnProperty(this.sound)) { // If there is a sound effect
                sounds[this.sound].play(); // Play the sound effect
            }
        }
    }

    onTick() {} // Called every frame

// Return speed in pixels per tick
// Adjusted to not be affected by zoom level
    pxSpeed() { // Calculate the movement speed per frame
        return this.speed * ts / 24 * monsterSpeedMultiplier; // Return speed
    }

// Change direction based on pathfinding map
    move() { // Movement logic
// If there is no pre-set BFS path or the path is empty, do not move
        if (!this.path || this.path.length === 0) return;

// If you have reached or exceeded path.length, it means that the monster has reached the end
        if (this.pathIndex >= this.path.length) {
// You can deduct health, kill monsters, etc. here
// this.quit(); // or something
            return;
        }

// Next node to go to
        let tile = this.path[this.pathIndex];
// Convert grid coordinates to pixel coordinates
        let targetPos = center(tile.col, tile.row);

// Calculate movement in this frame
        let dir = p5.Vector.sub(targetPos, this.pos);
        let dist = dir.mag();
        let step = this.pxSpeed(); // Pixel distance per frame

        if (dist <= step) {
// Target point can be reached within one frame
            this.pos = targetPos.copy();
            this.pathIndex++; // Go to the next point

// If it is already the end point, additional processing can be done
            if (this.pathIndex >= this.path.length) {
// Arrived at the end point => Blood loss + kill
                this.quit();
            }
        } else {
// Still on the way => Continue to move towards the target
            dir.normalize();
            dir.mult(step);
            this.pos.add(dir);
        }
    }
    visible(entities) {
        return getInRange(this.pos.x, this.pos.y, this.range, entities); // Get entities in range
    }
    target(entities) {
        entities = this.visible(entities); // Get visible monsters
        if (entities.length === 0) return; // If no monsters are visible, return

        var e = getFirst(entities); // Get the first monster
        if (typeof e === 'undefined') return; // If no target, return
        this.onAim(e); // Lock on target and attack
    }
    onAim(e) {

    }

    update() { // Update logic
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