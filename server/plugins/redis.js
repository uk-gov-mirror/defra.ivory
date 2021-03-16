module.exports = {
  plugin: require('hapi-redis2'),
  options: {
    settings: {
      port: process.env.REDIS_PORT, // Redis port
      host: process.env.REDIS_HOST // Redis host
    },
    decorate: true
  }
}
