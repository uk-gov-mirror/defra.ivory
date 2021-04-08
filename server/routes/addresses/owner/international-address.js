const handlers = {
  get: (request, h) => {
    return h.view('international-address', {
      title: 'Enter the owner’s address',
      hintText: 'If the owner is a business, give the business address.',
      errorSummaryText: '',
      errorText: false
    })
  },
  post: (request, h) => {
    const payload = request.payload
    if (!payload.internationalAddress) {
      return h.view('international-address', {
        title: 'Enter the owner’s address',
        hintText: 'If the owner is a business, give the business address.',
        errorSummaryText: 'Enter the address',
        errorText: {
          text: 'Enter the address'
        }
      })
    } else {
      const client = request.redis.client
      client.set('owner-address.international-address', payload.internationalAddress)
      return h.redirect('/check-your-answers')
    }
  }
}

module.exports = [{
  method: 'GET',
  path: '/owner-address/international-address',
  handler: handlers.get
}, {
  method: 'POST',
  path: '/owner-address/international-address',
  handler: handlers.post
}]
