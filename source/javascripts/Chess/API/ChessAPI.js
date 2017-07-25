import WebSocketWrapper from 'Core/WebSocketWrapper';

class ChessAPI {

  constructor(url = CHESS_SOCKET_API_URL) {
    this.ws = new WebSocketWrapper();
    this.ws.connect(url);
  }

  setListenerForMessages(handler) {
    this.ws.setMessageHandler(handler);
  }

  disconnectSocket() {
    this.ws.disconnect();
  }

  static getCurrentGames() {
    return Request('GET', `${API_BASIS_URL}list_games`);
  }
}

export default ChessAPI;
