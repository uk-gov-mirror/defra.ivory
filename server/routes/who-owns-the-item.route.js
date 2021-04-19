'use strict'

const { Options, Paths, Views } = require('../utils/constants')
const { buildErrorSummary } = require('../utils/validation')

const handlers = {
  get: (request, h) => {
    return h.view(Views.WHO_OWNS_ITEM)
  },

  post: (request, h) => {
    const payload = request.payload

    const errors = _validateForm(payload)

    if (errors.length) {
      return h.view(Views.WHO_OWNS_ITEM, {
        ...buildErrorSummary(errors)
      })
    } else {
      const client = request.redis.client
      client.set(
        'owner-applicant',
        payload.whoOwnsItem === 'I own it' ? Options.YES : Options.NO
      )

      return h.redirect(Paths.OWNER_DETAILS)
    }
  }
}

const _validateForm = payload => {
  const errors = []
  if (!payload.whoOwnsItem) {
    errors.push({
      name: 'whoOwnsItem',
      text: 'Tell us who owns the item'
    })
  }
  return errors
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
