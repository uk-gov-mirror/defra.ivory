'use strict'

const path = require('node:path')

const RedisService = require('../services/redis.service')
const config = require('./config')

const MAX_FILENAME_LENGTH = 100

// Allowlist-based sanitiser, as the disinfect plugin is disabled on upload routes.
// Strips directory components and control characters, and replaces any character
// that is not a letter, number, space or one of ._-() with an underscore.
const sanitiseFilename = filename => {
  if (typeof filename !== 'string') {
    return filename
  }

  const base = path
    .basename(filename.replaceAll('\\', '/'))
    .replace(/[\u0000-\u001f\u007f]/g, '') // eslint-disable-line no-control-regex
    .replace(/[^\p{L}\p{N}._\-() ]/gu, '_')
    .trim()

  if (base === '.' || base === '..') {
    return ''
  }

  const extension = path.extname(base)
  const name = base.slice(0, base.length - extension.length)

  return `${name.slice(0, MAX_FILENAME_LENGTH)}${extension.slice(0, 10)}`
}

const checkForDuplicates = (payload, uploadData) => {
  let duplicateFound

  if (uploadData.files && uploadData.fileSizes) {
    for (let i = 0; i < uploadData.files.length; i++) {
      if (
        uploadData.files[i] === payload.files.filename &&
        uploadData.fileSizes[i] === payload.files.bytes
      ) {
        duplicateFound = true
        break
      }
    }
  }

  return duplicateFound
}

const checkForFileSizeError = async (request, redisKey) => {
  const errors = []

  if (await RedisService.get(request, redisKey)) {
    errors.push({
      name: 'files',
      text: `The file must be smaller than ${config.maximumFileSize}MB`
    })
  }

  await RedisService.set(request, redisKey, false)

  return errors
}

module.exports = {
  checkForDuplicates,
  checkForFileSizeError,
  sanitiseFilename
}
