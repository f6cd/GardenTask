// Stolen from three.js: https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js#L691.
export default function composeMatrixFromTransformProperties(position, quaternion, scale) {
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