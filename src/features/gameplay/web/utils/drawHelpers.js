export function drawShip(ctx, ship) {
    const { x, y, width, height } = ship;

    ctx.save();

    // Ship body (triangle)
    ctx.fillStyle = '#00d2ff';
    ctx.beginPath();
    ctx.moveTo(x, y - height / 2);
    ctx.lineTo(x - width / 2, y + height / 2);
    ctx.lineTo(x + width / 2, y + height / 2);
    ctx.closePath();
    ctx.fill();

    // Ship glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00d2ff';
    ctx.stroke();

    ctx.restore();
}

export function drawBullet(ctx, bullet) {
    const { x, y, width, height, isPlayerBullet } = bullet;

    ctx.fillStyle = isPlayerBullet ? '#00ff00' : '#ff0000';
    ctx.shadowBlur = 10;
    ctx.shadowColor = isPlayerBullet ? '#00ff00' : '#ff0000';
    ctx.fillRect(x - width / 2, y - height / 2, width, height);
}

export function drawEnemy(ctx, enemy) {
    const { x, y, width, height, type } = enemy;

    const colors = {
        basic: '#ff6b6b',
        zigzag: '#ffd93d',
        aggressive: '#ff006e'
    };

    ctx.fillStyle = colors[type] || '#ff6b6b';
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors[type] || '#ff6b6b';

    // Enemy body (rectangle)
    ctx.fillRect(x - width / 2, y - height / 2, width, height);
}

export function drawExplosion(ctx, explosion) {
    const { x, y, size, alpha, particles } = explosion;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Central blast
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 200, 0, 0.8)');
    gradient.addColorStop(0.6, 'rgba(255, 100, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    // Particles
    ctx.fillStyle = '#ffaa00';
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(x + p.x, y + p.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}

export function drawStarfield(ctx, width, height, stars) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#fff';
    stars.forEach(star => {
        ctx.globalAlpha = star.brightness;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    ctx.globalAlpha = 1;
}

export function drawHealthBar(ctx, player, x, y, width, height) {
    const healthPercent = player.health / player.maxHealth;

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, width, height);

    // Health fill
    let color = '#00ff00';
    if (healthPercent < 0.3) color = '#ff0000';
    else if (healthPercent < 0.6) color = '#ffaa00';

    ctx.fillStyle = color;
    ctx.fillRect(x, y, width * healthPercent, height);

    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}

export function generateStarfield(width, height, count = 100) {
    const stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 1,
            brightness: Math.random() * 0.5 + 0.5,
            speed: Math.random() * 0.5 + 0.2
        });
    }
    return stars;
}
