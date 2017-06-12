/* eslint class-methods-use-this: ["error", { "exceptMethods": ["initGenericBlender"] }] */
import ChessAPI from './API/ChessAPI';
import Board from './Board';
import loadGenericPieces from './Pieces';

class Chess {

  constructor(scene) {
    this.scene = scene;
    this.playerOne = null;
    this.playerTwo = null;
    this.api = new ChessAPI();
    this.chessSet = null;
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
    this.chessSet = chessSet;

    this.initializePlayers();
    this.initializeSet();
  }

  initializeSet() {
    console.log('Set ', this.chessSet);
    // TODO once board controller is ready we can
    // serve the entire chessSet to it
  }

  initializePlayers() {
    console.log('Players ', this.playerOne, this.playerTwo);
    // TODO once server is ready we can have this for on
    // socket connection grab player meta
  }

  play() {
    console.log('Playing!');
    this.api.setListenerForMessages(this.messageHandler.bind(this));
  }

  messageHandler(msg) {
    console.log(msg);
    console.log(this.chessSet);
  }
}

export default Chess;
