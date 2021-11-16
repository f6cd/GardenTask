import createGenericBody from "../physics/createGenericBody.js";
import { Body, Sphere, Vec3 } from "cannon-es";
import Shooter from "./shooter.js";
import p5 from "p5";

const PLAYER_MASS = 30;
const PLAYER_RADIUS = 72 / 64;

const PLAYER_SHAPE = new Sphere(PLAYER_RADIUS);

export default class Player {
    constructor(physWorld, pos, camera, shooter) {
        this._camera = camera;

        // Dimensions stolen from the source engine: https://developer.valvesoftware.com/wiki/Player_Entity.
        /** @type {Body} */
        const body = new createGenericBody(
            PLAYER_SHAPE,
            PLAYER_MASS,
            new Vec3(pos.x, pos.y - PLAYER_RADIUS * 2, pos.z + PLAYER_RADIUS)
        );
        body.allowSleep = false;
        body.linearDamping = 0.9;
        body.angularDamping = 0;

        body.updateMassProperties();

        physWorld.add(body);
        this._body = body;

        // Shooting logic.
        this._shooter = shooter;
        window.addEventListener('click', () => {
            // Shoot a projectile.
            this._shooter.fire(this._body.position, this._camera.forward, body.velocity);
        });

        // Player controls.
        this._forward = new Vec3();
        this._right = new Vec3();

        // Detect landing after jump.
        // Copied from: https://github.com/pmndrs/cannon-es/blob/master/examples/js/PointerLockControlsCannon.js#L38.
        const tempContactNormal = new Vec3();
        this._canJump = true;
        body.addEventListener("collide", (event) => {
            const { contact } = event;

            if (contact.bi.id === body.id) {
                contact.ni.negate(tempContactNormal);
            } else {
                tempContactNormal.copy(contact.ni);
            }

            console.log(tempContactNormal.dot(Vec3.UNIT_Y));
            if (tempContactNormal.dot(Vec3.UNIT_Y) < -0.5) {
                this._canJump = true;
            }
        })
    }

    /**
     * Update player movement.
     * @param {p5} p Processing instance.
     */
    update(p) {
        // Compute forward vector. Only rotation about the Y axis!
        // this._forward.set(Math.cos(this.rover.pan), 0, Math.sin(this.rover.pan));
        this._forward.set(Math.cos(-this._camera.yRotation), 0, Math.sin(-this._camera.yRotation));
        this._forward.normalize();
        // Compute the right vector. Use constant up vector.
        this._forward.cross(Vec3.UNIT_Y, this._right);

        const playerVelocity = this._body.velocity;
        playerVelocity.set(0, this._body.velocity.y, 0);

        if (p.keyIsDown(87))
            playerVelocity.addScaledVector(1 * p.deltaTime, this._forward, playerVelocity);
        else if (p.keyIsDown(83))
            playerVelocity.addScaledVector(-1 * p.deltaTime, this._forward, playerVelocity);

        if (p.keyIsDown(65))
            playerVelocity.addScaledVector(-1 * p.deltaTime, this._right, playerVelocity);
        else if (p.keyIsDown(68))
            playerVelocity.addScaledVector(1 * p.deltaTime, this._right, playerVelocity);

        if (p.keyIsDown(32) && this._canJump) {
            this._canJump = false;
            playerVelocity.addScaledVector(-1 * 6, Vec3.UNIT_Y, playerVelocity);
        }
    }

    /**
     * Draw the object to the screen.
     * @param {p5} p Processing instance.
     */
    draw(p) {
        const pos = this._body.position;
        this._camera.position.set(pos.x, pos.y - 64 / 64 / 2, pos.z);

        this._shooter.draw(p);
    }
}
