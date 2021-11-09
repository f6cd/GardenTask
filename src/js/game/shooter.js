import * as CANNON from "../vendor/cannon-es.js";
import GenericPhysObject from "../physics/genericPhysObject.js";

const PROJECTILE_RADIUS = .2;
const projectileShape = new CANNON.Sphere(PROJECTILE_RADIUS);

const MAX_PROJECTILES = 12;

const FIRE_POWER = 45;
const PLAYER_ORIGIN_OFFSET = 4e-2;
const PROJECTILE_MASS = 40;

export default class Shooter {
    constructor(physWorld) {
        this.physWorld = physWorld;
        this.projectiles = [];
    }

    /**
     * Fire a projectile, given an origin and direction.
     * @param {CANNON.Vec3} origin 
     * @param {CANNON.Vec3} direction 
     */
    fire(origin, direction, playerVelocity) {
        // TODO: Simply GCing old projectiles is inefficient. Disconnect events and re-use objects?
        if (this.projectiles.length > MAX_PROJECTILES)
            this.physWorld.remove(this.projectiles.shift());

        const obj = new GenericPhysObject(
            projectileShape,
            PROJECTILE_MASS,
            origin
        );

        direction.normalize();
        obj.body.velocity = obj.body.velocity.vadd(direction.scale(FIRE_POWER));
        obj.body.position = origin.vadd(obj.body.velocity.scale(PLAYER_ORIGIN_OFFSET));
        obj.body.velocity.vadd(playerVelocity.scale(.01), obj.body.velocity);

        this.physWorld.add(obj);
        this.projectiles.push(obj);
    }

    draw() {
        this.projectiles.forEach(projectile => {
            push();
            applyMatrix(projectile.getTransformMatrix());
            fill(255, 0, 255);
            sphere(PROJECTILE_RADIUS);
            pop();
        });
    }
}