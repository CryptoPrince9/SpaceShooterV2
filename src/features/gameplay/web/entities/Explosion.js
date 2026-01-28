export default class Explosion {
    constructor(x, y, size = 20) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.maxSize = size * 3;
        this.alpha = 1;
        this.particles = [];
        this.active = true;

        // Create particles
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            this.particles.push({
                x: 0,
                y: 0,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3
            });
        }
    }

    update(deltaTime) {
        // Expand and fade
        this.size += 2;
        this.alpha -= 0.05;

        // Update particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
        });

        if (this.alpha <= 0 || this.size >= this.maxSize) {
            this.active = false;
        }
    }
}
