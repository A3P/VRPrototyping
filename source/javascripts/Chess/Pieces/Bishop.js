import Piece from './Piece';

class Bishop extends Piece {
  initGenericMesh() {
    return super.initBlenderMesh('blenderFiles/bishop.json');
  }
}

export default Bishop;
