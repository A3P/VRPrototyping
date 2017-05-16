import Piece from './Piece';


class Queen extends Piece {
  initGenericMesh() {
    return super.initBlenderMesh('blenderFiles/queen.json');
  }
}

export default Queen;