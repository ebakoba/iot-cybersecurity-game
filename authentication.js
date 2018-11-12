
const requireAuthentication = (ctx, next) => {
  if (ctx.session.authenticated) {
    next()
  } else {
    ctx.redirect('/login')
  }
}

const loginPost = async (ctx, next, authenticate) => {
  const user = ctx.request.body
  if (user.username !== undefined && user.password !== undefined) {
    await authenticate(ctx, user)
  }

  ctx.redirect('/')
}

module.exports = {
  requireAuthentication,
  loginPost
}
