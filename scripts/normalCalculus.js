//Calculate the normal of a face
function faceNormal(a,b,c){
  const ab = {
    x: b.x - a.x,
    y: b.y - a.y,
    z: b.z - a.z
  };
  const ac = {
    x: c.x - a.x,
    y: c.y - a.y,
    z: c.z - a.z
  }
  
  return {
    x: ab.y * ac.z - ab.z * ac.y,
    y: ab.z * ac.x - ab.x * ac.z,
    z: ab.x * ac.y - ab.y * ac.x
  }
}

//Calculate te center of the face
function faceCenter(face,vs){
  let cx = 0;
  let cy = 0;
  let cz = 0;
  
  for (const i of face){
    const v = vs[i];
    cx += v.x;
    cy += v.y;
    cz += v.z;
  }
  const n = face.length;
  
  return{
    x: cx/n,
    y: cy/n,
    z: cz/n
  }
}

//Draw the normal line from the center of current face
function drawNormal(face,vs,dz,angle,numFace){
  if(face.length < 3) return;
  
  const a = vs[face[0]];
  const b = vs[face[1]];
  const c = vs[face[2]];
  /*console.log(`a:`);
  console.log(a);
  console.log(`b:`);
  console.log(b);
  console.log(`c:`);
  console.log(c);*/
  
  
  const n = faceNormal(a,b,c);
  const center = faceCenter(face,vs);
  
  /*console.log(`n:`);
  console.log(n);
  console.log(`center:`);
  console.log(center);*/
  
  const lengthNormal = 0.5;
  
  const endNormal = {
    x: center.x + n.x * lengthNormal,
    y: center.y + n.y * lengthNormal,
    z: center.z + n.z * lengthNormal
  }
  
  const p1 = project(translate_z(rotate_xz(center,angle),dz));
  const p2 = project(translate_z(rotate_xz(endNormal,angle),dz));
  /*const p1 = project(translate_z(center,dz));
  const p2 = project(translate_z(endNormal,dz));*/
  
  if(!p1 || !p2) return;
  drawLine(screen(p1),screen(p2));
  stroke(0,255,0);
  textSize(25);
  text(numFace,screen(p1).x,screen(p1).y);
  
}

function scaleVector(p,scaleF){
  return {
    x: p.x * scaleF,
    y: p.y * scaleF,
    z: p.z * scaleF
  }
}