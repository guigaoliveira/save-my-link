import { ApolloServer } from "apollo-server-express";
import express from "express";
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import resolvers from "./resolvers";

(async () => {
  await createConnection();

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
  };

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers, validate: false }),
    context: ({ req, res }) => ({ req, res })
  });

  const app = express();

  app.use("/favicons", express.static(path.join(__dirname, "assets/favicons")));

  apolloServer.applyMiddleware({ app, cors: corsOptions });

  app.listen(4000, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
    );
  });
})();
