'use strict'

const routes = [].concat(
  require('../routes/home.route'),
  require('../routes/public.route'),
  require('../routes/check-your-answers.route'),
  require('../routes/ivory-integral.route'),
  require('../routes/ivory-added.route'),
  require('../routes/taken-from-elephant.route')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
