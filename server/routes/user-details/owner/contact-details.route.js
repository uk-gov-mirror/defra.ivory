'use strict'

const { Options, Paths, RedisKeys, Views } = require('../../../utils/constants')
const RedisService = require('../../../services/redis.service')
const { buildErrorSummary } = require('../../../utils/validation')

const handlers = {
  get: async (request, h) => {
    const ownerApplicant = await RedisService.get(
      request,
      RedisKeys.OWNER_APPLICANT
    )

    return h.view(Views.CONTACT_DETAILS, {
      title: _getTitle(ownerApplicant),
      ownerApplicant: ownerApplicant === Options.YES
    })
  },

  post: async (request, h) => {
    const ownerApplicant = await RedisService.get(
      request,
      RedisKeys.OWNER_APPLICANT
    )

    console.log(ownerApplicant)

    const payload = request.payload

    const errors = _validateForm(payload, ownerApplicant)

    if (errors.length) {
      return h.view(Views.CONTACT_DETAILS, {
        title: _getTitle(ownerApplicant),
        ownerApplicant: ownerApplicant === Options.YES,
        ..._getContext(request),
        ...buildErrorSummary(errors)
      })
    } else {
      if (ownerApplicant === Options.YES) {
        RedisService.set(
          request,
          RedisKeys.OWNER_NAME,
          payload.businessName ?? payload.name
        )
        RedisService.set(
          request,
          RedisKeys.OWNER_EMAIL_ADDRESS,
          payload.emailAddress
        )
        RedisService.set(request, RedisKeys.APPLICANT_NAME, payload.name)
        RedisService.set(
          request,
          RedisKeys.APPLICANT_EMAIL_ADDRESS,
          payload.emailAddress
        )
      } else {
        RedisService.set(request, RedisKeys.OWNER_NAME, payload.name)
        RedisService.set(
          request,
          RedisKeys.OWNER_EMAIL_ADDRESS,
          payload.emailAddress
        )
      }

      return h.redirect(
        ownerApplicant === Options.YES
          ? Paths.CHECK_YOUR_ANSWERS
          : Paths.APPLICANT_DETAILS
      )
    }
  }
}

const _getTitle = ownerApplicant => {
  return ownerApplicant === Options.YES
    ? 'Your contact details'
    : "Owner's contact details"
}

const _getContext = request => {
  const context = {}
  if (request.payload) {
    context.name = request.payload.name
    context.emailAddress = request.payload.emailAddress
    context.confirmEmailAddress = request.payload.confirmEmailAddress
  }
  return context
}

const _validateForm = (payload, ownerApplicant) => {
  return ownerApplicant === Options.YES
    ? _validateOwnerApplicant(payload)
    : _validateApplicant(payload)
}

const _validateOwnerApplicant = payload => {
  const errors = []

  if (!payload.name || !payload.name.trim().length) {
    errors.push({
      name: 'name',
      text: 'Enter your name'
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

const _validateApplicant = payload => {
  const errors = []

  if (!payload.name || !payload.name.trim().length) {
    errors.push({
      name: 'name',
      text: "Enter the owner's name"
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
      text: "You must confirm the owner's email address"
    })
  } else if (payload.confirmEmailAddress !== payload.emailAddress) {
    errors.push({
      name: 'confirmEmailAddress',
      text: "This confirmation does not match the owner's email address"
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
    path: `${Paths.OWNER_DETAILS}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.OWNER_DETAILS}`,
    handler: handlers.post
  }
]
