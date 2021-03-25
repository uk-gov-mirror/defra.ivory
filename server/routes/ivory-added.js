const handlers = {
  get: (request, h) => {
    return h.view('ivory-added', {
      title: 'Has any replacement ivory been added to the item since it was made?',
      pageName: 'ivoryAdded',
      hintText: 'This could have been to repair or restore damaged ivory.',
      errorSummaryText: '',
      errorText: false
    })
  },
  post: (request, h) => {
    const payload = request.payload
    // Check if it's the "Has any replacement ivory been added to the item since it was made?" page
    if (payload.pageName === 'ivoryAdded') {
      if (!payload.ivoryAdded) {
        return h.view('ivory-added', {
          title: 'Has any replacement ivory been added to the item since it was made?',
          pageName: 'ivoryAdded',
          hintText: 'This could have been to repair or restore damaged ivory.',
          errorSummaryText: 'You must tell us if any ivory has been added to the item since it was made',
          errorText: {
            text: 'You must tell us if any ivory has been added to the item since it was made'
          }
        })
      } else
      if (payload.ivoryAdded === 'No') {
        const client = request.redis.client
        client.set('ivory-added', payload.pageName + payload.ivoryAdded)
        return h.view('ivory-added', {
          title: 'Has any replacement ivory been added to the item since it was made?',
          pageName: 'ivoryAdded',
          hintText: 'This could have been to repair or restore damaged ivory.',
          errorSummaryText: '',
          errorText: false
        })
      } else
      if (payload.ivoryAdded === 'I dont know') {
        return 'Game over man...game over!'
      } else
      if (payload.ivoryAdded === 'Yes') {
        return h.view('ivory-added', {
          title: 'Was the replacement ivory taken from the elephant on or after 1 January 1975?',
          pageName: 'ivoryAddedAfter1975',
          hintText: '',
          errorSummaryText: '',
          errorText: false
        })
      }
    } else
    // Check if it's the "Was the replacement ivory taken from the elephant on or after 1 January 1975?" page
    if (payload.pageName === 'ivoryAddedAfter1975') {
      if (!payload.ivoryAdded) {
        return h.view('ivory-added', {
          title: 'Was the replacement ivory taken from the elephant on or after 1 January 1975?',
          pageName: 'ivoryAddedAfter1975',
          hintText: '',
          errorSummaryText: 'You must tell us if the replacement ivory was taken from an elephant on or after 1 January 1975',
          errorText: {
            text: 'You must tell us if the replacement ivory was taken from an elephant on or after 1 January 1975'
          }
        })
      } else
      if (payload.ivoryAdded === 'No') {
        const client = request.redis.client
        client.set('ivory-added', payload.pageName + payload.ivoryAdded)
        return h.view('ivory-added', {
          title: 'Was the replacement ivory taken from the elephant on or after 1 January 1975?',
          pageName: 'ivoryAddedAfter1975',
          hintText: '',
          errorSummaryText: '',
          errorText: false
        })
      } else
      if (payload.ivoryAdded === 'I dont know') {
        return 'Best find out then!'
      } else
      if (payload.ivoryAdded === 'Yes') {
        return 'Those poor elephants, you are not selling that!'
      }
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
