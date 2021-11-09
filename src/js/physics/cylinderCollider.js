import GenericPhysObject from "./genericPhysObject.js";
import * as CANNON from "../vendor/cannon-es.js";

export default class CylinderCollider {
    constructor(physWorld, mass, pos, radius, height) {
        const box = new CANNON.Cylinder(radius, radius, height, 12);

        const obj = new GenericPhysObject(box, mass, pos);

        physWorld.add(obj);
        this.physObject = obj;
    }
}
