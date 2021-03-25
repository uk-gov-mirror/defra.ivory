const handlers = {
  get: (request, h) => {
    return h.view('ivory-is-integral', {
      errorSummaryText: '',
      errorText: false
    })
  },
  post: (request, h) => {
    const payload = request.payload
    if (payload.ivoryIsIntegral) {
      const client = request.redis.client
      client.set('ivory-is-integral', payload.ivoryIsIntegral)
      return h.view('ivory-is-integral')
    } else {
      return h.view('ivory-is-integral', {
        errorSummaryText: 'You must tell us how the ivory is integral to the item',
        errorText: {
          text: 'You must tell us how the ivory is integral to the item'
        }
      })
    }
  }
}

module.exports = [{
  method: 'GET',
  path: '/ivory-is-integral',
  handler: handlers.get
}, {
  method: 'POST',
  path: '/ivory-is-integral',
  handler: handlers.post
}]
