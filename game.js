//Definição de variaveis
const width = window.innerWidth;
const height = window.innerHeight;
const canvas = document.getElementById("canvas");
const scene = new Scene();
const control = new Control(scene);
const view = new View();

// Configurações do game
canvas.width = width;
canvas.height = height;
scene.setViewport({ width: width, height: height, x: 0, y: 0, z: 150});
scene.getCamera().setPosition(0, 0, -29);
//scene.getCamera().rotate(-0.4, 0, 0);
view.setFPS(60);
view.setScene(scene);
view.setCanvas(canvas);
control.init();

//Definir objetos
var cube = Textures.createCube();/*
var pyramid = Textures.createPyramid();
var plane = Textures.createPlane(1, 1);
var sofa = Itens_Textures.createSofa();
var sofa2 = Itens_Textures.createSofa();*/

//Configurações dos objetos
cube.setStyle({ color: [255, 0, 0], size: 10, type: Entity.TYPEPOLYGONUS, twoSides: false, shine: 0.9});/*
sofa.setStyle({ color: [83, 145, 198], size: 20, type: Entity.TYPEPOINTS, twoSides: true, shine: 1});
sofa2.setStyle({ color: [83, 145, 198], size: 10, type: Entity.TYPEPOLYGONUS, twoSides: true, shine: 1});
//sofa.setScale(0.3, 0.3, 0.3);
var polys = cube.getPolygonus();
polys[0].color = [0, 120, 230];
polys[1].color = [120, 230, 36];
polys[2].color = [120, 0, 230];
polys[3].color = [155, 210, 170];*/

  /*var item1 = new Entity();
  item1.setName("Cube");
  item1.setPoints([{ x: -1, y: 1, z: 1 }, { x: 0, y: 1, z: 1 }, { x: 0, y: -1, z: 1 }, { x: -1, y: -1, z: 1 }, { x: -1, y: 1, z: -1 }, { x: 0, y: 1, z: -1 }, { x: 0, y: -1, z: -1 }, { x: -1, y: -1, z: -1 }]);
  item1.setEdges([{ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 0 }, { a: 4, b: 5 }, { a: 5, b: 6 }, { a: 6, b: 7 }, { a: 7, b: 4 }, { a: 0, b: 4 }, { a: 1, b: 5 }, { a: 2, b: 6 }, { a: 3, b: 7 }]);
  item1.setPolygonus([{ vertices: [1, 0, 3, 2] }, { vertices: [0, 4, 7, 3] }, { vertices: [4, 5, 6, 7] }, { vertices: [5, 1, 2, 6] }, { vertices: [0, 1, 5, 4] }, { vertices: [7, 6, 2, 3] }]);

  var item2 = new Entity();
  item2.setName("Cube");
  item2.setPoints([{ x: 0, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }, { x: 1, y: -1, z: 1 }, { x: 0, y: -1, z: 1 }, { x: 0, y: 1, z: -1 }, { x: 1, y: 1, z: -1 }, { x: 1, y: -1, z: -1 }, { x: 0, y: -1, z: -1 }]);
  item2.setEdges([{ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 0 }, { a: 4, b: 5 }, { a: 5, b: 6 }, { a: 6, b: 7 }, { a: 7, b: 4 }, { a: 0, b: 4 }, { a: 1, b: 5 }, { a: 2, b: 6 }, { a: 3, b: 7 }]);
  item2.setPolygonus([{ vertices: [1, 0, 3, 2] }, { vertices: [0, 4, 7, 3] }, { vertices: [4, 5, 6, 7] }, { vertices: [5, 1, 2, 6] }, { vertices: [0, 1, 5, 4] }, { vertices: [7, 6, 2, 3] }]);

//Adicionar itens no layout
scene.addItem(item1, 0, 2, 0);
scene.addItem(item2, 2, 2, 0);*/
/*scene.addItem(sofa, 0, 0, 0);
scene.addItem(sofa2, -5, 0, 0);*/

var item = new Entity();
item.setPoints([{ x: 0, y: 0, z: 0 }]);
item.setStyle({ color: [250, 0, 0], size: 20, type: Entity.TYPEPOINTS, twoSides: true, shine: 1});
scene.addItem(item, 0, 0, 0);
//*/
scene.addItem(cube, 0, -2, 0);//.addItem(cube.clone(), -2, 0, 0).addItem(cube.clone()  , 0, 0, 0).addItem(cube.clone(), 2, 0, 0).addItem(cube.clone(), 4, 0, 0);

/*//Create Plane com Cubes
function cubeplane(x, y, z, w, h){
  for(var iw = 0; iw < w; ++iw){
    for(var ih = 0; ih < h; ++ih){
    //scene.addItem(cube.clone(), (x + iw) * 2, y, (z + ih) * 2);
    }
  }
}cubeplane(-10, 0, -10, 2, 2);*/

//Start animação
view.frameAnimation(() => {
  control.lookat = scene.getCamera().getLookat();
  var trans = control.translate;
  var rot = control.rotate;
  scene.getCamera().translate(trans.x * 0.1, trans.y * 0.1, trans.z * 0.5);
  scene.getCamera().rotate(rot.x * 0.1, rot.y * 0.1, rot.z * 0.1);
  //cube.rotate(0, 0.007, 0);
  scene.render();
  view.render();
  //view.stopAnimation();

  let pos = scene.getCamera().getPosition();
  control.toast("x: " + Math.round(pos.x) + ", y: " + Math.round(pos.y) + ", z: " +  Math.round(pos.z));
});


//$('.refresh').click();