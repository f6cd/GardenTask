import GenericPhysObject from "../physics/genericPhysObject.js";
import getTrimesh from "../physics/getTrimesh.js";

export default class Terrain {
    constructor(physWorld, pos, islandModel, complexCollision, tex) {
        this.mesh = islandModel;
        this.tex = tex;

        const colShape = getTrimesh(complexCollision);

        const obj = new GenericPhysObject(colShape, 0, pos);

        obj.body.updateAABB();

        physWorld.add(obj);
        this.physObject = obj;
    }

    draw() {
        push();
        applyMatrix(this.physObject.getTransformMatrix());
        texture(this.tex);
        model(this.mesh);
        pop();
    }
}
