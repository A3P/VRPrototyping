import WebSocketWrapper from '../../WebSocketWrapper';

class ChessAPI {

  constructor(url = CHESS_SOCKET_API_URL) {
    this.ws = new WebSocketWrapper();
    this.ws.connect(url);
  }

  setListenerForMessages(handler) {
    this.ws.setMessageHandler(handler);
  }
}

export default ChessAPI;
