import BodyMatrixTracker from "../physics/bodyMatrixTracker.js";
import createGenericBody from "../physics/createGenericBody.js";
import getTrimesh from "../physics/getTrimesh.js";

export default class Terrain {
    constructor(physWorld, pos, islandModel, complexCollisionModel, tex) {
        const colShape = getTrimesh(complexCollisionModel);
        
        const body = new createGenericBody(colShape, 0, pos);
        body.updateAABB();
        physWorld.add(body);
        
        this._matrixTracker = new BodyMatrixTracker(body);

        this._mesh = islandModel;
        this._tex = tex;
    }

    draw() {
        push();
        applyMatrix(this._matrixTracker.getMatrix());
        texture(this._tex);
        model(this._mesh);
        pop();
    }
}
