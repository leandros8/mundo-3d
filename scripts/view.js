class View {

  #FPS = 60;
  #canvas;
  #scene;
  #animation;

  setScene = function (scene) {
    this.#scene = scene;
  }

  setCanvas = function (canvas) {
    this.#canvas = canvas;
  };

  setFPS = function (fps) {
    this.#FPS = fps;
  };

  frameAnimation = function (callback) {
    this.#animation = window.setInterval(callback, 1000 / this.#FPS);
  };

  stopAnimation = function () {
    window.clearInterval(this.#animation);
  }

  getClick = function (x, y) {
    var itens = this.#scene.getItens();

    for (var i = itens.length - 1; i >= 0; --i) {
      var item = itens[i];
      if (item.disable) continue;

      var style = item.getStyle();

      var coords = item.getCoords();

      //search point
      if (style.type == Entity.TYPEPOINTS)
        for (var j = 0; j < coords.points.length; ++j) {
          let p = coords.points[j];
          if (this.context.isPointInPath(p.path, x, y)) {
            return {
              type: Entity.TYPEPOINTS,
              entity: item,
              ind: j
            }
          };
        }

      // search edges
      if (style.type == Entity.TYPELINES)
        for (var j = item.getEdges().length - 1; j >= 0; --j) {
          let edge = item.getEdges()[j];
          if (this.context.isPointInStroke(edge.path, x, y)) {
            return {
              type: Entity.TYPELINES,
              entity: item,
              ind: j
            }
          };
        }

      //search polygonus
      if (style.type == Entity.TYPEPOLYGONUS)
        for (var j = coords.polygonus.length - 1; j >= 0; --j) {
          let poly = coords.polygonus[j];
          if (this.context.isPointInPath(poly.path, x, y)) {
            return {
              type: Entity.TYPEPOLYGONUS,
              entity: item,
              ind: poly.id
            }
          };
        }

    } 
                
  };

  render = function () {
    if(this.#scene == null)throw new Error("Scene not defined");
    if(this.#canvas == null)throw new Error("Canvas not defined");

    var itens = this.#scene.getItens();
    var ctx = this.context = this.#canvas.getContext("2d");
    var vp = this.#scene.getViewport();
    ctx.clearRect(vp.x, vp.y, vp.width, vp.height);

    ctx.beginPath();
    ctx.moveTo(vp.x, vp.y);
    ctx.lineTo(vp.x + vp.width, vp.y);
    ctx.lineTo(vp.x + vp.width, vp.y + vp.height);
    ctx.lineTo(vp.x, vp.y + vp.height);
    ctx.lineTo(vp.x, vp.y);
    ctx.clip();
    ctx.stroke();

    //renderizar itens
    for (var i = 0; i < itens.length; ++i) {
      var item = itens[i];
      if (item.disable) continue;
      let pcoords = item.getCoords().points;
      let vcoords = item.getCoords().polygonus;
      let style = item.getStyle();

      ctx.fillStyle = "rgb(" + style.color + ")";
      ctx.strokeStyle = "rgb(" + style.color + ")";

      //renderizar points
      if (style.type == Entity.TYPEPOINTS)
        for (var j = 0; j < pcoords.length; ++j) {
          var p = pcoords[j];
          if (p.z <= 0) continue;
          var path = p.path = new Path2D();
          path.arc(p.x, p.y, style.size / (p.z * 0.2), 0, Math.PI * 2);
          ctx.fill(path);

        }

      //renderizar linhas
      if (style.type == Entity.TYPELINES)
        for (var j = 0; j < item.getEdges().length; ++j) {
          var edge = item.getEdges()[j];
          var a = pcoords[edge.a], b = pcoords[edge.b];
          if (a.z <= 0 && b.z <= 0) continue;
          var path = edge.path = new Path2D();
          var ind = (a.z + b.z) * 0.5;
          if (ind < 1) ind = 1;
          ctx.lineWidth = style.size / ind;
          path.moveTo(a.x, a.y);
          path.lineTo(b.x, b.y);
          ctx.stroke(path);
        }

      //renderizar polygonus
      if (style.type == Entity.TYPEPOLYGONUS)
        for (var j = 0; j < vcoords.length; ++j) {

          let poly = vcoords[j];
          let path = poly.path = new Path2D();
          let vert = poly.vertices;

          var a = pcoords[vert[0]],
            b = pcoords[vert[1]],
            c = pcoords[vert[2]],
            d = pcoords[vert[3]];

          if (!style.twoSides && poly.wordCoords.z > 0) continue;

          let endX = vp.x + vp.width;
          let endY = vp.y + vp.height;

          if (a.z < 1 && b.z < 1 && c.z < 1 && d.z < 1) continue
          if (a.x < vp.x && b.x < vp.x && c.x < vp.x && d.z < vp.x) continue
          if (a.y < vp.y && b.y < vp.y && c.y < vp.y && d.y < vp.y) continue
          if (a.x > endX && b.x > endX && c.x > endX && d.x > endX) continue;
          if (a.y > endY && b.y > endY && c.y > endY && d.y > endY) continue;
          if (a.z > vp.z) continue;

          path.moveTo(a.x, a.y);
          path.lineTo(b.x, b.y);
          path.lineTo(c.x, c.y);
          path.lineTo(d.x, d.y);



          if (poly.texture || item.texture && item.texture.src) {

            var img = document.createElement("img");
            let dw = [0, 0, 1, 1]

            if(poly.texture)
              img.src = poly.texture;
            else{  
              let tx = item.texture;
              let uv = (poly.texture_uv ? poly.texture_uv : [0, 0])
              img.src = tx.src;
              dw = [-uv[0], -uv[1], (tx.w ? tx.w : 1), (tx.h ? tx.h : 1)]
            }

            ctx.save();
              ctx.beginPath();
                ctx.moveTo(a.x, a.y)
                ctx.lineTo(b.x, b.y);
                ctx.lineTo(c.x, c.y);
                ctx.clip();
              ctx.closePath();
              ctx.setTransform(
                b.x - a.x, b.y - a.y,
                c.x - b.x, c.y - b.y,
                a.x, a.y);
              ctx.drawImage(img, dw[0], dw[1], dw[2], dw[3]);
            ctx.restore();

            ctx.save();
              ctx.beginPath();
                ctx.moveTo(a.x, a.y)
                ctx.lineTo(c.x, c.y);
                ctx.lineTo(d.x, d.y);
                ctx.clip();
              ctx.closePath();
              ctx.setTransform(
                c.x - d.x, c.y - d.y,
                d.x - a.x, d.y - a.y,
                a.x, a.y);
                ctx.drawImage(img, dw[0], dw[1], dw[2], dw[3]);
            ctx.restore();

          }else{
            let color = style.color;
            if (poly.color) color = poly.color;

            let z = -poly.wordCoords.z;
            let bri = style.shine;

            color = [
              Math.max(Math.round(color[0] * z * bri), 0),
              Math.max(Math.round(color[1] * z * bri), 0),
              Math.max(Math.round(color[2] * z * bri), 0)
            ];

            ctx.fillStyle = 'rgb(' + color + ')';
            ctx.fill(path);
          }


        }
        
    }

  }

}
