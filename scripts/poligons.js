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

function drawWireframePoligon(poligon_selection){
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
    //translate_z(scaleModel(v), dz)
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
    //Miramos que esta cara este compuesto de menos de 3 vectores
    const vecA = transformedVs[f[0]];
    const vecB = transformedVs[f[1]];
    const vecC = transformedVs[f[2]];

    console.log("VEC A: ");
    console.log(vecA);
    console.log("VEC B: ");
    console.log(vecB);
    console.log("VEC C: ");
    console.log(vecC);
    if (culling) {
      if (f.length < 3) continue;

      //Comprobamos que esta cara se pueda dibujar por su normal



      if (isFaceVisible(vecA, vecB, vecC)) continue;
    }

    //Z-sorting method
    /*for (let i = 0; i < f.length; i++) {
      const a = transformedVs[f[i]];
      const b = transformedVs[f[(i + 1) % f.length]]; //We're modularing so if we get a i > f.length the we convert it again to the start index
      const prj_a = project(a);
      const prj_b = project(b);
      if (prj_a && prj_b) {
        drawLine(screen(prj_a), screen(prj_b));
      }
    }*/

    //Zbuffer method
    //Lambert ilumination
    const intensity = lambertIntensity(vecA, vecB, vecC);
    console.log("Intensidad Lambert: " + intensity)
    const prj_a = screenPoint(project(vecA));
    const prj_b = screenPoint(project(vecB));
    const prj_c = screenPoint(project(vecC));

    if (!prj_a || !prj_b || !prj_c) continue;

    const col = {
      r: 255 * intensity,
      g: 150 * intensity,
      b: 80 * intensity
    };
    console.log("Col:");
    console.log(col);
    drawTriangle(prj_a, prj_b, prj_c, vecA.z, vecB.z, vecC.z, col);
  }
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

function triangulateFaces(faces) {
  const tris = [];

  for (const f of faces) {
    for (let i = 0; i < f.length - 1; i++) {
      tris.push([f[0], f[i], f[i + 1]]);
    }
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
function drawTriangle(p0, p1, p2, z0, z1, z2, col) {
  let AB = vectorsSubstract(p0, p1);
  let AC = vectorsSubstract(p0, p2);
  let CA = vectorsSubstract(p2, p0);
  let BC = vectorsSubstract(p1, p2);
  console.log("Area:");
  let area = matrixDeterminant(AB, AC);
  console.log(area);
  if (area === 0) return; //If it's a not well formed triangle don't raster anything 
  //Calculate the Min and Max píxel coord for this triangle

  let maxX = Math.min(width - 1, Math.ceil(Math.max(p0.x, p1.x, p2.x)));
  let minX = Math.max(0, Math.floor(Math.min(p0.x, p1.x, p2.x)));
  let maxY = Math.min(width - 1, Math.ceil(Math.max(p0.y, p1.y, p2.y)));
  let minY = Math.max(0, Math.floor(Math.min(p0.y, p1.y, p2.y)));

  loadPixels();
  //Now iterate for every pixel
  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      //Calculate the baricentric coordinates for every pixel as point P
      let AP = {
        x: x - p0.x,
        y: y - p0.y
      };
      let BP = {
        x: x - p1.x,
        y: y - p1.y
      };
      let CP = {
        x: x - p2.x,
        y: y - p2.y
      };
      //We really calculate the area of subtriangles (AB to AP, BC to BP and AC to CP) and divide for total area triangle to verify it relevance
      const w0 = matrixDeterminant(AB, AP) / area;
      const w1 = matrixDeterminant(BC, BP) / area;
      const w2 = matrixDeterminant(CA, CP) / area;

      //If this baricentric coordinates are greater than 0 then it mean that P point it's inside of the triangle
      if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
        let z = w0 * z2 * + w1 * z0 + w2 * z1; //Z lineal interpolation 
        const idx = x + y * width;

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

  updatePixels();
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