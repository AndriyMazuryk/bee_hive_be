import { IResolvers } from "graphql-tools";
import * as bcrypt from "bcryptjs";
import { User } from "../../../entity";

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
    createUser: async (
      _,
      { firstName, lastName, email, password, occupation, location, birthDate, userInfo }
    ) => {
      const userExists = User.findOne({ where: { email }});
      if (userExists) {
        return false;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        occupation,
        location,
        birthDate,
        userInfo
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
  },
};
