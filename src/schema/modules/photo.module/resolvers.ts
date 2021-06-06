import { IResolvers } from 'graphql-tools';
import { User, Photo, PhotoAlbum } from '../../../entity';
import { response, message, uploadFile } from '../../../utils';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

export const resolvers: IResolvers = {
  Query: {
    getAllPhotoUrls: async () => {
      const urls = await Photo.find({ select: ['url'] });
      if (!urls) {
        return null;
      }

      return urls.map(i => i.url);
    },
    getPhotosByUserId: async (_, { userId }) => {
      if (!userId) {
        return null;
      }

      const user = await User.findOne({
        where: { id: userId },
        relations: ['photos'],
      });
      if (!user) {
        return null;
      }

      return user.photos.sort((a, b) => b.id - a.id);
    },
    getPhotosByPhotoAlbumId: async (_, { photoAlbumId }) => {
      if (!photoAlbumId) {
        return null;
      }

      const photoAlbum = await PhotoAlbum.findOne({
        where: { id: photoAlbumId },
        relations: ['photos'],
      });
      if (!photoAlbum) {
        return null;
      }

      return photoAlbum.photos.sort((a, b) => b.id - a.id);
    },
  },
  Mutation: {
    uploadPhoto: async (_, { photoAlbumId, file, isAvatar }, { req }) => {
      if (!req.userId) {
        return response(false, message.notAuthorized);
      }

      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['photoAlbums', 'photos', 'avatar'],
      });
      if (!user) {
        return response(false, message.invalidUserId);
      }

      if (!photoAlbumId && !isAvatar) {
        return response(false, message.needPhotoAlbumIdOrAvatar);
      }

      let photoAlbum;
      if (isAvatar) {
        photoAlbum = await PhotoAlbum.findOne({
          where: { title: 'Avatars', user },
        });

        if (!photoAlbum) {
          photoAlbum = await PhotoAlbum.create({
            title: 'Avatars',
            description: 'My avatars',
          }).save();
        } else {
          const oldAvatar = await Photo.findOne({
            where: { photoAlbum, isAvatar },
          });
          if (!oldAvatar) {
            return;
          }
          oldAvatar.isAvatar = false;
          await oldAvatar.save();
        }
      } else {
        photoAlbum = await PhotoAlbum.findOne({
          where: { id: photoAlbumId, user },
          relations: ['user'],
        });
      }
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
          isAvatar,
        }).save();

        if (isAvatar) {
          user.photoAlbums.push(photoAlbum);
          user.photos.push(photo);
          user.avatar = photo;
          await user.save();
        }

        return uploadedFile;
      } catch (error) {
        console.log('Error!', error);
        return error;
      }
    },
    removePhoto: async (_, { photoId }, { req }) => {
      if (!req.userId) {
        return response(false, message.notAuthorized);
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return response(false, message.invalidUserId);
      }

      const photo = await Photo.findOne({ where: { id: photoId, user } });
      if (!photo) {
        return response(false, message.invalidPhotoOrUserId);
      }

      let resp = response(true, message.photoRemoved);
      try {
        await photo.remove();
      } catch (error) {
        resp = response(false, message.photoNotRemoved);
      }

      return resp;
    },
  },
};
