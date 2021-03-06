import { sign } from 'jsonwebtoken';
import { User } from './entity';

export const createTokens = (user: User) => {
  const accessToken = sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15min',
    }
  );

  const refreshToken = sign(
    { userId: user.id, count: user.count },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );

  return { accessToken, refreshToken };
};
