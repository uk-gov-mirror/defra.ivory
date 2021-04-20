'use strict'

const RedisService = require('../services/redis.service')
const { Paths, RedisKeys, Views } = require('../utils/constants')

const title =
  'Was the replacement ivory taken from the elephant on or after 1 January 1975?'

const handlers = {
  get: (request, h) => {
    return h.view(Views.YES_NO_IDK, {
      title,
      hintText: '',
      errorSummaryText: '',
      errorText: false
    })
  },

  post: (request, h) => {
    const payload = request.payload

    if (!payload.yesNoIdk) {
      const errorText =
        'You must tell us if the replacement ivory was taken from an elephant on or after 1 January 1975'
      return h
        .view(Views.YES_NO_IDK, {
          title,
          hintText: '',
          errorSummaryText: errorText,
          errorText: {
            text: errorText
          }
        })
        .code(400)
    } else if (payload.yesNoIdk === 'No') {
      RedisService.set(request, RedisKeys.IVORY_ADDED, 'yes-pre-1975')
      return h.redirect(Paths.CHECK_YOUR_ANSWERS)
    } else if (payload.yesNoIdk === 'I dont know') {
      return 'Best find out then!'
    } else if (payload.yesNoIdk === 'Yes') {
      return 'Those poor elephants, you are not selling that!'
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.TAKEN_FROM_ELEPHANT}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.TAKEN_FROM_ELEPHANT}`,
    handler: handlers.post
  }
]
