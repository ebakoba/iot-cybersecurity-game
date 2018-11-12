console.log('hello from server 1')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const prepareDatabase = require('../database').prepareDatabase

prepareDatabase('$2b$10$8jyIo5qqXYKWEOjUc6SX3OFQ2BFpre9UyDuAjNfjqGybUAeP1kAJK').then((database) => {
  console.log('database', database)
  const app = new Koa()
  const router = new Router()

  const requireAuthentication = (ctx, next) => {
    if (ctx.session.authenticated) {
      next()
    } else {
      ctx.redirect('/login')
    }
  }
  router.get('/', requireAuthentication, (ctx) => {
    ctx.type = 'html'
    ctx.body = fs.createReadStream(path.join('level-1', 'client', 'index.html'))
  })

  router.get('/login', (ctx) => {
    ctx.type = 'html'
    ctx.body = fs.createReadStream(path.join('level-1', 'client', 'login.html'))
  })

  const authenticate = (ctx, user) => {
    return new Promise((resolve, reject) => {
      const statement = database.prepare('SELECT * FROM users WHERE username=?')
      statement.run(user.username).all((err, rows) => {
        if (err) throw err

        console.log('rows', rows)
        if (rows.length === 1) {
          bcrypt.compare(user.password, rows[0].hash, (err, isSame) => {
            if (err) throw err
            console.log(isSame)
            if (isSame) ctx.session.authenticated = true
            resolve()
          })
        } else {
          bcrypt.compare('jambolaia', '$2b$10$8jyIo5qqXYKWEOjUc6SX3OFQ2BFpre9UyDuAjNfjqGybUAeP1kAJK', () => {
            resolve()
          })
        }
      })
    })
  }

  router.post('/login', async (ctx) => {
    const user = ctx.request.body
    if (user.username !== undefined && user.password !== undefined) {
      await authenticate(ctx, user)
    }

    ctx.redirect('/')
  })

  app.keys = [Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 64)]
  app.use(session(app))

  app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())

  app.listen(3000)
})
