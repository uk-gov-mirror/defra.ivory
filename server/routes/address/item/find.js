// This route gets the address details for the item
const { postcodeValidator } = require('postcode-validator')
const completedBy = 'owner' // Temporary until previous page built then will use value saved in Redis. Use 'owner' or '3rdParty'

const handlers = {
  get: (request, h) => {
    return h.view('address/find', {
      title: completedBy === 'owner' ? 'What is your address?' : 'What is the owner\'s address?',
      message: completedBy === 'owner' ? 'If your business is the legal owner of the item, give your business address.' : 'If the legal owner of the item is a business, give the business address.',
      errorText: false
    })
  },
  post: (request, h) => {
    const payload = request.payload
    const noAddresses = 10 // Temporary value for number of results returned from search

    // If no postcode entered
    if (!payload.postcode) {
      return h.view('address/find', {
        title: completedBy === 'owner' ? 'What is your address?' : 'What is the owner\'s address?',
        message: completedBy === 'owner' ? 'If your business is the legal owner of the item, give your business address.' : 'If the legal owner of the item is a business, give the business address.',
        errorSummaryText: completedBy === 'owner' ? 'Enter your postcode' : 'Enter the owner\'s postcode',
        errorText: {
          text: completedBy === 'owner' ? 'Enter your postcode' : 'Enter the owner\'s postcode'
        }
      })
    // If an invalid postcode entered
    } else if (!postcodeValidator(payload.postcode, 'GB')) {
      return h.view('address/find', {
        title: completedBy === 'owner' ? 'What is your address?' : 'What is the owner\'s address?',
        message: completedBy === 'owner' ? 'If your business is the legal owner of the item, give your business address.' : 'If the legal owner of the item is a business, give the business address.',
        errorSummaryText: 'Enter a UK postcode in the correct format',
        errorText: {
          text: 'Enter a UK postcode in the correct format'
        }
      })
    } else {
      // Go look up the postcode
    }
  }
}

module.exports = [{
  method: 'GET',
  path: '/address/item/find',
  handler: handlers.get
}, {
  method: 'POST',
  path: '/address/item/find',
  handler: handlers.post
}]
