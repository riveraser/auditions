import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { Application } from "../api/entity/application";
import { Review } from "../api/entity/review";

const options: ConnectionOptions = {
  type: "sqlite",
  database: "data/api.sqlite",
  entities: [Application, Review],
  logging: true,
  synchronize: true,
};

export const clearDb = async (connection: Connection) => {
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    const repository = await connection.getRepository(entity.name);
    await repository.query(`DELETE FROM "${entity.tableName}";`);
  }
};

export const getConnection = async () => {
  return await createConnection(options);
};
