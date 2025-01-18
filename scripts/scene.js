class Scene {

  #camera = new Matrix();
  #viewport = { width: 950, heigth: 500, x: 0, y: 0, z: 50 };
  #itens = [];

  getCamera = function () {
    return this.#camera;
  }

  getViewport = function () {
    return this.#viewport;
  }

  getItens = function () {
    return this.#itens;
  }

  addItem = function (item, x, y, z) {
    if (x != null && y != null && z != null) item.setPosition(x, y, z);
    this.#itens.push(item);
    item.setId(this.#itens.length);
    return this;
  };

  remove = function (item) {
    this.#itens = this.#itens.filter(e => {
      if (e != item) return e;
    })
  }

  setViewport = function (vp) {
    this.#viewport = vp;
  }

  setCamera = function (matrix) {
    this.#camera = matrix;
  }

  render = function () {
    var vp = this.getViewport();
    var cposition = this.getCamera().getPosition();

    for (var i = 0; i < this.getItens().length; ++i) {
      var item = this.getItens()[i];
      if (item.disable) continue;
      var position = item.getPosition();
      let coords = { points: [], edges: [], polygonus: [] };
      item.z = 0;

      let t = window.teste = item.teste = {
        x: position.x - cposition.x,
        y: position.y - cposition.y,
        z: position.z - cposition.z};
      window.sql = item.sql = Math.sqrt(t.x*t.x + t.y * t.y);

      item.math_dist = new Matrix();
      let rad = 0.5;
      let x = Math.max(Math.min((position.x - cposition.x), rad), -rad);
      let y = Math.max(Math.min((position.y - cposition.y), rad), -rad);
      item.math_dist.rotate(y * 0.001, x * 0.001, 0);

      //renderizar pontos
      item.getPoints().map(point => {

        let out = item.math_dist.transform(point.x, point.y, point.z);
        out = item.transform(out.x, out.y, out.z);
        out = this.getCamera().transform(
          position.x + out.x - cposition.x,
          position.y + out.y - cposition.y,
          position.z + out.z - cposition.z);

        var dist = (out.z) * 0.07;
        var size = (vp.width + vp.height) * 0.06;

        if (dist <= 0) dist = 0.0001;
        //dist = 2;
        coords.points.push({
          x: vp.width / 2 + out.x * size / dist,
          y: vp.height / 2 + -out.y * size / dist,
          z: (out.z < 0) ? 0 : out.z,
          path: null,
        });

        item.z += out.z;
      });

      //renderizar polygonus
      item.getPolygonus().map((e, l) => {
        let poly = Util.cloneObject(e);
        let dir = poly.direction;
        poly.id = l;

        let md = item.math_dist.transform(dir.x, dir.y, dir.z);
        var out = poly.coords = item.transform(md.x, md.y, md.z);
        poly.wordCoords = this.getCamera().transform(out.x, out.y, out.z);
        coords.polygonus.push(poly);
      })

      coords.polygonus.sort((a, b) => {
        let ca = a.wordCoords;
        let cb = b.wordCoords;
        return (ca.z > cb.z) ? -1 : 1;
      });

      item.setCoords(coords);
    }

    this.getItens().sort((a, b) => {

      return (a.sql < b.sql ? 1 : -1);
    })


  };

}


//Math.sqrt(2*2 + 2*2 + 2*2);