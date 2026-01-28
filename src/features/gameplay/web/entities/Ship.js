export default class Ship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.health = 100;
        this.maxHealth = 100;
        this.fireRate = 200; // ms between shots
        this.lastFireTime = 0;
    }

    update(deltaTime, input, canvasWidth, canvasHeight) {
        // Apply input to velocity
        this.vx = 0;
        this.vy = 0;

        if (input.left) this.vx = -this.speed;
        if (input.right) this.vx = this.speed;
        if (input.up) this.vy = -this.speed;
        if (input.down) this.vy = this.speed;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Keep within bounds
        this.x = Math.max(this.width / 2, Math.min(canvasWidth - this.width / 2, this.x));
        this.y = Math.max(this.height / 2, Math.min(canvasHeight - this.height / 2, this.y));
    }

    canFire(currentTime) {
        return currentTime - this.lastFireTime >= this.fireRate;
    }

    fire(currentTime) {
        this.lastFireTime = currentTime;
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        return this.health <= 0;
    }

    getBounds() {
        return {
            left: this.x - this.width / 2,
            right: this.x + this.width / 2,
            top: this.y - this.height / 2,
            bottom: this.y + this.height / 2
        };
    }
}
