'use strict'

const { Paths, Views, RedisKeys } = require('../utils/constants')
const RedisService = require('../services/redis.service')

const handlers = {
  get: async (request, h) => {
    return h.view(Views.CHECK_YOUR_ANSWERS, {
      ...(await _getContext(request))
    })
  },

  post: async (request, h) => {
    const payload = request.payload
    if (!payload.agree) {
      return h.view(Views.CHECK_YOUR_ANSWERS, {
        ...(await _getContext(request)),
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
  return {
    ivoryIntegral: await RedisService.get(request, RedisKeys.IVORY_INTEGRAL),
    ivoryAdded: await RedisService.get(request, RedisKeys.IVORY_ADDED),
    ownerDetails: `${await RedisService.get(
      request,
      RedisKeys.OWNER_NAME
    )} ${await RedisService.get(request, RedisKeys.OWNER_EMAIL_ADDRESS)}`,
    applicantDetails: `${await RedisService.get(
      request,
      RedisKeys.APPLICANT_NAME
    )} ${await RedisService.get(request, RedisKeys.APPLICANT_EMAIL_ADDRESS)}`
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
