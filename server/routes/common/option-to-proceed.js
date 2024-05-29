'use strict'

const RedisService = require('../../services/redis.service')
const { Validators } = require('../../utils/validation')
const {
  RedisKeys,
  Urls
} = require('../../utils/constants')

const proceedWithRegistration = 'Assume item contains ivory and proceed with registration'
const doNotRegister = 'Do not continue with registration'

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

module.exports = {
  proceedWithRegistration,
  _getContext,
  _validateForm
}
