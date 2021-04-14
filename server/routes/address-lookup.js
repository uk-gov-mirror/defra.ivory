const https = require('https')
const fs = require('fs')

const handlers = {
  get: (request, h) => {
    return h.view('address-lookup', {
      errorSummaryText: '',
      errorText: false
    })
  },
  post: (request, h) => {
    const payload = request.payload
    if (!payload.postcode) {
      return h.view('address-lookup', {
        errorSummaryText: 'Enter a postcode',
        errorText: {
          text: 'Enter a postcode'
        }
      })
    } else {
      const options = {
        hostname: 'hostname',
        port: 443,
        path: '/ws/rest/DEFRA/v1/address/postcodes?postcode=' + payload.postcode.replace(' ', ''),
        method: 'GET',
        passphrase: 'password',
        pfx: fs.readFileSync('ivory-client-cert-snd.pfx')
      }
      
      const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
      
        res.on('data', d => {
          process.stdout.write(d)
        })
      })
      
      req.on('error', error => {
        console.error(error)
      })
      
      req.end()

      return h.view('address-lookup', {
        errorSummaryText: '',
        errorText: false
      }) 
    }   
  }
}

module.exports = [{
  method: 'GET',
  path: '/address-lookup',
  handler: handlers.get
}, {
  method: 'POST',
  path: '/address-lookup',
  handler: handlers.post
}]
