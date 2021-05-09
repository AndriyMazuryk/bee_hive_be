import { sign } from "jsonwebtoken";
import { User } from "./entity/User";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./constants";

export const createTokens = (user: User) => {
  const accessToken = sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15min",
  }); // env var needed

  const refreshToken = sign(
    { userId: user.id, count: user.count },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};
