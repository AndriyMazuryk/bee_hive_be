import { IResolvers } from 'graphql-tools';
import { Message, User } from '../../../entity';
import { response, message } from '../../../utils';

export const resolvers: IResolvers = {
  Query: {
    getMessagesByUserId: async (_, { userId }, { req }) => {
      if (!req.userId) {
        return null;
      }

      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['avatar'],
      });
      if (!user) {
        return null;
      }

      const interlocutor = await User.findOne({
        where: { id: userId },
        relations: ['avatar'],
      });
      if (!interlocutor) {
        return null;
      }

      let sentMessages;
      try {
        sentMessages = await Message.find({
          where: {
            author: user,
            recipient: interlocutor,
          },
          relations: ['author', 'recipient'],
        });
      } catch (error) {
        console.log(error);
        return null;
      }

      let receivedMessages;
      try {
        receivedMessages = await Message.find({
          where: {
            author: interlocutor,
            recipient: user,
          },
          relations: ['author', 'recipient'],
        });
      } catch (error) {
        console.log(error);
        return null;
      }

      const messages = [...sentMessages, ...receivedMessages].sort(
        (a, b) => b.id - a.id
      );

      return messages;
    },
  },
  Mutation: {
    sendMessage: async (_, { recipientId, text }, { req }) => {
      if (!req.userId) {
        return response(false, message.notAuthorized);
      }

      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['avatar'],
      });
      if (!user) {
        return response(false, message.invalidUserId);
      }

      const recipient = await User.findOne({
        where: { id: recipientId },
        relations: ['avatar'],
      });
      if (!recipient) {
        return response(false, message.invalidUserIdToSendMessage);
      }

      try {
        await Message.create({
          text,
          author: user,
          recipient,
        }).save();
      } catch (error) {
        console.log(error);
        return response(false, message.messageFail);
      }

      return response(true, message.messageSuccess);
    },
  },
};
