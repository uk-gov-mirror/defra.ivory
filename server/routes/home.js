const handlers = {
  get: (request, h) => {
    return h.view('home', {
      title: 'Hello',
      message: 'Elephants'
    })
  },
  post: (request, h) => {
    return h.view('home', {
      title: 'Hello',
      message: 'Elephants'
    })
  }
}

module.exports = [{
  method: 'GET',
  path: '/',
  handler: handlers.get
}, {
  method: 'POST',
  path: '/',
  handler: handlers.post
}]
