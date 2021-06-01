import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcryptjs';
import { User, Wall } from '../../../entity';

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
    getUserById: async (_, { userId }) => {
      return await User.findOne(userId);
    },
    getSubscribersByUserId: async (_, { userId }) => {
      const user = await User.findOne({
        where: { id: userId },
        relations: ['subscribers'],
      });
      if (!user) {
        return false;
      }

      return user.subscribers;
    },
    getSubscriptionsByUserId: async (_, { userId }) => {
      const user = await User.findOne({
        where: { id: userId },
        relations: ['subscriptions'],
      });
      if (!user) {
        return false;
      }

      return user.subscriptions;
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
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        occupation,
        location,
        birthDate,
        userInfo,
      }).save();

      await Wall.create({
        user,
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

      let message;
      if (firstName) {
        user.firstName = firstName;
        message = 'First name have been changed!';
      } else if (lastName) {
        user.lastName = lastName;
        message = 'Last name have been changed!';
      } else if (email) {
        const emailIsAlreadyInUse = await User.findOne({ where: { email } });
        if (emailIsAlreadyInUse) {
          return {
            success: false,
            message: 'This email is already in use!',
          };
        }

        user.email = email;
        message = 'Email have been changed!';
      } else if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        message = 'Password have been changed!';
      } else if (occupation) {
        user.occupation = occupation;
        message = 'Occupation have been changed!';
      } else if (location) {
        user.location = location;
        message = 'Location have been changed!';
      } else if (birthDate) {
        user.birthDate = birthDate;
        message = 'Birth date have been changed!';
      } else if (userInfo) {
        user.userInfo = userInfo;
        message = 'User info have been changed!';
      } else {
        return {
          success: false,
          message: "You haven't specified any parameters!",
        };
      }

      await user.save();

      return { success: true, message: message };
    },
    removeUser: async (_, { userId }) => {
      const user = await User.findOne(userId);
      await user.remove();

      return true;
    },
    subscribeToUser: async (_, { userIdToSubscribe }, { req }) => {
      if (!req.userId) {
        return false;
      }

      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['subscriptions'],
      });
      if (!user) {
        return false;
      }

      const userToSubscribe = await User.findOne({
        where: { id: userIdToSubscribe },
        relations: ['subscribers'],
      });
      if (!userToSubscribe) {
        return false;
      }

      user.subscriptions.push(userToSubscribe);
      await user.save();

      userToSubscribe.subscribers.push(user);
      await userToSubscribe.save();

      return true;
    },
  },
};
