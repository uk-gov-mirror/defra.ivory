'use strict'

const AnalyticsService = require('../../services/analytics.service')
const RedisService = require('../../services/redis.service')

const {
  Analytics,
  Paths,
  RedisKeys,
  Species,
  Urls,
  Views
} = require('../../utils/constants')

const { buildErrorSummary, Validators } = require('../../utils/validation')

const twoOrMoreOption = 'Two or more of these species'
const notSureOption = 'I\'m not sure'
const noneOfTheseOption = 'None of these'

const handlers = {
  get: async (request, h) => {
    const context = await _getContext(request)

    return h.view(Views.WHAT_SPECIES, {
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
        .view(Views.WHAT_SPECIES, {
          ...context,
          ...buildErrorSummary(errors)
        })
        .code(400)
    }

    AnalyticsService.sendEvent(request, {
      category: Analytics.Category.MAIN_QUESTIONS,
      action: `${Analytics.Action.SELECTED} ${payload.whatSpecies}`,
      label: context.pageTitle
    })

    // If Two or more option, then continue onto the next question
    if (payload.whatSpecies === twoOrMoreOption) {
      await RedisService.set(
        request,
        RedisKeys.WHAT_SPECIES,
        payload.whatSpecies
      )
      return h.redirect(Paths.SELLING_TO_MUSEUM)

    // If not sure display a screen giving the user the option to proceed or end their journey
    } else if (payload.whatSpecies === notSureOption) {
      await RedisService.set(
        request,
        RedisKeys.WHAT_SPECIES,
        payload.whatSpecies
      )
      return h.redirect(Paths.OPTION_TO_PROCEED)

    // If none of these then end the journey
    } else {
      await RedisService.delete(request, RedisKeys.WHAT_SPECIES)

      return h.redirect(Paths.DO_NOT_NEED_SERVICE)
    }
  }
}

const _getContext = async request => {
  return {
    pageTitle: 'What species of ivory does your item contain?',
    speciesItems: await _getSpeciesItems(request),
    items: await _getOptions(request),
    guidanceUrl: Urls.GOV_UK_TOP_OF_MAIN
  }
}

const _getSpeciesItems = () => {
  return Object.values(Species)
}

const _getOptions = async request => {
  const whatSpecies = await RedisService.get(request, RedisKeys.WHAT_SPECIES)

  const options = [
    {
      value: twoOrMoreOption,
      text: twoOrMoreOption,
      checked: whatSpecies === twoOrMoreOption
    },
    {
      value: notSureOption,
      text: notSureOption,
      checked: whatSpecies === notSureOption
    },
    {
      value: noneOfTheseOption,
      text: noneOfTheseOption,
      checked: whatSpecies === noneOfTheseOption
    }
  ]

  return options
}

const _validateForm = payload => {
  const errors = []

  if (Validators.empty(payload.whatSpecies)) {
    errors.push({
      name: 'whatSpecies',
      text: 'Please choose an option'
    })
  }

  return errors
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.WHAT_SPECIES}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WHAT_SPECIES}`,
    handler: handlers.post
  }
]
