'use strict'

const { Paths } = require('../../../utils/constants')
const { get, post } = require('../../common/address-international.route')

module.exports = [
  {
    method: 'GET',
    path: `${Paths.OWNER_ADDRESS_INTERNATIONAL}`,
    handler: get
  },
  {
    method: 'POST',
    path: `${Paths.OWNER_ADDRESS_INTERNATIONAL}`,
    handler: post
  }
]
