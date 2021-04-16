const handlers = {
  get: (request, h) => {
    return h.view('international-address', {
      title: 'Enter your address',
      hintText: 'If your business is helping someone else sell their item, give your business address.',
      errorSummaryText: '',
      errorText: false
    })
  },
  post: (request, h) => {
    const payload = request.payload
    if (!payload.internationalAddress) {
      return h.view('international-address', {
        title: 'Enter your address',
        hintText: 'If your business is helping someone else sell their item, give your business address.',
        errorSummaryText: 'Enter the address',
        errorText: {
          text: 'Enter the address'
        }
      })
    } else {
      const client = request.redis.client
      client.set('applicant-address.international-address', payload.internationalAddress)
      return h.redirect('/check-your-answers')
    }
  }
}

module.exports = [{
  method: 'GET',
  path: '/applicant-address/international-address',
  handler: handlers.get
}, {
  method: 'POST',
  path: '/applicant-address/international-address',
  handler: handlers.post
}]
