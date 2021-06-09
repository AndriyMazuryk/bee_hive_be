import { createApplication } from 'graphql-modules';
import {
  uploadModule,
  userModule,
  authModule,
  postModule,
  photoModule,
  photoAlbumModule,
  opinionModule,
  messageModule,
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
    messageModule,
  ],
});

export const schema = application.createSchemaForApollo();
