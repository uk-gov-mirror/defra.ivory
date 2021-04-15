'use strict'

const { Views } = require('../utils/constants')

const handlers = {
  get: (request, h) => {
    return h.view(Views.IVORY_INTEGRAL, {
      errorSummaryText: '',
      errorText: false
    })
  },

  post: (request, h) => {
    const payload = request.payload
    if (payload.ivoryIsIntegral) {
      const client = request.redis.client
      client.set('ivory-integral', payload.ivoryIsIntegral)
      return h.redirect(Views.CHECK_YOUR_ANSWERS)
    } else {
      return h.view(Views.IVORY_INTEGRAL, {
        errorSummaryText:
          'You must tell us how the ivory is integral to the item',
        errorText: {
          text: 'You must tell us how the ivory is integral to the item'
        }
      })
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: `/${Views.IVORY_INTEGRAL}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `/${Views.IVORY_INTEGRAL}`,
    handler: handlers.post
  }
]
