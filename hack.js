var WebSocketClient = require('websocket').client

var client = new WebSocketClient()

client.on('connect', (connection) => {
  console.log('WebSocket Client Connected')

  function toggleRelay () {
    if (connection.connected) {
      connection.send(JSON.stringify({
        type: 'toggleRelay',
        data: JSON.stringify({
          pin: 12
        })
      }))
    }
  }
  toggleRelay()
})

client.connect('ws://localhost:3000/websocket', 'echo-protocol')
