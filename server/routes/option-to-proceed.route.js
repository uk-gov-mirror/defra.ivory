'use strict'

const AnalyticsService = require('../services/analytics.service')
const RedisService = require('../services/redis.service')

const {
  Analytics,
  Paths,
  RedisKeys,
  Urls,
  Views
} = require('../utils/constants')

const { buildErrorSummary, Validators } = require('../utils/validation')

const proceedWithRegistration = 'Assume item contains ivory and proceed with registration'
const doNotRegister = 'Do not continue with registration'

const handlers = {
  get: async (request, h) => {
    const context = await _getContext(request)

    return h.view(Views.OPTION_TO_PROCEED, {
      ...context
    })
  },

  post: async (request, h) => {
    const context = await _getContext(request)
    const payload = request.payload
    const errors = _validateForm(payload)

    if (errors.length) {
      AnalyticsService.sendEvent(request, {
        category: Analytics.Category.ERROR,
        action: JSON.stringify(errors),
        label: context.pageTitle
      })

      return h
        .view(Views.OPTION_TO_PROCEED, {
          ...context,
          ...buildErrorSummary(errors)
        })
        .code(400)
    }

    AnalyticsService.sendEvent(request, {
      category: Analytics.Category.MAIN_QUESTIONS,
      action: `${Analytics.Action.SELECTED} ${payload.optionToProceed}`,
      label: context.pageTitle
    })

    if (payload.optionToProceed === proceedWithRegistration) {
      await RedisService.set(
        request,
        RedisKeys.OPTION_TO_PROCEED,
        payload.optionToProceed
      )
      return h.redirect(Paths.WHAT_TYPE_OF_ITEM_IS_IT)
    } else {
      await RedisService.delete(request, RedisKeys.OPTION_TO_PROCEED)

      return h.redirect(Paths.DO_NOT_NEED_SERVICE)
    }
  }
}

const _getContext = async request => {
  return {
    pageTitle: 'Do you wish to proceed?',
    items: await _getOptions(request),
    guidanceUrl: Urls.GOV_UK_TOP_OF_MAIN
  }
}

const _getOptions = async request => {
  const optionToProceed = await RedisService.get(request, RedisKeys.OPTION_TO_PROCEED)

  const options = [
    {
      value: proceedWithRegistration,
      text: proceedWithRegistration,
      checked: optionToProceed === proceedWithRegistration
    },
    {
      value: doNotRegister,
      text: doNotRegister,
      checked: optionToProceed === doNotRegister
    }
  ]

  return options
}

const _validateForm = payload => {
  const errors = []

  if (Validators.empty(payload.optionToProceed)) {
    errors.push({
      name: 'optionToProceed',
      text: 'Please choose an option'
    })
  }

  return errors
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.OPTION_TO_PROCEED}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.OPTION_TO_PROCEED}`,
    handler: handlers.post
  }
]
