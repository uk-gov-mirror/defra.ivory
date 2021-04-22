'use strict'

const { Paths, Views } = require('../../../utils/constants')
const { postcodeValidator } = require('postcode-validator')
const AddressService = require('../../../services/address.service')
const completedBy = 'owner' // Temporary until previous page built then will use value saved in Redis. Use 'owner' or '3rdParty'

const handlers = {
  get: (request, h) => {
    return h.view(Views.ADDRESS_FIND, {
      title: completedBy === 'owner' ? 'What is your address?' : 'What is the owner\'s address?',
      message: completedBy === 'owner' ? 'If your business is the legal owner of the item, give your business address.' : 'If the legal owner of the item is a business, give the business address.',
      errorText: false
    })
  },
  post: async (request, h) => {
    const payload = request.payload

    // If no postcode entered
    if (!payload.postcode) {
      return h.view(Views.ADDRESS_FIND, {
        title: completedBy === 'owner' ? 'What is your address?' : 'What is the owner\'s address?',
        message: completedBy === 'owner' ? 'If your business is the legal owner of the item, give your business address.' : 'If the legal owner of the item is a business, give the business address.',
        errorSummaryText: completedBy === 'owner' ? 'Enter your postcode' : 'Enter the owner\'s postcode',
        errorText: {
          text: completedBy === 'owner' ? 'Enter your postcode' : 'Enter the owner\'s postcode'
        }
      })
    // If an invalid postcode entered
    } else if (!postcodeValidator(payload.postcode, 'GB')) {
      return h.view(Views.ADDRESS_FIND, {
        title: completedBy === 'owner' ? 'What is your address?' : 'What is the owner\'s address?',
        message: completedBy === 'owner' ? 'If your business is the legal owner of the item, give your business address.' : 'If the legal owner of the item is a business, give the business address.',
        errorSummaryText: 'Enter a UK postcode in the correct format',
        errorText: {
          text: 'Enter a UK postcode in the correct format'
        }
      })
    } else {
      const test = await AddressService.addressSearch(payload.nameNumber, payload.postcode)
      console.log(test)
      const address = test.results
      console.log(address)
    }
  }
}

module.exports = [{
  method: 'GET',
  path: `/${Paths.OWNER_ADDRESS_FIND}`,
  handler: handlers.get
}, {
  method: 'POST',
  path: `/${Paths.OWNER_ADDRESS_FIND}`,
  handler: handlers.post
}]
