import { IResolvers } from "graphql-tools";
import * as bcrypt from "bcryptjs";
import { createTokens } from "../../auth";
import { User } from "../../entity/User";

export const resolvers: IResolvers = {
  Query: {
    me: (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }

      return User.findOne(req.userId);
    },
    getAllUsers: async () => {
      const users = await User.find();
      return users;
    },
  },
  Mutation: {
    createUser: async (_, { firstName, lastName, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      }).save();

      return true;
    },
    updateUser: async (_, { firstName, lastName, email, password }) => {
      // validation
      // update and save
      return true;
    },
    removeUser: async (_, { userId }) => {
      const user = await User.findOne(userId);
      await user.remove();

      return true;
    },
    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      const { accessToken, refreshToken } = createTokens(user);

      res.cookie("refresh-token", refreshToken, {
        expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      });
      res.cookie("access-token", accessToken, {
        expires: new Date(Date.now() + 60 * 15 * 1000),
      });

      return user;
    },
    logout: (_, __, { res }) => {
      res.clearCookie("access-token");
      res.clearCookie("refresh-token");
      return true;
    },
    invalidateTokens: async (_, __, { req }) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }
      user.count += 1;
      await user.save();

      return true;
    },
  },
};
