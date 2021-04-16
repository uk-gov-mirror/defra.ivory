'use strict'

const { v4: uuidv4 } = require('uuid')
const { SESSION_ID, Views } = require('../utils/constants')

const handlers = {
  get: (request, h) => {
    const sessionId = uuidv4()
    h.state(SESSION_ID, sessionId)

    return h.view(Views.HOME, {
      title: 'Hello',
      message: 'Elephants'
    })
  },

  post: (request, h) => {
    return h.view(Views.HOME, {
      title: 'Hello',
      message: 'Elephants'
    })
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: handlers.get
  },
  {
    method: 'POST',
    path: '/',
    handler: handlers.post
  }
]
