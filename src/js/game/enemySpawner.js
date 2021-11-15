import { Vec3 } from "cannon-es";

const MAX_ENEMIES_START = 2;
const ENEMY_SPAWN_LOCATIONS = [
    new Vec3(10, 0, -40),
    new Vec3(-20, 0, -40),
    new Vec3(0, 0, 40),
    new Vec3(-10, 0, 50),
];

const CORPSE_DESPAWN_TIME = 2500 * 1;
const MOVEMENT_SPEED_START = 2;
const RANGE_TO_KILL_TREE = 6;

const TEXT_BANNER = document.getElementById("textBanner");
function updateKillCount(count) {
    TEXT_BANNER.innerHTML = `Destroy zombies before they reach the special tree!<br>${count} KILLED`;
}

function showGameOverScreen(endCount) {
    document.getElementById("gameOver").style.display = "flex";
    document.getElementById("gameOverInfo").innerHTML = `A zombie reached the tree.<br>YOU KILLED ${endCount}!`;
    TEXT_BANNER.style.display = "none";

    document.exitPointerLock();
}

export default class EnemySpawner {
    constructor(physWorld, constructFunction, onGameOver) {
        this.createEnemy = constructFunction;
        this.enemies = [];
        this.onGameOver = onGameOver;

        this.physWorld = physWorld;

        this.killCount = 0;
        updateKillCount(this.killCount);

        this.tempJitter = new Vec3();
    }

    /**
     * Update enemy spawning.
     * @param {p5} p Processing instance.
     * @param {number} elapsedTime Total time elapsed in the simulation.
     */

    update(p, elapsedTime) {
        this.enemies.forEach(thisEnemy => {
            if (thisEnemy.alive) {
                // If enemy is alive...
                if (thisEnemy.withinRangeOfPoint(RANGE_TO_KILL_TREE) === true) {
                    // Game over. D:
                    // TODO: Cleanly exit this function, stop all other execution. Kill physics sim, etc.
                    showGameOverScreen(this.killCount);
                    this.onGameOver();
                }
            } else if (!thisEnemy.queuedForDeath) {
                // If enemy is dead, but not queued or death yet...

                // Horrible hack! Randomly mutating classes is bad. :(
                thisEnemy.queuedForDeath = true;

                // Destroy enemy after a brief delay, so that we get cool physics and blood particles.
                setTimeout(() => {
                    this.physWorld.remove(thisEnemy._body);
                    this.enemies = this.enemies.filter(a => a != thisEnemy);
                }, CORPSE_DESPAWN_TIME);

                // Update count.
                updateKillCount(++this.killCount);
            }
        });

        // Increase the maximum enemy cap over time. Extra enemy every 9 seconds.
        const maxEnemiesAdjusted = MAX_ENEMIES_START + Math.floor(elapsedTime / 9);
        if (maxEnemiesAdjusted > this.enemies.length) {
            // Pick a random location. Add some jitter to prevent spawning bodies inside other bodies.
            const randomSpawnPosition = ENEMY_SPAWN_LOCATIONS[Math.floor(Math.random() * ENEMY_SPAWN_LOCATIONS.length)];
            this.tempJitter.set((Math.random() - .5) * 5, 0, (Math.random() - .5) * 5);

            // Adjust movement speed that enemies get faster over time.
            const moveSpeed = MOVEMENT_SPEED_START + Math.floor(elapsedTime / 7.5);

            this.enemies.push(this.createEnemy(randomSpawnPosition.vadd(this.tempJitter), moveSpeed));
        }
    }

    /**
     * Draw enemies the screen.
     * @param {p5} p Processing instance.
     */
    draw(p) {
        this.enemies.forEach(enemy => {
            enemy.update();
            enemy.draw(p);
        });
    }
}
