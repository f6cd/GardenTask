import GenericPhysObject from "../physics/genericPhysObject.js";
import * as CANNON from "../vendor/cannon-es.js";
import Shooter from "./shooter.js";

const PLAYER_MASS = 30;
const PLAYER_RADIUS = 72 / 64;

export default class Player {
    constructor(physWorld, pos, rover) {
        this.rover = rover;

        // Dimensions stolen from the source engine: https://developer.valvesoftware.com/wiki/Player_Entity.
        const playerShape = new CANNON.Sphere(PLAYER_RADIUS);
        const obj = new GenericPhysObject(
            playerShape,
            PLAYER_MASS,
            new CANNON.Vec3(pos.x, pos.y - PLAYER_RADIUS * 2, pos.z + PLAYER_RADIUS)
        );
        obj.body.fixedRotation = true;
        obj.body.allowSleep = false;
        obj.body.linearDamping = 0;
        obj.body.angularDamping = 0;

        obj.body.updateMassProperties();

        physWorld.add(obj);
        this.physObject = obj;

        // Shooting logic.
        this.shooter = new Shooter(physWorld);
        window.addEventListener('click', () => {
            this.shooter.fire(this.physObject.body.position, this.rover.forward, obj.body.velocity);
        });

        // Player controls.
        this._forward = new CANNON.Vec3();
        this._right = new CANNON.Vec3();
    }

    update() {
        // Compute forward vector. Only rotation about the Y axis!
        // this._forward.set(Math.cos(this.rover.pan), 0, Math.sin(this.rover.pan));
        this._forward.set(Math.cos(-this.rover.yRotation), 0, Math.sin(-this.rover.yRotation));
        this._forward.normalize();
        // Compute the right vector. Use constant up vector.
        this._forward.cross(CANNON.Vec3.UNIT_Y, this._right);

        const playerVelocity = this.physObject.body.velocity;
        playerVelocity.set(0, this.physObject.body.velocity.y, 0);

        if (keyIsDown(87))
            playerVelocity.addScaledVector(1 * deltaTime, this._forward, playerVelocity);
        else if (keyIsDown(83))
            playerVelocity.addScaledVector(-1 * deltaTime, this._forward, playerVelocity);

        if (keyIsDown(65))
            playerVelocity.addScaledVector(-1 * deltaTime, this._right, playerVelocity);
        else if (keyIsDown(68))
            playerVelocity.addScaledVector(1 * deltaTime, this._right, playerVelocity);
    }

    draw() {
        const pos = this.physObject.body.position;
        this.rover.position.set(pos.x, pos.y - 64 / 64 / 2, pos.z);

        this.shooter.draw();
    }
}
