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
import SensorDetailsInterface from '../interfaces/SensorDetailsInterface'
import SensorDataInterface from '../interfaces/SensorDataInterface'
import SensorConfigDetailInterface from '../interfaces/SensorConfigDetailInterface'

export default class FileParserService {
  private currentSensor: SensorDataInterface
  private consolidatedLog: OutputType
  constructor() {
    this.currentSensor = { name: '', id: '', details: [] }
  }

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
      const lineName: keyof typeof HeaderEnum = line
        .toLocaleUpperCase()
        .split(' ')[0] as keyof typeof HeaderEnum
      
      // parsing the first line 
      if (HeaderEnum[lineName] === HeaderEnum.REFERENCE) {
        try {
          this.processHeaderLine(line)
        } catch (err) {
          throw new Error('Cannot parse the file Headline')
        }

        // The Sensor name and Id
      } else if (HeaderEnum[lineName]) {
        const id: string = line.split(' ')[1]

        if (
          this.currentSensor.name !== HeaderEnum[lineName].toString() ||
          this.currentSensor.id !== id
        ) {
          if (this.currentSensor.name !== '') this.processSensorLine(this.currentSensor)
          this.currentSensor.name = HeaderEnum[lineName].toString()
          this.currentSensor.id = id
          this.currentSensor.details = []
        }

        // The specific sensor reads will add details to current sensor
      } else {
        const arrLineData: string[] = line.split(' ')
        const newSensorDetail: SensorDetailsInterface = {
          date: arrLineData[0],
          value: Number(arrLineData[1]),
        }
        this.currentSensor.details.push(newSensorDetail)
      }
    })

    await once(readLine, 'close')

    // This will process any remaining sensor data if we reached the last file line
    this.processSensorLine(this.currentSensor)

    return this.consolidatedLog
  }

  /**
   * Will parse the first line, get the base values and save them at each sensor config property
   * 
   * @param {string} data 
   */
  private processHeaderLine = (data: string) => {
    const arrData: string[] = data.replace(`${HeaderEnum.REFERENCE} `, '').split(' ')
    // pair: name ... odd: threshold value
    for (let i = 0; i < arrData.length; i += 2) {
      let name: keyof typeof configSensors = arrData[i] as keyof typeof configSensors
      configSensors[name].thresholds = Number(arrData[i + 1])
    }
  }

  /**
   * The main code to process the lines for each sensor it wont returnt the log
   * but instead it will set the OutputType private var inside the this class
   * 
   * @param {SensorDataInterface} sensor 
   */
  private processSensorLine = (sensor: SensorDataInterface) => {
    const currentSensorConfig: SensorConfigDetailInterface =
      configSensors[sensor.name as keyof typeof configSensors]
    
      //When processing the line if any sensors fails
    // we return it to add to the log
    let retSensor: SensorDataInterface | undefined

    switch (currentSensorConfig.method) {
      case 'average':
        retSensor = this.processAverage(sensor, currentSensorConfig)
        break
      case 'sum':
        retSensor = this.processSum(sensor, currentSensorConfig)
        break
      case 'standard':
        retSensor = this.processStandard(sensor, currentSensorConfig)
        break
    }

    if (retSensor) {
      const { id, name } = retSensor
      // Do we already have mapped the sensor id in the log?
      if (this.consolidatedLog && this.consolidatedLog[id]) {
        this.consolidatedLog[id].push(name)
      } else {
        this.consolidatedLog = { ...this.consolidatedLog }
        this.consolidatedLog[id] = []
        this.consolidatedLog[id].push(name)
      }
    }
  }

  /**
   *  Will sum, get the total then calculte the average and check if that average meets the threshold
   *
   * @param {SensorDataInterface} sensor
   * @param {SensorConfigDetailInterface} currentSensorConfig
   * @returns {SensorDataInterface} | {undefined}
   */

  private processAverage = (
    sensor: SensorDataInterface,
    currentSensorConfig: SensorConfigDetailInterface
  ): SensorDataInterface | undefined => {
    let isOk = true
    let sumTotal = 0
    let average = 0
    const threshold = currentSensorConfig.base * currentSensorConfig.thresholds
    sensor.details.forEach((el) => {
      sumTotal += el.value
    })
    average = sumTotal / sensor.details.length

    if (currentSensorConfig.operator === '<') {
      if (average < threshold) {
        isOk = false
      }
    } else {
      if (average > threshold) {
        isOk = false
      }
    }
    return isOk ? undefined : sensor
  }

  /**
   * Will sum all the lines for a sensor and check is the total meets the threshold
   *
   * @param {SensorDataInterface} sensor the current sensor information
   * @param {SensorConfigDetailInterface} currentSensorConfig the sensor configuration
   * @returns {SensorDataInterface, undefined}
   */
  private processSum = (
    sensor: SensorDataInterface,
    currentSensorConfig: SensorConfigDetailInterface
  ): SensorDataInterface | undefined => {
    let isOk = true
    let sumTotal = 0
    const threshold = currentSensorConfig.base * currentSensorConfig.thresholds
    sensor.details.forEach((el) => {
      sumTotal += el.value
    })
    if (currentSensorConfig.operator === '<') {
      if (sumTotal < threshold) {
        isOk = false
      }
    } else {
      if (sumTotal > threshold) {
        isOk = false
      }
    }
    return isOk ? undefined : sensor
  }

  /**
   * As I understood the deviation < 2 : line value - threshold value will be negative or positive but must be between
   * the range deviation | examples:
   * - threshold 5 (0)  line value = 8 deviation is 3 (8-5) so is NOT OK
   * - threshold 5 (0)  line value = 2 deviation is -3 (2-5) so still NOT OK since absoltue value is 3
   * - threshold 5 (0)  line value = 6 deviation is 1 (6-5) so this is OK
   *
   * So if one line fails, then whe whole sensor fails
   *
   * @param {SensorDataInterface} sensor the current sensor information
   * @param {SensorConfigDetailInterface} currentSensorConfig the sensor configuration
   * @returns {SensorDataInterface} | {undefined}
   */
  private processStandard = (
    sensor: SensorDataInterface,
    currentSensorConfig: SensorConfigDetailInterface
  ): SensorDataInterface | undefined => {
    let isOk = true
    let maxLen = sensor.details.length

    for (let i = 0; i < maxLen; i++) {
      const deviation = Math.abs(sensor.details[i].value - currentSensorConfig.thresholds)

      // Operator is greater or less than?
      if (currentSensorConfig.operator === '<') {
        if (deviation > currentSensorConfig.base) {
          isOk = false
          i = maxLen //we stop as soon af we found one that fails
        }
      } else {
        if (deviation < currentSensorConfig.base) {
          isOk = false
          i = maxLen //we stop as soon af we found one that fails
        }
      }
    }
    return isOk ? undefined : sensor
  }
}
