import Piece from './Piece';

class Rook extends Piece {
  initGenericMesh() {
    return super.initBlenderMesh('blenderFiles/rook.json');
  }
}

export default Rook;
