const handlers = {
  get: (request, h) => {
    return h.view('ivory-integral', {
      errorSummaryText: '',
      errorText: false
    })
  },
  post: (request, h) => {
    const payload = request.payload
    if (payload.ivoryIsIntegral) {
      const client = request.redis.client
      client.set('ivory-integral', payload.ivoryIsIntegral)
      return h.view('ivory-integral')
    } else {
      return h.view('ivory-integral', {
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
  path: '/ivory-integral',
  handler: handlers.get
}, {
  method: 'POST',
  path: '/ivory-integral',
  handler: handlers.post
}]
