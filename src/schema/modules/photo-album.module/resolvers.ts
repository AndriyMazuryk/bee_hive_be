import { IResolvers } from 'graphql-tools';
import { PhotoAlbum, User } from '../../../entity';
import { response } from '../../../utils';

export const resolvers: IResolvers = {
  Query: {},
  Mutation: {
    createPhotoAlbum: async (_, { title, description }, { req }) => {
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

      const photoAlbum = await PhotoAlbum.create({
        title,
        description,
      }).save();
      if (!photoAlbum) {
        return response(false, "Photo album hasn't been created!");
      }

      user.photoAlbums.push(photoAlbum);
      await user.save();

      return response(
        true,
        `Photo album ${photoAlbum.title} has been created!`
      );
    },
    removePhotoAlbum: async (_, { photoAlbumId }, { req }) => {
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

      const title = photoAlbum.title;
      await photoAlbum.remove();

      return response(true, `Photo album ${title} has been removed!`);
    },
  },
};
