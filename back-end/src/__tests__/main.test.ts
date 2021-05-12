import { promises as fs } from 'fs'
import FileParserService from '../services/FileParserService'

describe('Main', () => {
  for (let i = 1; i < 3; i++) {
    
    // We need to reinstantiate the class or the returning log will persist!
    const fileParserService: FileParserService = new FileParserService();
    
    it(`works ${i}`, async () => {
      const output = await fileParserService.evaluate(__dirname + `/test-${i}.log`)
      const result = JSON.parse(
        (await fs.readFile(__dirname + `/test-${i}.results.json`)).toString()
      )
      expect(Object.keys(output)).toEqual(expect.arrayContaining(Object.keys(result)))
      Object.keys(result).forEach((k) => {
        expect(output[k].sort()).toEqual(result[k].sort())
      })
      
    })
  }
})
