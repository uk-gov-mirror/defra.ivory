const uuid = require('uuid/v4')

const utils = {
  // Usage: const val = getNestedVal(myObj, 'a.b.c')
  getNestedVal (nestedObj, path) {
    return path
      .split('.')
      .reduce((obj, key) => {
        return (obj && obj[key] !== 'undefined') ? obj[key] : undefined
      }, nestedObj)
  },

  cloneAndMerge (...args) {
    const obj = Object.assign({}, ...args)
    Object.entries(obj).forEach(([prop, val]) => {
      if (val === null) {
        delete obj[prop]
      }
    })
    return obj
  },

  uuid () {
    return uuid()
  },

  async getCache (request, key) {
    if (typeof key === 'string') {
      return request.yar.get(key)
    }
    // Retrieve each item specified in the array of keys
    // usage: const [a, b, c] = await utils.getCache(request, ['a', 'b', 'c'])
    return Promise.all(key.map(async (key) => {
      return utils.getCache(request, key)
    }))
  },

  async setCache (request, key, val) {
    request.yar.set(key, val)
  }
}

module.exports = utils
