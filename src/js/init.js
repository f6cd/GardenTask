import Scene from "./scene.js";

window.setup = function () {
    // I didn't want to add this, but webpack excludes globals (like p5) if they're not referenced anywhere!
    if (!p5) console.error("p5.js not loaded!");

    // Setup canvas
    const canvasRenderer = createCanvas(windowWidth, windowHeight, WEBGL);
    canvasRenderer.parent('sketch-holder');
    noStroke();

    // Setup scene.
    const thisScene = new Scene(canvasRenderer);
    
    thisScene.setup();
    window.draw = () => thisScene.draw();
};

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};