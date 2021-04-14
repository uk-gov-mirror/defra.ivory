const routes = [].concat(
  require('../routes/home'),
  require('../routes/public'),
  require('../routes/check-your-answers'),
  require('../routes/ivory-integral'),
  require('../routes/ivory-added'),
  require('../routes/taken-from-elephant'),
  require('../routes/address-lookup')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
