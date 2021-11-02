import GenericPhysObject from "./genericPhysObject.js";
import * as CANNON from "../vendor/cannon-es.js";

export default class PlaneCollider {
    constructor(physWorld, pos) {
        const plane = new CANNON.Plane();

        const obj = new GenericPhysObject(plane, 0, pos);

        obj.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);

        physWorld.add(obj);
        this.physObject = obj;
    }
}
