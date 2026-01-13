import Matter from "matter-js";

const CollisionSystem = (entities, { dispatch }) => {
    let pairs = Matter.Detector.collisions(
        Matter.Detector.create(),
        Matter.Composite.allBodies(entities.physics.engine.world)
    );

    pairs.forEach(pair => {
        // Bullet hitting Enemy
        // Access bodies via pair.bodyA and pair.bodyB

        // This is a simplified check. MatterJS `collisionStart` event is better but we can iterate pairs manually if we don't have constraints.
        // Actually, React Native Game Engine usually pairs with Matter.Events.
    });

    // Easier approach: Iterate entities and check overlap manually or look at MatterJS collision events.
    // Let's use Matter.Events in the setup, OR just simple distance check for now if Detector is annoying to setup in functional system.
    // Actually, let's use the Detector properly or just check overlaps.

    // Simplest: Check every bullet against every enemy. O(N*M). Low count, so fine.

    let bullets = Object.keys(entities).filter(k => k.startsWith("bullet_"));
    let enemies = Object.keys(entities).filter(k => k.startsWith("enemy_"));
    let ship = entities.ship;

    bullets.forEach(bKey => {
        let bullet = entities[bKey].body;
        enemies.forEach(eKey => {
            let enemy = entities[eKey].body;
            if (Matter.Collision.collides(bullet, enemy)) {
                // Hit!
                dispatch({ type: "score" });

                Matter.World.remove(entities.physics.engine.world, bullet);
                Matter.World.remove(entities.physics.engine.world, enemy);

                delete entities[bKey];
                delete entities[eKey];
            }
        });
    });

    if (ship) {
        enemies.forEach(eKey => {
            if (entities[eKey] && Matter.Collision.collides(ship.body, entities[eKey].body)) {
                dispatch({ type: "game-over" });
            }
        });
    }

    return entities;
};

export default CollisionSystem;
