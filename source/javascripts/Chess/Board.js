import * as THREE from 'three';
import { fragmentShader, vertexShader } from './BoardShader';

class Board {

  initBoard() {
    this.boardLength = 32;
    this.geometry = new THREE.BoxGeometry(this.boardLength, 0, this.boardLength);
    this.createShader();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.setBoundingBox();
  }

  createShader() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader,
      fragmentShader
    });
  }

  // Bounding Box is used to determine the length of each axis in the board
  setBoundingBox() {
    this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
    this.x = this.boundingBox.max.x - this.boundingBox.min.x;
    this.y = this.boundingBox.max.y - this.boundingBox.min.y;
    this.z = this.boundingBox.max.z - this.boundingBox.min.z;
  }

  addPiece(piece) {
    this.mesh.add(piece);
  }

  removePiece(piece) {
    this.mesh.remove(piece);
  }

  getBoard() {
    return this.mesh;
  }

  clearBoard() {
    for (let i = (this.mesh.children.length - 1); i >= 0; i--) {
      this.removePiece(this.mesh.children[i]);
    }
  }

}

export default Board;
