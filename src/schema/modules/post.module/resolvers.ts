import { IResolvers } from "graphql-tools";
import { User, Post } from "../../../entity";

export const resolvers: IResolvers = {
  Query: {
    getPostById: async (postId) => {
      const post = await Post.findOne(postId);
      return post;
    },
    getLastPostbyAuthor: async (authorId) => {
      //
    },
    getPostsByAuthor: async (authorId) => {
      //
    },
  },
  Mutation: {
    createPost: async (_, { text }) => {
      // check if the user has authorization
      // create post
      await Post.create({
        text,
      }).save();

      return true;
    },
    updatePost: async (_, { text }) => {
      // validation
      // update and save
      return true;
    },
    removePost: async (_, { postId }) => {
      const post = await Post.findOne(postId);
      await post.remove();

      return true;
    },
    likePost: async (_, { postId }) => {
      //
    },
    dislikePost: async (_, { postId }) => {
      //
    }
  },
};
