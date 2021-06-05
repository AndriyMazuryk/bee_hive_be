import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcryptjs';
import { User, Wall } from '../../../entity';
import { response } from '../../../utils';

export const resolvers: IResolvers = {
  Query: {
    currentUser: async (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }

      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['avatar', 'photos'],
      });
      if (!user) {
        return null;
      }
      // TODO add default avatar
      // if (!user.avatar) {
      //   return false;
      // }
      return user;
    },
    getAllUsers: async () => {
      return await User.find();
    },
    getUserById: async (_, { userId }) => {
      return await User.findOne({
        where: { id: userId },
        relations: ['photos', 'avatar'],
      });
    },
    getSubscribersByUserId: async (_, { userId }) => {
      const user = await User.findOne({
        where: { id: userId },
        relations: ['subscribers'],
      });
      if (!user) {
        return null;
      }

      return user.subscribers;
    },
    getSubscriptionsByUserId: async (_, { userId }) => {
      const user = await User.findOne({
        where: { id: userId },
        relations: ['subscriptions'],
      });
      if (!user) {
        return null;
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
        return response(false, 'User with this email already exists!');
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

      return response(true, 'User has been created!');
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
        return response(false, 'The user is not authorized!');
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return response(false, 'There is no user with this ID!');
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
          return response(false, 'This email is already in use!');
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
        return response(false, "You haven't specified any parameters!");
      }

      await user.save();

      return response(true, message);
    },
    removeUser: async (_, { userId }) => {
      const user = await User.findOne(userId);
      if (!user) {
        return response(false, 'There is no user with this ID!');
      }

      await user.remove();

      return response(true, 'User has been removed!');
    },
    subscribeToUser: async (_, { userIdToSubscribe }, { req }) => {
      if (!req.userId) {
        return response(false, 'The user is not authorized!');
      }

      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['subscriptions'],
      });
      if (!user) {
        return response(false, 'There is no user with this ID!');
      }

      const userToSubscribe = await User.findOne({
        where: { id: userIdToSubscribe },
        relations: ['subscribers'],
      });
      if (!userToSubscribe) {
        return response(false, 'There is no user with this ID to subscribe!');
      }

      if (user.id === userToSubscribe.id) {
        return response(false, "You can't subscribe to yourself!");
      }

      if (
        user.subscriptions.filter(user => user.id === userToSubscribe.id)
          .length > 0
      ) {
        return response(false, 'You already subscribed to this user!');
      }

      user.subscriptions.push(userToSubscribe);
      await user.save();

      return response(
        true,
        `You have been subscribed to ${userToSubscribe.firstName} ${userToSubscribe.lastName}`
      );
    },
  },
};
