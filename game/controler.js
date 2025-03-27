class Control {

  #longclick = null;
  #clickTime = null;
  #start = { x: 0, y: 0 }
  #isMove = false;
  #move_event = null;
  #retur = null;
  #pause = false;
  #scene = null;
  #texture_config = { w: 3, h: 4, uvs: [[1, 0], [2, 1], [1, 2], [0, 1], [1, 1], [1, 3]] }

  rotate = { x: 0, y: 0, z: 0 };
  translate = { x: 0, y: 0, z: 0 };
  controlModel = 'PC';
  isMouseMove = true;
  isFull = true;

  itens_scene = [];

  game_senttings = { itens: [], showcase: [25], camera: null };

  itens_available = [
    { type: 'texture', src: "/game/textures/01.jpeg", icon: "/game/textures/01.jpeg" },
    { type: 'texture', src: "/game/textures/02.jpeg", icon: "/game/textures/02.jpeg" },
    { type: 'texture', src: "/game/textures/03.jpeg", icon: "/game/textures/03.jpeg" },
    { type: 'texture', src: "/game/textures/04.jpeg", icon: "/game/textures/04.jpeg" },
    { type: 'texture', src: "/game/textures/05.jpeg", icon: "/game/textures/05.jpeg" },
    { type: 'texture', src: "/game/textures/06.jpeg", icon: "/game/textures/06.jpeg" },
    { type: 'texture', src: "/game/textures/07.jpeg", icon: "/game/textures/07.jpeg" },
    { type: 'texture', src: "/game/textures/09.jpeg", icon: "/game/textures/09.jpeg" },
    { type: 'texture', src: "/game/textures/10.jpeg", icon: "/game/textures/10.jpeg" },
    { type: 'texture', src: "/game/textures/11.jpeg", icon: "/game/textures/11.jpeg" },
    { type: 'texture', src: "/game/textures/13.jpeg", icon: "/game/textures/13.jpeg" },
    { type: 'texture', src: "/game/textures/14.jpeg", icon: "/game/textures/14.jpeg" },
    { type: "color", data: [0, 180, 255] },
    { type: "color", data: [0, 180, 255] },
    { type: "color", data: [0, 180, 255] },
    { type: "color", data: [0, 180, 255] },
    { type: "color", data: [0, 180, 255] },
  ];

  setScene = function (scene) {
    this.#scene = scene;
  }

  toast = function (msg) {
    var toast = $("#toast");
    if (msg == null) toast.hide();
    else toast.html(msg).show();
  };

  init = () => {
    if (this.#scene == null) throw new Error("Scene not defined");

    let senttings = window.localStorage.getItem('game_senttings');
    if (senttings != null) this.game_senttings = JSON.parse(senttings);

    let gs = this.game_senttings;
    if (gs.camera != null) {
      this.#scene.setCamera(new Matrix(gs.camera.matrix, gs.camera.lookat));
      let ps = gs.camera.position;
      this.#scene.getCamera().setPosition(ps.x, ps.y, ps.z);
    } else {
      let gs = this.game_senttings;
      let cam = this.#scene.getCamera();
      gs.camera = { lookat: cam.getLookat(), matrix: cam.getData(), position: cam.getPosition() };
    }

    this.#initHtml();
    $(".control").show();

    let div = document.querySelector('.imgs-controll');
    div.style.display = 'flex';
    div.style.display = 'none';

    setTimeout(() => {
      div.style.display = 'none';
    }, 2000);

    $('#itens-list').change(() => {
      $('.itens-list .item input').parent().css('background', 'transparent');
      $('.itens-list .item input:checked').parent().css('background', '#333a');
    })

    this.game_senttings.itens.map(e => {

      let obj;
      let aval = this.itens_available[e.id];
      if (aval.type == 'texture') {
        obj = this.#texture_cube(aval.src);
      } else {
        obj = new Textures.createCube();
        obj.getStyle().color = aval.data;
      }

      this.#scene.addItem(obj, e.x, e.y, e.z);
    })

    //refresh local storage e itens
    $('.refresh').click(() => {
      let is = confirm('Deseja excluir todos os itens?');
      if (is) {
        window.localStorage.removeItem('game_senttings');
        window.location.reload();
      }
    })

    //addicionar eventos
    $(document).on({
      keydown: (e) => this.#keydown(e),
      keyup: (e) => this.#keyup(),
    });

    $('.control').on({
      mousedown: (e) => this.#mousedown(e, this),
      mousemove: (e) => this.#mousemove(e, this),
      mouseup: (e) => this.#mouseup(e, this)
    });

    $('.full').click(this.#full);

    $('.item.other').click(() => {
      this.#pause = true;
      $('.modal-other').show();
      $('.modal-bg').show();
      $('.itens-list .item').attr('draggable', 'true');
    });

    let close = () => {
      this.#pause = false;
      $('.modal-other').hide();
      $('.modal-bg').hide();
      $('.itens-list .item').attr('draggable', 'false');
    }

    $('.modal-bg').click(close);
    $('.modal-close').click(close);


    //função arrasta e solta
    $('.modal-item').on('dragstart', (ev) => {
      ev.originalEvent.dataTransfer.setData("item", ev.target.id);
    })

    $('.modal-list').on({
      dragover: (ev) => {
        ev.preventDefault();
      },
      drop: (ev) => {
        ev.preventDefault();
        var id = ev.originalEvent.dataTransfer.getData("item");
        this.game_senttings.showcase[id] = null;
        $('.itens-list .item-' + id + ' span').css('background', 'transparent');
        this.#save();
      }
    })

    $('.itens-list .item').on({
      dragstart: (ev) => {
        ev.originalEvent.dataTransfer.setData("item", ev.target.id);
      },
      dragover: (ev) => {
        ev.preventDefault();
      },
      drop: (ev) => {
        ev.preventDefault();

        let i = ev.currentTarget.id;
        var id = ev.originalEvent.dataTransfer.getData("item");
        this.game_senttings.showcase[i] = id;

        let item = this.itens_available[id];

        if (item.type == 'texture')
          $('.itens-list .item-' + i + ' span').attr('style', `background-image: url(${item.icon})`);
        else
          $('.itens-list .item-' + i + ' span').css('background', 'rgb(' + item.data + ')');



        this.#save();
      }
    })

    // fim da função arrasta e solta

    //$('#file').on('dragstart', function(evt) {
    //touchpad mobile controller
    /* if (config.isTouchpad) {
       $('.move-full').show().on({
         touchmove: function (t) {
           var touch = t.touches[0];
           var x = ((touch.clientX - (canvas.width / 2)) / (canvas.width / 2));
           var y = ((touch.clientY - (canvas.height / 2)) / (canvas.height / 2));
           x = (x < -1) ? -1 : (x > 1) ? 1 : x;
           y = (y < -1) ? -1 : (y > 1) ? 1 : y;
           var c = Math.cos(loaokat.y),
             s = Math.sin(loaokat.y);
           config.rotate = { x: y * -c * 0.07, y: x * 0.07, z: y * s * 0.07, };
         },
         touchend: function () {
           config.rotate = { x: 0, y: 0, z: 0 };
         }
       })
     }*/










    /*
    
    
        let mov = $(".move"); window.mov = mov;
        let point = $(".move .pointer")
    
        let t = mov.offset().top;
        let l = mov.offset().left;
    
        let w = mov.width();
        let h = mov.height();
    
        let start = false;
    
        let rot = this.rotate;
        let move = function (e) {
          if (!start) return;
          let px = e.clientX;
          let py = e.clientY;
    
          rot.y = (px - l - w/2) / (w/2) / 10;
          rot.x = -(py - t - h/2) / (h/2) / 10;
    
          point.css({
            left: Math.min(Math.max(px - l, 0), w),
            top: Math.min(Math.max(py - t, 0), h),
          });
        }
    
        mov.on({
          mousedown: e => {
            start = true;
            move(e);
          },
    
          mouseup: () => {
            start = false;
            point.css({ left: "50%", top: "50%" });
            rot.x = 0;
            rot.y = 0;
          },
    
          mousemove: move,
    
          mouseleave: e => {
            start = false;
            point.css({ left: "50%", top: "50%" });
          }
        });
    
    */




  }

  #initHtml = function () {
    $('body').append($('<div/>').addClass('control')
      .html(`<form id="itens-list"><div class="itens-list"></div></form>
    <div class="modal-bg"></div><div class="modal-other"><h3>Addicionar Itens</h3>
    <label class="modal-close"><i class="bi bi-x"></i></label><div class="modal-list"></div></div>   
    <label class="full"><input type="checkbox" class="full-check"><i class="a bi bi-arrows-fullscreen"></i>
    <i class="b bi bi-arrows-angle-contract"></i></label><div class="refresh"><i class="bi bi-arrow-clockwise"></i></div>
    <span id="toast"></span><span class="cicle"><span class="cicle-on"></span></span>
    <div class="imgs-controll"><span class="keyboard"><img src="game/keyboard.png"></span><span class="mouse">
    <img src="game/mouse.png"></span></div>`));

    let itens_list = $('.itens-list');
    for (let i = 0; i < 9; i++) {
      let c = this.game_senttings.showcase[i];
      let aval = this.itens_available[c];

      let label = $('<label/>').attr('id', i).addClass('item item-' + i);
      if (aval && aval.type == 'color')
        label.html(`<input type="radio" name="rad" value="${i}"/><span style="background:rgb(${aval.data});"></span>`);
      else if (aval && aval.type == 'texture')
        label.html(`<input type="radio" name="rad"/><span style="background-image:url('${aval.icon}');"></span>`);
      else label.html(`<input type="radio" name="rad" value="${i}"/><span style="background:transparent;"></span>`);

      itens_list.append(label);

    }

    itens_list.append($('<label/>').addClass('item other').html('<i class="bi bi-three-dots"></i>'));

    let modal_list = $('.modal-list');
    this.itens_available.map((e, i) => {

      let div = $('<div/>').addClass('modal-item');

      if (e.type == 'texture') div.html(`<span draggable="true" id="${i}" style="background-image:url('${e.icon}');"></span>`);
      else div.html(`<span draggable="true" id="${i}" style="background:rgb(${e.data});"></span>`);

      modal_list.append(div);
    })

    // mobile touchpad
    //<div class="move-full">

  }

  #keydown = function (e) {
    if (this.#pause) return;

    let look = this.#scene.getCamera().getLookat();
    var c = Math.cos(look.y),
      s = Math.sin(look.y);
    switch (e.keyCode) {
      case 65:
        this.translate = { x: -c, y: 0, z: s };
        break;
      case 68:
        this.translate = { x: c, y: 0, z: -s };
        break;
      case 87:
        this.translate = { x: s, y: 0, z: c };
        break;
      case 83:
        this.translate = { x: -s, y: 0, z: -c };
        break;
      case 69:
        this.translate.y = 1;
        break;
      case 81:
        this.translate.y = -1;
        break;
      case 37:
        this.rotate.y = -0.1;
        break;
      case 39:
        this.rotate.y = 0.1;
        break;
      case 38:
        this.rotate = { x: 0.1 * c, y: 0, z: 0.1 * -s };
        break;
      case 40:
        this.rotate = { x: 0.1 * -c, y: 0, z: 0.1 * s };
        break;
    }

    let cam = this.#scene.getCamera();
    let gs = this.game_senttings;
    gs.camera = { lookat: cam.getLookat(), matrix: cam.getData(), position: cam.getPosition() };
    this.#save();

  }

  #keyup = function () {
    this.translate = { x: 0, y: 0, z: 0 };
    this.rotate = { x: 0, y: 0, z: 0 };
  }

  #mousedown = function (a) {
    if (this.#pause) return;
    this.#start.x = a.clientX;
    this.#start.y = a.clientY;
    this.#isMove = true;

    this.#clickTime = new Date().getTime();
    this.#mousemove(a);
  }

  #mousemove = function (e) {
    if (this.#pause) return;
    if (!this.#isMove) return;
    if (this.#move_event) clearTimeout(this.#move_event);

    let retorno = view.getClick(e.clientX, e.clientY);
    if (retorno != null && this.#retur != retorno.entity)
      $('.cicle').stop().show().css("padding", "20px").animate({ padding: 0 }, 1000, () => { $('.cicle').stop().hide() });
    else if (retorno == null)
      $('.cicle').hide();

    $('.cicle').css({
      left: e.clientX - 20,
      top: e.clientY - 20,
    })

    if (retorno == null || this.#retur != retorno.entity)
      window.clearInterval(this.#longclick);

    if (retorno != null && this.#retur != retorno.entity)
      this.#longclick = window.setInterval(() => {
        if (retorno == null) return;
        var item = retorno.entity;
        this.#scene.remove(item);
        let pos = item.getPosition();
        let gs = this.game_senttings;
        this.game_senttings.itens = gs.itens.filter(a => !(a.x == pos.x && a.y == pos.y && a.z == pos.z));
        this.#save();

      }, 1000);

    this.#retur = (retorno == null) ? null : retorno.entity;


    if (!this.isMouseMove) return;






















    if (true) {

      let look = this.#scene.getCamera().getLookat();
      var c = Math.cos(look.y),
        s = Math.sin(look.y);
      var x = (e.clientX - this.#start.x);
      var y = (e.clientY - this.#start.y);

      let rad = 10;

      x = (x < -rad) ? -rad : (x > rad) ? rad : x;
      y = (y < -rad) ? -rad : (y > rad) ? rad : y;

      let vel = 0.008;

      this.rotate = { x: y * -c * vel, y: x * vel, z: y * s * vel };




      let cx = canvas.offsetLeft;
      let cy = canvas.offsetTop;

      /*let cam = this.#scene.getCamera();
      let scam = this.game_senttings.camera;
      scam.lookat = cam.getLookat();
      scam.matrix = cam.getData();
      this.#save();*/

      //this.#move_event = setTimeout(() => {
      //this.rotate = { x: 0, y: 0, z: 0 };
      //}, 1000 / 20);

    }



















  }

  #mouseup = function (e) {
    this.#isMove = false;
    this.rotate = { x: 0, y: 0, z: 0 };
    window.clearInterval(this.#longclick);
    $('.cicle').stop().hide();
    let time = new Date().getTime();
    if ((time - this.#clickTime) < 1000) {
      var retorno = view.getClick(e.clientX, e.clientY);
      if (retorno == null) return;
      var item = retorno.entity;
      var ind = retorno.ind;
      let pos = item.getPosition();
      let poly = item.getPolygonus()[ind];

      let coords = null;
      let cpolys = item.getCoords().polygonus;
      for (var i = 0; i < cpolys.length; ++i) {
        var c = cpolys[i];
        if (c.id != ind) continue;
        coords = c.coords;
      }

      let x = coords.x, y = coords.y, z = coords.z;

      let obj;

      let id = $('input[name="rad"]:checked').parent().attr('id');
      let d = this.game_senttings.showcase[id];
      let aval = this.itens_available[d];

      if (!aval) return;

      if (aval.type == 'texture') {
        obj = this.#texture_cube(aval.src);
      } else {
        obj = new Textures.createCube();
        obj.getStyle().color = aval.data;
      }

      let p = { x: (pos.x + x * 2), y: (pos.y + y * 2), z: (pos.z + z * 2) };

      this.#scene.addItem(obj, p.x, p.y, p.z);
      this.game_senttings.itens.push({ id: d, x: p.x, y: p.y, z: p.z });
      this.#save();
    }
  }

  #texture_cube(src) {
    let obj = new Textures.createCube();
    let s = this.#texture_config, u = s.uvs;
    obj.texture = { src: src, w: s.w, h: s.h };
    obj.getPolygonus()[0].texture_uv = u[0];
    obj.getPolygonus()[1].texture_uv = u[1];
    obj.getPolygonus()[2].texture_uv = u[2];
    obj.getPolygonus()[3].texture_uv = u[3];
    obj.getPolygonus()[4].texture_uv = u[4];
    obj.getPolygonus()[5].texture_uv = u[5];
    return obj;
  }

  #full = function () {
    var elem = document.documentElement;
    if (this.isFull) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      this.isFull = false;
    } else {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
      this.isFull = true;

    }
  }

  #save = function () {
    let json = JSON.stringify(this.game_senttings)
    window.localStorage.setItem('game_senttings', json);
  }

}

/*Area de testes*/{









  //eixo invertido
  //eixo padrao

  //continuo 
  //com pausa

  //Adicionar Controle mobile

  /*
  
  //touchpad mobile controller
  var size = (canvas.width + canvas.height) * 0.08;
  
  /*
        
        var div2 = $("<div/>").css({
          width: size,
          height: size,
          left: 10,
          bottom: 10,
          border: "2px solid green",
          position: "absolute",
          "border-radius": "10px"
        }).on({
          touchmove: function (t) {
            var touch = t.touches[0];
            var ofset = div2.position();
            var x = ((touch.clientX - ofset.left - (size / 2)) / (size / 2));
            var y = ((touch.clientY - ofset.top - (size / 2)) / (size / 2));
            x = (x < -1) ? -1 : (x > 1) ? 1 : x;
            y = (y < -1) ? -1 : (y > 1) ? 1 : y;
            var c = Math.cos(lookaat.y),
              s = Math.sin(looakat.y);
            control.translate = { x: x * c + y * -s, y: 0, z: x * -s + y * -c };
          },
          touchend: function () {
            control.translate = { x: 0, y: 0, z: 0 };
          }
        });
        $("body").append(div2);
      
        var div3 = $("<div/>").css({
          width: size / 2,
          height: size,
          right: 10,
          bottom: 10,
          border: "2px solid green",
          position: "absolute",
          "border-radius": "10px"
        }).on({
          touchmove: function (t) {
            var touch = t.touches[0];
            var ofset = div3.position();
            var y = ((touch.clientY - ofset.top - (size / 2)) / (size / 2));
            y = (y < -1) ? -1 : (y > 1) ? 1 : y;
            control.translate.y = -y;
          },
          touchend: function () {
            control.translate.y = 0;
          }
        });
        $("body").append(div3);
      
      };
  
      */


}