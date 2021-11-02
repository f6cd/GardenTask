import * as CANNON from "../vendor/cannon-es.js";

export default function getTrimesh(p5Model) {
    const vertices = [];

    p5Model.vertices.forEach(vertex => {
        vertices.push(vertex.x, vertex.y, vertex.z);
    });

    const indices = [];

    for (let i = 0; i < p5Model.faces.length; i++) {
        indices.push(
            p5Model.faces[i][0], p5Model.faces[i][1], p5Model.faces[i][2]
        );
    }

    return new CANNON.Trimesh(vertices, indices);
}