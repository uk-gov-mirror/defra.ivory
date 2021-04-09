const handlers = {
  get: (request, h) => {
    return h.view('yes-no-idk', {
      title: 'Has any replacement ivory been added to the item since it was made?',
      hintText: 'This could have been to repair or restore damaged ivory.',
      errorSummaryText: '',
      errorText: false
    })
  },
  post: (request, h) => {
    const payload = request.payload
    if (!payload.yesNoIdk) {
      return h.view('yes-no-idk', {
        title: 'Has any replacement ivory been added to the item since it was made?',
        hintText: 'This could have been to repair or restore damaged ivory.',
        errorSummaryText: 'You must tell us if any ivory has been added to the item since it was made',
        errorText: {
          text: 'You must tell us if any ivory has been added to the item since it was made'
        }
      })
    } else
    if (payload.yesNoIdk === 'No') {
      const client = request.redis.client
      client.set('ivory-added', 'no')
      return h.redirect('check-your-answers')
    } else
    if (payload.yesNoIdk === 'I dont know') {
      return 'Game over man...game over!'
    } else
    if (payload.yesNoIdk === 'Yes') {
      return h.redirect('taken-from-elephant')
    }
  }
}

module.exports = [{
  method: 'GET',
  path: '/ivory-added',
  handler: handlers.get
}, {
  method: 'POST',
  path: '/ivory-added',
  handler: handlers.post
}]
