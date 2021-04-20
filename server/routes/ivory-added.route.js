'use strict'

const RedisService = require('../services/redis.service')
const { Paths, RedisKeys, Views } = require('../utils/constants')

const title =
  'Has any replacement ivory been added to the item since it was made?'

const hintText = 'This could have been to repair or restore damaged ivory.'

const handlers = {
  get: (request, h) => {
    return h.view(Views.YES_NO_IDK, {
      title,
      hintText,
      errorSummaryText: '',
      errorText: false
    })
  },

  post: (request, h) => {
    const payload = request.payload
    if (!payload.yesNoIdk) {
      const errorText =
        'You must tell us if any ivory has been added to the item since it was made'
      return h.view(Views.YES_NO_IDK, {
        title,
        hintText,
        errorSummaryText: errorText,
        errorText: {
          text: errorText
        }
      })
    } else if (payload.yesNoIdk === 'No') {
      RedisService.set(request, RedisKeys.IVORY_ADDED, 'no')
      return h.redirect(Paths.CHECK_YOUR_ANSWERS)
    } else if (payload.yesNoIdk === 'I dont know') {
      return 'Game over man...game over!'
    } else if (payload.yesNoIdk === 'Yes') {
      return h.redirect(Paths.TAKEN_FROM_ELEPHANT)
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.IVORY_ADDED}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.IVORY_ADDED}`,
    handler: handlers.post
  }
]
