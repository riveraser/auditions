/**
 * I usualy use code "helpers/_helpers_name_.ts" to create one file to group logic for specific tasks like date manipulation, string manipulatios, randoms, etc.
 * but if we have an important logic then I usually use the "services" to be able to add more logic (either private or public methods) in the future
 */
import { once } from 'events'
import { createReadStream } from 'fs'
import { createInterface } from 'readline'
import { HeaderEnum } from '../enums/HeaderEnum'
import { OutputType } from '../types/OutpuType'
import configSensors from '../config/Sensors.json'

export default class FileParserService {
  constructor() {}

  /**
   * Will parse a filename, execute some comparaisongs basen on services and output the results
   *
   * @param {string} _filename The file to be parsed
   * @returns {Promise<OutputType>} The OutputType promise containing all the parsed data
   */
  evaluate = async (_filename: string): Promise<OutputType> => {
    /**
     * In a case we need to process big files we create a Stream and read line by line
     * instead of reading the whole archive, saving the whole content to an array and then looping to iterate!!!
     */
    const readLine = createInterface({
      input: createReadStream(_filename),
      crlfDelay: Infinity,
    })
    readLine.on('line', (line: string) => {
      // We process the line:
      if (line && line.toLocaleLowerCase().includes(HeaderEnum.REFERENCE)) {
        try {
          this.processHeaderLine(line)
        } catch (err) {
          throw new Error('Cannot parse the file Headline');
        }
      }
    })

    await once(readLine, 'close')

    console.log(configSensors)

    return {
      foo: ['bar', 'baz'],
    }
  }

  private processHeaderLine = (data: string) => {
    const arrData: string[] = data.replace(`${HeaderEnum.REFERENCE} `, '').split(' ')
    for (let i = 0; i < arrData.length; i += 2) {
      let name: keyof typeof configSensors = arrData[i] as keyof typeof configSensors
      configSensors[name].thresholds = Number(arrData[i + 1])
    }
  }
}
