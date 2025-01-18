class Control {

  rotate = { x: 0, y: 0, z: 0 };
  translate = { x: 0, y: 0, z: 0 };
  isTouchpad = false;
  itens_scene = [];
  itens_show = [
    [255, 0, 0],
    [0, 255, 0],
    null,
    null,
    null,
    [0, 0, 255],
    null,
    [0, 180, 255],
    null
  ];

  itens_available = [
    [0, 0, 0],
    [0, 0, 255],
    [0, 0, 0],
    [255, 0, 0],
    [0, 0, 0],
    [0, 180, 255],
    [0, 0, 0],
    [0, 255, 0],
    [0, 0, 0],
    [0, 0, 255],
    [0, 0, 0],
    [255, 0, 0],
    [0, 0, 0],
    [0, 180, 255],
    [0, 0, 0],
    [0, 255, 0],
    [0, 0, 0],
    [0, 0, 255],
    [0, 0, 0],
    [255, 0, 0],
    [0, 0, 0],
    [0, 180, 255],
    [0, 0, 0],
    [0, 255, 0],
    [0, 0, 0],
    [0, 0, 255],
    [0, 0, 0],
    [255, 0, 0],
    [0, 0, 0],
    [0, 180, 255],
    [0, 0, 0],
    [0, 255, 0],
  ];

  isFull = true;
  lookat = { x: 0, y: 0, z: 0 };

  #longclick = null;
  #clickTime = null;
  #start = { x: 0, y: 0 }
  #isMove = false;
  #move_event = null;
  #retur = null;
  #pause = false;

  #initHtml = function () {
    $('body').append($('<div/>').addClass('control')
      .html(`<form id="itens-list"><div class="itens-list"></div></form>
    <div class="modal-bg"></div><div class="modal-other"><h3>Addicionar Itens</h3>
    <label class="modal-close"><i class="bi bi-x"></i></label><div class="modal-list"></div></div>   
    <label class="full"><input type="checkbox" class="full-check"><i class="a bi bi-arrows-fullscreen"></i>
    <i class="b bi bi-arrows-angle-contract"></i></label><div class="refresh"><i class="bi bi-arrow-clockwise"></i></div>
    <span id="toast"></span><span class="cicle"><span class="cicle-on"></span></span>
    <div class="imgs-controll"><span class="keyboard"><img src="images/keyboard.png"></span><span class="mouse">
    <img src="images/mouse.png"></span></div>`));

    let itens_list = $('.itens-list');
    for (let i = 0; i < 9; i++) {
      let color = this.itens_show[i];
      if (color == null) color = 'transparent';
      else color = (`rgb(${color})`);

      itens_list.append($('<label/>').attr('id', i).addClass('item item-' + i)
        .html(`<input type="radio" name="rad" value="${i}"/><span style="background:${color};"></span>`));
      //.html(`<input type="radio" name="rad"/><span style="background-image:url('images/terra_lado.png');"></span>`));
    }

    itens_list.append($('<label/>').addClass('item other').html('<i class="bi bi-three-dots"></i>'));

    let modal_list = $('.modal-list');
    this.itens_available.map((e, i) => {
      let color = (`rgb(${e})`);
      modal_list.append($('<div/>').addClass('modal-item')
        .html(`<span draggable="true" id="${i}" style="background:${color};"></span>`));
      //.html(`<span style="background-image:url('images/terra_lado.png');"></span>`));
    })

    // mobile touchpad
    //<div class="move-full">


  }

  toast = function (msg) {
    var toast = $("#toast");
    if (msg == null) toast.hide();
    else toast.html(msg).show();
  };

  init = () => {

    //load scene of local storage
    let itens = window.localStorage.getItem('itens_show');
    if (itens != null) this.itens_show = JSON.parse(itens);

    this.#initHtml();
    $(".control").show();

    let div = document.querySelector('.imgs-controll');
    //div.style.display = 'flex';
    div.style.display = 'none';

    setTimeout(() => {
      div.style.display = 'none';
    }, 2000);

    //add efect check list
    $('#itens-list').change(() => {
      $('.itens-list .item input').parent().css('background', 'transparent');
      $('.itens-list .item input:checked').parent().css('background', '#333a');
    })

    //load scene of local storage
    let scene_lookat = window.localStorage.getItem('scene_lookat');
    if (scene_lookat != null) {
      let obj = JSON.parse(scene_lookat);
      scene.setCamera(new Matrix(obj.data, obj.lookat));
    }

    //load scene of local storage
    let scene_position = window.localStorage.getItem('scene_position');
    if (scene_position != null) {
      let obj = JSON.parse(scene_position);
      scene.getCamera().setPosition(obj.x, obj.y, obj.z);
    }

    //load scene of local storage
    let itens_scene = window.localStorage.getItem('itens_scene');
    if (itens_scene != null) {
      let itens = JSON.parse(itens_scene);
      if (itens.length > 0) {
        this.itens_scene = itens;
        itens.map(e => {
          let obj = new Textures.createCube()
          obj.getStyle().color = e.color;
          scene.addItem(obj, e.x, e.y, e.z);
        })
      }
    }

    //function experimental
    for (let x = -30; x <= 30; ++x)for (let z = -30; z <= 30; ++z) {
      let obj = new Textures.createCube()
      //obj.getStyle().color = [255, 0, 180];
      //scene.addItem(obj, x*2, 0, z*2);
    }


    //refresh local storage e itens
    $('.refresh').click(() => {
      let is = confirm('Deseja excluir todos os itens?');
      if (is) {
        window.localStorage.removeItem('itens_scene');
        window.localStorage.removeItem('scene_position');
        window.localStorage.removeItem('scene_lookat');
        window.localStorage.removeItem('itens_show');
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
        this.itens_show[id] = null;
        $('.itens-list .item-' + id + ' span').css('background', 'transparent');
        window.localStorage.setItem('itens_show', JSON.stringify(this.itens_show));
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
        var id = ev.originalEvent.dataTransfer.getData("item");
        let item = this.itens_available[id];
        let i = ev.currentTarget.id;
        this.itens_show[i] = item;
        $('.itens-list .item-' + i + ' span').css('background', 'rgb(' + item + ')');
        window.localStorage.setItem('itens_show', JSON.stringify(this.itens_show));
      },


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
           var c = Math.cos(lookat.y),
             s = Math.sin(lookat.y);
           config.rotate = { x: y * -c * 0.07, y: x * 0.07, z: y * s * 0.07, };
         },
         touchend: function () {
           config.rotate = { x: 0, y: 0, z: 0 };
         }
       })
     }*/

  }

  #keydown = function (e) {
    if (this.#pause) return;
    var c = Math.cos(this.lookat.y),
      s = Math.sin(this.lookat.y);
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

    let cam = scene.getCamera();
    window.localStorage.setItem('scene_position', JSON.stringify(cam.getPosition()));
    window.localStorage.setItem('scene_lookat', JSON.stringify({ lookat: cam.getLookat(), data: cam.getData() }));
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
      $('.cicle').stop().show().css({
        padding: '20px'
      }).animate({
        padding: 0,
        //background: '#888'
      }, 1000, () => {
        $('.cicle').stop().hide();
      });
    else if (retorno == null) $('.cicle').hide();

    $('.cicle').css({
      left: e.clientX - 20,
      top: e.clientY - 20,
    })

    var c = Math.cos(this.lookat.y),
      s = Math.sin(this.lookat.y);
    var x = (e.clientX - this.#start.x);
    var y = (e.clientY - this.#start.y);

    x = (x < -10) ? -10 : (x > 10) ? 10 : x;
    y = (y < -10) ? -10 : (y > 10) ? 10 : y;

    let vel = 0.001;
    this.rotate = { x: y * -c * vel, y: x * vel, z: y * s * vel };
    let cam = scene.getCamera();
    window.localStorage.setItem('scene_lookat', JSON.stringify({ lookat: cam.getLookat(), data: cam.getData() }));

    this.#move_event = setTimeout(() => {
      this.rotate = { x: 0, y: 0, z: 0 };
    }, 100);

    if (retorno == null || this.#retur != retorno.entity)
      window.clearInterval(this.#longclick);

    if (retorno != null && this.#retur != retorno.entity)
      this.#longclick = window.setInterval(() => {
        let retorno = view.getClick(e.clientX, e.clientY);
        if (retorno == null) return;
        var item = retorno.entity;
        scene.remove(item);
        let pos = item.getPosition();
        this.itens_scene = this.itens_scene.filter(a => !(a.x == pos.x && a.y == pos.y && a.z == pos.z));
        window.localStorage.setItem('itens_scene', JSON.stringify(this.itens_scene));

        if (view.getClick(e.clientX, e.clientY) != null)
          $('.cicle').stop().show().css({
            padding: '20px'
          }).animate({
            padding: 0,
            //background: '#888'
          }, 1000, () => {
            $('.cicle').stop().hide();
          });

      }, 1000);

    this.#retur = (retorno == null) ? null : retorno.entity;
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
      for(var i = 0;i < cpolys.length;++i){
        var c = cpolys[i];
        if(c.id != ind)continue;
        coords = c.coords;
      }
      
      let x = coords.x, y = coords.y, z = coords.z;

      let obj = new Textures.createCube();

      let id = $('input[name="rad"]:checked').val();
      let color = this.itens_show[id];
      if (color == null) return;
      obj.getStyle().color = color;

      scene.addItem(obj, (pos.x + (x * 2)), (pos.y + (y * 2)), (pos.z + (z * 2)));
      this.itens_scene.push({ color: color, x: (pos.x + (x * 2)), y: (pos.y + (y * 2)), z: (pos.z + (z * 2)) });
      window.localStorage.setItem('itens_scene', JSON.stringify(this.itens_scene));
    }
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
      canvas.height = scene.getViewport().height = screen.height;
      this.isFull = true;

    }
  }

}




//Adicionar Controle

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
          var c = Math.cos(lookat.y),
            s = Math.sin(lookat.y);
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