import { IResolvers } from 'graphql-tools';
import { User, Post, Wall } from '../../../entity';

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
        return false;
      }

      return user.posts.sort((a, b) => b.id - a.id);
    },
    getWallPostsByUserId: async (_, { userId }) => {
      const user = await User.findOne({
        where: { id: userId },
        relations: ['wall'],
      });
      if (!user || !user.wall) {
        return false;
      }

      const wall = await Wall.findOne({
        where: { id: user.wall.id },
        relations: ['posts'],
      });
      if (!wall) {
        return false;
      }

      return wall.posts.sort((a, b) => b.id - a.id);
    },
  },
  Mutation: {
    createPost: async (_, { recipientId, text }, { req }) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }

      const recipient = await User.findOne({
        where: { id: recipientId },
        relations: ['wall'],
      });
      if (!recipient || !recipient.wall) {
        return false;
      }

      const wall = await Wall.findOne({ where: { id: recipient.wall.id } });
      if (!wall) {
        return false;
      }

      // create post
      const post = new Post();
      post.text = text;
      post.author = user;
      post.wall = wall;
      await post.save();

      return true;
    },
    updatePost: async (_, { postId, text }, { req }) => {
      if (!req.userId) {
        return false;
      }
      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }

      const post = await Post.findOne({ where: { id: postId, author: user } });
      if (!post) {
        return false;
      }

      post.text = text;
      await post.save();

      return true;
    },
    removePost: async (_, { postId }, { req }) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }

      const post = await Post.findOne({ where: { id: postId, author: user } });
      if (!post) {
        return false;
      }

      await post.remove();

      return true;
    },
    likePost: async (_, { postId }) => {
      //
    },
    dislikePost: async (_, { postId }) => {
      //
    },
  },
};
