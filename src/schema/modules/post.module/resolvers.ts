import { IResolvers } from 'graphql-tools';
import { User, Post, Wall } from '../../../entity';
import { response, message } from '../../../utils';

export const resolvers: IResolvers = {
  Query: {
    getAllPosts: async () => {
      return await Post.find();
    },
    getPostById: async (_, { postId }) => {
      return await Post.findOne(postId);
    },
    getLastPostByAuthor: async (_, { authorId }) => {
      //
    },
    getPostsByAuthorId: async (_, { authorId }) => {
      const user = await User.findOne({
        where: { id: authorId },
        relations: ['posts'],
      });
      if (!user) {
        return null;
      }

      return user.posts.sort((a, b) => b.id - a.id);
    },
    getWallPostsByUserId: async (_, { userId }) => {
      const user = await User.findOne({
        where: { id: userId },
        relations: ['wall'],
      });
      if (!user || !user.wall) {
        return null;
      }

      const posts = await Post.find({
        where: { wall: user.wall },
        relations: ['author', 'author.avatar'],
      });
      if (!posts) {
        return null;
      }
      if (posts.length < 1) {
        return [];
      }

      return posts.sort((a, b) => b.id - a.id);
    },
  },
  Mutation: {
    createPost: async (_, { recipientId, text }, { req }) => {
      if (!req.userId) {
        return response(false, message.notAuthorized);
      }

      if (text.length < 1) {
        return response(false, message.emptyTextField);
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return response(false, message.invalidUserId);
      }

      const recipient = await User.findOne({
        where: { id: recipientId },
        relations: ['wall'],
      });
      if (!recipient || !recipient.wall) {
        return response(false, message.invalidUserIdToSendPost);
      }

      const wall = await Wall.findOne({ where: { id: recipient.wall.id } });
      if (!wall) {
        return response(false, message.userDoesNotHaveWall);
      }

      const post = await Post.create({
        text,
        author: user,
        wall,
      }).save();
      if (!post) {
        return response(false, message.postFail);
      }

      return response(true, message.postSuccess);
    },
    updatePost: async (_, { postId, text }, { req }) => {
      if (!req.userId) {
        return response(false, message.notAuthorized);
      }

      if (text.length < 1) {
        return response(false, message.emptyTextField);
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return response(false, message.invalidUserId);
      }

      const post = await Post.findOne({ where: { id: postId, author: user } });
      if (!post) {
        return response(false, message.invalidPostId);
      }

      post.text = text;
      const success = await post.save();
      if (!success) {
        return response(false, message.postNotUpdated);
      }

      return response(true, message.postUpdated);
    },
    removePost: async (_, { postId }, { req }) => {
      if (!req.userId) {
        return response(false, message.notAuthorized);
      }

      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['wall'],
      });
      if (!user) {
        return response(false, message.invalidUserId);
      }

      const post = await Post.findOne({
        where: [
          { id: postId, author: user },
          { id: postId, wall: user.wall },
        ],
      });
      if (!post) {
        return response(false, message.invalidPostId);
      }

      const success = await post.remove();
      if (!success) {
        return response(false, message.postNotRemoved);
      }

      return response(true, message.postRemoved);
    },
  },
};
