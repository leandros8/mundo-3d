//Definição de variaveis
const width = window.innerWidth;
const height = window.innerHeight;
const canvas = document.getElementById("canvas");
const scene = new Scene();
//const control = new Control(scene);
const view = new View();

// Configurações do game
canvas.width = width;
canvas.height = height;
scene.setViewport({ width: width, height: height, x: 0, y: 0, z: 150 });
scene.getCamera().setPosition(0, 10, -25);
scene.getCamera().rotate(-0.4, 0, 0);
view.setFPS(60);
view.setScene(scene);
view.setCanvas(canvas);
//control.init();

//Criação da barra slide
$('head').append('<link rel="stylesheet" href="create.css">');

var cube = Textures.createCube();
cube.setStyle({ color: [160, 0, 160], size: 20, type: Entity.TYPEPOLYGONUS, twoSides: true, shine: 1 });
scene.addItem(cube, -4, 0, 0);

var item = new Entity();
item.setPoints([{ x: 0, y: 0, z: 0 }]);
item.setStyle({ color: [160, 0, 160], size: 20, type: Entity.TYPEPOINTS, twoSides: true, shine: 1 });
//scene.addItem(item, 0, 0, 0);

class create {

  item;

  #refresh_detals = function(ctx){
    $('.list').hide(); 
    $('.detals').show();
    $('div.type label').removeClass('active');
    $('div.type #det').addClass('active');
    
    var s = ctx.item.getStyle();
    var color = $('#style-color');
    var c = s.color;
    var hex = '#';
    c.map(e => { hex += (e < 16 ? '0' : '') + e.toString(16); });
    color.val(hex);
    color.change(() => {
      var v = color.val();
      var r = [parseInt(v.substr(1, 2), 16), parseInt(v.substr(3, 2), 16), parseInt(v.substr(5, 2), 16)];
      var s = ctx.item.getStyle();
      ctx.item.setStyle({ color: r, size: s.size, type: s.type, twoSides: s.twoSides, shine: s.shine });
    });

    var size = $('#style-size');
    size.val(s.size);
    size.change(() => {
      var s = ctx.item.getStyle();
      ctx.item.setStyle({ color: s.color, size: size.val(), type: s.type, twoSides: s.twoSides, shine: s.shine });
    });

    var type = $('#style-type');
    type.val(s.type);
    type.change(() => {
      var s = ctx.item.getStyle();
      ctx.item.setStyle({ color: s.color, size: s.size, type: type.val(), twoSides: s.twoSides, shine: s.shine });
    });

    var shine = $('#style-shine');
    shine.val(s.shine);
    shine.change(() => {
      var s = ctx.item.getStyle();
      ctx.item.setStyle({ color: s.color, size: s.size, type: s.type, twoSides: s.twoSides, shine: shine.val() });
    });

    let p = ctx.item.getPosition();
    $('#p-x').val(p.x).change(() => { p.x = parseFloat($('#p-x').val())});
    $('#p-y').val(p.y).change(() => { p.y = parseFloat($('#p-y').val())});
    $('#p-z').val(p.z).change(() => { p.z = parseFloat($('#p-z').val())});

    let rot = function(){
      let x = parseFloat($('#r-x').val());
      let y = parseFloat($('#r-y').val());
      let z = parseFloat($('#r-z').val());
      ctx.item.resetData();
      ctx.item.rotate(x, y, z);
    }
    
    var r = ctx.item.getLookat();
    $('#r-x').val(r.x).change(rot);
    $('#r-y').val(r.y).change(rot);
    $('#r-z').val(r.y).change(rot);

    var sca = ctx.item.getSize();
    $('#s-x').val(sca.x).change(() => { ctx.item.setScale(parseInt($('#s-x').val()), sca.y, sca.z) });
    $('#s-y').val(sca.y).change(() => { ctx.item.setScale(sca.x, parseInt($('#s-y').val()), sca.z) });
    $('#s-z').val(sca.y).change(() => { ctx.item.setScale(sca.x, sca.y, parseInt($('#s-z').val())) });
}

  #refresh_points = function (ctx, id) {
    $('.list').hide(); 
    $('.points-list').show();
    $('div.type label').removeClass('active');
    $('div.type #poi').addClass('active');

    let html_list = '';
    let points = ctx.item.getPoints();
    for (var i = 0; i < points.length; ++i) {
      let p = points[i];
      html_list += `<li id="${i}">
        <span>Ponto ${i}</span>
        <span>X: ${p.x}</span>
        <span>Y: ${p.y}</span>
        <span>Z: ${p.z}</span>
      </li>`;
    }

    let ul = $('.points-list ul').html(html_list);
    ul.scrollTop(ul[0].scrollHeight);

    if (!id) var id = $('.points-list ul li:last-child')[0].id;

    $('.points-list ul li').removeClass('active');
    $('.points-list ul li[id=' + id + ']').addClass('active');
    $('.points-detals .detal-title').html('Ponto ' + id);

    let p = points[id];
    $('.point-position label input[name="x"]').off().val(p.x).change((e) => { p.x = parseFloat($(e.target).val()); this.#refresh_points(ctx, id) });
    $('.point-position label input[name="y"]').off().val(p.y).change((e) => { p.y = parseFloat($(e.target).val()); this.#refresh_points(ctx, id) });
    $('.point-position label input[name="z"]').off().val(p.z).change((e) => { p.z = parseFloat($(e.target).val()); this.#refresh_points(ctx, id) });

    $('.points-list ul li').off().click((e => { ctx.#refresh_points(ctx, e.currentTarget.id) }));

    $('.points-list button.del').off().click(() => {
      if (confirm('Confimar a exlusão?')) {
        points.splice(id, 1)
        this.#refresh_points(ctx);
      }
    });

  }

  #refresh_edges = function (ctx, id) {
    $('.list').hide(); 
    $('.edges-list').show();
    $('div.type label').removeClass('active');
    $('div.type #edg').addClass('active');
    let html_list = '';
    let edges = ctx.item.getEdges();
    for (var i = 0; i < edges.length; ++i) {
      let e = edges[i];
      html_list += `<li id="${i}">
              <span>Linha ${i}</span>
              <span>A: P${e.a}</span>
              <span>B: P${e.b}</span>
            </li>`;
    }

    let ul = $('.edges-list ul').html(html_list);
    ul.scrollTop(ul[0].scrollHeight);

    if (!id) var id = $('.edges-list ul li:last-child')[0].id;

    $('.edges-list ul li').removeClass('active');
    $('.edges-list ul li[id=' + id + ']').addClass('active');
    $('.edges-detals .detal-title').html('Linha ' + id);

    let html_item = '';
    for (var i = 0; i < ctx.item.getPoints().length; ++i) html_item += `<option value="${i}" id="${i}">P${i}</option>`;

    let l = edges[id];
    $('.edge-item-a').html(html_item).off().val(l.a).change((e) => { l.a = $(e.target).val(); this.#refresh_edges(ctx, id) });
    $('.edge-item-b').html(html_item).off().val(l.b).change((e) => { l.b = $(e.target).val(); this.#refresh_edges(ctx, id) });

    $('.edges-list ul li').off().click((e => { ctx.#refresh_edges(ctx, e.currentTarget.id) }));

    $('.edges-list button.del').off().click(() => {
      if (confirm('Confimar a exlusão?')) {
        edges.splice(id, 1)
        this.#refresh_edges(ctx);
      }
    });

  }

  #refresh_polygonus = function (ctx, id) {
    $('.list').hide(); 
    $('.polygonus-list').show();
    $('div.type label').removeClass('active');
    $('div.type #pol').addClass('active');

    let html_list = '';
    let polys = ctx.item.getPolygonus();
    for (var i = 0; i < polys.length; ++i) {
      let e = polys[i].vertices;
      html_list += `<li id="${i}">
              <span>Poligono ${i}</span>
              <span>A: P${e[0]}</span>
              <span>B: P${e[1]}</span>
              <span>C: P${e[2]}</span>
              <span>D: P${e[3]}</span>
            </li>`;
    }

    let ul = $('.polygonus-list ul').html(html_list);
    ul.scrollTop(ul[0].scrollHeight);

    if (!id) var id = $('.polygonus-list ul li:last-child')[0].id;

    $('.polygonus-list ul li').removeClass('active');
    $('.polygonus-list ul li[id=' + id + ']').addClass('active');
    $('.polygonus-detals .detal-title').html('Poligono ' + id);

    let html_item = '';
    for (var i = 0; i < ctx.item.getPoints().length; ++i) html_item += `<option value="${i}" id="${i}">P${i}</option>`;

    let l = polys[id].vertices;
    $('.polygonus-item-a').html(html_item).off().val(l[0]).change((e) => { l[0] = $(e.target).val(); this.#refresh_polygonus(ctx, id) });
    $('.polygonus-item-b').html(html_item).off().val(l[1]).change((e) => { l[1] = $(e.target).val(); this.#refresh_polygonus(ctx, id) });
    $('.polygonus-item-c').html(html_item).off().val(l[2]).change((e) => { l[2] = $(e.target).val(); this.#refresh_polygonus(ctx, id) });
    $('.polygonus-item-d').html(html_item).off().val(l[3]).change((e) => { l[3] = $(e.target).val(); this.#refresh_polygonus(ctx, id) });

    $('.polygonus-list ul li').off().click((e => { ctx.#refresh_polygonus(ctx, e.currentTarget.id) }));

    $('.polygonus-list button.del').off().click(() => {
      if (confirm('Confimar a exlusão?')) {
        polys.splice(id, 1)
        this.#refresh_polygonus(ctx);
      }
    });
  }

  #click_item = function(ctx, x, y){
    let result = view.getClick(x, y);
    if(result == null)return;

    if(result.type == Entity.TYPEPOINTS){
      this.#refresh_points(ctx, result.ind);
    }else if(result.type == Entity.TYPELINES){
      this.#refresh_edges(ctx, result.ind);
    }else if(result.type == Entity.TYPEPOLYGONUS){
      this.#refresh_polygonus(ctx, result.ind);
    }
  }

  init = function () {
    //abrir e fechar slide
    $('.open-close-slide').click(e => {
      $('.open-close-slide').toggleClass('open');
    });

    //titulo
    $('.slide .link').html(this.item.getId());
    $('.slide .name').html(this.item.getName());

    //tipo de visualização
    $('div.type label').click((e) => {
      let ind = e.target.id;
      switch (ind) {
        case 'det':
          this.#refresh_detals(this);
          break;
        case 'poi':
          this.#refresh_points(this);
          break;
        case 'edg':
          this.#refresh_edges(this);
          break;
        case 'pol':
          this.#refresh_polygonus(this);
          break;
      }
    });

    $('.points-list button.add').click((() => {
      let list = this.item.getPoints();
      list.push({ x: 0, y: 0, z: 0 });
      this.#refresh_points(this);
    }));

    $('.edges-list button.add').click((() => {
      let list = this.item.getEdges();
      list.push({ a: 0, b: 0 });
      this.#refresh_edges(this);
    }));

    $('.polygonus-list button.add').click((() => {
      let list = this.item.getPolygonus();
      list.push({vertices:[0, 0, 0, 0]});
      this.item.setPolygonus(list);
      this.#refresh_polygonus(this);
    }));

    $('#canvas').click(e => this.#click_item(this, e.clientX, e.clientY));

  }
}

var cr = new create();
cr.item = cube;
cr.init();

//Start animação
view.frameAnimation(() => {

  /*control.lookat = scene.getCamera().getLookat();
  var trans = control.translate;
  var rot = control.rotate;
  scene.getCamera().translate(trans.x * 0.5, trans.y * 0.5, trans.z * 0.5);
  scene.getCamera().rotate(rot.x * 0.1, rot.y * 0.1, rot.z * 0.1);*/
  //cube.rotate(0, 0.07, 0);
  scene.render();
  view.render();
  //view.stopAnimation();

  /*let pos = scene.getCamera().getPosition();
  control.toast("x: " + Math.round(pos.x) + ", y: " + Math.round(pos.y) + ", z: " +  Math.round(pos.z));*/
});

//$('.refresh').click();