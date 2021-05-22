import { IResolvers } from 'graphql-tools';
import { User, Post } from '../../../entity';

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
    getPostsByAuthor: async (_, { authorId }) => {
      const user = await User.findOne({
        where: { id: authorId },
        relations: ['posts'],
      });
      if (!user) {
        return false;
      }

      return user.posts;
    },
  },
  Mutation: {
    createPost: async (_, { text }, { req }) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }

      // create post
      const post = new Post();
      post.text = text;
      post.author = user;
      await post.save();

      return true;
    },
    updatePost: async (_, { text }) => {
      // validation
      // update and save
      return true;
    },
    removePost: async (_, { postId }) => {
      const post = await Post.findOne(postId);
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
