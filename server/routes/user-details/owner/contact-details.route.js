'use strict'

const { Paths, Views } = require('../../../utils/constants')

const handlers = {
  get: async (request, h) => {
    const client = request.redis.client
    const ownerApplicant = await client.get('owner-applicant')

    return h.view(Views.CONTACT_DETAILS, {
      title: ownerApplicant === 'yes' ? 'Your contact details' : `Owner's contact details`,
      ownerApplicant: ownerApplicant === 'yes',
      errorSummaryText: '',
      errorText: false
    })
  },

  post: async (request, h) => {
    const client = request.redis.client
    const ownerApplicant = await client.get('owner-applicant')

    const payload = request.payload
    if (ownerApplicant === 'yes') {
      client.set('owner.name', payload.businessName ?? payload.name)
      client.set('owner.emailAddress', payload.emailAddress)
      client.set('applicant.name', payload.name)
      client.set('applicant.emailAddress', payload.emailAddress)
    } else {
      client.set('owner.name', payload.name)
      client.set('owner.emailAddress', payload.emailAddress)
    }

    if (ownerApplicant === 'yes') {
      return h.redirect(Paths.CHECK_YOUR_ANSWERS)
    } else {
      return h.redirect(Paths.APPLICANT_DETAILS)
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.OWNER_DETAILS}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.OWNER_DETAILS}`,
    handler: handlers.post
  }
]
