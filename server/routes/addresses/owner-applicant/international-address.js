const handlers = {
  get: (request, h) => {
    return h.view('international-address', {
      title: 'Enter your address',
      hintText: 'If your business owns the item, give your business address.',
      errorSummaryText: '',
      errorText: false
    })
  },
  post: (request, h) => {
    const payload = request.payload
    if (!payload.internationalAddress) {
      return h.view('international-address', {
        title: 'Enter your address',
        hintText: 'If your business owns the item, give your business address.',
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
  path: '/your-address/international-address',
  handler: handlers.get
}, {
  method: 'POST',
  path: '/your-address/international-address',
  handler: handlers.post
}]
