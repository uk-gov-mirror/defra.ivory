// Suppress MaxListenersExceededWarning within tests
require('events').EventEmitter.defaultMaxListeners = Infinity

module.exports = class TestHelper {
  static stubCommon (sandbox) {
    // Do nothing for now
  }

  static getFile (filename) {
    return filename.substring(__dirname.length)
  }
}
