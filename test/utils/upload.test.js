'use strict'

jest.mock('../../server/services/redis.service')

const { sanitiseFilename } = require('../../server/utils/upload')

describe('Upload utils', () => {
  describe('sanitiseFilename method', () => {
    it('should leave safe filenames unchanged', () => {
      expect(sanitiseFilename('document.pdf')).toEqual('document.pdf')
      expect(sanitiseFilename('My file (1)-final_v2.docx')).toEqual(
        'My file (1)-final_v2.docx'
      )
      expect(sanitiseFilename('Café.JPG')).toEqual('Café.JPG')
    })

    it('should remove HTML/script characters to prevent XSS', () => {
      const result = sanitiseFilename('<img src=x onerror=alert(1)>.pdf')

      expect(result).toEqual('_img src_x onerror_alert(1)_.pdf')
      expect(result).not.toMatch(/[<>=]/)
    })

    it('should replace quotes and ampersands', () => {
      expect(sanitiseFilename('a"b\'c&d.pdf')).toEqual('a_b_c_d.pdf')
    })

    it('should strip directory components', () => {
      expect(sanitiseFilename('../../etc/passwd.pdf')).toEqual('passwd.pdf')
      expect(sanitiseFilename('..\\..\\windows\\file.docx')).toEqual(
        'file.docx'
      )
    })

    it('should remove control characters', () => {
      expect(sanitiseFilename('a\u0000b\nc.pdf')).toEqual('abc.pdf')
    })

    it('should return an empty string for dot-only names', () => {
      expect(sanitiseFilename('.')).toEqual('')
      expect(sanitiseFilename('..')).toEqual('')
    })

    it('should limit the length of the name but keep the extension', () => {
      const result = sanitiseFilename(`${'a'.repeat(300)}.pdf`)

      expect(result).toEqual(`${'a'.repeat(100)}.pdf`)
    })

    it('should return non-string input unchanged', () => {
      expect(sanitiseFilename(undefined)).toBeUndefined()
    })
  })
})
