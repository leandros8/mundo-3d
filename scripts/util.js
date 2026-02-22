
const Util = {

  cloneObject: function (object) {
    if (object == null) return null;

    if (object instanceof Array) {
      var arr = [];
      for (var i = 0; i < object.length; ++i)
        arr.push(this.cloneObject(object[i]));
      return arr;
    };

    if (object instanceof Object) {
      var item = {};
      //var arr = Object.entries(object);console.log(arr);
      var arr = Object.keys(object);
      for (var i = 0; i < arr.length; ++i) {
        var key = arr[i];
        item[this.cloneObject(key)] = this.cloneObject(object[key]);
      }
      return item
    };

    if (typeof object == "string") {
      return (object + "");
    };

    if (typeof object == "number") {
      return (object + 0);
    };

    if (typeof object == "boolean") {
      if (object) return true;
      else return false;
    };
  },

}

const Textures = {

  createCube: function () {
    var item = new Entity();
    item.setName("Cube");
    item.setPoints([{ x: -1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }, { x: 1, y: -1, z: 1 }, { x: -1, y: -1, z: 1 }, { x: -1, y: 1, z: -1 }, { x: 1, y: 1, z: -1 }, { x: 1, y: -1, z: -1 }, { x: -1, y: -1, z: -1 }]);
    item.setEdges([{ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 0 }, { a: 4, b: 5 }, { a: 5, b: 6 }, { a: 6, b: 7 }, { a: 7, b: 4 }, { a: 0, b: 4 }, { a: 1, b: 5 }, { a: 2, b: 6 }, { a: 3, b: 7 }]);
    item.setPolygonus([{ vertices: [1, 0, 3, 2] }, { vertices: [0, 4, 7, 3] }, { vertices: [4, 5, 6, 7] }, { vertices: [5, 1, 2, 6] }, { vertices: [0, 1, 5, 4] }, { vertices: [7, 6, 2, 3] }]);
    return item;
  },

  createPyramid: function () {
    var item = new Entity();
    item.setName("Pyramid");
    item.setPoints([{ x: 0, y: 1, z: 0 }, { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 }, { x: 1, y: -1, z: -1 }, { x: -1, y: -1, z: -1 }]);
    item.setEdges([{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }, { a: 4, b: 1 }]);
    item.setPolygonus([{ vertices: [0, 0, 1, 2] }, { vertices: [0, 0, 2, 3] }, { vertices: [0, 0, 3, 4] }, { vertices: [0, 0, 4, 1] }, { vertices: [4, 3, 2, 1] }]);
    return item;
  },

  createPlane: function (w, h) {
    var item = new Entity();
    item.setName("Plane");

    var points = [],
      edges = [],
      polygonus = [];

    var ind = 0;

    for (var z = h / 2; z >= -h / 2; --z) {
      for (var x = -w / 2; x <= w / 2; ++x) {
        points.push({ x: x, y: 0, z: z });
        if (x > -w / 2) edges.push({ a: ind, b: ind - 1 });
        if (z < h / 2) edges.push({ a: ind, b: ind - w - 1 });
        if (x > -w / 2 && z < h / 2) polygonus.push({ vertices: [ind - w - 2, ind - w - 1, ind, ind - 1] });
        ++ind;
      }
    }

    item.setPoints(points);
    item.setEdges(edges);
    item.setPolygonus(polygonus);

    return item;
  },

}
