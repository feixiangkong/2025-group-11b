// Define the Bullet class: used to simulate bullet flight effects
class Bullet {
    constructor(x, y, target, damage, speed = 10) { // Constructor to initialize bullet properties
        this.pos = createVector(x, y); // Set bullet position
        this.target = target; // Target object
        this.damage = damage; // Damage value
        this.speed = speed; // Movement speed

        // Calculate unit direction vector
        this.dir = p5.Vector.sub(target.pos, createVector(x, y)).normalize();
        this.alive = true; // Bullet alive state

        // Bullet size (scaled based on ts)
        this.width = ts * 0.5; // Bullet width
        this.height = ts * 0.2; // Bullet height
    }

    // New method: check if bullet is dead
    isDead() {
        return !this.alive; // Return inverse of alive state
    }

    // Add an empty steer method to avoid errors when called
    steer() {
        // Bullet doesn't need additional steering logic
    }

    // Check if bullet is near target
    reachedTarget() {
        return this.pos.dist(this.target.pos) < this.target.radius * ts * 0.8;
    }

    update() { // Update bullet state
        // Update target direction each frame
        this.dir = p5.Vector.sub(this.target.pos, this.pos).normalize();
        this.pos.add(p5.Vector.mult(this.dir, this.speed)); // Move in direction

        if (this.reachedTarget()) { // If reached target
            this.explode(); // Trigger explosion
        }
    }

    draw() { // Draw bullet
        push();
        translate(this.pos.x, this.pos.y); // Move coordinates to bullet position
        rotate(this.dir.heading()); // Rotate bullet direction

        image(t1Image, 0, 0, this.width * 1.5, this.height * 1.5);
        pop();
    }

    // **Add `explode()` method**
    explode() {
        if (this.alive) { // Only trigger explosion if alive
            this.target.dealDamage(this.damage, 'physical'); // Deal physical damage
            this.alive = false; // Set bullet to dead state

            // Particle effects can be added here, such as sparks, smoke, etc.
            let explosion = new RocketExplosion(this.pos.x, this.pos.y);
            for (let i = 0; i < 10; i++) {
                explosion.addParticle();
            }
            systems.push(explosion); // Add to particle system
        }
    }

    // **Add `kill()` method**
    kill() {
        this.alive = false; // Set bullet to dead state
    }
}

// Define the Bullet2 class: used to simulate another bullet flight effect
class Bullet2 {
    constructor(x, y, target, damage, speed = 10) { // Constructor to initialize bullet properties
        this.pos = createVector(x, y); // Set bullet position
        this.target = target; // Target object
        this.damage = damage; // Damage value
        this.speed = speed; // Movement speed

        // Calculate unit direction vector
        this.dir = p5.Vector.sub(target.pos, createVector(x, y)).normalize();
        this.alive = true; // Bullet alive state

        // Bullet size (scaled based on ts)
        this.width = ts * 0.5; // Bullet width
        this.height = ts * 0.2; // Bullet height
    }

    // New method: check if bullet is dead
    isDead() {
        return !this.alive; // Return inverse of alive state
    }

    // Add an empty steer method to avoid errors when called
    steer() {
        // Bullet doesn't need additional steering logic
    }

    // Check if bullet is near target
    reachedTarget() {
        return this.pos.dist(this.target.pos) < this.target.radius * ts * 0.8;
    }

    update() { // Update bullet state
        // Update target direction each frame
        this.dir = p5.Vector.sub(this.target.pos, this.pos).normalize();
        this.pos.add(p5.Vector.mult(this.dir, this.speed)); // Move in direction

        if (this.reachedTarget()) { // If reached target
            this.explode(); // Trigger explosion
        }
    }

    draw() { // Draw bullet
        push();
        translate(this.pos.x, this.pos.y); // Move coordinates to bullet position
        rotate(this.dir.heading()); // Rotate bullet direction

        fill(0);
        ellipse(0, 0, 10, 10);

        pop();
    }

    // **Add `explode()` method**
    explode() {
        if (this.alive) { // Only trigger explosion if alive
            this.target.dealDamage(this.damage, 'physical'); // Deal physical damage
            this.alive = false; // Set bullet to dead state

            // Particle effects can be added here, such as sparks, smoke, etc.
            let explosion = new RocketExplosion(this.pos.x, this.pos.y);
            for (let i = 0; i < 10; i++) {
                explosion.addParticle();
            }
            systems.push(explosion); // Add to particle system
        }
    }

    // **Add `kill()` method**
    kill() {
        this.alive = false; // Set bullet to dead state
    }
}

// Define the FireBall class: inherits from Bullet
class FireBall extends Bullet {
    // Draw FireBall
    draw() {
        push();
        translate(this.pos.x, this.pos.y); // Move coordinates to bullet position
        rotate(this.dir.heading()); // Rotate bullet direction

        image(fireBallImage, 0, 0, this.width * 3, this.height * 3);
        pop();
    }

    // **Add `explode()` method**
    explode() {
        if (this.alive) { // Only trigger explosion if alive
            this.target.dealDamage(this.damage, 'fire'); // Deal fire damage
            this.alive = false; // Set bullet to dead state
        }
    }
}

class Arrow extends Bullet {
    constructor(x, y, target, damage, speed = 10) {
        super(x, y, target, damage, speed);

        // Size
        this.width = ts * 0.5;
        this.height = ts * 0.2;
    }

    // Override draw method
    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.dir.heading());

        // Draw
        image(imgAttackArrow, -this.width / 2, -this.height / 2, this.width, this.height);

        pop();
    }
}

class SparkBullet extends Bullet {
    constructor(x, y, target, damage, speed = 10) {
        super(x, y, target, damage, speed);

        // Size
        this.width = ts * 0.5;
        this.height = ts * 0.2;
    }

    // Override draw method
    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.dir.heading());

        // Draw
        image(imgAttackBullet, -this.width / 2, -this.height / 2, this.width, this.height);

        pop();
    }
}