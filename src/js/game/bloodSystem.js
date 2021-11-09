import { Vec3 } from "../vendor/cannon-es";

const MAX_PARTICLES = 200;
const GLOBAL_ACCELERATION = new Vec3(0, 0.002);

class Particle {
    constructor(position) {
        this.velocity = new Vec3(random(-1, 1), 0, random(-1, 1)).scale(.1);
        this.position = position.clone();
        this.lifespan = 100;
    }

    update() {
        this.velocity.vadd(GLOBAL_ACCELERATION, this.velocity);
        this.position.vadd(this.velocity, this.position);
        this.lifespan -= 2;
    }

    draw() {
        const sideLength = Math.max(0, this.lifespan / 255);

        push();
        fill(255, 0, 0);
        translate(...this.position.toArray());
        box(sideLength, sideLength, sideLength);
        pop();
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

    draw() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
        }
    }
}