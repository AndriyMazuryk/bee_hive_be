import { IResolvers } from "graphql-tools";
import * as bcrypt from "bcryptjs";
import { User } from "../../../entity";

export const resolvers: IResolvers = {
  Query: {
    currentUser: async (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }

      return await User.findOne(req.userId);
    },
    getAllUsers: async () => {
      return await User.find();
    },
  },
  Mutation: {
    createUser: async (
      _,
      { firstName, lastName, email, password, occupation, location, birthDate, userInfo }
    ) => {
      const userExists = await User.findOne({ where: { email }});
      if (userExists) {
        return { success: false, message: "User with this email already exists!" };
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

      return { success: true, message: "User has been created!" };
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
