import * as THREE from 'three';

// Positions pieces and adds them to the board based on the board state.
class BoardController {

  /*
    The chess pieces can use any geometry and material as long as
    they are positioned center and above level with the z-axis in the blend file.

    The keys used for the pieces have to match the ones used in boardState.
    The array for every key uses the first index for
    player_one(white) and the second index for player_two(black).

    Format for the passed through pieces:
    ***************************************
    const pieces = {
      "Pawn": [whitePawn, blackPawn],
      "Bishop": [whiteBishop, blackBishop],
    };
    ***************************************
  */
  init(pieces, board) {
    this.pieces = pieces;
    this.board = board;

    this.boardPlacements = [[], [], [], [], [], [], [], []];
    this.animationQueue = [];
    this.animationProgress = 0.0;
    this.animationSpeed = 0.04;

    this.squareX = board.x / 8;
    this.squareY = board.y;
    this.squareZ = board.z / 8;

    const distanceFromCentre = 3.5;
    this.origin = new THREE.Vector3(
      -distanceFromCentre * this.squareX,
      this.squareY,
      distanceFromCentre * this.squareZ
    );
  }

  /*
   Iterates over the squares in the board state and
   adds each square's piece to the board

   Format for the board state:
   *************************************************
   const boardState = [
     {'piece': 'Pawn', 'owner': 0, 'x': 0, 'y':5},
     {'piece': 'Queen', 'owner': 1, 'x': 7, 'y':2},
     {'piece': 'Bishop', 'owner': 1, 'x': 3, 'y':7},
     {'piece': 'Knight', 'owner': 0, 'x': 1, 'y':0},
   ];
   *************************************************
  */
  placePieces(boardState) {
    // Board is cleared and all the pieces are added to the board anew
    this.board.clearBoard();
    this.animationQueue = [];
    this.boardPlacements = [[], [], [], [], [], [], [], []];
    this.animationProgress = 0.0;
    this.boardState = boardState;

    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i].piece !== '') {
        const piece = this.pieces[boardState[i].piece][boardState[i].owner];
        const pieceClone = piece.getMesh().clone();

        pieceClone.position.copy(
          this.calculatePosition(boardState[i].x, boardState[i].y)
        );

        this.boardPlacements[boardState[i].x][boardState[i].y] = pieceClone;
        this.board.addPiece(pieceClone);
      }
    }
  }

  calculatePosition(row, column) {
    const position = new THREE.Vector3().copy(this.origin);
    position.x += row * this.squareX;
    position.z += -column * this.squareZ;
    return position;
  }

  /*
    Format for moves:
    ******************
    const moves = [
      {source: [0, 1], destination: [0, 2]},
      {source: [1, 1], destination: [1, 3]},
      {source: [1, 0], destination: [2, 2]},
      {source: [1, 7], destination: [2, 5]},
    ]
  */
  movePiece(data) {
    this.boardState = data.board_state;
    data.moves.forEach((move) => {
      if (this.getPiece(move.source)) {
        const animation = {};

        animation.destination = this.calculatePosition(
            move.destination[0],
            move.destination[1]
        );

        animation.source = this.calculatePosition(
          move.source[0],
          move.source[1]
        );

        this.board.removePiece(
          this.getPiece(move.destination)
        );

        this.boardPlacements[move.destination[0]][move.destination[1]] =
          this.getPiece(move.source);

        this.boardPlacements[move.source[0]][move.source[1]] = undefined;
        animation.piece = this.getPiece(move.destination);

        if (move.captured.length === 2) {
          this.board.removePiece(
            this.getPiece(move.captured)
          );
          this.boardPlacements[move.captured[0]][move.captured[1]] = undefined;
        }

        if (animation.piece !== undefined) {
          this.animationQueue.push(animation);
        }
      }
    });
  }

  getPiece(coordinates) {
    return this.boardPlacements[coordinates[0]][coordinates[1]];
  }

  getPieces() {
    return this.boardPlacements;
  }

  getBoard() {
    return this.board;
  }

  animateMovement() {
    if (this.animationQueue.length !== 0) {
      const move = this.animationQueue[0];
      if (this.animationProgress < 1.0) {
        move.piece.position.lerpVectors(
          move.source,
          move.destination,
          this.animationProgress
        );
        this.animationProgress += this.animationSpeed;
      } else {
        this.animationProgress = 0.0;
        /*
          Due to the floating point inaccuracy, the position
          of the piece will be slightly off during its
          path of animation (not visually noticable).
          Once the animation is over the piece is positioned at
          its exact coordinates for consistency.
        */
        move.piece.position.copy(move.destination);
        this.animationQueue.shift();
      }
    }
  }

}

export default BoardController;
