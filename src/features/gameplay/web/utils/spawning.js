export function spawnEnemy(canvasWidth, difficulty) {
    const Enemy = require('../entities/Enemy').default;

    const types = ['basic', 'basic', 'zigzag', 'aggressive'];
    const type = types[Math.floor(Math.random() * Math.min(types.length, 2 + Math.floor(difficulty / 5)))];

    const x = Math.random() * (canvasWidth - 80) + 40;
    const y = -40;

    return new Enemy(x, y, type);
}

export function shouldSpawnEnemy(gameTime, lastSpawnTime, difficulty) {
    const spawnInterval = Math.max(800 - difficulty * 20, 300);
    return gameTime - lastSpawnTime >= spawnInterval;
}
