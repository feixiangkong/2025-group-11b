class Effect { // Define the Effect class
    constructor(duration) { // Constructor that accepts duration parameter
        // Display properties
        this.color = [0, 0, 0]; // Color, default is black

        // Miscellaneous properties
        this.alive = true; // Alive state, default is alive
        this.duration = duration; // Duration
        this.name = 'status'; // Effect name, default value is 'status'
        this.count = 0;
    }

    isDead() { // Check if the effect has ended
        return !this.alive; // Return the inverse of the alive state
    }

    kill() { // Terminate the effect
        this.alive = false; // Set the alive state to false
    }

    onEnd(e) {} // Callback function when the effect ends (empty function)
    onStart(e) {} // Callback function when the effect starts (empty function)
    onTick(e) {} // Callback function for each update (empty function)

    update(e) { // Update function
        this.onTick(e); // Call the onTick method
        if (this.duration > 0) this.duration--; // Decrement the duration
        if (this.duration === 0) { // When the duration reaches zero
            this.onEnd(e); // Call the onEnd method
            this.kill(); // Terminate the effect
        }
    }
}

class UpgradeFX extends Effect {
    constructor(duration, x, y) {
        super(duration);
        this.xpos = x;
        this.ypos = y;
        this.frameIdx = 0;
        this.frameNum = 12;
    }

    update(e) {
        super.update(e);

        if (this.frameIdx >= this.frameNum) {
            this.onEnd(e); // Call the onEnd method
            this.kill(); // Terminate the effect
        }

        let sprites = imgUpgradeShine;
        let frameWidth = sprites.width / this.frameNum;
        let frameHeight = sprites.height;
        let frameX = this.frameIdx * frameWidth;
        imageMode(CENTER);
        image(sprites, this.xpos, this.ypos, ts, ts, frameX, 0, frameWidth, frameHeight);

        if (frameCount % 2 === 0) this.frameIdx++;
    }
}