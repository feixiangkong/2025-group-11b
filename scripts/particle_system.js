// Particle System class, defines a particle system
class ParticleSystem {
    constructor(x, y) {
// Initialize the origin position and create an empty particle array
        this.origin = createVector(x, y);
        this.particles = [];
    }

// Add a new particle to the particle system
    addParticle() {
        this.particles.push(new Particle(this.origin, 1))
    }

// Check if the particle system has no particles
    isDead() {
        return this.particles.length === 0;
    }

// Execute the particle system and update the status of each particle
    run() {
// Traverse the particle array from back to front
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.run(); // Run the particle action

// If the particle is dead, delete it from the array
            if (p.isDead()) this.particles.splice(i, 1);
        }
    }
}

// Rocket explosion class, inherited from particle system
class RocketExplosion extends ParticleSystem {
    constructor(x, y) {
        super(x, y); // Call parent class constructor
    }

// Override parent class addParticle method, add fire particles
    addParticle() {
        this.particles.push(new Fire(this.origin, 5));
    }
}

// Bomb explosion class, inherited from particle system
class BombExplosion extends ParticleSystem {
    constructor(x, y) {
        super(x, y); // Call parent class constructor
    }

// Override parent class addParticle method, add bomb particles
    addParticle() {
        this.particles.push(new Bomb(this.origin, 2));
    }
}

// Shrapnel explosion class, inherited from particle system
class ShrapnelExplosion extends ParticleSystem {
    constructor(x, y) {
        super(x, y); // Call parent class constructor
    }

// Override parent class addParticle method to add shrapnel particles
    addParticle() {
        this.particles.push(new Shrapnel(this.origin, 5));
    }
}

class StoneExplosion extends ParticleSystem {
    constructor(x, y) {
        super(x, y);
    }

    addParticle() {
        let spd = 2;
        this.particles.push(new Stone(this.origin, spd));
    }
}

class CannonExplosion extends ParticleSystem {
    constructor(x, y, particleAmt) {
        super(x, y);
        let spd = 2;

        let centerR = random(1, 2);
        this.particles.push(new Cannon(this.origin, spd, centerR));
        var deltaAngle = TWO_PI / (particleAmt - 1);
        for (let i = 0; i < particleAmt - 1; i++)
        {
            var a = i * deltaAngle + random(-PI/10, PI/10);
            var d = ts * 0.8;
            var x = this.origin.x + cos(a) * d;
            var y = this.origin.y + sin(a) * d;
            let r = random(centerR / 4, centerR / 2);
            this.particles.push(new Cannon(createVector(x, y), spd, r));
        }

    }
}