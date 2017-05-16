import Piece from './Piece';


class King extends Piece {
  initGenericMesh() {
    return super.initBlenderMesh('blenderFiles/king.json');
  }
}

export default King;