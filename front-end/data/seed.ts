import faker from 'faker'
import { Connection } from 'typeorm'
import { Application } from '../api/entity/application'
import { clearDb, getConnection } from './connection'

async function seed() {
  const connection = await getConnection()
  await clearDb(connection)

  const appMachineConfig = new Application().machine.config.states

  for (let i = 0; i < 20; i++) {
    const application = await Application.create({
      title: faker.lorem.words(4),
      excerpt: faker.lorem.sentences(2),
      state: randomState(Object.keys(appMachineConfig)),
    }).save()
  }

  process.exit()
}

function randomState(states: string[]): string {
  return states[Math.floor(Math.random() * states.length)]
}

seed()
