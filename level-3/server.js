const { createServer } = require('../websocketServer')
const app = createServer(false)

app.listen(3000)
