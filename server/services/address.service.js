'use strict'

const fetch = require('node-fetch')
const { readFileSync } = require('fs')
const { resolve } = require('path')
const https = require('https')

module.exports = class AddressService {
  static async addressSearch (postcode) {
    const authOptions = {
      passphrase: '3pJ8jUhvKQ',
      pfx: readFileSync(
        resolve('ivory-client-cert-snd.pfx')
      ),
      keepAlive: false
    }
    const tlsConfiguredAgent = new https.Agent(authOptions)

    const searchOptions = {
      agent: tlsConfiguredAgent
    }

    const response = await fetch(`https://integration-snd.azure.defra.cloud/ws/rest/DEFRA/v1/address/postcodes?postcode=${postcode}`, searchOptions)
    const json = await response.json()
    return json
  }
}
