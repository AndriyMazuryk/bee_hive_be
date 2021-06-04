import { createApplication } from 'graphql-modules';
import {
  uploadModule,
  userModule,
  authModule,
  postModule,
  photoModule,
  photoAlbumModule,
} from './modules';

const application = createApplication({
  modules: [
    uploadModule,
    userModule,
    authModule,
    postModule,
    photoModule,
    photoAlbumModule,
  ],
});

export const schema = application.createSchemaForApollo();
