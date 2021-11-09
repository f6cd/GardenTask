export const loadModelPromise = (relativePath) => {
    return new Promise((resolve, reject) => {
        loadModel(relativePath, false, resolve, reject);
    });
};

export const loadImagePromise = (relativePath) => {
    // Doesn't actually need to be a promise, but syntactically cleaner.
    return Promise.resolve(loadImage(relativePath));
};