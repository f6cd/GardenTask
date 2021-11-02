import BloodSystem from "./bloodSystem.js";
import * as CANNON from "../vendor/cannon-es.js";
import GenericPhysObject from "../physics/genericPhysObject.js";

const ENEMY_MASS = 300;
const ENEMY_HEIGHT = .93;

const PROJECTILE_VELOCITY_THRESHOLD = 800;

export default class Enemy {
    constructor(physWorld, pos, moveSpeed, enemyModel, enemySkin) {
        // Setup physics.
        const playerShape = new CANNON.Box(new CANNON.Vec3(.35, ENEMY_HEIGHT, .7));
        const obj = new GenericPhysObject(
            playerShape,
            ENEMY_MASS,
            new CANNON.Vec3(pos.x, pos.y - ENEMY_HEIGHT * 2, pos.z)
        );
        obj.body.fixedRotation = true;
        obj.body.allowSleep = false;
        obj.body.updateMassProperties();

        physWorld.add(obj);
        this.physObject = obj;

        // Rudimentary AI and death behaviour.
        this.alive = true;
        this.movementSpeed = moveSpeed;
        this.seekPoint = new CANNON.Vec3();

        obj.body.addEventListener("collide", (event) => {
            if (event.body.velocity.lengthSquared() < PROJECTILE_VELOCITY_THRESHOLD) return;

            // Apply a comically large force when hit.
            const ptRelative = event.body.position.vsub(obj.body.position);
            ptRelative.normalize();
            obj.body.applyForce(ptRelative.scale(-1000000 - Math.random() * 1000000 * .4));

            if (this.alive) {
                // Unlock rotation when dead. Only perform once.
                obj.body.fixedRotation = false;
                this.alive = false;
                obj.body.updateMassProperties();
                
                // Enable blood.
                this.bloodSystem.enabled = true;
            }
        });

        // Appearance.
        this.enemyModel = enemyModel;
        this.enemySkin = enemySkin;

        // Blood.
        this.bloodSystem = new BloodSystem(false);
    }

    withinRangeOfPoint(range) {
        return (this.physObject.body.position.distanceSquared(this.seekPoint)) < Math.pow(range, 2);
    }

    _updateAI() {
        const headingVector = this.seekPoint.vsub(this.physObject.body.position);
        // Bad hack: strip Y axis, normalize to create a direction.
        // We should really strip both Z axis first, then sub and normalize.
        headingVector.set(headingVector.x, 0, headingVector.z).normalize();

        // Face the seek point.
        const angle = Math.atan2(headingVector.z, headingVector.x);
        this.physObject.body.quaternion.setFromAxisAngle(CANNON.Vec3.UNIT_Y, -angle + Math.PI / 2);

        // Set velocity towards the seek point.
        const velocity = this.physObject.body.velocity;
        velocity.set(
            headingVector.x * this.movementSpeed,
            velocity.y,
            headingVector.z * this.movementSpeed,
        );
    }

    update() {
        this.bloodSystem.update(this.physObject.body.position);
        if (this.alive) this._updateAI();
    }

    draw() {
        push();
        applyMatrix(this.physObject.getTransformMatrix());
        texture(this.enemySkin);
        model(this.enemyModel);
        pop();

        // Draw blood system.
        this.bloodSystem.draw();
    }
}
