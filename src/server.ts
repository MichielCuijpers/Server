import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import { Request, Response } from 'express';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { LoadConfiguration } from './configuration-loader';
import { ConnectionFactory } from './connection-factory';
import { CreateMutations, Resolvers, UpdateMutations } from './schema';
import 'passport-azure-ad';
import { bearerStrategy } from './security/authentication'
import passport from 'passport';
import session from 'express-session';
import { cherrytwistAuthChecker } from './security';

const main = async () => {

  LoadConfiguration();

  // Connect to the database
  try {
    const connectionFactory = new ConnectionFactory();
    const connection = await connectionFactory.GetConnection();
    await connection.synchronize();
    console.log('Database connection established and data loaded');
  } catch (error) {
    console.log('Unable to establish database connection: ' + error);
  }

  // Build the schema
  const schema = await buildSchema({
    resolvers: [Resolvers, CreateMutations, UpdateMutations],
    authChecker: cherrytwistAuthChecker,
  });

  const getUser = (req: Request, res: Response) =>
    new Promise((resolve, reject) => {
      console.log(req.headers['authorization']);
      passport.authenticate('oauth-bearer', { session: true }, (err, user, info) => {

        console.log(err);
        console.log('User info: ', user);
        console.log('Validated claims: ', info);

        if (err) reject(err)
        resolve(user)
      })(req, res)
    })

  // Enable authentication or not.
  const AUTHENTICATION_ENABLED = process.env.AUTHENTICATION_ENABLED || false;
  console.log(`Authentication enabled: ${AUTHENTICATION_ENABLED}`)
  let apolloServer: ApolloServer;
  if (!AUTHENTICATION_ENABLED) {
    apolloServer = new ApolloServer({ schema });
  } else {
    apolloServer = new ApolloServer(
      {
        schema,
        context: async ({ res, req }) => {
          const user = await getUser(req, res);
          if (!user) throw new AuthenticationError('No user logged in!');
          console.log('User found', user);

          return user;
        }
      }
    );
  }
  const app = express();

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(bearerStrategy);

  //enable CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  apolloServer.applyMiddleware({ app, cors: false });

  const environment = process.env.NODE_ENV;
  const isDevelopment = environment === 'development';

  if (isDevelopment) {
    app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));
  }
  const sess = {
    secret: 'keyboard cat',
    cookie: {}
  }
  app.use(session(sess));

  const GRAPHQL_ENDPOINT_PORT = process.env.GRAPHQL_ENDPOINT_PORT || 4000;

  app.listen(
    GRAPHQL_ENDPOINT_PORT,
    () => console.log(`Server started on http://localhost:${GRAPHQL_ENDPOINT_PORT}`),
  );
};

main();
