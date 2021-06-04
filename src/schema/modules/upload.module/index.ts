import 'graphql-import-node';
import { createModule } from 'graphql-modules';
import * as typeDefs from './typeDefs.graphql';
import { resolvers } from './resolvers';

export const uploadModule = createModule({
  id: 'upload',
  dirname: __dirname,
  typeDefs: [typeDefs],
  resolvers: resolvers,
});
