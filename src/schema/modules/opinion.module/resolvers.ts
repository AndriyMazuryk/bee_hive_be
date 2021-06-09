import { IResolvers } from 'graphql-tools';
import { Opinion, Post, User } from '../../../entity';
import { response, message, constToKey } from '../../../utils';

export const resolvers: IResolvers = {
  Mutation: {
    setOpinionByPostId: async (_, { postId, opinion }, { req }) => {
      if (!req.userId) {
        return response(false, message.notAuthorized);
      }

      const user = await User.findOne({
        where: { id: req.userId },
        relations: ['opinions'],
      });
      if (!user) {
        return response(false, message.invalidUserId);
      }

      const post = await Post.findOne({
        where: { id: postId },
        relations: ['opinions'],
      });
      if (!post) {
        return response(false, message.invalidPostId);
      }

      let userOpinion;
      userOpinion = await Opinion.findOne({
        relations: ['post', 'user'],
        where: { post, user },
      });

      if (
        post.opinions.length < 1 ||
        user.opinions.length < 1 ||
        !userOpinion
      ) {
        userOpinion = await Opinion.create({ user, post }).save();
        post.opinions.push(userOpinion);
        await post.save();
        user.opinions.push(userOpinion);
        await user.save();
      }

      const keys = ['veryBad', 'bad', 'neutral', 'good', 'veryGood'];
      const passedMarkKey = constToKey(opinion);

      keys.forEach((opinionKey, index) => {
        if (opinionKey === passedMarkKey) {
          if (userOpinion[opinionKey]) {
            userOpinion[opinionKey] = false;
            post['votesValue'] -= index + 1;
            post['votesCount'] -= 1;
            post[opinionKey] -= 1;
          } else {
            userOpinion[opinionKey] = true;
            post['votesValue'] += index + 1;
            post['votesCount'] += 1;
            post[opinionKey] += 1;
          }
        } else if (userOpinion[opinionKey]) {
          userOpinion[opinionKey] = false;
          post['votesValue'] -= index + 1;
          post['votesCount'] -= 1;
          post[opinionKey] -= 1;
        }
      });

      await userOpinion.save();
      await post.save();

      return response(true, 'Success!');
    },
  },
};
