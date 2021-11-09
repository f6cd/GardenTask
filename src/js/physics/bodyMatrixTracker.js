// Stolen from three.js: https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js#L691.
function composeMatrixFromTransformProperties(position, quaternion, scale) {
    const te = [];

    const x = quaternion[0], y = quaternion[1], z = quaternion[2], w = quaternion[3];
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    const sx = scale[0], sy = scale[1], sz = scale[2];

    te[0] = (1 - (yy + zz)) * sx;
    te[1] = (xy + wz) * sx;
    te[2] = (xz - wy) * sx;
    te[3] = 0;

    te[4] = (xy - wz) * sy;
    te[5] = (1 - (xx + zz)) * sy;
    te[6] = (yz + wx) * sy;
    te[7] = 0;

    te[8] = (xz + wy) * sz;
    te[9] = (yz - wx) * sz;
    te[10] = (1 - (xx + yy)) * sz;
    te[11] = 0;

    te[12] = position[0];
    te[13] = position[1];
    te[14] = position[2];
    te[15] = 1;

    return te;
}

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