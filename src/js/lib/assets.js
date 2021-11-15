import p5 from "p5";

/**
 * Load a 3D model from a file.
 * @param {p5} p Processing instance. 
 * @param {String} relativePath File path (with extension) of model to load.
 * @returns {p5.Geometry} Loaded geometry.
 */
export const loadModelPromise = (p, relativePath) => {
    return new Promise((resolve, reject) => {
        p.loadModel(relativePath, false, resolve, reject);
    });
};

/**
 * Load an image from a file.
 * @param {p5} p Processing instance. 
 * @param {String} relativePath File path (with extension) of image to load.
 * @returns {p5.Image} Loaded image.
 */
export const loadImagePromise = (p, relativePath) => {
    // Doesn't actually need to be a promise, but syntactically cleaner.
    return Promise.resolve(p.loadImage(relativePath));
};

/**
 * Load a font from a file.
 * @param {p5} p Processing instance. 
 * @param {String} relativePath File path (with extension) of font to load.
 * @returns {p5.Font} Loaded font.
 */
export const loadFont = (p, relativePath) => {
    // Doesn't actually need to be a promise, but syntactically cleaner.
    return Promise.resolve(p.loadFont(relativePath));
};