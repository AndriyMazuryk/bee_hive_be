import 'graphql-import-node';
import { createModule } from 'graphql-modules';
import * as typeDefs from './typeDefs.graphql';
import { resolvers } from './resolvers';

export const messageModule = createModule({
  id: 'message',
  dirname: __dirname,
  typeDefs: [typeDefs],
  resolvers: resolvers,
});
