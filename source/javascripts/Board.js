import blendLoad from './Blender';
import Square from './Square'
import * as THREE from 'three';


class Board {

  initBoard() {
    this.rows = [ [], [], [], [], [], [], [], [] ];
    this.blackSquare = new Square();
    return this.blackSquare.initSquareMesh('javascripts/square.json').then((mesh) => {
      this.initBlackSquare(mesh);
      this.initWhiteSquare();
      this.createRows();
    });
  }

  initBlackSquare(mesh) {
    this.blackSquare.init(mesh);
    this.blackSquare.getMesh().material.color.set('black');
  }

  initWhiteSquare() {
    this.whiteSquare = new Square();
    this.whiteSquare.init(new THREE.Mesh(this.blackSquare.geometry));
  }


  createRows() {
    for(var row = 0; row < 8; row++) {
      for(var column = 0; column < 8; column++) {
        this.rows[row].push(
          this.cloneSquare(row, column)
        );
      }
    }
  }

  cloneSquare(row, column) {
    if( (row + column) % 2 === 0) {
      return this.blackSquare.getMesh().clone();
    } else {
      return this.whiteSquare.getMesh().clone();
    }
  }

}

export default Board;
