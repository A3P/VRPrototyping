import * as THREE from 'three';
import Square from './Square';

/*
  The Board class creates a group of Square Meshes to form a board.

  Board.init returns a promise that is resolved when the board is fully created.

  Board can be created and added to your scene as follows:
  *****************************
  import Board from './Board';

  const board = new Board();
  board.initBoard().then( () => {
    board.mesh.position.set(x, controls.userHeight, z);
    scene.add(board.mesh);
  }
  ******************************
*/

class Board {

  initBoard() {
    this.rows = [[], [], [], [], [], [], [], []];
    this.mesh = new THREE.Group();
    this.blackSquare = new Square();
    // Board is created once the Json Loader loads the blend file.
    return Square.initSquareMesh('blenderFiles/square.json').then((mesh) => {
      this.initBlackSquare(mesh);
      this.setBoundingBox();
      this.initWhiteSquare();
      this.createBoard();
    });
  }

  initBlackSquare(mesh) {
    this.blackSquare.init(mesh);
    this.blackSquare.getMesh().material.color.setHex('0x000000');
  }

  // White Square is created using the same geometry as Black Square to
  // save us from having to use Json Loader more than once
  initWhiteSquare() {
    this.whiteSquare = new Square();
    this.whiteSquare.init(new THREE.Mesh(this.blackSquare.getMesh().geometry));
    this.whiteSquare.getMesh().material.color.setHex('0xFFFFFF');
  }

  // Bounding Box determines the length of each axis in a Square.
  setBoundingBox() {
    this.boundingBox = new THREE.Box3().setFromObject(this.blackSquare.getMesh());
    this.x = this.boundingBox.max.x - this.boundingBox.min.x;
    this.y = this.boundingBox.max.y - this.boundingBox.min.y;
    this.z = this.boundingBox.max.z - this.boundingBox.min.z;
  }

  // Adds the Squares on the chessboard to a 2-dimensional array.
  createBoard() {
    const squaresPerLine = 8;
    for (let row = 0; row < squaresPerLine; row++) {
      for (let column = 0; column < squaresPerLine; column++) {
        this.rows[row].push(
          this.cloneSquare(row, column)
        );
        this.positionSquare(row, column);
        this.mesh.add(this.rows[row][column]);
      }
    }
  }

  // Alternates between cloning white and black squares for the board.
  cloneSquare(row, column) {
    if ((row + column) % 2 === 0) {
      return this.whiteSquare.getMesh().clone();
    }
    return this.blackSquare.getMesh().clone();
  }

  // Positions the square based on their location on the board.
  positionSquare(row, column) {
    this.rows[row][column].position.set(this.x * row, 0, this.z * column);
  }

}

export default Board;
