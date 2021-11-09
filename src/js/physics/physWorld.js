import { World, NaiveBroadphase } from "../vendor/cannon-es.js";

export default class PhysWorld {
    constructor() {
        const world = new World();
        world.gravity.set(0, 10, 0);
        world.broadphase = new NaiveBroadphase();
        world.solver.iterations = 20;

        // Tweak contact properties.
        // Contact stiffness - use to make softer/harder contacts
        world.defaultContactMaterial.contactEquationStiffness = 1e7;

        // Stabilization time in number of timesteps
        world.defaultContactMaterial.contactEquationRelaxation = 5;

        this.world = world;
    }

    update() {
        this.world.step(1 / 60);
    }

    add(body) {
        this.world.addBody(body);
    }

    remove(body) {
        this.world.removeBody(body);
    }
}