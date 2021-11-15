import BloodSystem from "./bloodSystem.js";
import { Box, Vec3 } from "cannon-es";
import createGenericBody from "../physics/createGenericBody.js";
import BodyMatrixTracker from "../physics/bodyMatrixTracker.js";

const ENEMY_MASS = 300;
const ENEMY_HEIGHT = .93;

const PROJECTILE_VELOCITY_THRESHOLD = 800;

export default class Enemy {
    constructor(physWorld, pos, moveSpeed, enemyModel, enemySkin) {
        // Setup physics.
        const enemyShape = new Box(new Vec3(.35, ENEMY_HEIGHT, .7));
        const body = new createGenericBody(enemyShape,
            ENEMY_MASS,
            new Vec3(pos.x, pos.y - ENEMY_HEIGHT * 2, pos.z)
        )
        body.fixedRotation = true;
        body.allowSleep = false;
        body.updateMassProperties();

        physWorld.add(body);
        this._body = body;

        // Rudimentary AI and death behaviour.
        this.alive = true;
        this.movementSpeed = moveSpeed;
        this.seekPoint = new Vec3();

        body.addEventListener("collide", (event) => {
            if (event.body.velocity.lengthSquared() < PROJECTILE_VELOCITY_THRESHOLD) return;

            // Apply a comically large force when hit.
            const ptRelative = event.body.position.vsub(body.position);
            ptRelative.normalize();
            body.applyForce(ptRelative.scale(-1000000 - Math.random() * 1000000 * .4));

            if (this.alive) {
                // Unlock rotation when dead. Only perform once.
                body.fixedRotation = false;
                this.alive = false;
                body.updateMassProperties();

                // Enable blood.
                this.bloodSystem.enabled = true;
            }
        });

        // Appearance.
        this.enemyModel = enemyModel;
        this.enemySkin = enemySkin;
        this._matrixTracker = new BodyMatrixTracker(body);

        // Blood.
        this.bloodSystem = new BloodSystem(false);
    }

    withinRangeOfPoint(range) {
        return (this._body.position.distanceSquared(this.seekPoint)) < Math.pow(range, 2);
    }

    _updateAI() {
        const headingVector = this.seekPoint.vsub(this._body.position);
        // Bad hack: strip Y axis, normalize to create a direction.
        // We should really strip both Z axis first, then sub and normalize.
        headingVector.set(headingVector.x, 0, headingVector.z).normalize();

        // Face the seek point.
        const angle = Math.atan2(headingVector.z, headingVector.x);
        this._body.quaternion.setFromAxisAngle(Vec3.UNIT_Y, -angle + Math.PI / 2);

        // Set velocity towards the seek point.
        const velocity = this._body.velocity;
        velocity.set(
            headingVector.x * this.movementSpeed,
            velocity.y,
            headingVector.z * this.movementSpeed,
        );
    }

    update() {
        this.bloodSystem.update(this._body.position);
        if (this.alive) this._updateAI();
    }

    /**
     * Draw the object to the screen.
     * @param {p5} p Processing instance.
     */
    draw(p) {
        p.push();
        p.applyMatrix(this._matrixTracker.getMatrix());
        p.texture(this.enemySkin);
        p.model(this.enemyModel);
        p.pop();

        // Draw blood system.
        this.bloodSystem.draw(p);
    }
}
