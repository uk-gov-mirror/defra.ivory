'use strict'

const { Paths, Views } = require('../../../utils/constants')

const handlers = {
  get: (request, h) => {
    return h.view(Views.ADDRESS_INTERNATIONAL, {
      title: 'Enter your address',
      hintText: 'If your business is helping someone else sell their item, give your business address.',
      errorSummaryText: '',
      errorText: false
    })
  },
  post: (request, h) => {
    const payload = request.payload
    if (!payload.internationalAddress) {
      return h.view(Views.ADDRESS_INTERNATIONAL, {
        title: 'Enter your address',
        hintText: 'If your business is helping someone else sell their item, give your business address.',
        errorSummaryText: 'Enter the address',
        errorText: {
          text: 'Enter the address'
        }
      })
    } else {
      const client = request.redis.client
      client.set('applicant-address.international-address', payload.internationalAddress)
      return h.redirect(`/${Paths.CHECK_YOUR_ANSWERS}`)
    }
  }
}

module.exports = [{
  method: 'GET',
  path: `/${Paths.OWNER_ADDRESS_INTERNATIONAL}`,
  handler: handlers.get
}, {
  method: 'POST',
  path: `/${Paths.OWNER_ADDRESS_INTERNATIONAL}`,
  handler: handlers.post
}]
