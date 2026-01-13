import Matter from "matter-js";
import { Dimensions } from "react-native";
import Enemy from "../entities/Enemy";

const { width, height } = Dimensions.get("window");
let lastSpawnTime = 0;

const EnemySystem = (entities, { time }) => {
    let engine = entities.physics.engine;
    let world = engine.world;

    // Spawn
    if (time.current - lastSpawnTime > 1500) { // Every 1.5s
        lastSpawnTime = time.current;

        let randomX = Math.random() * (width - 50) + 25;
        let enemy = Matter.Bodies.rectangle(randomX, -50, 40, 40, { label: "Enemy" });
        Matter.Body.setVelocity(enemy, { x: 0, y: 3 }); // Move down
        Matter.World.add(world, [enemy]);

        entities["enemy_" + time.current] = {
            body: enemy,
            renderer: Enemy,
            scored: false
        };
    }

    // Cleanup and Movement check (Physics handles movement, but we clean up)
    Object.keys(entities).forEach(key => {
        if (key.startsWith("enemy_")) {
            if (entities[key].body.position.y > height + 50) {
                Matter.World.remove(world, entities[key].body);
                delete entities[key];
            }
        }
    });

    return entities;
};

export default EnemySystem;
