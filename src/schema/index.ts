import { createApplication } from 'graphql-modules';
import {
  uploadModule,
  userModule,
  authModule,
  postModule,
  photoModule,
} from './modules';

const application = createApplication({
  modules: [uploadModule, userModule, authModule, postModule, photoModule],
});

export const schema = application.createSchemaForApollo();
