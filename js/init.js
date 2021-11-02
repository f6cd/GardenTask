import Scene from "./scene.js";
let thisScene = null;

window.setup = function () {
    const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent('sketch-holder');
    noStroke();

    thisScene = new Scene();
    thisScene.setup();
};

window.draw = function () {
    thisScene.draw();
};

window.windowResized = function() {
    resizeCanvas(windowWidth, windowHeight);
};