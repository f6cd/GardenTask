import GenericPhysObject from "./genericPhysObject.js";
import * as CANNON from "./cannon-es.js";

export default class Box {
    constructor(physWorld, mass, pos, scale) {
        this.scale = scale;

        const box = new CANNON.Box(new CANNON.Vec3(scale.x / 2, scale.y / 2, scale.z / 2));

        const obj = new GenericPhysObject(box, mass, pos);

        physWorld.add(obj);
        this.physObject = obj;
    }

    draw() {
        push();
        applyMatrix(this.physObject.getTransformMatrix());
        fill(255, 0, 0);
        box(this.scale.x, this.scale.y, this.scale.z);
        pop();
    }
}
