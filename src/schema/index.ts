import { createApplication } from 'graphql-modules';
import {
  uploadModule,
  userModule,
  authModule,
  postModule,
  photoModule,
  photoAlbumModule,
  opinionModule,
} from './modules';

const application = createApplication({
  modules: [
    uploadModule,
    userModule,
    authModule,
    postModule,
    photoModule,
    photoAlbumModule,
    opinionModule,
  ],
});

export const schema = application.createSchemaForApollo();
