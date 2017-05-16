/* eslint class-methods-use-this: ["error", { "exceptMethods": ["initBlenderMesh"] }] */
import blendLoad from '../../Blender';

class Pawn {

  initBlenderMesh(path) {
    return blendLoad(path);
  }

  init(mesh, position, color = 'green') {
    this.mesh = mesh;

    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.material.color.set(color);
  }

  getMesh() {
    return this.mesh;
  }

  setPosition(position) {
    this.mesh.setPosition(position.x, position.y, position.z);
  }

}

export default Pawn;