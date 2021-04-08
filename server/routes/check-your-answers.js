const handlers = {
  get: async (request, h) => {
    const client = request.redis.client
    return h.view('check-your-answers', {
      ivoryIntegral: await client.get('ivory-integral'),
      ivoryAdded: await client.get('ivory-added'),
      errorSummaryText: '',
      errorText: false
    })
  },
  post: async (request, h) => {
    const payload = request.payload
    if (!payload.agree) {
      const client = request.redis.client
      return h.view('check-your-answers', {
        ivoryIntegral: await client.get('ivory-integral'),
        ivoryAdded: await client.get('ivory-added'),
        errorSummaryText: 'You must agree to the declaration',
        errorText: {
          text: 'You must agree to the declaration'
        }
      })
    } else {
      return h.redirect('check-your-answers')
    }
  }
}

module.exports = [{
  method: 'GET',
  path: '/check-your-answers',
  handler: handlers.get
}, {
  method: 'POST',
  path: '/check-your-answers',
  handler: handlers.post
}]
