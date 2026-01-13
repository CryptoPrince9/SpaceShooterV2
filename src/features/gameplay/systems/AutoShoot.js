import Matter from "matter-js";
import Bullet from "../entities/Bullet";

let lastShootTime = 0;

const AutoShoot = (entities, { time }) => {
    let engine = entities.physics.engine;
    let world = engine.world;
    let ship = entities.ship ? entities.ship.body : null;

    if (!ship) return entities;

    if (time.current - lastShootTime > 500) { // 500ms firing rate
        lastShootTime = time.current;

        let bullet = Matter.Bodies.rectangle(ship.position.x, ship.position.y - 30, 10, 20);
        Matter.Body.setVelocity(bullet, { x: 0, y: -10 });
        Matter.World.add(world, [bullet]);

        // Add to entities with a unique key
        entities["bullet_" + time.current] = {
            body: bullet,
            renderer: Bullet
        };
    }

    // Cleanup bullets
    Object.keys(entities).forEach(key => {
        if (key.startsWith("bullet_")) {
            if (entities[key].body.position.y < -100) {
                Matter.World.remove(world, entities[key].body);
                delete entities[key];
            }
        }
    });

    return entities;
};

export default AutoShoot;
