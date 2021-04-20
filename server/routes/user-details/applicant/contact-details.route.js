'use strict'

const RedisService = require('../../../services/redis.service')
const { Paths, RedisKeys, Views } = require('../../../utils/constants')
const { buildErrorSummary } = require('../../../utils/validation')

const title = 'Your contact details'

const handlers = {
  get: (request, h) => {
    return h.view(Views.CONTACT_DETAILS, { ..._getContext(request) })
  },

  post: (request, h) => {
    const payload = request.payload
    const errors = _validateForm(payload)

    if (errors.length) {
      return h.view(Views.CONTACT_DETAILS, {
        ..._getContext(request),
        ...buildErrorSummary(errors)
      })
    }

    RedisService.set(request, RedisKeys.APPLICANT_NAME, payload.name)
    RedisService.set(
      request,
      RedisKeys.APPLICANT_EMAIL_ADDRESS,
      payload.emailAddress
    )

    return h.redirect(Paths.CHECK_YOUR_ANSWERS)
  }
}

const _getContext = request => {
  const context = { title, applicant: true }

  if (request && request.payload) {
    context.name = request.payload.name
    context.emailAddress = request.payload.emailAddress
    context.confirmEmailAddress = request.payload.confirmEmailAddress
  }
  return context
}

const _validateForm = payload => {
  const errors = []

  if (!payload.name) {
    errors.push({
      name: 'name',
      text: 'Enter your full name'
    })
  }

  if (!payload.emailAddress || !payload.emailAddress.trim().length) {
    errors.push({
      name: 'emailAddress',
      text: 'Enter your email address'
    })
  } else if (!_isValidEmail(payload.emailAddress)) {
    errors.push({
      name: 'emailAddress',
      text:
        'Enter an email address in the correct format, like name@example.com'
    })
  }

  if (!payload.confirmEmailAddress) {
    errors.push({
      name: 'confirmEmailAddress',
      text: 'You must confirm your email address'
    })
  } else if (payload.confirmEmailAddress !== payload.emailAddress) {
    errors.push({
      name: 'confirmEmailAddress',
      text: 'This confirmation does not match your email address'
    })
  }

  return errors
}

const _isValidEmail = email => {
  return email.match(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  )
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.APPLICANT_DETAILS}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.APPLICANT_DETAILS}`,
    handler: handlers.post
  }
]
