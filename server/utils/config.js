'use strict'

const joi = require('joi')
const envs = ['development', 'test', 'production']

// Define config schema
const schema = joi.object().keys({
  env: joi
    .string()
    .valid(...envs)
    .default(envs[0]),
  port: joi.number().default(3000),
  serviceName: joi.string().default('No service name in .env'),
  redisHost: joi.string().default('127.0.0.1'),
  redisPort: joi.number().default(6379),
  serviceApiEnabled: joi
    .bool()
    .valid(true, false)
    .default(false),
  serviceApiHost: joi.string().default('127.0.0.1'),
  serviceApiPort: joi.number().default(3010),
  cookieValidationPassword: joi.string()
})

// Build config
const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  serviceName: process.env.SERVICE_NAME,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  serviceApiEnabled: process.env.SERVICE_API_ENABLED,
  serviceApiHost: process.env.SERVICE_API_HOST,
  serviceApiPort: process.env.SERVICE_API_PORT,
  cookieValidationPassword: process.env.COOKIE_VALIDATION_PASSWORD
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

// Add some helper props
value.isDev = value.env === 'development'

module.exports = value
