import BodyMatrixTracker from "../physics/bodyMatrixTracker.js";
import createGenericBody from "../physics/createGenericBody.js";
import { Sphere, Vec3 } from "cannon-es";

const PROJECTILE_RADIUS = .2;
const projectileShape = new Sphere(PROJECTILE_RADIUS);

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
     * @param {Vec3} origin 
     * @param {Vec3} direction 
     */
    fire(origin, direction, playerVelocity) {
        // TODO: Simply GCing old projectiles is inefficient. Disconnect events and re-use objects?
        if (this.projectiles.length > MAX_PROJECTILES)
            this.physWorld.remove(this.projectiles.shift().body);

        const body = new createGenericBody(
            projectileShape,
            PROJECTILE_MASS,
            origin
        );

        direction.normalize();
        body.velocity = body.velocity.vadd(direction.scale(FIRE_POWER));
        body.position = origin.vadd(body.velocity.scale(PLAYER_ORIGIN_OFFSET));
        body.velocity.vadd(playerVelocity.scale(.01), body.velocity);

        this.physWorld.add(body);
        this.projectiles.push({
            body: body,
            matrixTracker: new BodyMatrixTracker(body),
        });
    }

    /**
     * Draw the object to the screen.
     * @param {p5} p Processing instance.
     */
    draw(p) {
        this.projectiles.forEach(projectile => {
            p.push();
            p.applyMatrix(projectile.matrixTracker.getMatrix());
            p.fill(255, 0, 255);
            p.sphere(PROJECTILE_RADIUS);
            p.pop();
        });
    }
}