import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import Ship from './entities/Ship';
import Bullet from './entities/Bullet';
import { processCollisions } from './utils/collisionDetection';
import {
    drawShip,
    drawBullet,
    drawEnemy,
    drawExplosion,
    drawStarfield,
    drawHealthBar,
    generateStarfield
} from './utils/drawHelpers';
import { spawnEnemy, shouldSpawnEnemy } from './utils/spawning';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WebGameScreen() {
    const canvasRef = useRef(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [paused, setPaused] = useState(false);

    // Game state refs (don't trigger re-renders)
    const gameStateRef = useRef({
        player: null,
        bullets: [],
        enemies: [],
        explosions: [],
        stars: [],
        input: { left: false, right: false, up: false, down: false, fire: false },
        lastTime: 0,
        lastSpawnTime: 0,
        difficulty: 0,
        animationId: null
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const state = gameStateRef.current;

        // Initialize game
        state.player = new Ship(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 100);
        state.stars = generateStarfield(SCREEN_WIDTH, SCREEN_HEIGHT);
        state.lastTime = performance.now();

        // Input handlers
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                    state.input.left = true;
                    break;
                case 'ArrowRight':
                case 'd':
                    state.input.right = true;
                    break;
                case 'ArrowUp':
                case 'w':
                    state.input.up = true;
                    break;
                case 'ArrowDown':
                case 's':
                    state.input.down = true;
                    break;
                case ' ':
                    state.input.fire = true;
                    e.preventDefault();
                    break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                    state.input.left = false;
                    break;
                case 'ArrowRight':
                case 'd':
                    state.input.right = false;
                    break;
                case 'ArrowUp':
                case 'w':
                    state.input.up = false;
                    break;
                case 'ArrowDown':
                case 's':
                    state.input.down = false;
                    break;
                case ' ':
                    state.input.fire = false;
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Game loop
        const gameLoop = (currentTime) => {
            if (paused || gameOver) {
                state.animationId = requestAnimationFrame(gameLoop);
                return;
            }

            const deltaTime = (currentTime - state.lastTime) / 1000;
            state.lastTime = currentTime;

            // Update player
            state.player.update(deltaTime, state.input, SCREEN_WIDTH, SCREEN_HEIGHT);

            // Fire bullets
            if (state.input.fire && state.player.canFire(currentTime)) {
                state.bullets.push(new Bullet(state.player.x, state.player.y - 30, -8, true));
                state.player.fire(currentTime);
            }

            // Update bullets
            state.bullets = state.bullets.filter(bullet => {
                bullet.update(deltaTime, SCREEN_HEIGHT);
                return bullet.active;
            });

            // Spawn enemies
            if (shouldSpawnEnemy(currentTime, state.lastSpawnTime, state.difficulty)) {
                state.enemies.push(spawnEnemy(SCREEN_WIDTH, state.difficulty));
                state.lastSpawnTime = currentTime;
            }

            // Update enemies
            state.enemies = state.enemies.filter(enemy => {
                enemy.update(deltaTime, state.player.x, SCREEN_HEIGHT);
                return enemy.active;
            });

            // Update explosions
            state.explosions = state.explosions.filter(explosion => {
                explosion.update(deltaTime);
                return explosion.active;
            });

            // Check collisions
            const collisionResults = processCollisions(
                state.bullets,
                state.enemies,
                state.player,
                state.explosions
            );

            if (collisionResults.enemiesDestroyed > 0) {
                setScore(prev => prev + collisionResults.enemiesDestroyed * 10);
                state.difficulty += collisionResults.enemiesDestroyed * 0.5;
            }

            if (collisionResults.playerHit) {
                setGameOver(true);
            }

            // Update starfield
            state.stars.forEach(star => {
                star.y += star.speed;
                if (star.y > SCREEN_HEIGHT) {
                    star.y = 0;
                    star.x = Math.random() * SCREEN_WIDTH;
                }
            });

            // Render
            drawStarfield(ctx, SCREEN_WIDTH, SCREEN_HEIGHT, state.stars);

            drawShip(ctx, state.player);

            state.bullets.forEach(bullet => drawBullet(ctx, bullet));
            state.enemies.forEach(enemy => drawEnemy(ctx, enemy));
            state.explosions.forEach(explosion => drawExplosion(ctx, explosion));

            // UI
            drawHealthBar(ctx, state.player, 20, 20, 200, 20);

            state.animationId = requestAnimationFrame(gameLoop);
        };

        state.animationId = requestAnimationFrame(gameLoop);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (state.animationId) {
                cancelAnimationFrame(state.animationId);
            }
        };
    }, [paused, gameOver]);

    const handleRestart = () => {
        setGameOver(false);
        setScore(0);
        const state = gameStateRef.current;
        state.player = new Ship(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 100);
        state.bullets = [];
        state.enemies = [];
        state.explosions = [];
        state.difficulty = 0;
        state.lastTime = performance.now();
    };

    return (
        <View style={styles.container}>
            <canvas
                ref={canvasRef}
                width={SCREEN_WIDTH}
                height={SCREEN_HEIGHT}
                style={{ display: 'block' }}
            />

            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Score: {score}</Text>
            </View>

            {gameOver && (
                <View style={styles.gameOverContainer}>
                    <Text style={styles.gameOverText}>GAME OVER</Text>
                    <Text style={styles.finalScoreText}>Final Score: {score}</Text>
                    <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
                        <Text style={styles.restartButtonText}>RESTART</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        position: 'relative'
    },
    scoreContainer: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 10
    },
    scoreText: {
        color: '#00d2ff',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 210, 255, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10
    },
    gameOverContainer: {
        position: 'absolute',
        top: '40%',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 20
    },
    gameOverText: {
        color: '#ff0000',
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 20,
        textShadowColor: 'rgba(255, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20
    },
    finalScoreText: {
        color: '#fff',
        fontSize: 28,
        marginBottom: 30
    },
    restartButton: {
        backgroundColor: '#00d2ff',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25
    },
    restartButtonText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold'
    }
});
