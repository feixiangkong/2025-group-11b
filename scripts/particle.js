class Particle { // Define particle class
    constructor(pos, speed) { // Constructor, accepts position pos and speed speed as parameters
        this.pos = pos.copy(); // Copy the pos position to ensure that the original position is not modified
        this.vel = p5.Vector.random2D().mult(random(-1, 1) * speed * ts / 24); // Generate a speed vector in a random direction and adjust it according to speed
        this.lifespan = 255; // Set the initial life value of the particle
        this.decay = 2; // Set the decay speed of the particle
        this.color = [0, 0, 0]; // Set the color of the particle (default black)
        this.radius = 4; // Set the radius of the particle
    }

    draw() { // Draw the particle
        stroke(0, this.lifespan); // Set the stroke color, and the transparency changes with lifespan
        fill(this.color[0], this.color[1], this.color[2], this.lifespan); // Set fill color and apply transparency
        var r = this.radius * ts / 24 * 2; // Calculate particle size
        ellipse(this.pos.x, this.pos.y, r, r); // Draw particles in a circle
    }

    isDead() { // Determine whether the particle is dead
        return this.lifespan < 0; // If the life value is less than 0, return true
    }

    run() { // Run particles (update status and draw)
        if (!paused) this.update(); // If not paused, update particle status
        this.draw(); // Draw particles
    }

    update() { // Update particle status
        this.pos.add(this.vel); // Position moves according to speed
        this.lifespan -= this.decay; // Life value decreases (decay)
    }
}

class Fire extends Particle { // Inherit the Particle class and define fire particles
    constructor(pos, speed) { // Constructor
        super(pos, speed); // Call parent class constructor
        this.angle = random(TWO_PI); // Set initial angle (random direction)
        this.angVel = random(-1, 1); // Set angular velocity (random rotation speed)
        this.decay = random(3, 6); // Set decay speed (flame particles disappear faster)
        this.color = [200 + random(55), random(127), random(31)]; // Set flame color (orange-red range)
        this.radius = randint(2, 6); // Set radius of flame particles (random size)
    }

    draw() { // Draw flame particles
        stroke(0, this.lifespan); // Set stroke color
        fill(this.color[0], this.color[1], this.color[2], this.lifespan); // Set fill color
        rectMode(CENTER); // Set rectangle mode to center alignment
        push(); // Save current drawing state
        translate(this.pos.x, this.pos.y); // Move to particle position
        rotate(this.angle); // Rotate particle
        var r = this.radius * ts / 24 * 2; // Calculate particle size
        rect(0, 0, r, r); // Draw flame particles in rectangle
        pop(); // Restore drawing state
        rectMode(CORNER); // Restore rectangle mode to default (upper left corner aligned)
    }

    update() { // Update flame particle state
        this.pos.add(this.vel); // Position moves according to speed
        this.angle += this.angVel; // Angle changes with angular velocity (produces rotation effect)
        this.lifespan -= this.decay; // Life value decreases (decay)
    }
}

class Bomb extends Particle { // Inherit Particle class and define bomb particles
    constructor(pos, speed) { // Constructor
        super(pos, speed); // Call parent class constructor
        this.decay = random(8, 10); // Set a faster decay speed
        this.color = [151 + random(80), 45 + random(60), 200 + random(55)]; // Set the bomb color (purple tone)
        this.radius = randint(2, 6); // Set the radius of the bomb particle
    }
}

class Shrapnel extends Fire { // Inherit the Fire class and define the shrapnel particle
    constructor(pos, speed) { // Constructor
        super(pos, speed); // Call the parent class constructor
        this.decay = random(8, 10); // Set a faster decay speed
        var r = 63 + random(127); // Set the color to gray (from dark gray to light gray)
        this.color = [r, r, r]; // Set the shrapnel color
        this.radius = randint(2, 6); // Set the radius of the shrapnel particle
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

    update() {
        if (frameCount % 5 == 0)
        {
            this.frameIndex++;
        }
    }
}