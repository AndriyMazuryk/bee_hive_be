import 'graphql-import-node';
import { createModule } from 'graphql-modules';
import * as typeDefs from './typeDefs.graphql';
import { resolvers } from './resolvers';

export const photoModule = createModule({
  id: 'photo',
  dirname: __dirname,
  typeDefs: [typeDefs],
  resolvers: resolvers,
});
