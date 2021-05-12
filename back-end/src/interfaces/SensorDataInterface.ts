import SensorDetailsInterface from './SensorDetailsInterface'
export default interface SensorDataInterface {
  name: string, 
  id: string
  details: SensorDetailsInterface[]
}
