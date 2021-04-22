'use strict'

const config = require('../utils/config')
const fetch = require('node-fetch')
const { readFileSync } = require('fs')
const { resolve } = require('path')
const https = require('https')

module.exports = class AddressService {
  static async addressSearch (nameNumber, postcode) {
    const authOptions = {
      passphrase: config.addressLookupPassphrase,
      pfx: readFileSync(
        resolve(config.addressLookupPfxCert)
      ),
      keepAlive: false
    }
    const tlsConfiguredAgent = new https.Agent(authOptions)

    const searchOptions = {
      agent: tlsConfiguredAgent
    }

    const response = await fetch(`${config.addressLookupUrl}/ws/rest/DEFRA/v1/address/postcodes?postcode=${postcode}`, searchOptions)
    const json = await response.json()

    if (nameNumber) {
      // Filter the results
    }
    return json
  }
}
