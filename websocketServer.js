const Koa = require('koa')
const Router = require('koa-router')
const websockify = require('koa-websocket')
const { requireAuthentication } = require('./authentication')

const app = websockify(new Koa())
const websocketRouter = new Router()

const activeClients = []

const broadcastMessage = (message) => {
  console.log(activeClients.length)
  activeClients.forEach((client) => {
    client.send(message)
  })
}

websocketRouter.get('/websocket', (ctx) => {
  console.log('hello connection')

  console.log('connection opened')
  activeClients.push(ctx.websocket)
  broadcastMessage('hello world')
  ctx.websocket.on('message', (message) => {
    console.log('message', message)
  })
})

app.ws
  .use(requireAuthentication)
  .use(websocketRouter.routes())
  .use(websocketRouter.allowedMethods())

module.exports = app
