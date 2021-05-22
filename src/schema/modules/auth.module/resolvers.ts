import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcryptjs';
import { createTokens } from '../../../auth';
import { User } from '../../../entity';

export const resolvers: IResolvers = {
  Mutation: {
    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return false;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return false;
      }

      const { accessToken, refreshToken } = createTokens(user);

      res.cookie('refresh-token', refreshToken, {
        expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      });
      res.cookie('access-token', accessToken, {
        expires: new Date(Date.now() + 60 * 15 * 1000),
      });

      return true;
    },
    logout: (_, __, { res }) => {
      res.clearCookie('access-token');
      res.clearCookie('refresh-token');
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
