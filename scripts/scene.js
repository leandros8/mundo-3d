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
      let coords = {points: [], edges: [], polygonus: []};
      item.z = 0;

      //renderizar pontos
      item.getPoints().map(point => {
        var out = item.transform(point.x, point.y, point.z);
        out = this.getCamera().transform(
          position.x + out.x - cposition.x,
          position.y + out.y - cposition.y,
          position.z + out.z - cposition.z);

        //usado para consertar rotação ao mover
        var mat2 = new Matrix();
        mat2.rotate(out.y * 0.001, out.x * 0.001, 0);
        out = mat2.transform(out.x, out.y, out.z);

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
        poly.wordCoords = this.getCamera().transform(out.x, out.y, out.z);
        coords.polygonus.push(poly);
      })

      coords.polygonus.sort((a, b) => {

        let ca = a.coords;
        let cb = b.coords;

        if(ca.z < cb.z)return 1;
        else if(ca.z > cb.z)return -1
        else if(ca.y < cb.y)return -1;
        else if(ca.y > cb.y)return 1;
        else if(ca.x > cb.x)return -1;
        else return 1;
      });

      item.setCoords(coords);
    }

    this.getItens().sort((a, b) => {
      return (a.z < b.z ? 1 : -1);
    })


  };

}
