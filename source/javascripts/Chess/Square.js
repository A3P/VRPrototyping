import blendLoad from './../Blender';

class Square {

  static initSquareMesh(path) {
    return blendLoad(path);
  }

  init(mesh) {
    this.mesh = mesh;
  }

  getMesh() {
    return this.mesh;
  }

}

export default Square;
