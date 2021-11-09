import { Cylinder } from "../vendor/cannon-es.js";
import createGenericBody from "./createGenericBody.js";

export default class CylinderCollider {
    constructor(physWorld, mass, pos, radius, height) {
        const box = new Cylinder(radius, radius, height, 12);

        const body = new createGenericBody(box, mass, pos);

        physWorld.add(body);
    }
}
