import { IResolvers } from 'graphql-tools';
import { User, Photo } from '../../../entity';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

export const resolvers: IResolvers = {
  Query: {
    getAllPhotoLocations: async () => {
      const locations = await Photo.find({ select: ['location'] });
      return locations.map(i => i.location);
    },
    getPhotosByUserId: async (_, { userId }) => {
      //
    },
  },
  Mutation: {
    uploadPhoto: async (_, { file, avatar }, { req }) => {
      if (!req.userId) {
        return false;
      }
      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['photos', 'avatar'],
      });
      let isAvatar = false;
      if (avatar) {
        isAvatar = true;
      }
      const { createReadStream, filename, mimetype, encoding } = await file;

      const filenameWithUuid = `${uuid()}-${filename}`;
      const pathName = path.join(`./public/photos/${filenameWithUuid}`);
      const location = `http://localhost:4000/photos/${filenameWithUuid}`;
      const stream = createReadStream();

      return new Promise((resolve, reject) => {
        stream
          .pipe(fs.createWriteStream(pathName))
          .on('finish', async () => {
            const photo = await Photo.create({
              filename: filenameWithUuid,
              encoding,
              mimetype,
              location,
              isAvatar,
            }).save();
            user.photos.push(photo);
            if (isAvatar) {
              user.avatar = photo;
            }
            await user.save();
            resolve({
              success: true,
              message: 'Successfully Uploaded',
              mimetype,
              filename: filenameWithUuid,
              encoding,
              location,
            });
          })
          .on('error', err => {
            console.log('Error Event Emitted');
            reject({
              success: false,
              message: 'Failed',
            });
          });
      });
    },
  },
};
