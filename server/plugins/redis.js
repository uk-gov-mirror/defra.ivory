const config = require('../config')

module.exports = {
  plugin: require('hapi-redis2'),
  options: {
    settings: {
      host: config.redisHost,
      port: config.redisPort
    },
    decorate: true
  }
}
