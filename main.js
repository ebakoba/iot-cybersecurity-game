
const path = require('path')
const cli = require('cli')
const gpio = require('./gpio')

gpio.initialize()

const { level } = cli.parse({
  level: ['l', 'A game vulnerability level', 'number', 1]
})

if (level < 1 || level > 3) {
  cli.error('Game only has levels from 1 to 3')
} else {
  cli.exec(`node ${path.join('.', `level-${level}`, 'server.js')}`)
}
