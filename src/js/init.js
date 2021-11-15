import Scene from "./scene.js";
import p5 from "p5";

// See: https://p5js.org/examples/instance-mode-instantiation.html.

/**
 * Init the sketch!
 * @param {p5} p Processing instance. 
 */
function createSketch(p) {
    p.setup = () => {
        // Setup canvas
        const canvasRenderer = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        canvasRenderer.parent('sketch-holder');
        p.noStroke();

        // Setup scene.
        const thisScene = new Scene(p, canvasRenderer);
        
        thisScene.setup();

        p.draw = () => thisScene.draw();        
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
}

new p5(createSketch);