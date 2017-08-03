import * as THREE from 'three';
import Request from 'Core/Requests';

class PieceControls {

  constructor(renderer, boardController, camera, gameID = null) {
    this.renderer = renderer;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = camera;
    this.boardController = boardController;
    this.pieceSelected = true;
    this.sourceCoordinates = [];
    this.gameID = gameID;
    document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
  }

  onDocumentMouseDown(event) {
    event.preventDefault();

    let objects = [];

    if (this.pieceSelected) {
      objects.push(this.boardController.getBoard().mesh);
    } else {
      objects = this.getPieces();
    }

    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(objects);
    let clicked;

    if (intersects.length > 0) {
      clicked = intersects[0];
      const coordinates = this.getSquare(clicked.point);

      if (this.pieceSelected) {
        this.sendMove(this.sourceCoordinates, coordinates);
        this.setPieceSelected(!this.pieceSelected);
      } else {
        this.sourceCoordinates = coordinates;
        this.setPieceSelected(!this.pieceSelected);
      }

    } else {
      this.setPieceSelected(false);
    }
  }

  getPieces() {
    let objects = [];
    this.boardController.getPieces().forEach((column) => {
      objects = objects.concat(column);
    });

    return objects.filter((element) => {
      return element !== undefined;
    });
  }

  setPieceSelected(booleanValue) {
    this.pieceSelected = booleanValue;
  }

  getSquare(point) {
    const globalXBoardPosition = this.boardController.getBoard().mesh.position.x;
    const globalZBoardPosition = this.boardController.getBoard().mesh.position.z;
    const boardLength = this.boardController.getBoard().boardLength;
    const xConversionRate = globalXBoardPosition + (boardLength/2);
    const zConversionRate = globalZBoardPosition + (boardLength/2);
    const file = Math.floor((point.z - zConversionRate) / -4);
    const rank = Math.floor((point.x - xConversionRate) / -4);
    return [file, rank];
  }

  sendMove(source, destination) {
    const move = { src: source.join(''), dst: destination.join('') };
    Request('POST', `${API_BASIS_URL}${this.gameID}/move`, JSON.stringify(move)).then((response) => {
      console.log(response);
    });
  }

  setGameID(gameID) {
    this.gameID = gameID;
  }
}

export default PieceControls;
