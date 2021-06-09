import { IResolvers } from 'graphql-tools';
import { Message, User } from '../../../entity';
import { response, message } from '../../../utils';

export const resolvers: IResolvers = {
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
