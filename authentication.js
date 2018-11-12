
const requireAuthentication = (ctx, next) => {
  console.log('session', ctx.session)
  if (ctx.session.authenticated) {
    next()
  } else {
    ctx.redirect('/login')
  }
}

module.exports = {
  requireAuthentication
}
