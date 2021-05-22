import { createApplication } from 'graphql-modules';
import { userModule, authModule, postModule } from './modules';

const application = createApplication({
  modules: [userModule, authModule, postModule],
});

export const schema = application.createSchemaForApollo();
