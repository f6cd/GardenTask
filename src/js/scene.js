import { Vec3 } from "./vendor/cannon-es.js";

import CylinderCollider from "./physics/cylinderCollider.js";
import Enemy from "./game/enemy.js";
import EnemySpawner from "./game/enemySpawner.js";
import PhysWorld from "./physics/physWorld.js";
import PlaneCollider from "./physics/planeCollider.js";
import Player from "./game/player.js";
import RoverCam from "./vendor/p5.rovercam.js";
import Terrain from "./game/terrain.js";

import { loadModelPromise, loadImagePromise } from "./lib/assets.js";

export default class Scene {
    constructor(canvasRenderer) {
        this.phys = new PhysWorld();

        this.rover = new RoverCam(canvasRenderer);
        this.rover.fov = radians(75);

        this.sceneReady = false;
    }

    setup() {
        this.objects = [
            // Player object and collision.
            new Player(
                this.phys,
                new Vec3(10, 0, 0),
                this.rover,
            ),
            // Ground collision.
            new PlaneCollider(this.phys, new Vec3()),
            // Centre tree collision.
            new CylinderCollider(this.phys, 0, Vec3.ZERO, 3, 20),
        ];

        Promise.all([
            loadImagePromise("./assets/resurrect-64-1x.png"),
            loadModelPromise("./assets/island.obj"),
            loadModelPromise("./assets/island_fence_collide.obj"),
            loadModelPromise("./assets/basicCharacter.obj"),
            loadImagePromise("./assets/skin_exclusiveZombie.png"),
        ])
            .then(assets => {
                const [paletteTexture, islandModel, islandComplexCollision, kenneyCharacter, kenneyZombieSkin] = assets;

                this.objects.push(
                    // Terrain and complex collision - i.e. fences, flowers.
                    new Terrain(this.phys, Vec3.ZERO, islandModel, islandComplexCollision, paletteTexture)
                );

                this.objects.push(
                    new EnemySpawner(this.phys, (pos, moveSpeed) => {
                        // Spawn an enemy.
                        return new Enemy(this.phys, pos, moveSpeed, kenneyCharacter, kenneyZombieSkin);
                    }, () => {
                        // On game over.
                        this.sceneReady = false;
                    })
                );
            })
            .then(() => this.sceneReady = true);
    }

    draw() {
        if (!this.sceneReady) return;

        background(195, 233, 247);

        // Update physics, converting dt back into ms.
        this.phys.update(deltaTime / 1000);

        // Lighting setup.
        ambientLight(100, 109, 117);
        directionalLight(245, 234, 215, 50, 80, -1);
        specularMaterial(250);
        shininess(50);

        // Call update, draw methods on all objects that have them.
        this.objects.forEach(obj => obj.update && obj.update());
        this.rover.update();
        this.objects.forEach(obj => obj.draw && obj.draw());
    }
}
