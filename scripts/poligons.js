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

let osoFs = [];
let osoVs = [];

//Call the function to draw the selected poligon
function drawPoligon(poligon_selection) {
  switch (poligon_selection) {
    case "CUBE":
      drawFaces(fs, vs);
      break;
    case "PIRAMID":
      drawFaces(pirFs, pirVs);
      break;
    case "OSO":
      drawFaces(osoFs, osoVs);
      break;
    case "CUSTOM":
      drawFaces(obj_fs, obj_vs);
      break;
    default:
      drawFaces(fs, vs);
      break;
  }
}

function drawFaces(fs, vs) {
  let iterator = 0;
  //Transform vertices
  const transformedVs = vs.map(v =>
    translate_z(rotate_xz(v, angle), dz)                          
  );
  //Sort faces using z-sort method
  const sortedFaces = [...fs].sort((f1,f2) => {
    return calculateMediaZ(f2,transformedVs) - calculateMediaZ(f1,transformedVs);
  });
  for (const f of sortedFaces) {
    if (faceNormalbool) {
      drawNormal(f, vs, dz, angle, iterator);
    }

    iterator++;
    //Miramos que esta cara este compuesto de menos de 3 vectores
    if (culling) {
      if (f.length < 3) continue;

      //Comprobamos que esta cara se pueda dibujar por su normal
      const vecA = transformedVs[f[0]];
      const vecB = transformedVs[f[1]];
      const vecC = transformedVs[f[2]];


      if (isFaceVisible(vecA, vecB, vecC)) continue;
    }

    for (let i = 0; i < f.length; i++) {
      const a = transformedVs[f[i]];
      const b = transformedVs[f[(i + 1) % f.length]]; //We're modularing so if we get a i > f.length the we convert it again to the start index
      const prj_a = project(a);
      const prj_b = project(b);
      if (prj_a && prj_b) {
        drawLine(screen(prj_a), screen(prj_b));
      }
    }
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
