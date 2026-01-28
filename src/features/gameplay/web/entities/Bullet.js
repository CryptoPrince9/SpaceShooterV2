export default class Bullet {
    constructor(x, y, vy, isPlayerBullet = true) {
        this.x = x;
        this.y = y;
        this.width = 6;
        this.height = 15;
        this.vy = vy;
        this.isPlayerBullet = isPlayerBullet;
        this.damage = 10;
        this.active = true;
    }

    update(deltaTime, canvasHeight) {
        this.y += this.vy;

        // Deactivate if off screen
        if (this.y < -this.height || this.y > canvasHeight + this.height) {
            this.active = false;
        }
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
