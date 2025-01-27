'use strict'

const hapi = require('@hapi/hapi')
const config = require('./utils/config')
const cookieConfig = require('./utils/cookieConfig')
const { DEFRA_IVORY_SESSION_KEY, ServerEvents } = require('./utils/constants')

const createServer = async () => {
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  server.event(ServerEvents.PLUGINS_LOADED)

  _registerPlugins(server)

  _createSessionCookie(server)

  return server
}

const _registerPlugins = async server => {
  await server.register(require('./plugins/blipp.plugin'))
  await server.register(require('./plugins/disinfect.plugin'))
  await server.register(require('./plugins/error-pages.plugin'))
  await server.register(require('./plugins/hapi-sanitize-payload.plugin'))
  await server.register(require('./plugins/inert.plugin'))
  await server.register(require('./plugins/logging.plugin'))
  await server.register(require('./plugins/redis.plugin'))
  await server.register(require('./plugins/robots.plugin'))
  await server.register(require('./plugins/router.plugin'))
  await server.register(require('./plugins/views.plugin'))

  server.events.emit(ServerEvents.PLUGINS_LOADED)
}

const _createSessionCookie = server => {
  server.state(DEFRA_IVORY_SESSION_KEY, cookieConfig.options)
}

module.exports = createServer
