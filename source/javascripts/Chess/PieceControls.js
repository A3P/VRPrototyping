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
    this.squareHighlight = this.createSquareHighlight();

    document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
  }

  onDocumentMouseDown(event) {
    event.preventDefault();

    const raycastObjects = this.getRaycastObjects();
    const intersects = this.raycast(event, raycastObjects);
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

  getRaycastObjects() {
    if (this.pieceSelected) {
      return [this.boardController.getBoard().mesh];
    } else {
      return this.getPieces();
    }
  }

  raycast(mouseEvent, raycastObjects) {
    this.mouse.x = (mouseEvent.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(mouseEvent.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObjects(raycastObjects);
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

  setPieceSelected(isSelected) {
    this.pieceSelected = isSelected;
    if (isSelected) {
      this.activateSquareHighlight();
    } else {
      this.deactivateSquareHighlight()
    }
  }

  createSquareHighlight() {
    const square = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.MeshBasicMaterial(
        {
          color: 0xff5f5f,
          side: THREE.DoubleSide
        }
      )
    );

    square.rotateX(1.57);
    return square;
  }

  activateSquareHighlight() {
    this.squareHighlight.position.copy(
      this.boardController.calculatePosition(
        this.sourceCoordinates[0],
        this.sourceCoordinates[1]
      )
    );
    this.squareHighlight.position.y += 0.005;
    this.boardController.getBoard().mesh.add(this.squareHighlight);
  }

  deactivateSquareHighlight() {
    this.boardController.getBoard().mesh.remove(this.squareHighlight);
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
