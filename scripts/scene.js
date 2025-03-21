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

  getItem = function (x, y, z) {
    let out;
    this.getItens().map(e => {
      let pos = e.getPosition();
      if (pos.x == x && pos.y == y && pos.z == z) out = e;
    });
    return out;
  }

  getItemId = function (id) {
    let out;
    this.getItens().map(e => {if (e.getId() == id) out = e});
    return out;
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

      //gerar sqrt para sort itens
      let e = this.getCamera().transform(position.x - cposition.x, position.y - cposition.y, position.z - cposition.z);
      item.sqrt = Math.sqrt(e.x * e.x + e.y * e.y + e.z * e.z);

      //renderizar pontos
      item.getPoints().map(point => {

        let out = item.transform(point.x, point.y, point.z);
        out = this.getCamera().transform(
          position.x + out.x - cposition.x,
          position.y + out.y - cposition.y,
          position.z + out.z - cposition.z);

        var dist = (out.z) * 0.07;
        var size = (vp.width + vp.height) * 0.06;

        if (dist <= 0) dist = 0.0001;

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
        var out = poly.coords = item.transform(dir.x, dir.y, dir.z);

        //gerar sqrt para sort itens
        let h = this.getCamera().transform(position.x + out.x - cposition.x, position.y + out.y - cposition.y, position.z + out.z - cposition.z);
        poly.sqrt = Math.sqrt(h.x * h.x + h.y * h.y + h.z * h.z);

        poly.wordCoords = this.getCamera().transform(out.x, out.y, out.z);
        coords.polygonus.push(poly);
      })

      //sort polygonus
      coords.polygonus.sort((a, b) => {
        return (a.sqrt > b.sqrt) ? -1 : 1;
      });

      item.setCoords(coords);
    }

    //sort itens
    this.getItens().sort((a, b) => {
      return (a.sqrt < b.sqrt ? 1 : -1);
    })

  };

}