class Matrix {

  #data = [1, 0, 0, 0, 1, 0, 0, 0, 1]
  #position = { x: 0, y: 0, z: 0 };
  #scale = { x: 1, y: 1, z: 1 };
  #lookat = { x: 0, y: 0, z: 0 };

  constructor(data, lookat) {
    if (data) this.#data = data;
    if (lookat) this.#lookat = lookat;
  }

  /*translate = function(x, y, z) {
    this.#position.x += x;
    this.#position.y += y;
    this.#position.z += z;
  }*/

translate = function(x, y, z) {
    let m = this.#data.slice();
    this.#position.x = m[0] * x + m[3] * y + m[6] * z + this.#position.x;
    this.#position.y = m[1] * x + m[4] * y + m[7] * z + this.#position.y;
    this.#position.z = m[2] * x + m[5] * y + m[8] * z + this.#position.z;
  }

  rotate = function(x, y, z) {
    var c = Math.cos(x), s = Math.sin(x), m = this.#data.slice();
    this.#data[3] = m[3] * c + m[6] * s;
    this.#data[4] = m[4] * c + m[7] * s;
    this.#data[5] = m[5] * c + m[8] * s;
    this.#data[6] = m[6] * c - m[3] * s;
    this.#data[7] = m[7] * c - m[4] * s;
    this.#data[8] = m[8] * c - m[5] * s;
    this.#lookat.x += x;
    c = Math.cos(y), s = Math.sin(y), m = this.#data.slice();
    this.#data[0] = m[0] * c + m[6] * s;
    this.#data[1] = m[1] * c + m[7] * s;
    this.#data[2] = m[2] * c + m[8] * s;
    this.#data[6] = m[6] * c - m[0] * s;
    this.#data[7] = m[7] * c - m[1] * s;
    this.#data[8] = m[8] * c - m[2] * s;
    this.#lookat.y += y;
    c = Math.cos(z), s = Math.sin(z), m = this.#data.slice();
    this.#data[0] = m[0] * c + m[3] * s;
    this.#data[1] = m[1] * c + m[4] * s;
    this.#data[2] = m[2] * c + m[5] * s;
    this.#data[3] = m[3] * c - m[0] * s;
    this.#data[4] = m[4] * c - m[1] * s;
    this.#data[5] = m[5] * c - m[2] * s;
    this.#lookat.z += z;
  }

  resetData = function(){
    this.#data = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }

  setScale = function(x, y, z) {
    this.#scale.x = x;
    this.#scale.y = y;
    this.#scale.z = z;
  }

  setPosition = function(x, y, z) {
    this.#position.x = x;
    this.#position.y = y;
    this.#position.z = z;
  }

  transform = function(x, y, z) {
    var m = this.#data.slice();
    return {
      x: m[0] * x + m[3] * y + m[6] * z,
      y: m[1] * x + m[4] * y + m[7] * z,
      z: m[2] * x + m[5] * y + m[8] * z,
    }
  }
  
  getData = function(){
    return this.#data;
  }

  getPosition = function() {
    return this.#position;
  }

  getSize = function() {
    return this.#scale;
  }

  getLookat = function() {
    return this.#lookat;
  }

  clone = function() {
    var item = new Matrix(Util.cloneObject(this.getData()), Util.cloneObject(this.getLookat()));
    item.setPosition(this.cloneObject(this.#position));
    item.scale(this.#scale.x, this.#scale.y, this.#scale.z)
    return item;
  }

  toString = function() {
    return ("Matrix 3D and Position");
  }

}
