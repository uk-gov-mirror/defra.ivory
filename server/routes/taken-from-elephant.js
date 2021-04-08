const handlers = {
  get: (request, h) => {
    return h.view('yes-no-idk', {
      title: 'Was the replacement ivory taken from the elephant on or after 1 January 1975?',
      hintText: '',
      errorSummaryText: '',
      errorText: false
    })
  },
  post: (request, h) => {
    const payload = request.payload

    if (!payload.yesNoIdk) {
      return h.view('yes-no-idk', {
        title: 'Was the replacement ivory taken from the elephant on or after 1 January 1975?',
        hintText: '',
        errorSummaryText: 'You must tell us if the replacement ivory was taken from an elephant on or after 1 January 1975',
        errorText: {
          text: 'You must tell us if the replacement ivory was taken from an elephant on or after 1 January 1975'
        }
      })
    } else
    if (payload.yesNoIdk === 'No') {
      const client = request.redis.client
      client.set('ivory-added', 'yes-pre-1975')
      return h.redirect('check-your-answers')
    } else
    if (payload.yesNoIdk === 'I dont know') {
      return 'Best find out then!'
    } else
    if (payload.yesNoIdk === 'Yes') {
      return 'Those poor elephants, you are not selling that!'
    }
  }
}

module.exports = [{
  method: 'GET',
  path: '/taken-from-elephant',
  handler: handlers.get
}, {
  method: 'POST',
  path: '/taken-from-elephant',
  handler: handlers.post
}]
