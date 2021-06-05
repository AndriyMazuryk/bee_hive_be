import { IResolvers } from 'graphql-tools';
import { User, Photo, PhotoAlbum } from '../../../entity';
import { response, message, uploadFile } from '../../../utils';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

export const resolvers: IResolvers = {
  Query: {
    getAllPhotoUrls: async () => {
      const urls = await Photo.find({ select: ['url'] });
      return urls.map(i => i.url);
    },
    getPhotosByUserId: async (_, { userId }) => {
      //
    },
  },
  Mutation: {
    uploadPhoto: async (_, { photoAlbumId, file }, { req }) => {
      if (!req.userId) {
        return response(false, message.notAuthorized);
      }

      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['photos', 'avatar'],
      });
      if (!user) {
        return response(false, message.invalidUserId);
      }

      const photoAlbum = await PhotoAlbum.findOne({
        where: { id: photoAlbumId, user },
        relations: ['user'],
      });
      if (!photoAlbum) {
        return response(false, message.invalidPhotoAlbumOrUserId);
      }

      const { createReadStream, filename, mimetype, encoding } = await file;

      const filenameWithUuid = `${uuid()}-${filename}`;
      const pathName = path.join(`./public/photos/${filenameWithUuid}`);
      const url = `http://localhost:4000/photos/${filenameWithUuid}`;

      let uploadedFile;
      try {
        uploadedFile = await uploadFile(createReadStream, pathName);
        const photo = await Photo.create({
          filename: filenameWithUuid,
          mimetype,
          encoding,
          url,
          user,
          photoAlbum,
        }).save();
        return uploadedFile;
      } catch (error) {
        console.log('Error!', error);
        return error;
      }
    },
  },
};
