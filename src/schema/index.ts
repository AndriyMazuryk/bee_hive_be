import { createApplication } from 'graphql-modules';
import { userModule, authModule, postModule, photoModule } from './modules';

const application = createApplication({
  modules: [userModule, authModule, postModule, photoModule],
});

export const schema = application.createSchemaForApollo();
