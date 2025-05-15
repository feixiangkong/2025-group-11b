// Function to create an effect
function createEffect(duration, template) {
    var e = new Effect(duration); // Create a new Effect instance

    // Fill in all properties from the template
    template = typeof template === 'undefined' ? {} : template; // Default to empty object if template is undefined
    var keys = Object.keys(template); // Get all keys from the template

    // Iterate over all keys and copy properties to the effect instance
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        e[key] = template[key];
    }

    return e; // Return the created effect instance
}

// Object to store all effects
var effects = {};

// Define Slow effect
effects.slow = {
    // Display properties
    color: [68, 108, 179], // Blue color

    // Miscellaneous properties
    name: 'slow', // Effect name

    // Methods
    onEnd: function(e) { // When effect ends
        e.speed = this.oldSpeed; // Restore original speed
    },
    onStart: function(e) { // When effect starts
        this.oldSpeed = e.speed; // Store original speed
        this.speed = e.speed / 2; // Halve the speed
        e.speed = this.speed; // Apply to target
    }
};

// Define Enhanced Slow effect
effects.slow2 = {
    // Display properties
    color: [68, 108, 179], // Blue color

    // Miscellaneous properties
    name: 'slow2', // Effect name
    count: 0, // Initialize count property

    // Methods
    onEnd: function(e) { // When effect ends
        e.speed = e.oldSpeed; // Restore original speed
        // e.isSlow2 = true;
    },
    onStart: function(e) { // When effect starts
        // If the target is not already affected by this slow
        if (e.isSlow2 == false) {
            e.oldSpeed = e.speed; // Store original speed
            e.isSlow2 = true; // Mark the target as slowed
        }

        e.count++; // Increment count each time effect is applied

        // Slow progressively based on count
        if (e.count < 10) {
            e.speed = 0; // Freeze target for first 10 applications
        } else {
            e.speed = e.oldSpeed / 2; // Then apply regular slow
        }
    }
};

// Define Poison effect
effects.poison = {
    // Display properties
    color: [102, 204, 26], // Green color

    // Miscellaneous properties
    name: 'poison', // Effect name

    // Methods
    onTick: function(e) { // Each update tick
        e.dealDamage(10, 'poison'); // Deal 10 poison damage
    }
};

// Define Regeneration effect
effects.regen = {
    // Display properties
    color: [210, 82, 127], // Pink color

    // Miscellaneous properties
    name: 'regen', // Effect name

    // Methods
    onTick: function(e) { // Each update tick
        // 20% chance to regenerate 1 health if not at max
        if (e.health < e.maxHealth && Math.random() < 0.2) e.health++;
    }
};

// Define Stun effect
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
    onTick: function(e) {
        e.createStunnedEffect(); // Visual effect for stun
    }
};    