'use strict'

const config = require('../utils/config')

module.exports = {
  plugin: require('hapi-pino'),
  options: {
    logPayload: true,
    prettyPrint: config.isDev,
    level: 'warn'

    // TODO reinstate this
    // level: config.isDev ? 'debug' : 'warn'
  }
}
