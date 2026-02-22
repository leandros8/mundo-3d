/*Definição de variaveis*/
  const width = window.innerWidth;
  const height = window.innerHeight;
  const canvas = document.getElementById("canvas");
  const scene = new Scene();
  const control = new Control();
  const view = new View();
  const baseUrl = "https://leandros8.github.io/mundo-3d";

/*Configurações do game*/
  canvas.width = width;
  canvas.height = height;
  scene.setViewport({ width: width, height: height, x: 0, y: 0, z: 150 });
  view.setFPS(35);
  view.setScene(scene);
  view.setCanvas(canvas);
  control.setScene(scene);
  control.init();

/*Definir objetos*/
  let cube = Textures.createCube();
  let cube2 = cube.clone();
  let cube3 = cube.clone();
  var plane = Textures.createPlane(40, 40);

/*Configurações dos objetos*/
  cube.setStyle({ color: [255, 0, 0], size: 10, type: Entity.TYPEPOLYGONUS, twoSides: true, shine: 0.9 });
  cube.setName('Bloco de terra');
  cube.getPolygonus()[0].texture = baseUrl + "/game/terra_lado.png";
  cube.getPolygonus()[1].texture = baseUrl + "/game/terra_lado.png";
  cube.getPolygonus()[2].texture = baseUrl + "/game/terra_lado.png";
  cube.getPolygonus()[3].texture = baseUrl + "/game/terra_lado.png";
  cube.getPolygonus()[4].texture = baseUrl + "/game/terra_cima.jpeg";
  cube.getPolygonus()[5].texture = baseUrl + "/game/terra_baixo.jpg";
  cube2.setStyle({ color: [255, 0, 0], size: 10, type: Entity.TYPEPOLYGONUS, twoSides: true, shine: 0.9 });
  cube2.setName('Bloco colorido');
  cube2.getPolygonus()[0].color = [0, 0, 255];
  cube3.setStyle({ color: [180, 180, 180], size: 10, type: Entity.TYPEPOLYGONUS, twoSides: true, shine: 0.9 });
  cube3.setName('Bloco TNT');
  cube3.texture = { src: baseUrl + "/game/textures/01.jpeg", w: 3, h: 4 };
  cube3.getPolygonus()[0].texture_uv = [1, 2];
  cube3.getPolygonus()[1].texture_uv = [1, 2];
  cube3.getPolygonus()[2].texture_uv = [1, 2];
  cube3.getPolygonus()[3].texture_uv = [1, 2];
  cube3.getPolygonus()[4].texture_uv = [1, 1];
  cube3.getPolygonus()[5].texture_uv = [1, 3];  
  plane.setStyle({ color: [200, 200, 200], size: 40, type: Entity.TYPELINES, twoSides: true, shine: 1 });

/*Adicionar itens no layout*/
  scene.addItem(plane, 0, -3.3, 20).addItem(cube, 0, -2, 20).addItem(cube2, -4, -2, 20).addItem(cube3, 4, -2, 20);
//inicio = Date.now();
/*Start animação*/
  view.frameAnimation(() => {
    let trans = control.translate;
    let rotat = control.rotate;
    scene.getCamera().translate(trans.x * 0.1, trans.y * 0.1, trans.z * 0.2);
    scene.getCamera().rotate(rotat.x * 0.1, rotat.y * 0.1, rotat.z * 0.1);
    cube.rotate(0, -0.007, 0);
    cube2.rotate(0, 0, 0.007);
    cube3.rotate(-0.007, 0, 0);

    scene.render();    
    inicio = Date.now();
    view.render();
    console.log(Date.now() - inicio);
    //view.stopAnimation();
    let pos = scene.getCamera().getPosition();
    control.toast("x: " + Math.round(pos.x) + ", y: " + Math.round(pos.y) + ", z: " + Math.round(pos.z));

  });


/*Area de testes*/{




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
  //*/
  //Adicionar itens no layout*/
  //scene.addItem(item1, 0, 2, 0);
  //scene.addItem(item2, 2, 2, 0);




  //Create Plane com Cubes
  /*function cubeplane(x, y, z, w, h){
    for(var iw = 0; iw < w; ++iw){
      for(var ih = 0; ih < h; ++ih){
      scene.addItem(cube.clone(), (x + iw) * 2, y, (z + ih) * 2);
      }
    }
  }cubeplane(0, 0, 0, 20, 20);*/


  /* //ponto na posição 0 - 0 - 0
  var item = new Entity();
  item.setPoints([{ x: 0, y: 0, z: 0 }]);
  item.setStyle({ color: [250, 0, 0], size: 20, type: Entity.TYPEPOINTS, twoSides: true, shine: 1});
  scene.addItem(item, 0, 0, 0);*/

}