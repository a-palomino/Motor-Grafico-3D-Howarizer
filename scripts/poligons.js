//Piramide
const pirVs = [
  { x: 0, y: 0.25, z: 0 },

  { x: -0.25, y: -0.25, z: -0.25 },
  { x: 0.25, y: -0.25, z: -0.25 },
  { x: -0.25, y: -0.25, z: 0.25 },
  { x: 0.25, y: -0.25, z: 0.25 },
];

const pirFs = [
  [0, 2, 1, 0],
  [0, 4, 2, 0],
  [0, 3, 4, 0],
  [0, 1, 3, 0],
  [4, 2, 1, 3],
];

//Vertex points
const vs = [
  { x: 0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: -0.25, z: 0.25 },
  { x: 0.25, y: -0.25, z: 0.25 },

  { x: 0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: -0.25, z: -0.25 },
  { x: 0.25, y: -0.25, z: -0.25 },
];
const fs = [
  [0, 1, 2, 3],
  [7, 6, 5, 4],
  [3, 7, 4, 0],
  [1, 5, 6, 2],
  [5, 4, 0, 1],
  [6, 2, 3, 7],
];

const triangulatedCubeFaces = triangulateFaces(fs);
const triangulatedPiramidFaces = triangulateFaces(pirFs);


let osoFs = [];
let osoVs = [];

let osoTriangulateFS = [];


let customTriangulateFS = [];


//Call the function to draw the vertex from selected object
function drawSelectedVertexModel(poligon_selection) {
  switch (poligon_selection) {
    case "CUBE":
      drawVertex(vs);
      break;
    case "PIRAMID":
      drawVertex(pirVs);
      break;
    case "OSO":
      drawVertex(osoVs);
      break;
    case "CUSTOM":
      drawVertex(obj_vs);
      break;
    default:
      drawVertex(vs);
      break;
  }
}


//Call the function to draw the selected poligon
function drawPoligon(poligon_selection) {
  switch (poligon_selection) {
    case "CUBE":
      drawFaces(triangulatedCubeFaces, vs); //If z-sorting then remove triangulateFaces and pass fs instead
      break;
    case "PIRAMID":
      drawFaces(triangulatedPiramidFaces, pirVs);
      break;
    case "OSO":
      drawFaces(osoTriangulateFS, osoVs);
      break;
    case "CUSTOM":
      drawFaces(customTriangulateFS, obj_vs);
      break;
    default:
      drawFaces(triangulatedCubeFaces, vs);
      break;
  }
}

function drawWireframePoligon(poligon_selection) {
  switch (poligon_selection) {
    case "CUBE":
      drawWireframe(fs, vs); //If z-sorting then remove triangulateFaces and pass fs instead
      break;
    case "PIRAMID":
      drawWireframe(pirFs, pirVs);
      break;
    case "OSO":
      drawWireframe(osoFs, osoVs);
      break;
    case "CUSTOM":
      drawWireframe(obj_fs, obj_vs);
      break;
    default:
      drawWireframe(fs, vs);
      break;
  }
}

function drawVertex(vs) {
  //Iterate vertex points
  for (const v of vs) {
    drawPoint(screenPoint(project(translate_z(rotate_xz(scaleModel(v), angle), dz))));
  }
}

//Draw a point
function drawPoint({ x, y }) {
  const size = 5;
  fill(0, 255, 0);
  rect(x - size / 2, y - size / 2, size, size);
}

function drawWireframe(fs, vs) {
  let iterator = 0;
  //Transform vertices
  const transformedVs = vs.map(v =>
    translate_z(rotate_xz(scaleModel(v), angle), dz)
  );
  //Sort faces using z-sort method
  const sortedFaces = [...fs].sort((f1, f2) => {
    return calculateMediaZ(f2, transformedVs) - calculateMediaZ(f1, transformedVs);
  });
  for (const f of sortedFaces) {
    if (faceNormalbool) {
      drawNormal(f, vs, dz, angle, iterator);
    }

    iterator++;



    if (culling) {
      if (f.length < 3) continue;

      //Comprobamos que esta cara se pueda dibujar por su normal
      //Miramos que esta cara este compuesto de menos de 3 vectores
      const vecA = transformedVs[f[0]];
      const vecB = transformedVs[f[1]];
      const vecC = transformedVs[f[2]];


      if (isFaceVisible(vecA, vecB, vecC)) continue;
    }

    //Z-sorting method
    for (let i = 0; i < f.length; i++) {
      const a = transformedVs[f[i]];
      const b = transformedVs[f[(i + 1) % f.length]]; //We're modularing so if we get a i > f.length the we convert it again to the start index
      const prj_a = project(a);
      const prj_b = project(b);
      if (prj_a && prj_b) {
        drawLine(screenPoint(prj_a), screenPoint(prj_b));
      }
    }

  }
}

function drawFaces(fs, vs) {
  let iterator = 0;
  //Transform vertices
  const transformedVs = vs.map(v =>
    translate_z(rotate_xz(scaleModel(v), angle), dz)
  );

  //Sort faces using z-sort method
  const sortedFaces = [...fs].sort((f1, f2) => {
    return calculateMediaZ(f2, transformedVs) - calculateMediaZ(f1, transformedVs);
  });

  // Load pixels ONCE at the start
  loadPixels();

  for (const f of sortedFaces) {
    if (faceNormalbool) {
      //drawNormal(f, vs, dz, angle, iterator);
    }
    if (f.length < 3) continue;
    iterator++;
    //Miramos que esta cara este compuesto de menos de 3 vectores
    const vecA = transformedVs[f[0]];
    const vecB = transformedVs[f[1]];
    const vecC = transformedVs[f[2]];


    if (isFaceVisible(vecA, vecB, vecC)) continue;



    //Zbuffer method
    //Lambert ilumination
    const intensity = lambertIntensity(vecA, vecB, vecC);
    const prj_a = screenPoint(project(vecA));
    const prj_b = screenPoint(project(vecB));
    const prj_c = screenPoint(project(vecC));

    if (!prj_a || !prj_b || !prj_c) continue;
    const col = {
      r: 255 * intensity,
      g: 150 * intensity,
      b: 80 * intensity
    };
    rasterizeTriangle(prj_a, prj_b, prj_c, vecA.z, vecB.z, vecC.z, col);
  }

  // Update pixels ONCE at the end
  updatePixels();
}

/**Z-SORTING**/
function calculateMediaZ(face, vs) {
  let media = 0;
  for (const f of face) {
    const v = vs[f];
    media += v.z;
  }

  return media / face.length;
}


function scaleModel(p) {
  return {
    x: p.x * scaleF,
    y: p.y * scaleF,
    z: p.z * scaleF,
  }
}


//Those functions are dedicated to the next step ->Triangulation + Z-buffer + Lambert Ilumination + Directional light + Flat shading
function triangulateFace(face) {
  const tris = [];

  for (let i = 1; i < face.length - 1; i++) {
    tris.push([face[0], face[i], face[i + 1]]);
  }

  return tris;
}

function triangulateFaces(faces) {
  const tris = [];

  for (const f of faces) {
    if (f.length < 3) continue;
    tris.push(...triangulateFace(f));
  }

  return tris;
}

function initZbuffer() {
  zBuffer = new Float32Array(width * height);
}
function clearZbuffer() {
  zBuffer.fill(Infinity);
}


//Rasterization
function rasterizeTriangle(p0, p1, p2, z0, z1, z2, col) {
  // Validate that all points have valid coordinates
  if (!isFinite(p0.x) || !isFinite(p0.y) || !isFinite(p1.x) || !isFinite(p1.y) || !isFinite(p2.x) || !isFinite(p2.y)) {
    return;
  }

  

  let AB = vectorsSubstract(p1, p0);
  let AC = vectorsSubstract(p2, p0);

  const area =
    (p1.x - p0.x) * (p2.y - p0.y) -
    (p2.x - p0.x) * (p1.y - p0.y);

  // Skip degenerate triangles
  if (Math.abs(area) < 0.001) return;

  //Calculate the Min and Max píxel coord for this triangle
  const minX = Math.max(0, Math.floor(Math.min(p0.x, p1.x, p2.x)));
  const maxX = Math.min(width - 1, Math.ceil(Math.max(p0.x, p1.x, p2.x)));
  const minY = Math.max(0, Math.floor(Math.min(p0.y, p1.y, p2.y)));
  const maxY = Math.min(height - 1, Math.ceil(Math.max(p0.y, p1.y, p2.y)));

  // Skip if triangle is completely outside canvas
  if (minX > maxX || minY > maxY) return;

  //Now iterate for every pixel
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const P = { x: x - p0.x, y: y - p0.y };
      const w0 = (AB.x * P.y - AB.y * P.x) / area;
      const w1 = ((p2.x - p1.x) * (y - p1.y) - (p2.y - p1.y) * (x - p1.x)) / area;
      const w2 = 1 - w0 - w1;

      //If this barycentric coordinates are greater than 0 then it mean that P point it's inside of the triangle
      if(w0 >= -0.001 && w1 >= -0.001 && w2 >= -0.001) {
        const z = w0 * z0 + w1 * z1 + w2 * z2;

        //Z lineal interpolation 
        const idx = x + y * width;

        // Validate index bounds
        if (idx >= 0 && idx < zBuffer.length) {
          //If this pixel is beyond of the previos drawed
          if (z < zBuffer[idx]) {
            zBuffer[idx] = z;

            const i = idx * 4;
            pixels[i] = col.r;
            pixels[i + 1] = col.g;
            pixels[i + 2] = col.b;
            pixels[i + 3] = 255;
          }
        }
      }
    }
  }
}




function vectorNormalize(v) {
  let vLenght = Math.hypot(v.x, v.y, v.z);

  if (vLenght === 0) return v;

  return {
    x: v.x / vLenght,
    y: v.y / vLenght,
    z: v.z / vLenght
  }
}

function centerModel(vs) {
  let vx = 0, vy = 0, vz = 0;

  for (const v of vs) {
    vx += v.x;
    vy += v.y;
    vz += v.z;
  }

  vx /= vs.length;
  vy /= vs.length;
  vz /= vs.length;

  for (const v of vs) {
    v.x -= vx;
    v.y -= vy;
    v.z -= vz;
  }
}