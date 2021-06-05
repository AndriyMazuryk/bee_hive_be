interface IResponse {
  success: boolean;
  message: string;
}

export const response = (success: boolean, message: string): IResponse => {
  return { success, message };
};

export const message = {
  notAuthorized: 'The user is not authorized!',
  invalidUserId: 'There is no user with this ID!',
  invalidPassword: 'Wrong password!',
  loggedIn: 'You are logged in!',
  loggedOut: 'You are logged out!',
  tokensInvalidated: 'Tokens are invalidated!',
};
