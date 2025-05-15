class Tower {
    constructor(col, row) { // Constructor, initialize the position and properties of the tower
        this.baseOnTop = true; // Whether to draw the tower base above the barrel
        this.color = [0, 0, 0]; // Primary color
        this.drawLine = true; // Whether to draw the line connecting the attack target
        this.follow = true; // Whether to follow the target, even if not attacking
        this.hasBarrel = true; // Whether there is a barrel
        this.hasBase = true; // Whether there is a tower base
        this.length = 0.7; // Barrel length (in tiles)
        this.radius = 1; // Tower base radius (in tiles)
        this.secondary = [0, 0, 0]; // Secondary color
        this.weight = 2; // Laser stroke width
        this.width = 0.3; // Barrel width (in tiles)
        this.health = 10;

// Misc // Miscellaneous
        this.alive = true; // Is the tower alive?
        this.name = 'tower'; // Name of the tower
        this.sound = null; // Sound played when launching
        this.title = 'Tower'; // Title of the tower
        this.selected = false; // Is it selected?

// Position // Position of the tower
        this.angle = 0; // Angle of the tower
        this.gridPos = createVector(col, row); // Grid position
        this.pos = createVector(col*ts + ts/2, row*ts + ts/2); // Screen position

// Stats // Properties of the tower
        this.cooldown = 0.01; // Cooldown time
        this.cooldownMax = 0; // Maximum cooldown time
        this.cooldownMin = 0; // Minimum cooldown time
        this.cost = 0; // Purchase cost of the tower
        this.damageMax = 20; // Maximum damage
        this.damageMin = 1; // Minimum damage
        this.range = 3; // Attack range (tile units)
        this.totalCost = 0; // Total cost
        this.type = 'physical'; // Damage type
        this.upgrades = []; // Upgrade list
    }

    // Adjust angle to point towards pixel position
    aim(x, y) {
        this.angle = atan2(y - this.pos.y, x - this.pos.x); // Calculate angle
    }

// Deal damage to monster // Deal damage to monster
    attack(e) {

        var damage = round(random(this.damageMin, this.damageMax)); // Random damage
        e.dealDamage(damage, this.type); // Damage monster
        if (sounds.hasOwnProperty(this.sound)) { // If there is sound, play the sound
            sounds[this.sound].play();
        }
        this.onHit(e); // Perform subsequent operations on the target
    }

// Check if cooldown is completed // Check if the cooling time is completed
    canFire() {
        return this.cd === 0; // If the cooling time is 0, it means that you can attack
    }

// Auxiliary deep cloning method
    deepClone(obj, hash = new WeakMap()) {
// Return the basic type directly
        if (obj === null || typeof obj !== 'object') return obj;

// If it has been cloned, return the cloned object directly
        if (hash.has(obj)) return hash.get(obj);

        let clone;

// Process arrays
        if (Array.isArray(obj)) {
            clone = [];
            hash.set(obj, clone); // Record the current object
            clone = obj.map(item => this.deepClone(item, hash));
            return clone;
        }

// Process ordinary objects
        clone = {};
        hash.set(obj, clone); // Record the current object

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clone[key] = this.deepClone(obj[key], hash);
            }
        }

        return clone;
    }
    copyTower(template) {
// If no template is passed, use an empty object
        template = typeof template === 'undefined' ? {} : template;

// Get all keys of the template
        var keys = Object.keys(template);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = template[key];

// Deep cloning logic
            if (value && typeof value === 'object') {
// If it is an array, create a new array and recursively clone the elements
                if (Array.isArray(value)) {
                    this[key] = value.map(item =>
                        item && typeof item === 'object' ? this.deepClone(item) : item
                    );
                }
// If it is a normal object, recursively clone
                else {
                    this[key] = this.deepClone(value);
                }
            }
// Direct assignment of basic types
            else {
                this[key] = value;
            }
        }
    }
    draw() { // Draw the tower
// Draw turret base // Draw the base of the tower
        if (this.hasBase && !this.baseOnTop) this.drawBase();
// Draw barrel // Draw the barrel
        if (this.hasBarrel) {
            push();
            translate(this.pos.x, this.pos.y);
            rotate(this.angle); // Rotate the barrel
            this.drawBarrel(); // Draw the barrel
            pop();
        }
// Draw turret base // Draw the base of the tower again
        if (this.hasBase && this.baseOnTop) this.drawBase();
    }

// Draw barrel of tower (moveable part) // Draw the barrel of the tower (movable part)
    drawBarrel() {
        fill(this.secondary); // Set fill color
        rect(0, -this.width * ts / 2, this.length * ts, this.width * ts); // Draw a rectangular barrel
    }

// Draw base of tower (stationary part) // Draw the tower base (stationary part)
    drawBase() {
        fill(this.color); // Set fill color
        ellipse(this.pos.x, this.pos.y, this.radius * ts, this.radius * ts); // Draw an elliptical tower base
    }

// Returns damage range // Returns damage range
    getDamage() {
        return rangeText(this.damageMin, this.damageMax); // Returns damage text
    }

// Returns average cooldown in seconds // Returns average cooldown time (seconds)
    getCooldown() {
        return (this.cooldownMin + this.cooldownMax) / 120; // Calculate cooldown time
    }

    kill() { // Mark the tower as dead
        this.alive = false;
    }

    isDead() { // Check if the tower is dead
        return !this.alive;
    }

// Functionality once entity has been targeted // Operation after the target is selected
    onAim(e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y); // Target locked
        if (!this.canFire()) return; // If you can't attack, return
        this.resetCooldown(); // Reset cooldown
        this.attack(e); // Attack target
// Draw line to target // Draw the line to attack the target
        if (!this.drawLine) return;
        stroke(this.color); // Set line color
        strokeWeight(this.weight); // Set line width
        line(this.pos.x, this.pos.y, e.pos.x, e.pos.y); // Draw line
        strokeWeight(1); // Reset line width
    }

    onCreate() { // Initialization at creation
        this.cd = 0; // Set cooldown to 0
    }

    onHit(e) {} // Operation when the target is hit

// Add effect when the tower is attacked
    dealDamage(amt, type) { // Deal with damage

        this.health -= amt ; // Calculate final damage
//
// if (this.health > 0) { // If health is greater than 0
// this.health -= amt ; // Calculate final damage
//
//
// }
        if (this.health <= 0) this.kill(); // If health is less than or equal to 0, call death logic

    }

    resetCooldown() { // Reset cooldown
        var cooldown = round(random(this.cooldownMin, this.cooldownMax)); // Randomly generate cooldown
        this.cd = cooldown; // Set cooldown
        this.cooldown = cooldown;
    }

// Sell price // Tower selling price
    sellPrice() {
        return floor(this.totalCost * sellConst); // Return selling price
    }

// Target correct monster // Target the correct monster
    target(entities) {
        entities = this.visible(entities); // Get visible monsters
        if (entities.length === 0) return; // If no monsters are visible, return
        var t = getTaunting(entities); // Get taunting monsters
        if (t.length > 0) entities = t; // If there are taunting monsters, select them
        var e = getFirst(entities); // Get the first monster
        if (typeof e === 'undefined') return; // If no target, return
        this.onAim(e); // Lock on the target and attack
    }

    update() { // Update the state of the tower
        if (this.cd > 0) this.cd--; // If the cooldown is greater than 0, reduce the cooldown
    }

// Use template to set attributes // Use template to set tower attributes
    upgrade(template) {
        template = typeof template === 'undefined' ? {} : template; // If no template is passed, use an empty object
        var keys = Object.keys(template); // Get all keys of the template
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i]; // Iterate over the template keys

            this[key] = template[key]; // Set properties
        }
        if (template.cost) this.totalCost += template.cost; // If there is a cost, increase the total cost
    }

// Returns array of visible entities out of passed array // Returns array of visible entities
    visible(entities) {
        return getInRange(this.pos.x, this.pos.y, this.range, entities); // Get entities in range
    }

// Draw the attack range
    diaplayRange(cx, cy)
    {
        stroke(255, 237, 102);
        strokeWeight(2);
        fill(this.color[0], this.color[1], this.color[2], 40);
//fill(100, 40);
// Attack range radius
        var r = this.range * ts * 2;
        circle(cx, cy, r);
    }

//Display remaining CDs
    displayCD(cx, cy)
    {
        let cdRatio = this.cd / this.cooldown;
        if (cdRatio < 0.001) return;
        strokeWeight(2);
        stroke(255);
        fill(100);
        rect(cx - ts / 3, cy + ts / 5, 2 * ts / 3, ts / 5);
        noStroke();
        fill(0, 12, 188);
        let wid = lerp(0, 2 * ts / 3, cdRatio);
        rect(cx - ts / 3, cy + ts / 5, wid, ts / 5);
    }
    displayUpgrade(cx, cy) {
        let hasUpgrade = this.upgrades.length > 0;
        if (!hasUpgrade) return;
        let enoughCash = cash > this.upgrades[0].cost;
        let icon = enoughCash ? iconUpgrade : iconUpgradeGrey;
        let scale = 0.2;
        image(icon, cx, cy, ts * scale, ts * scale); // Remove sin(angle) floating calculation
    }
}
