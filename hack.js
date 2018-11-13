const WebSocketClient = require('websocket').client

const client = new WebSocketClient()

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
      connection.send(JSON.stringify({
        type: 'toggleRelay',
        data: JSON.stringify({
          pin: 11
        })
      }))
    }
  }

  setInterval(toggleRelay, 20)
})

client.connect('ws://192.168.1.1/websocket')
