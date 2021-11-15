import { Vec3 } from "cannon-es";

import CylinderCollider from "./physics/cylinderCollider.js";
import Enemy from "./game/enemy.js";
import EnemySpawner from "./game/enemySpawner.js";
import PhysWorld from "./physics/physWorld.js";
import PlaneCollider from "./physics/planeCollider.js";
import Player from "./game/player.js";
import RoverCam from "./lib/p5.rovercam.js";
import Terrain from "./game/terrain.js";

import { loadModelPromise, loadImagePromise, loadFont } from "./lib/assets.js";
import p5 from "p5";

export default class Scene {
    /**
     * Create a new scene.
     * @param {p5} p Processing instance. 
     * @param {p5.Renderer} canvasRenderer 
     */
    constructor(p, canvasRenderer) {
        this._phys = new PhysWorld();

        this._cam = new RoverCam(canvasRenderer);
        this._cam.fov = p.radians(75);

        this._sceneReady = false;

        this._p = p;
    }

    setup() {
        this.objects = [
            // Player object and collision.
            new Player(
                this._phys,
                new Vec3(10, 0, 0),
                this._cam,
            ),
            // Ground collision.
            new PlaneCollider(this._phys, new Vec3()),
            // Centre tree collision.
            new CylinderCollider(this._phys, 0, Vec3.ZERO, 3, 20),
        ];
        Promise.all([
            loadImagePromise(this._p, "./assets/resurrect-64-1x.png"),
            loadModelPromise(this._p, "./assets/island.obj"),
            loadModelPromise(this._p, "./assets/island_fence_collide.obj"),
            loadModelPromise(this._p, "./assets/basicCharacter.obj"),
            loadImagePromise(this._p, "./assets/skin_exclusiveZombie.png"),
            loadFont(this._p, "./assets/Larceny.ttf"),
        ])
            .then(assets => {
                const [paletteTexture, islandModel, islandComplexCollision, kenneyCharacter, kenneyZombieSkin] = assets;

                this.objects.push(
                    // Terrain and complex collision - i.e. fences, flowers.
                    new Terrain(this._phys, Vec3.ZERO, islandModel, islandComplexCollision, paletteTexture)
                );

                this.objects.push(
                    new EnemySpawner(this._phys, (pos, moveSpeed) => {
                        // Spawn an enemy.
                        return new Enemy(this._phys, pos, moveSpeed, kenneyCharacter, kenneyZombieSkin);
                    }, () => {
                        // On game over.
                        this._sceneReady = false;
                    })
                );
            })
            .then(() => this._sceneReady = true);

        // Used to count time across the simulation.
        // We can't rely on frame count.
        this._clock = 0;
    }

    draw() {
        if (!this._sceneReady) return;

        this._p.background(195, 233, 247);

        // Update physics, converting dt back into ms.
        this._phys.update(this._p.deltaTime / 1000);

        // Lighting setup.
        this._p.ambientLight(100, 109, 117);
        this._p.directionalLight(245, 234, 215, 50, 80, -1);
        this._p.specularMaterial(250);
        this._p.shininess(50);

        // Call update, draw methods on all objects that have them.
        this.objects.forEach(obj => obj.update && obj.update(this._p, this._clock));
        this._cam.update(this._p);
        this.objects.forEach(obj => obj.draw && obj.draw(this._p));

        this._clock += this._p.deltaTime / 1000;
    }
}
