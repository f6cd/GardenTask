import { Body } from "cannon-es";

export default function createGenericBody(colShape, mass, pos) {
    const body = new Body({
        mass: mass
    });
    body.addShape(colShape);
    body.position.copy(pos);
    body.linearDamping = 0.4;
    body.updateSolveMassProperties();

    return body;
}