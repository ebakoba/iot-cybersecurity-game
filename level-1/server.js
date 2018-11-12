const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const { prepareDatabase } = require('../database')
const { requireAuthentication, loginPost } = require('../authentication')
const { createServer } = require('../websocketServer')
const app = createServer(true)

prepareDatabase('$2b$10$8jyIo5qqXYKWEOjUc6SX3OFQ2BFpre9UyDuAjNfjqGybUAeP1kAJK').then((database) => {
  const router = new Router()

  router.get('/', requireAuthentication, (ctx) => {
    ctx.type = 'html'
    ctx.body = fs.createReadStream(path.join('level-1', 'client', 'index.html'))
  })

  router.get('/manual', (ctx) => {
    ctx.type = 'html'
    ctx.body = fs.createReadStream(path.join('level-1', 'client', 'manual.html'))
  })

  router.get('/login', (ctx) => {
    ctx.type = 'html'
    ctx.body = fs.createReadStream(path.join('level-1', 'client', 'login.html'))
  })

  const authenticate = (ctx, user) => {
    return new Promise((resolve, reject) => {
      const statement = database.prepare('SELECT * FROM users WHERE username=?')
      statement.run(user.username).all((err, rows) => {
        if (err) reject(err)

        if (rows.length === 1) {
          bcrypt.compare(user.password, rows[0].hash, (err, isSame) => {
            if (err) reject(err)
            if (isSame) ctx.session.authenticated = true
            resolve()
          })
        } else {
          bcrypt.compare('jambolaia', '$2b$10$8jyIo6ssXYKWEOjUc6SX3OFQ2BFpre9UyDuAjNfjqGybUAeP1kAJK', () => {
            resolve()
          })
        }
      })
    })
  }

  router.post('/login', async (ctx, next) => loginPost(ctx, next, authenticate))

  app
    .use(router.routes())
    .use(router.allowedMethods())

  app.listen(3000)
})
