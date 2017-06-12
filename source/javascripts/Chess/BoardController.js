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

    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i].piece !== '') {
        const piece = this.pieces[boardState[i].piece][boardState[i].owner];
        const pieceClone = piece.getMesh().clone();

        this.positionPiece(pieceClone, boardState[i].x, boardState[i].y);
        this.board.addPiece(pieceClone);
      }
    }
  }

  positionPiece(piece, row, column) {
    piece.position.copy(this.origin);
    piece.position.x += row * this.squareX;
    piece.position.z += -column * this.squareZ;
  }

}

export default BoardController;
