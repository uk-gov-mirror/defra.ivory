'use strict'

const { v4: uuidv4 } = require('uuid')
const CookieService = require('../services/cookie.service')
const RedisService = require('../services/redis.service')

const {
  DEFRA_IVORY_SESSION_KEY,
  Paths,
  HOME_URL
} = require('../utils/constants')

const handlers = {
  get: async (request, h) => {
    const sessionCookie = CookieService.getSessionCookie(request, false)

    if (sessionCookie) {
      await RedisService.deleteSessionData(request)
    }
    _setCookieSessionId(h)

    const redirectUrl = Paths.WHAT_SPECIES_EXPERT + (request.query.useChecker ? '?useChecker=true' : '')

    return h.redirect(redirectUrl)
  }
}

const _setCookieSessionId = h => {
  h.state(DEFRA_IVORY_SESSION_KEY, uuidv4())
}

module.exports = [
  {
    method: 'GET',
    path: HOME_URL,
    handler: handlers.get
  }
]
