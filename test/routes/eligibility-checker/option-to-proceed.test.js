'use strict'

jest.mock('../../../server/services/redis.service')
const RedisService = require('../../../server/services/redis.service')

const TestHelper = require('../../utils/test-helper')

describe('/eligibility-checker/option-to-proceed route', () => {
  let server
  const url = '/eligibility-checker/option-to-proceed'
  const nextUrl = '/eligibility-checker/selling-to-museum'
  const nextUrlDoNotContinue = '/eligibility-checker/do-not-need-service'

  const elementIds = {
    pageTitle: 'pageTitle',
    introPara: 'introPara',
    option1: 'optionToProceed',
    option2: 'optionToProceed-2',
    callToAction: 'callToAction'
  }

  let document

  beforeAll(async () => {
    server = await TestHelper.createServer()
  })

  afterAll(async () => {
    await server.stop()
  })

  beforeEach(() => {
    _createMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    const getOptions = {
      method: 'GET',
      url
    }

    beforeEach(async () => {
      document = await TestHelper.submitGetRequest(server, getOptions)
    })

    it('should have the Beta banner', () => {
      TestHelper.checkBetaBanner(document)
    })

    it('should have the Back link', () => {
      TestHelper.checkBackLink(document)
    })

    it('should have the correct page heading', () => {
      const element = document.querySelector(
        `#${elementIds.pageTitle} > legend > h1`
      )
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual(
        'Do you wish to proceed?'
      )
    })

    it('should have the correct radio buttons', () => {
      TestHelper.checkRadioOption(
        document,
        elementIds.option1,
        'Assume item contains ivory and proceed with registration',
        'Assume item contains ivory and proceed with registration',
        false,
        ''
      )

      TestHelper.checkRadioOption(
        document,
        elementIds.option2,
        'Do not continue with registration',
        'Do not continue with registration',
        false,
        ''
      )
    })

    it('should have the correct Call to Action button', () => {
      const element = document.querySelector(`#${elementIds.callToAction}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Confirm and submit')
    })
  })

  describe('POST', () => {
    let postOptions

    beforeEach(() => {
      postOptions = {
        method: 'POST',
        url,
        payload: {}
      }
    })

    describe('Success', () => {
      it('should store the value in Redis and progress to the next route when the first option has been selected', async () => {
        await _checkSelectedRadioAction(
          postOptions,
          server,
          'Assume item contains ivory and proceed with registration',
          nextUrl
        )
      })

      it('should delete value from Redis and end user journey if second option selected', async () => {
        await _checkSelectedRadioAction(
          postOptions,
          server,
          'Do not continue with registration',
          nextUrlDoNotContinue
        )
      })
    })

    describe('Failure', () => {
      it('should display a validation error message if the user does not select an item', async () => {
        postOptions.payload.whatSpecies = ''
        const response = await TestHelper.submitPostRequest(
          server,
          postOptions,
          400
        )
        await TestHelper.checkValidationError(
          response,
          'optionToProceed',
          'optionToProceed-error',
          'Please choose an option'
        )
      })
    })
  })
})

const _createMocks = () => {
  TestHelper.createMocks()

  RedisService.get = jest.fn()
}

const _checkSelectedRadioAction = async (
  postOptions,
  server,
  selectedOption,
  nextUrl
) => {
  const redisKey = 'option-to-proceed'
  postOptions.payload.optionToProceed = selectedOption

  expect(RedisService.set).toBeCalledTimes(0)

  const response = await TestHelper.submitPostRequest(server, postOptions)

  if (selectedOption === 'Do not continue with registration') {
    expect(RedisService.delete).toBeCalledTimes(1)
    expect(RedisService.delete).toBeCalledWith(expect.any(Object), redisKey)
  } else {
    expect(RedisService.set).toBeCalledTimes(1)
    expect(RedisService.set).toBeCalledWith(
      expect.any(Object),
      redisKey,
      selectedOption
    )
  }

  expect(response.headers.location).toEqual(nextUrl)
}
