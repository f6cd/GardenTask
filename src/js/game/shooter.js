import BodyMatrixTracker from "../physics/bodyMatrixTracker.js";
import createGenericBody from "../physics/createGenericBody.js";
import { Body, Sphere, Vec3 } from "cannon-es";
import p5 from "p5";
import getRandomInRange from "../lib/getRandomInRange.js";

const PROJECTILE_RADIUS = .2;
const projectileShape = new Sphere(PROJECTILE_RADIUS);

const MAX_PROJECTILES = 12;

const FIRE_POWER = 45;
const PLAYER_ORIGIN_OFFSET = 4e-2;
const PROJECTILE_MASS = 40;

export default class Shooter {
    constructor(physWorld, flowerModel, paletteTexture) {
        this._flowerModel = flowerModel;
        this._paletteTexture = paletteTexture;
        this._physWorld = physWorld;
        this._projectiles = [];
    }

    /**
     * Fire a projectile, given an origin and direction.
     * @param {Vec3} origin 
     * @param {Vec3} direction 
     */
    fire(origin, direction, playerVelocity) {
        // TODO: Simply GCing old projectiles is inefficient. Disconnect events and re-use objects?
        if (this._projectiles.length > MAX_PROJECTILES)
            this._physWorld.remove(this._projectiles.shift().body);

        /** @type {Body} */
        const body = new createGenericBody(
            projectileShape,
            PROJECTILE_MASS,
            origin
        );

        direction.normalize();
        body.velocity = body.velocity.vadd(direction.scale(FIRE_POWER));
        body.position = origin.vadd(body.velocity.scale(PLAYER_ORIGIN_OFFSET));
        body.velocity.vadd(playerVelocity.scale(.01), body.velocity);

        body.angularDamping = .99;
        body.linearDamping = .2;

        body.angularVelocity = new Vec3(getRandomInRange(-16,16),getRandomInRange(-16,16),getRandomInRange(-16,16));
        body.updateMassProperties();

        this._physWorld.add(body);
        this._projectiles.push({
            body: body,
            matrixTracker: new BodyMatrixTracker(body),
        });
    }

    /**
     * Draw the object to the screen.
     * @param {p5} p Processing instance.
     */
    draw(p) {
        this._projectiles.forEach(projectile => {
            p.push();
            p.applyMatrix(projectile.matrixTracker.getMatrix());
            p.scale(.24);
            p.texture(this._paletteTexture);
            p.model(this._flowerModel);
            p.pop();
        });
    }
}