'use strict'

const { Views } = require('../utils/constants')

const handlers = {
  get: async (request, h) => {
    const client = request.redis.client
    return h.view(Views.CHECK_YOUR_ANSWERS, {
      ivoryIntegral: await client.get('ivory-integral'),
      ivoryAdded: await client.get('ivory-added'),
      errorSummaryText: '',
      errorText: false
    })
  },

  post: async (request, h) => {
    const payload = request.payload
    if (!payload.agree) {
      const client = request.redis.client
      return h.view(Views.CHECK_YOUR_ANSWERS, {
        ivoryIntegral: await client.get('ivory-integral'),
        ivoryAdded: await client.get('ivory-added'),
        errorSummaryText: 'You must agree to the declaration',
        errorText: {
          text: 'You must agree to the declaration'
        }
      })
    } else {
      return h.redirect(Views.CHECK_YOUR_ANSWERS)
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: `/${Views.CHECK_YOUR_ANSWERS}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `/${Views.CHECK_YOUR_ANSWERS}`,
    handler: handlers.post
  }
]
