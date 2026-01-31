//Carga un modelo .obj y lo convierte a texto para leerlo
function loadFile(){
  const file = fileInput.files[0];
  
  if(!file) return;
  
  const reader = new FileReader();
  //Read the file
  reader.onload = () => {
    const obj_text = reader.result;
    //console.log(obj_text);
    const obj_vf = obj_parser(obj_text);
    
    obj_vs = obj_vf.aux_vs;
    normalizeOBJ(obj_vs);
    obj_fs = obj_vf.aux_fs;
    
    console.log("Vertices:", obj_vs);
    console.log("Faces:", obj_fs);
  };
  
  reader.readAsText(file);
  
}

async function loadLocalFile(){
  
  const res = await fetch("files/Origami_Panda.obj");
  
  const file = await res.text();
  
  const obj_vf = obj_parser(file);
    
  osoVs = obj_vf.aux_vs;
  normalizeOBJ(osoVs);
  osoFs = obj_vf.aux_fs;
    
  console.log("Vertices:", obj_vs);
  console.log("Faces:", obj_fs);
  
  
}

//A partir del archivo de texto lo parsea para obtener los vectores de los vertices y las caras
function obj_parser(obj_text){
  const aux_vs = [];
  const aux_fs = [];
  //console.log(obj_text);
  obj_text.split('\n').forEach(obj_line => {
    obj_line = obj_line.trim();
    if (obj_line.startsWith('v ')) {
      const [, x, y, z] = obj_line.split(/\s+/);
      aux_vs.push({
        x: +x,
        y: +y,
        z: +z
      });
    }
    if (obj_line.startsWith('f ')) {
      const indices = obj_line
        .split(/\s+/)
        .slice(1)
        .map(v => parseInt(v.split('/')[0], 10) - 1);
      aux_fs.push(indices);
    }
  });
  
  return {aux_vs,aux_fs};
}

//Normalizar las coord de obj
function normalizeOBJ(vs){
  let max = 0;
  
  for(const v of vs){
    max = Math.max(max, Math.abs(v.x), Math.abs(v.y), Math.abs(v.z));
  }
  if(max === 0) return;
  for(const v of vs){
    v.x /= max;
    v.y /= max;
    v.z /= max;
  }
}