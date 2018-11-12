const rpio = require('rpio')

const initialize = () => {
  rpio.open(11, rpio.OUTPUT, rpio.LOW)
  rpio.open(11, rpio.OUTPUT, rpio.HIGH)
}

const getValues = () => ({
  11: rpio.read(11) === 0,
  12: rpio.read(12) === 0
})

const toggle = (pin) => {
  rpio.write(pin, rpio.read(pin) === 0 ? 1 : 0)
}

module.exports = {
  initialize,
  getValues,
  toggle
}
