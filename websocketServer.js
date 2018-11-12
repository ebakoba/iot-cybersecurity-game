const Koa = require('koa')
const Router = require('koa-router')
const websockify = require('koa-websocket')
const { requireAuthentication } = require('./authentication')

const app = websockify(new Koa())
const websocketRouter = new Router()

websocketRouter.get('/websocket', (ctx) => {
  console.log('hello connection')
  ctx.websocket.send('Hello world')
  ctx.websocket.on('message', (message) => {
    console.log('message', message)
  })
})

app.ws
  .use(requireAuthentication)
  .use(websocketRouter.routes())
  .use(websocketRouter.allowedMethods())

module.exports = app
