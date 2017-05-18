import WebSocketWrapper from '../../WebSocketWrapper';

class ChessAPI {
  constructor(url = 'ws://localhost:8080') {
    this.ws = new WebSocketWrapper();
    this.ws.connect(url);
  }

  setListenerForMessages(handler) {
    this.ws.setMessageHandler(handler);
  }

}

export default ChessAPI;
