import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Dimensions, Text } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import Ship from './entities/Ship';
import Physics from './systems/Physics';
import MoveShip from './systems/MoveShip';
import AutoShoot from './systems/AutoShoot';
import EnemySystem from './systems/EnemySystem';
import CollisionSystem from './systems/CollisionSystem';

const { width, height } = Dimensions.get("window");

export default function Game() {
    const [running, setRunning] = useState(true);
    const [gameEngine, setGameEngine] = useState(null);
    const [score, setScore] = useState(0);

    const setupWorld = () => {
        let engine = Matter.Engine.create({ enableSleeping: false });
        let world = engine.world;
        engine.gravity.y = 0;

        let ship = Matter.Bodies.rectangle(width / 2, height - 100, 50, 50);
        Matter.World.add(world, [ship]);

        return {
            physics: { engine: engine, world: world },
            ship: { body: ship, renderer: Ship }
        };
    };

    const handleEvent = (e) => {
        if (e.type === "score") {
            setScore(prev => prev + 10);
        } else if (e.type === "game-over") {
            setRunning(false);
            console.log("Game Over!");
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}>
                <Text style={{ color: 'white', fontSize: 20 }}>Score: {score}</Text>
            </View>
            {!running && (
                <View style={{ position: 'absolute', top: height / 2 - 20, width: width, alignItems: 'center', zIndex: 10 }}>
                    <Text style={{ color: 'red', fontSize: 40, fontWeight: 'bold' }}>GAME OVER</Text>
                </View>
            )}
            <GameEngine
                ref={(ref) => setGameEngine(ref)}
                style={styles.gameContainer}
                running={running}
                onEvent={handleEvent}
                systems={[Physics, MoveShip, AutoShoot, EnemySystem, CollisionSystem]}
                entities={setupWorld()}>
                <StatusBar hidden={true} />
            </GameEngine>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    gameContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});
