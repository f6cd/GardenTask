import { Vec3 } from "cannon-es";
import p5 from "p5";
import RoverCam from "../lib/p5.rovercam.js";
import BodyMatrixTracker from "../physics/bodyMatrixTracker.js";
import createGenericBody from "../physics/createGenericBody.js";
import getTrimesh from "../physics/getTrimesh.js";

export default class Terrain {
    constructor(physWorld, pos, islandModel, complexCollisionModel, tex) {
        const colShape = getTrimesh(complexCollisionModel);
        
        const body = new createGenericBody(colShape, 0, pos);
        body.updateAABB();
        physWorld.add(body);

        /** @type {Vec3} */
        this._pos = pos;
        
        this._matrixTracker = new BodyMatrixTracker(body);

        this._mesh = islandModel;
        this._tex = tex;
    }

    /**
     * Draw the object to the screen.
     * @param {p5} p Processing instance.
     * @param {RoverCam} cam User camera.
     */
    draw(p, cam) {
        p.push();
        p.applyMatrix(this._matrixTracker.getMatrix());
        p.texture(this._tex);
        p.model(this._mesh);
        p.pop();

        const offsetFromTree = cam.position.vsub(this._pos);
        const angleToCamera = Math.atan2(offsetFromTree.x, offsetFromTree.z);

        // Draw text above the tree.
        // Faces the camera like a billboard.
        p.push();
        p.textAlign(p.CENTER, p.BOTTOM);
        p.angleMode(p.RADIANS);
        p.textSize(4);
        p.translate(...this._pos.vadd(new Vec3(0, -20, 0)).toArray());
        p.rotateY(angleToCamera);
        p.text("help me!\ni fear the zombies!", 0, 0);
        p.pop();
    }
}
