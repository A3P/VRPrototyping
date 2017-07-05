import WebSocketWrapper from 'Core/WebSocket/WebSocketWrapper';
import Request from 'Core/Requests/Request';

class ChessAPI {

  constructor(url = CHESS_SOCKET_API_URL, gameID) {
    this.ws = new WebSocketWrapper();
    this.ws.connect(url + gameID);
    this.gameID = gameID;
    console.log(url + gameID);
  }

  setListenerForMessages(handler) {
    this.ws.setMessageHandler(handler);
  }

  static getCurrentGames() {
    return Request('GET', 'https://utils.freerunningtech.com/list_games');
  }
}

export default ChessAPI;
