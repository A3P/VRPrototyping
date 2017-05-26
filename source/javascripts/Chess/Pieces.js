import King from './Pieces/King';
import Pawn from './Pieces/Pawn';
import Queen from './Pieces/Queen';
import Knight from './Pieces/Knight';
import Bishop from './Pieces/Bishop';
import Rook from './Pieces/Rook';

const loadGenericPieces = () => {
  const king = new King();
  const pawn = new Pawn();
  const queen = new Queen();
  const knight = new Knight();
  const bishop = new Bishop();
  const rook = new Rook();

  const pieces = [
    king.initGenericMesh(),
    queen.initGenericMesh(),
    pawn.initGenericMesh(),
    knight.initGenericMesh(),
    bishop.initGenericMesh(),
    rook.initGenericMesh()
  ];

  return Promise.all(pieces).then((meshes) => {
    meshes[0].name = 'King';
    meshes[1].name = 'Queen';
    meshes[2].name = 'Pawn';
    meshes[3].name = 'Knight';
    meshes[4].name = 'Bishop';
    meshes[5].name = 'Rook';

    king.init(meshes[0]);
    queen.init(meshes[1]);
    pawn.init(meshes[2]);
    knight.init(meshes[3]);
    bishop.init(meshes[4]);
    rook.init(meshes[5]);

    return {
      King: king,
      Queen: queen,
      Pawn: pawn,
      Knight: knight,
      Bishop: bishop,
      Rook: rook,
    };
  });
};

export default loadGenericPieces;
