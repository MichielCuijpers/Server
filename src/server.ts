import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';

import { Resolvers } from './schema/Resolvers';
import { createConnection } from 'typeorm';
import { Ecoverse } from './models';


const main = async() => {

  require('dotenv').config()

  // Connect to the database
  try {
    const connection = await createConnection(
      {
        "type": "mysql",
        "host": process.env.DATABASE_HOST,
        "port": 3306,
        "username": "root",
        "password": process.env.MYSQL_ROOT_PASSWORD,
        "database": process.env.MYSQL_DATABASE,
        "insecureAuth": true,
        "synchronize": true,
        "logging": true,
          "entities": [
            "./src/models/index.ts"
          ],
          "migrations":[
            "src/migrations/**/*.ts"
          ]
      }
    );
    await connection.synchronize();
    console.log('Database connection established and data loaded');
  } catch (error) {
    console.log('Unable to establish database connection: ' + error); 
  }

  // Build the schema
  const schema = await buildSchema({
    resolvers: [ Resolvers ],
  });

  const apolloServer = new ApolloServer({ schema });
  const app = express();
  apolloServer.applyMiddleware({ app });
  app.listen(
    4000,
    () => console.log(`Server started on http://localhost:4000${apolloServer.graphqlPath}`),
  );
};

main();