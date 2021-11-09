import * as CANNON from "../vendor/cannon-es.js";

export default class PhysWorld {
    constructor() {
        const world = new CANNON.World();
        world.gravity.set(0, 10, 0);
        world.broadphase = new CANNON.NaiveBroadphase();
        world.solver.iterations = 20;

        // Tweak contact properties.
        // Contact stiffness - use to make softer/harder contacts
        world.defaultContactMaterial.contactEquationStiffness = 1e7;

        // Stabilization time in number of timesteps
        world.defaultContactMaterial.contactEquationRelaxation = 5;

        this.world = world;
    }

    update() {
        this.world.step(1/60);
    }

    add(physObject) {
        this.world.addBody(physObject.body);
    }

    remove(physObject) {
        this.world.removeBody(physObject.body);
    }
}