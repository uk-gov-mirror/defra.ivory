'use strict'

const AnalyticsService = require('../services/analytics.service')
const RedisService = require('../services/redis.service')

const {
  ItemType,
  Paths,
  RedisKeys,
  Views,
  Analytics
} = require('../utils/constants')

const { buildErrorSummary, Validators } = require('../utils/validation')

const handlers = {
  get: async (request, h) => {
    const context = await _getContext(request)

    return h.view(Views.WHAT_TYPE_OF_ITEM_IS_IT, {
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
        .view(Views.WHAT_TYPE_OF_ITEM_IS_IT, {
          ...context,
          ...buildErrorSummary(errors)
        })
        .code(400)
    }

    await RedisService.set(
      request,
      RedisKeys.WHAT_TYPE_OF_ITEM_IS_IT,
      payload.whatTypeOfItemIsIt
    )

    AnalyticsService.sendEvent(request, {
      category: Analytics.Category.MAIN_QUESTIONS,
      action: `${Analytics.Action.SELECTED} ${payload.whatTypeOfItemIsIt}`,
      label: context.pageTitle
    })

    const isSection2 = payload.whatTypeOfItemIsIt === ItemType.HIGH_VALUE

    return h.redirect(isSection2 ? Paths.ALREADY_CERTIFIED : Paths.CAN_CONTINUE)
  }
}

const _getContext = async request => {
  return {
    pageTitle: 'What is your ivory item?',
    items: await _getOptions(request),
    linkUrl: Paths.SELLING_TO_MUSEUM
  }
}

const _getOptions = async request => {
  const whatTypeOfItemIsIt = await RedisService.get(
    request,
    RedisKeys.WHAT_TYPE_OF_ITEM_IS_IT
  )

  const options = Object.values(ItemType).map(itemType => {
    return {
      value: itemType,
      text: itemType,
      checked: whatTypeOfItemIsIt === itemType
    }
  })

  _addHints(options)

  return options
}

const _addHints = async options => {
  const hints = [
    '',
    'The ivory must be integral to the item.',
    '',
    'If you’re selling or hiring out items to a qualifying museum your item must be ‘worked’ ivory. This means the ivory has been significantly altered from its natural raw state. For example, it’s been used to make a piece of jewellery or musical instrument. <br/><br/>You do not need an exemption if you’re a qualifying museum selling or hiring out an item to another qualifying museum.',
    ''
  ]

  for (let index = 0; index < options.length; index++) {
    options[index].hint = {
      html: hints[index]
    }
  }
}

const _validateForm = payload => {
  const errors = []

  if (Validators.empty(payload.whatTypeOfItemIsIt)) {
    errors.push({
      name: 'whatTypeOfItemIsIt',
      text: 'Tell us what type of ivory you want to sell or hire out'
    })
  }

  return errors
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.WHAT_TYPE_OF_ITEM_IS_IT}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WHAT_TYPE_OF_ITEM_IS_IT}`,
    handler: handlers.post
  }
]
