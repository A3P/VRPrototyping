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

  // Positions a clone of the chess piece before it is added to the board
  positionPiece(piece, row, column) {
    /*
      The exact same position as the square is used for the piece except
      the y co-oridnate is raised by the height(y-value) of the board
    */
    const position = new THREE.Vector3().copy(
      this.board.getSquares()[row][column].position
    );
    position.y += this.board.y;
    piece.position.set(position.x, position.y, position.z);
  }

}

export default BoardController;
