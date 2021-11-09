/*
 *
 * The p5.RoverCam library - First-Person 3D CameraControl for p5.js and WEBGL.
 *
 *   Copyright © 2020 by p5.RoverCam authors
 *
 *   Source: https://github.com/freshfork/p5.RoverCam
 *
 *   MIT License: https://opensource.org/licenses/MIT
 *
 *
 * explanatory note:
 *
 * p5.RoverCam is a derivative of the QueasyCam Library by Josh Castle,
 * ported to JavaScript for p5.js from github.com/jrc03c/queasycam
 *
 * updates
 * 20200628 incorporate pointerLock and overridable controller method
 * 20200629 add support for switching between multiple cameras
 * 20200701 v1.1.0 fix registerMethod and allow for p5js instance mode
 * 20200702 v1.1.1 moved pointerLock; added keymap and ocular offsetting
 */

/**
 * Heavily modified to use the cannon.js library!
 * Lots of unused code has been removed.
 */

import { Vec3, Quaternion } from "./cannon-es.js";

const CAMERA_NEAR_Z = 0.01;
const CAMERA_FAR_Z = 250;

export default class RoverCam {
    constructor(canvasRenderer) {
        this.xRotation = 0;
        this.yRotation = 0;

        this.forward = new Vec3();
        this.up = new Vec3();
        this.position = new Vec3();

        document.addEventListener('mousemove', (event) => {
            if (!this.pointerLock) return;

            const { movementX, movementY } = event;

            this.yRotation -= movementX * 0.002;
            this.xRotation += movementY * 0.002;

            this.xRotation = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.xRotation));
        });

        canvasRenderer.elt.addEventListener('click', () => {
            if (!this.pointerLock) {
                document.body.requestPointerLock();
            }
        });

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement) {
                this.pointerLock = true;
            } else {
                this.pointerLock = false;
            }
        });
    }

    set fov(value) {
        this.fovy = value;
        this._cachedWidth = 0; // trigger a perspective call in the draw loop
    }

    update() {
        // 'width' and 'height' are poorly named p5 globals that hold the width+height of the canvas.
        if (width !== this._cachedWidth || height !== this._cachedHeight) {
            console.log("perspective");
            perspective(this.fovy, width / height, CAMERA_NEAR_Z, CAMERA_FAR_Z);
            this._cachedWidth = width;
            this._cachedHeight = height;
        }

        const viewQuaternion = new Quaternion().setFromEuler(0, this.yRotation, this.xRotation, "XYZ");
        viewQuaternion.vmult(Vec3.UNIT_X, this.forward);
        viewQuaternion.vmult(Vec3.UNIT_Y, this.up);

        const center = this.position.vadd(this.forward);

        camera(this.position.x, this.position.y, this.position.z, center.x, center.y, center.z, this.up.x, this.up.y, this.up.z);
    }
}