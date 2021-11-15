import { Body, Shape, Vec3 } from "cannon-es";

/**
 * Create a new body with predefined settings from a collision shape, mass and position.
 * @param {Shape} colShape Collision shape to use.
 * @param {number} mass Mass. 
 * @param {Vec3} pos Initial position.
 * @returns {Body} Created physics body.
 */
function createGenericBody(colShape, mass, pos) {
    const body = new Body({
        mass: mass
    });

    body.addShape(colShape);
    body.position.copy(pos);
    body.linearDamping = 0.4;
    body.updateSolveMassProperties();

    return body;
}

export default createGenericBody;