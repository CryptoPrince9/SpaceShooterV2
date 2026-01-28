export default class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.type = type;
        this.health = type === 'aggressive' ? 30 : 10;
        this.speed = type === 'aggressive' ? 2 : 1.5;
        this.active = true;
        this.offsetX = Math.random() * Math.PI * 2; // For wave movement

        // Movement pattern
        if (type === 'zigzag') {
            this.amplitude = 50; // Wave amplitude
            this.frequency = 0.02; // Wave frequency
        }
    }

    update(deltaTime, playerX, canvasHeight) {
        switch (this.type) {
            case 'basic':
                this.y += this.speed;
                break;

            case 'zigzag':
                this.y += this.speed;
                this.offsetX += this.frequency;
                this.x += Math.sin(this.offsetX) * 2;
                break;

            case 'aggressive':
                this.y += this.speed * 0.8;
                // Move toward player X position
                const dx = playerX - this.x;
                this.x += Math.sign(dx) * Math.min(Math.abs(dx), 1.5);
                break;
        }

        // Deactivate if off screen
        if (this.y > canvasHeight + this.height) {
            this.active = false;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.active = false;
            return true; // Enemy destroyed
        }
        return false;
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
