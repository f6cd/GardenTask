import { Plane, Vec3 } from "../vendor/cannon-es.js";
import createGenericBody from "./createGenericBody.js";

export default class PlaneCollider {
    constructor(physWorld, pos) {
        const plane = new Plane();

        const body = new createGenericBody(plane, 0, pos);

        body.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);

        physWorld.add(body);
    }
}
