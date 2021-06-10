import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcryptjs';
import { Photo, Post, User, Wall } from '../../../entity';
import { message, recalculateKarmaTo, response } from '../../../utils';
import { In } from 'typeorm';

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

      user.lastVisit = new Date();
      await user.save();

      recalculateKarmaTo(user);

      return user;
    },
    getAllUsers: async () => {
      const users = await User.find({ relations: ['avatar'] });
      if (!users) {
        return null;
      }

      users.forEach(user => recalculateKarmaTo(user));

      return users;
    },
    getUserById: async (_, { userId }) => {
      const user = await User.findOne({
        where: { id: userId },
        relations: ['photos', 'avatar'],
      });
      if (!user) {
        return null;
      }

      recalculateKarmaTo(user);

      return user;
    },
    getSubscribersByUserId: async (_, { userId }) => {
      const user = await User.findOne({
        where: { id: userId },
        relations: ['subscribers', 'subscribers.avatar'],
      });
      if (!user) {
        return null;
      }

      return user.subscribers.sort((a, b) => a.id - b.id);
    },
    getSubscriptionsByUserId: async (_, { userId }) => {
      const user = await User.findOne({
        where: { id: userId },
        relations: ['subscriptions', 'subscriptions.avatar'],
      });
      if (!user) {
        return null;
      }

      return user.subscriptions.sort((a, b) => a.id - b.id);
    },
    getNewsByUserId: async (_, { userId }) => {
      const user = await User.findOne({
        where: { id: userId },
        relations: ['subscriptions'],
      });
      if (!user) {
        null;
      }
      const subscriptionsIds = user.subscriptions.map(
        subscription => subscription.id
      );

      const posts = await Post.find({
        relations: ['author', 'author.avatar'],
        where: { author: In([...subscriptionsIds]) },
        order: {
          id: 'DESC',
        },
        take: 15,
      });
      if (!posts) {
        return null;
      }

      return posts;
    },
    getKarmaByUserId: async (_, { userId }) => {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return null;
      }

      recalculateKarmaTo(user);
      if (!user.karma) {
        return 0;
      }

      return user.karma;
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

      const defaultAvatar = await Photo.findOne(1);

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
        avatar: defaultAvatar,
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
        return response(false, message.notAuthorized);
      }

      const user = await User.findOne(req.userId);
      if (!user) {
        return response(false, message.invalidUserId);
      }

      let resMessage;
      if (firstName) {
        user.firstName = firstName;
        resMessage = 'First name have been changed!';
      } else if (lastName) {
        user.lastName = lastName;
        resMessage = 'Last name have been changed!';
      } else if (email) {
        const emailIsAlreadyInUse = await User.findOne({ where: { email } });
        if (emailIsAlreadyInUse) {
          return response(false, 'This email is already in use!');
        }

        user.email = email;
        resMessage = 'Email have been changed!';
      } else if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        resMessage = 'Password have been changed!';
      } else if (occupation) {
        user.occupation = occupation;
        resMessage = 'Occupation have been changed!';
      } else if (location) {
        user.location = location;
        resMessage = 'Location have been changed!';
      } else if (birthDate) {
        user.birthDate = birthDate;
        resMessage = 'Birth date have been changed!';
      } else if (userInfo) {
        user.userInfo = userInfo;
        resMessage = 'User info have been changed!';
      } else {
        return response(false, "You haven't specified any parameters!");
      }

      await user.save();

      return response(true, resMessage);
    },
    removeUser: async (_, { userId }) => {
      const user = await User.findOne(userId);
      if (!user) {
        return response(false, message.invalidUserId);
      }

      await user.remove();

      return response(true, 'User has been removed!');
    },
    subscribeToUser: async (_, { userId }, { req }) => {
      if (!req.userId) {
        return response(false, message.notAuthorized);
      }

      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['subscriptions'],
      });
      if (!user) {
        return response(false, message.invalidUserId);
      }

      const userToSubscribe = await User.findOne({
        where: { id: userId },
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
    unsubscribeToUser: async (_, { userId }, { req }) => {
      if (!req.userId) {
        return response(false, message.notAuthorized);
      }

      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['subscriptions'],
      });
      if (!user) {
        return response(false, message.invalidUserId);
      }

      const userToUnsubscribe = await User.findOne({
        where: { id: userId },
      });
      if (!userToUnsubscribe) {
        return response(false, 'There is no user with this ID to unsubscribe!');
      }

      if (user.id === userToUnsubscribe.id) {
        return response(false, "You can't unsubscribe to yourself!");
      }

      const subscriptionExists = user.subscriptions.filter(
        user => user.id === userToUnsubscribe.id
      );
      if (!subscriptionExists) {
        return response(false, 'You are not subscribed to this user!');
      }

      user.subscriptions = user.subscriptions.filter(
        user => user.id !== userToUnsubscribe.id
      );
      await user.save();

      return response(
        true,
        `You have been unsubscribed to ${userToUnsubscribe.firstName} ${userToUnsubscribe.lastName}`
      );
    },
  },
};
