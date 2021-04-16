'use strict'

const { Paths, Views } = require('../utils/constants')

const handlers = {
  get: async (request, h) => {
    const client = request.redis.client
    return h.view(Views.CHECK_YOUR_ANSWERS, {
      ivoryIntegral: await client.get('ivory-integral'),
      ivoryAdded: await client.get('ivory-added'),
      ownerDetails: await client.get('owner.name') + ' ' + await client.get('owner.emailAddress'),
      applicantDetails: await client.get('applicant.name') + ' ' + await client.get('applicant.emailAddress'),
      errorSummaryText: '',
      errorText: false
    })
  },

  post: async (request, h) => {
    const payload = request.payload
    console.log("Business name: " + await client.get('owner.name'))
    if (!payload.agree) {
      const client = request.redis.client
      return h.view(Views.CHECK_YOUR_ANSWERS, {
        ivoryIntegral: await client.get('ivory-integral'),
        ivoryAdded: await client.get('ivory-added'),
        ownerDetails: await client.get('owner.name') + ' ' + await client.get('owner.emailAddress'),
        applicantDetails: await client.get('applicant.name')+ ' ' + await client.get('applicant.emailAddress'),
        errorSummaryText: 'You must agree to the declaration',
        errorText: {
          text: 'You must agree to the declaration'
        }
      })
    } else {
      return h.redirect(Paths.CHECK_YOUR_ANSWERS)
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.CHECK_YOUR_ANSWERS}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.CHECK_YOUR_ANSWERS}`,
    handler: handlers.post
  }
]
