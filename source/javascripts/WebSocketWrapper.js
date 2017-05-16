class WebSocketWrapper {
  constructor() {
    this.socket = {};
  }

  connect(url = 'ws://localhost:8080', protocols = []) {
      this.socket = new WebSocket(url, protocols);

      this.socket.onopen = () => {
        this.socket.send('Simple Send');
      };

      this.socket.onerror = (err) => {
        console.log('Error: ', err);
      };

      this.socket.onclose = (event) => {
        console.log('Closing: ', JSON.stringify(event));
      };
  }


  disconnect() {
    console.log('Disconnecting...');
    this.socket.close();
  }
}

export default WebSocketWrapper;