import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcryptjs';
import { User } from '../../../entity';

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
      {
        firstName,
        lastName,
        email,
        password,
        occupation,
        location,
        birthDate,
        userInfo,
      }
    ) => {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return {
          success: false,
          message: 'User with this email already exists!',
        };
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
        userInfo,
      }).save();

      return { success: true, message: 'User has been created!' };
    },
    updateUser: async (
      _,
      {
        firstName,
        lastName,
        email,
        password,
        occupation,
        location,
        birthDate,
        userInfo,
      },
      { req }
    ) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = password;
      user.occupation = occupation;
      user.location = location;
      user.birthDate = birthDate;
      user.userInfo = userInfo;

      await user.save();

      return true;
    },
    removeUser: async (_, { userId }) => {
      const user = await User.findOne(userId);
      await user.remove();

      return true;
    },
    setFirstName: async (_, { firstName }, { req }) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }

      user.firstName = firstName;
      await user.save();

      return true;
    },
    setLastName: async (_, { lastName }, { req }) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }

      user.lastName = lastName;
      await user.save();

      return true;
    },
    setEmail: async (_, { email }, { req }) => {
      if (!req.userId) {
        return {
          success: false,
        };
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return {
          success: false,
        };
      }

      const emailIsAlreadyInUse = await User.findOne({ where: { email } });
      if (emailIsAlreadyInUse) {
        return {
          success: false,
          message: 'This email is already in use!',
        };
      }

      user.email = email;
      await user.save();

      return true;
    },
    setPassword: async (_, { password }, { req }) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();

      return true;
    },
    setOccupation: async (_, { occupation }, { req }) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }

      user.occupation = occupation;
      await user.save();

      return true;
    },
    setLocation: async (_, { location }, { req }) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }

      user.location = location;
      await user.save();

      return true;
    },
    setBirthDate: async (_, { birthDate }, { req }) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }

      user.birthDate = birthDate;
      await user.save();

      return true;
    },
    setUserInfo: async (_, { userInfo }, { req }) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return false;
      }

      user.userInfo = userInfo;
      await user.save();

      return true;
    },
  },
};
