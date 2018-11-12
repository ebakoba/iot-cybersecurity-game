const Koa = require('koa')
const Router = require('koa-router')
const websockify = require('koa-websocket')
const { requireAuthentication } = require('./authentication')
const gpio = require('./gpio')

gpio.initialize() // TODO remove

const app = websockify(new Koa())
const websocketRouter = new Router()

const activeClients = []

const broadcastMessage = (message) => {
  activeClients.forEach((client) => {
    client.send(message)
  })
}

const handleClientMessage = (message) => {
  switch (message.type) {
    case 'toggleRelay':
      gpio.toggle(JSON.parse(message.data).pin)
      broadcastMessage(JSON.stringify({
        type: 'allRelays',
        data: JSON.stringify(gpio.getValues())
      }))
      break
    default:
      throw new Error('Unknown message type')
  }
}

websocketRouter.get('/websocket', (ctx) => {
  const client = ctx.websocket
  activeClients.push(client)

  client.send(JSON.stringify({
    type: 'allRelays',
    data: JSON.stringify(gpio.getValues())
  }))

  ctx.websocket.on('close', (event) => {
    const index = activeClients.indexOf(ctx.websocket)
    if (index > -1) activeClients.splice(index, 1)
  })

  ctx.websocket.on('message', (message) => {
    handleClientMessage(JSON.parse(message))
  })
})

app.ws
  .use(requireAuthentication)
  .use(websocketRouter.routes())
  .use(websocketRouter.allowedMethods())

module.exports = app
