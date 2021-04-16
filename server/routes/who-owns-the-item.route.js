'use strict'

const { Paths, Views } = require('../utils/constants')

const handlers = {
  get: (request, h) => {
    return h.view(Views.WHO_OWNS_ITEM, {
      errorSummaryText: '',
      errorText: false
    })
  },

  post: (request, h) => {
    const payload = request.payload
    if (!payload.whoOwnsItem) {
      return h.view(Views.WHO_OWNS_ITEM, {
        errorSummaryText:
          'Tell us who owns the item',
        errorText: {
          text:
            'Tell us who owns the item'
        }
      })
    } else {
      const client = request.redis.client
      if (payload.whoOwnsItem === 'I own it') {
        client.set('owner-applicant', 'yes')
      } else {
        client.set('owner-applicant', 'no')
      }

      return h.redirect(Paths.OWNER_DETAILS)
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.WHO_OWNS_ITEM}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WHO_OWNS_ITEM}`,
    handler: handlers.post
  }
]
