'use strict'

const { Paths, Views, RedisKeys } = require('../utils/constants')

const handlers = {
  get: async (request, h) => {
    return h.view(Views.CHECK_YOUR_ANSWERS, {
      ..._getContext()
    })
  },

  post: async (request, h) => {
    const payload = request.payload
    if (!payload.agree) {
      return h.view(Views.CHECK_YOUR_ANSWERS, {
        ..._getContext(),
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

const _getContext = async request => {
  const client = request.redis.client
  return {
    ivoryIntegral: await client.get('ivory-integral'),
    ivoryAdded: await client.get('ivory-added'),
    ownerDetails: `${await client.get(RedisKeys.OWNER_NAME)} ${await client.get(
      RedisKeys.OWNER_EMAIL_ADDRESS
    )}`,
    applicantDetails: `${await client.get('applicant.name')} ${await client.get(
      RedisKeys.APPLICANT_EMAIL_ADDRESS
    )}`
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
