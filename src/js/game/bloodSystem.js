import { Vec3 } from "cannon-es";
import p5 from "p5";

const MAX_PARTICLES = 200;
const GLOBAL_ACCELERATION = new Vec3(0, 0.002);

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_two_values
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

class Particle {
    constructor(position) {
        this.velocity = new Vec3(getRandomInRange(-1, 1), 0, getRandomInRange(-1, 1)).scale(.1);
        this.position = position.clone();
        this.lifespan = 100;
    }

    update() {
        this.velocity.vadd(GLOBAL_ACCELERATION, this.velocity);
        this.position.vadd(this.velocity, this.position);
        this.lifespan -= 2;
    }

    /**
     * Draw the object to the screen.
     * @param {p5} p Processing instance.
     */
    draw(p) {
        const sideLength = Math.max(0, this.lifespan / 255);

        p.push();
        p.fill(255, 0, 0);
        p.translate(...this.position.toArray());
        p.box(sideLength, sideLength, sideLength);
        p.pop();
    }

    get dead() {
        return this.lifespan < 0;
    }
}

export default class BloodSystem {
    constructor(startEnabled) {
        this.particles = [];
        this._enabled = startEnabled;
    }

    set enabled(value) {
        this._enabled = value;
    }

    update(spawnPos) {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            particle.update();
            if (particle.dead) this.particles.splice(i, 1);
        }

        if (this._enabled && this.particles.length < MAX_PARTICLES)
            this.particles.push(new Particle(spawnPos));
    }

    /**
     * Draw the object to the screen.
     * @param {p5} p Processing instance.
     */
    draw(p) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(p);
        }
    }
}