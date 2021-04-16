'use strict'

const { Paths, Views } = require('../../..//utils/constants')

const handlers = {
  get: (request, h) => {
    return h.view(Views.CONTACT_DETAILS, {
      title: 'Your contact details',
      applicant: true,
      errorSummaryText: '',
      errorText: false
    })
  },

  post: (request, h) => {
    const payload = request.payload
    let errors = []

    if (!payload.name) {
      errors.push({
        "text": "Enter your full name",
        "href": "#name"
      })
    }

    if (!payload.emailAddress) {
      errors.push({
        "text": "Enter your email address",
        "href": "#emailAddress"
      })
    } else if (!isValidEmail(payload.emailAddress)) {
      errors.push({
        "text": "Enter an email address in the correct format, like name@example.com",
        "href": "#emailAddress"
      })
    }

    if (!payload.confirmEmailAddress) {
      errors.push({
        "text": "You must confirm your email address",
        "href": "#confirmEmailAddress"
      })
    } else if (payload.confirmEmailAddress !== payload.emailAddress) {
      errors.push({
        "text": "This confirmation does not match your email address",
        "href": "#confirmEmailAddress"
      })
    }

    if (errors.length > 0) {
      return h.view(Views.CONTACT_DETAILS, {
        title: 'Your contact details',
        applicant: true,
        errors: errors
      })
    }

    const client = request.redis.client
    client.set('applicantname', payload.name)
    client.set('applicant.emailAddress', payload.emailAddress)

    return h.redirect(Paths.CHECK_YOUR_ANSWERS)
  }
}

function isValidEmail() {
  return true
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
