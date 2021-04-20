'use strict'

const createServer = require('../../server')

const TestHelper = require('../utils/test-helper')
const { ServerEvents } = require('../../server/utils/constants')

describe('ivory-integral route', () => {
  let server
  const url = '/ivory-integral'
  const nextUrl = 'check-your-answers'

  const elementIDs = {
    ivoryIsIntegral: 'ivoryIsIntegral',
    ivoryIsIntegral2: 'ivoryIsIntegral-2',
    ivoryIsIntegral3: 'ivoryIsIntegral-3',
    continue: 'continue'
  }

  let document

  beforeAll(async done => {
    server = await createServer()
    server.events.on(ServerEvents.PLUGINS_LOADED, () => {
      done()
    })
  })

  afterAll(() => {
    server.stop()
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

    it('should have the correct page title', () => {
      const element = document.querySelector('.govuk-fieldset__legend')
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual(
        'How is the ivory integral to the item?'
      )
    })

    it('should have the correct radio buttons', () => {
      TestHelper.checkRadioOption(
        document,
        elementIDs.ivoryIsIntegral,
        'The ivory is essential to the design or function of the item',
        'The ivory is essential to the design or function of the item'
      )
      TestHelper.checkRadioOption(
        document,
        elementIDs.ivoryIsIntegral2,
        'You cannot remove the ivory easily or without damaging the item',
        'You cannot remove the ivory easily or without damaging the item'
      )
      TestHelper.checkRadioOption(
        document,
        elementIDs.ivoryIsIntegral3,
        'Both reasons - You cannot remove the ivory easily or without risk of damage and the ivory is essential to the design or function of the item',
        'Both of the above'
      )
    })

    it('should have the correct Call to Action button', () => {
      const element = document.querySelector(`#${elementIDs.continue}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Continue')
    })
  })

  describe('POST', () => {
    let response
    let postOptions

    beforeEach(() => {
      postOptions = {
        method: 'POST',
        url,
        payload: {}
      }
    })

    describe('Success', () => {
      it('should do store the value in Redis and progress to the next route when the first option has been selected', async () => {
        postOptions.payload.ivoryIsIntegral =
          'The ivory is essential to the design or function of the item'

        // TODO Test that value was stored by RedisService - Awaiting merge of PR-29
        // expect(RedisService.prototype.set).toBeCalledTimes(0)

        response = await TestHelper.submitPostRequest(server, postOptions)

        // TODO Test that value was stored by RedisService - Awaiting merge of PR-29
        // expect(RedisService.prototype.set).toBeCalledTimes(1)
        expect(response.headers.location).toEqual(nextUrl)
      })
    })

    describe('Failure', () => {
      const VALIDATION_SUMMARY_HEADING = 'There is a problem'

      it('should display a validation error message if the user does not select an item', async () => {
        postOptions.payload.ivoryIsIntegral = ''
        response = await TestHelper.submitPostRequest(server, postOptions, 400)
        await TestHelper.checkValidationError(
          response,
          'ivoryIsIntegral',
          'ivoryIsIntegral-error',
          VALIDATION_SUMMARY_HEADING,
          'You must tell us how the ivory is integral to the item'
        )
      })
    })
  })
})
