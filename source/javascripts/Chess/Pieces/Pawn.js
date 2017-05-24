import Piece from './Piece';

class Pawn extends Piece {
  initGenericMesh() {
    return super.initBlenderMesh('blenderFiles/pawn.json');
  }
}

export default Pawn;
