'use strict'

const { Paths } = require('../../../utils/constants')
const { get, post } = require('../../common/address-find.route')

module.exports = [
  {
    method: 'GET',
    path: `${Paths.OWNER_ADDRESS_FIND}`,
    handler: get
  },
  {
    method: 'POST',
    path: `${Paths.OWNER_ADDRESS_FIND}`,
    handler: post
  }
]
