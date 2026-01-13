import Matter from "matter-js";

const MoveShip = (entities, { touches }) => {
    let ship = entities.ship.body;

    touches.filter(t => t.type === "move").forEach(t => {
        // Simple follow touch on X axis
        Matter.Body.setPosition(ship, {
            x: t.event.pageX,
            y: ship.position.y // Keep Y fixed for now, or allow free movement? Classic space shooters are usually X-axis only or free. Let's do X-axis for now.
        });
    });

    return entities;
};

export default MoveShip;
