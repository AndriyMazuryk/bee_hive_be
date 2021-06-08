import { createApplication } from 'graphql-modules';
import {
  uploadModule,
  userModule,
  authModule,
  postModule,
  photoModule,
  photoAlbumModule,
  karmaModule,
} from './modules';

const application = createApplication({
  modules: [
    uploadModule,
    userModule,
    authModule,
    postModule,
    photoModule,
    photoAlbumModule,
    karmaModule,
  ],
});

export const schema = application.createSchemaForApollo();
