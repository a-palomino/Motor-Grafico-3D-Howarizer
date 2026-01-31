//Visualizador de modelos 3D sin usar WebGL/Vulkan

let file_src = "files/Origami_Panda.obj";
let fileInput;
let culling = false;
let faceNormalbool = false;

//let x = 0;
//let y = 0;
let dz = 2; //Z offset
let angle = 0;
let scaleF = 1;

//Poligon Types
const poligonType = Object.freeze({
  CUBE: "CUBE",
  PIRAMID: "PIRAMID",
  CUSTOM: "CUSTOM"
}); 
let poligonSelected = "CUBE";

//Objects loads
let obj_vs = [];
let obj_fs = [];


function setup() {
  createCanvas(800, 800);
  //Charge bear obj
  loadLocalFile();
  
  fileInput = document.querySelector("input[type=file]");
  fileInput.addEventListener("change", loadFile);
  let buttonCulling = document.getElementById("culling");
  let buttonFaceNormal = document.getElementById("face");
  let selectPoligon = document.getElementById("poligonType");
  
  buttonCulling.addEventListener("click", () => {
    culling = !culling ? true : false;
  });
  buttonFaceNormal.addEventListener("click", () => {
    faceNormalbool = !faceNormalbool ? true : false;
  });
  selectPoligon.addEventListener("change",(event)=>{
    event.preventDefault();
    poligonSelected = event.target.value;
  });
}

function draw() {
  //frameRate(60);

  frame();
  textSize(32);
  stroke(0, 255, 0);
  text(frameRate(), 50, 50);
}

function frame() {
  const dt = 1 / 120;
  //console.log(`Delta time: ${deltaTime} -- DT: ${dt} -- FPS: ${frameRate()}`);
  //dz += 1*dt;
  angle += (PI / 3) * dt;
  //scaleF = scaleF < 5 ? scaleF+0.1: 1;
  clearScreen();

  //Iterate vertex points
  /*for(const v of vs){
    drawPoint(screen(project(translate_z(rotate_xz(v,angle),dz))));
  }*/

  //Iterate faces
  drawPoligon(poligonSelected);
}

//Clean the screen
function clearScreen() {
  background(0, 0, 0);
}

//Draw a point
function drawPoint({ x, y }) {
  const size = 25;
  fill(0, 255, 0);
  rect(x - size / 2, y - size / 2, size, size);
}

//Draw a line
function drawLine(p1, p2) {
  stroke(0, 255, 0);
  strokeWeight(2);
  line(p1.x, p1.y, p2.x, p2.y);
}

//Normalize the coordinates to make the center of the canvas the 0,0 coord.
function screen(p) {
  //Translate form -1..1 => 0..2 => to 0..w/h our actual canvas coord system
  return {
    x: ((p.x + 1) / 2) * width,
    y: (1 - (p.y + 1) / 2) * height,
  };
}

//It projects the coordinates to the desired dep
function project({ x, y, z }) {
  if (z <= 0.01) return null;
  return {
    x: x / z,
    y: y / z,
  };
}

//Translate the obj into z axis
function translate_z({ x, y, z }, dz) {
  return {
    x,
    y,
    z: z + dz,
  };
}

//Rotate the obj into x and z axis
function rotate_xz({ x, y, z }, angle) {
  return {
    x: x * cos(angle) - z * sin(angle),
    y,
    z: x * sin(angle) + z * cos(angle),
  };
}

//Back-Face Culling - ESTUDIAR Y ACABAR DE IMPLEMENTAR
function vectorsSubstract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  };
}

//This function calculates the normal between two vectors
function vectorCrossProduct(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function vectorDotProduct(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function isFaceVisible(a, b, c) {
  const ab = vectorsSubstract(b, a);
  const ac = vectorsSubstract(c, a);
  const normalFace = vectorCrossProduct(ab, ac);

  // Cámara en (0,0,0), mirando a +Z
  const view = {
    x: -a.x,
    y: -a.y,
    z: -a.z,
  };

  return vectorDotProduct(normalFace, view) < 0;
}



