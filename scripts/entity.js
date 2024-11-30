class Entity extends Matrix {

  static TYPEPOINTS = 0.002;
  static TYPELINES = 0.005;
  static TYPEPOLYGONUS = 0.009;

  static decode = function(data){
    
  }

  #id = -1;
  #points = [];
  #edges = [];
  #polygonus = [];
  #coords = {points: [], edges: [], polygonus: []};
  #name = "";
  #style = {
    color: [160, 160, 160],
    size: 15,
    type: Entity.TYPEPOLYGONUS,
    twoSides: true,
    shine: 1
  }

  disable = false;

  constructor(matrix, lookat) {
    if (matrix && lookat) super(matrix, lookat);
    else super();
  }

  getName = function () {
    return this.#name;
  }

  getId = function () {
    return this.#id;
  }

  getPoints = function () {
    return this.#points;
  }

  getEdges = function () {
    return this.#edges;
  }

  getPolygonus = function () {
    return this.#polygonus;
  }

  getCoords = function () {
    return this.#coords;
  }

  getStyle = function () {
    return this.#style;
  }

  setName = function (name) {
    this.#name = name;
  }

  setId = function (id) {
    this.#id = id;
  }

  setPoints = function (itens) {
    this.#points = itens;
  }

  setEdges = function (itens) {
    this.#edges = itens;
  }

  setPolygonus = function (itens) {
    this.#polygonus = itens;
    let p = this.#points;
    itens.map(e => {
      let v = e.vertices;
      let a = p[v[0]], b = p[v[1]], c = p[v[2]], d = p[v[3]];
      e.direction = {
        x: (a.x + b.x + c.x + d.x) / 4,
        y: (a.y + b.y + c.y + d.y) / 4,
        z: (a.z + b.z + c.z + d.z) / 4
      }
    })
  }

  setCoords = function (itens) {
    this.#coords = itens;
  }

  setStyle = function (style) {
    this.#style = style;
  }

  sortEdges = function (calback) {
    this.#edges.sort(calback);
  }

  sortPolygonus = function (calback) {
    this.#polygonus.sort(calback);
  }

  clone = function () {
    var item = new Entity(Util.cloneObject(this.getData()), Util.cloneObject(this.getLookat()));
    item.setName(this.#name + "");
    item.setId(this.#id + 0);
    item.setPoints(Util.cloneObject(this.#points));
    item.setEdges(Util.cloneObject(this.#edges));
    item.setPolygonus(Util.cloneObject(this.#polygonus));
    item.setCoords(Util.cloneObject(this.#coords));
    var position = Util.cloneObject(this.getPosition());
    item.setPosition(position.x, position.y, position.z);
    item.setScale(this.getSize().x, this.getSize().y, this.getSize().z)
    item.setStyle(Util.cloneObject(this.#style));
    return item;
  };

  toString = function () {
    return ("Entity 3D [" + this.#name + "]")
  }

}
