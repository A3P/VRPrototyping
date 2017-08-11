/* eslint class-methods-use-this: ["error", { "exceptMethods": ["initGenericBlender"] }] */
import ChessAPI from './API/ChessAPI';
import Board from './Board';
import { loadGenericPieces, makeBlackAndWhitePieces } from './Pieces';
import BoardController from './BoardController';
import InitialPieceState from './InitialPieceState';

class Chess {
  constructor(scene) {
    this.scene = scene;
    this.playerOne = null;
    this.playerTwo = null;
    this.api = new ChessAPI();
    this.pieceSet = null;
    this.board = null;
    this.gameID = null;
    this.boardcontroller = new BoardController();
    this.setBoard = false;
  }

  /**
   * initGenericBlender() returns a promise that when resolved
   * has an object of all pre-made blender chess pieces and board
   */
  initGenericBlender() {
    const board = new Board();
    board.initBoard();
    const chessPromises = [loadGenericPieces()];
    return Promise.all(chessPromises).then((chessArray) => {
      chessArray[0].Board = board;
      return chessArray[0];
    });
  }

  /**
   * init() initializes the chess game
   * based on the passed in chessSet object
   */
  init(chessSet) {
    this.pieceSet = makeBlackAndWhitePieces(chessSet);

    this.board = chessSet.Board;
    this.orientatePieceSet();
    this.scene.add(this.board.getBoard());
    this.initializePlayers();
    this.initializeSet();
  }

  orientatePieceSet() {
    // These are magic numbers, essentially trialed to be positioned
    // as best as possible until we have a VR controller with
    // positional tracking
    this.board.getBoard().position.set(0, -12, -44);
    this.board.getBoard().rotateY(1.60);
    this.board.getBoard().rotateZ(0.3);
  }

  initializeSet() {
    this.boardcontroller.init(this.pieceSet, this.board);
    this.boardcontroller.placePieces(InitialPieceState.board_state);
  }

  initializePlayers() {
    console.log('Players ', this.playerOne, this.playerTwo);
    // TODO once server is ready we can have this for on
    // socket connection grab player meta
  }

  play(gameID = null) {
    if (gameID) {
      this.gameID = gameID;
      this.api = new ChessAPI(`${CHESS_SOCKET_API_URL}${gameID}`);
    }
    console.log('Playing!');
    this.boardSet = true;
    this.api.setListenerForMessages(this.messageHandler.bind(this));
  }

  messageHandler(msg) {
    const data = JSON.parse(msg.data);
    if (this.boardSet) {
      this.boardcontroller.placePieces(data.board_state);
      this.boardSet = false;
    } else {
      this.boardcontroller.movePiece(data);
    }
  }
}

export default Chess;
