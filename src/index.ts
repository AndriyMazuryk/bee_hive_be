import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './schema';
import { createConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import { User } from './entity';
import { createTokens } from './auth';

const startServer = async () => {
  dotenv.config();

  const app = express();
  const server = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
  });
  await server.start();

  await createConnection();

  app.use(cookieParser());

  app.use(async (req: any, res, next) => {
    const refreshToken = req.cookies['refresh-token'];
    const accessToken = req.cookies['access-token'];

    if (!refreshToken && !accessToken) {
      return next();
    }

    try {
      const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;
      req.userId = data.userId;
      return next();
    } catch {}

    if (!refreshToken) {
      return next();
    }

    let data;

    try {
      data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as any;
    } catch {
      return next();
    }

    const user = await User.findOne(data.userId);
    // token has been invalidated
    if (!user || user.count !== data.count) {
      return next();
    }

    const tokens = createTokens(user);
    res.cookie('access-token', tokens.accessToken, {
      expires: new Date(Date.now() + 60 * 15 * 1000),
    });
    res.cookie('refresh-token', tokens.refreshToken, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
    });
    req.userId = user.id;

    next();
  });

  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: 'http://localhost:3000',
    },
  });

  await new Promise(() =>
    app.listen({ port: 4000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      )
    )
  );
  return { server, app };
};

startServer();
