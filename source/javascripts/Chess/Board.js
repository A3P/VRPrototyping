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
    board.getBoard().position.set(x, controls.userHeight, z);
    scene.add(board.getBoard());
  });
  ******************************
*/

class Board {

  initBoard() {
    this.squares = [[], [], [], [], [], [], [], []];
    this.group = new THREE.Group();
    this.blackSquare = new Square();
    // Board is created once the Json Loader loads the blend file
    return Square.initSquareMesh('blenderFiles/square.json').then((mesh) => {
      this.initBlackSquare(mesh);
      this.setBoundingBox();
      this.initWhiteSquare();
      this.createSquareArray();
    });
  }

  initBlackSquare(mesh) {
    this.blackSquare.init(mesh);
    this.blackSquare.getMesh().material.color.setHex('0x000000');
  }

  /*
    White Square is created using the same geometry as Black Square to
    save us from having to use Json Loader more than once
  */
  initWhiteSquare() {
    this.whiteSquare = new Square();
    this.whiteSquare.init(new THREE.Mesh(this.blackSquare.getMesh().geometry));
    this.whiteSquare.getMesh().material.color.setHex('0xFFFFFF');
  }

  // Bounding Box is used to determine the length of each axis in a Square
  setBoundingBox() {
    this.boundingBox = new THREE.Box3().setFromObject(this.blackSquare.getMesh());
    this.x = this.boundingBox.max.x - this.boundingBox.min.x;
    this.y = this.boundingBox.max.y - this.boundingBox.min.y;
    this.z = this.boundingBox.max.z - this.boundingBox.min.z;
  }

  // Adds the Squares on the chessboard to a 2-dimensional array
  createSquareArray() {
    const squaresPerLine = 8;
    for (let row = 0; row < squaresPerLine; row++) {
      for (let column = 0; column < squaresPerLine; column++) {
        this.squares[row].push(
          this.cloneSquare(row, column)
        );
        this.positionSquare(row, column);
        this.group.add(this.squares[row][column]);
      }
    }
  }

  // Alternates between cloning white and black squares for the board
  cloneSquare(row, column) {
    if ((row + column) % 2 === 0) {
      return this.blackSquare.getMesh().clone();
    }
    return this.whiteSquare.getMesh().clone();
  }

  // Positions the square based on their location on the board
  positionSquare(row, column) {
    this.squares[row][column].position.set(this.x * row, 0, -this.z * column);
  }

  addPiece(piece) {
    this.group.add(piece);
  }

  removePiece(piece) {
    this.group.remove(piece);
  }

  getBoard() {
    return this.group;
  }

  // Returns two dimensional array of squares
  getSquares() {
    return this.squares;
  }

  /*
    Clears the pieces of the board by deleteing its
    children down to 64
  */
  clearBoard() {
    const numberOfSquares = 64;
    for (let i = (this.group.children.length - 1); i > (numberOfSquares - 1); i--) {
      this.removePiece(this.group.children[i]);
    }
  }

}

export default Board;
