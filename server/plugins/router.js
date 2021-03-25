const routes = [].concat(
  require('../routes/home'),
  require('../routes/about'),
  require('../routes/public'),
  require('../routes/ivory-is-integral'),
  require('../routes/ivory-added')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
