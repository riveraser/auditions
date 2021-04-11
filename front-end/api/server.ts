import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { ApplicationResolver } from "./entity/application";
import { buildSchema } from "type-graphql";
import { getConnection } from "../data/connection";
import { ReviewResolver } from "./entity/review";

async function main() {
  await getConnection();
  const schema = await buildSchema({
    resolvers: [ApplicationResolver, ReviewResolver],
  });
  const server = new ApolloServer({ schema });
  await server.listen(4000);
  console.log("Server has started!");
}

main();
