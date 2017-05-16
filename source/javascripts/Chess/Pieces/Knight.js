import Piece from './Piece';


class Knight extends Piece {
  initGenericMesh() {
    return super.initBlenderMesh('blenderFiles/knight.json');
  }
}

export default Knight;