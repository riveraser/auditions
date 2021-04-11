import faker from "faker";
import { Connection } from "typeorm";
import { Application } from "../api/entity/application";
import { clearDb, getConnection } from "./connection";

async function seed() {
  const connection = await getConnection();
  await clearDb(connection);

  for (let i = 0; i < 20; i++) {
    await Application.create({
      title: faker.lorem.words(4),
      excerpt: faker.lorem.sentences(2),
    }).save();
  }

  process.exit();
}

seed();
