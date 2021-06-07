import { IResolvers } from 'graphql-tools';
import { PhotoAlbum, User } from '../../../entity';
import { response } from '../../../utils';
import { unlink } from 'fs/promises';
import * as path from 'path';

export const resolvers: IResolvers = {
  Query: {
    getPhotoAlbumsByUserId: async (_, { userId }) => {
      if (!userId) {
        return response(false, 'Invalid user ID!');
      }

      const user = await User.findOne({
        where: { id: userId },
        relations: ['photoAlbums'],
      });
      if (!user) {
        return response(false, 'There is no user with this ID!');
      }

      return user.photoAlbums.sort((a, b) => b.id - a.id);
    },
  },
  Mutation: {
    createPhotoAlbum: async (_, { title, description }, { req }) => {
      if (!req.userId) {
        return response(false, 'The user is not authorized!');
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return response(false, 'There is no user with this ID!');
      }

      const photoAlbum = await PhotoAlbum.create({
        title,
        description: description ? description : '',
        user,
      }).save();
      if (!photoAlbum) {
        return response(false, "Photo album hasn't been created!");
      }

      return response(
        true,
        `Photo album ${photoAlbum.title} has been created!`
      );
    },
    updatePhotoAlbum: async (
      _,
      { photoAlbumId, title, description },
      { req }
    ) => {
      if (!req.userId) {
        return response(false, 'The user is not authorized!');
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return response(false, 'There is no user with this ID!');
      }

      const photoAlbum = await PhotoAlbum.findOne({
        where: { id: photoAlbumId, user },
      });
      if (!photoAlbum) {
        return response(
          false,
          'There is no photo album with this ID or you do not own it!'
        );
      }

      if (photoAlbum.title === 'Avatars') {
        return response(
          false,
          'You cannot change the name of the Avatars photo album.'
        );
      }

      if (title) {
        photoAlbum.title = title;
      }
      if (description) {
        photoAlbum.description = description;
      }

      await photoAlbum.save();

      return response(
        true,
        `Photo Album ${photoAlbum.title} has been updated!`
      );
    },
    removePhotoAlbum: async (_, { photoAlbumId }, { req }) => {
      if (!req.userId) {
        return response(false, 'The user is not authorized!');
      }

      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['photoAlbums'],
      });
      if (!user) {
        return response(false, 'There is no user with this ID!');
      }

      const photoAlbum = await PhotoAlbum.findOne({
        where: { id: photoAlbumId, user },
        relations: ['photos'],
      });
      if (!photoAlbum) {
        return response(
          false,
          'There is no photo album with this ID or you do not own it!'
        );
      }

      const title = photoAlbum.title;
      if (title === 'Avatars') {
        user.avatar = null;
        await user.save();
      }

      photoAlbum.photos.forEach(async photo => {
        const pathName = path.join('public', 'photos', photo.filename);
        try {
          await unlink(pathName);
          await photo.remove();
        } catch (error) {
          console.log(error);
          return response(false, `Photo album ${title} has not been removed!`);
        }
      });
      user.photoAlbums = user.photoAlbums.map(photoAlbum =>
        photoAlbum.id === photoAlbumId ? null : photoAlbum
      );
      await user.save();
      await photoAlbum.remove();

      return response(true, `Photo album ${title} has been removed!`);
    },
  },
};
