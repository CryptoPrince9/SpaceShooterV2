export function checkCollision(bounds1, bounds2) {
    return !(
        bounds1.right < bounds2.left ||
        bounds1.left > bounds2.right ||
        bounds1.bottom < bounds2.top ||
        bounds1.top > bounds2.bottom
    );
}

export function processCollisions(bullets, enemies, player, explosions) {
    const results = {
        enemiesDestroyed: 0,
        playerHit: false
    };

    // Check player bullets vs enemies
    bullets.forEach(bullet => {
        if (!bullet.active || !bullet.isPlayerBullet) return;

        enemies.forEach(enemy => {
            if (!enemy.active) return;

            if (checkCollision(bullet.getBounds(), enemy.getBounds())) {
                bullet.active = false;
                const destroyed = enemy.takeDamage(bullet.damage);

                if (destroyed) {
                    results.enemiesDestroyed++;
                    explosions.push(createExplosion(enemy.x, enemy.y));
                }
            }
        });
    });

    // Check enemies vs player
    enemies.forEach(enemy => {
        if (!enemy.active) return;

        if (checkCollision(enemy.getBounds(), player.getBounds())) {
            enemy.active = false;
            const playerDead = player.takeDamage(20);
            explosions.push(createExplosion(enemy.x, enemy.y));

            if (playerDead) {
                results.playerHit = true;
                explosions.push(createExplosion(player.x, player.y, 40));
            }
        }
    });

    return results;
}

function createExplosion(x, y, size) {
    const Explosion = require('../entities/Explosion').default;
    return new Explosion(x, y, size);
}
