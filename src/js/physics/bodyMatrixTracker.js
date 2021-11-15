import composeMatrixFromTransformProperties from "../lib/composeMatrixFromTransformProperties";

// Is this even an optimization?
const STATIC_1X1X1 = [1, 1, 1];

/**
 * Given a body, track its transform and convert into a matrix for drawing.
 * This is a class, as it allows for optimizations to be added (i.e. not recalculating for static bodies).
 */
export default class BodyMatrixTracker {
    constructor(trackingBody) {
        this._body = trackingBody;
    }

    getMatrix() {
        if (this._body.mass > 0 || !this._cachedTransformMatrix) {
            // Small optimization; only re-calculate transform matrix if we're not a static body.
            this._cachedTransformMatrix = composeMatrixFromTransformProperties(
                this._body.position.toArray(),
                this._body.quaternion.toArray(),
                STATIC_1X1X1,
            );
        }

        return this._cachedTransformMatrix;
    }
}