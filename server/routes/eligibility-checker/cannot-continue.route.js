'use strict'

const AnalyticsService = require('../../services/analytics.service')

const {
  Paths,
  Views,
  Urls,
  Analytics
} = require('../../utils/constants')

const PAGE_TITLE = 'You cannot continue'

const handlers = {
  get: async (request, h) => {
    AnalyticsService.sendEvent(request, {
      category: Analytics.Category.SERVICE_COMPLETE,
      action: Analytics.Action.DROPOUT,
      label: PAGE_TITLE
    })

    return h.view(Views.CANNOT_CONTINUE, {
      pageTitle: PAGE_TITLE
    })
  },

  post: async (request, h) => {
    AnalyticsService.sendEvent(request, {
      category: Analytics.Category.SERVICE_COMPLETE,
      action: `${Analytics.Action.SELECTED} Finish and redirect button`,
      label: PAGE_TITLE
    })

    return h.redirect(Urls.GOV_UK_TOP_OF_MAIN)
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.CANNOT_CONTINUE}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.CANNOT_CONTINUE}`,
    handler: handlers.post
  }
]
