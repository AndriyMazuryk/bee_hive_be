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
  invalidEmail: 'There is no user with this email!',
  invalidPassword: 'Wrong password!',
  loggedIn: 'You are logged in!',
  loggedOut: 'You are logged out!',
  tokensInvalidated: 'Tokens are invalidated!',
  invalidUserIdToSendPost:
    'There is no user with this ID to send him/her a post',
  userDoesNotHaveWall: 'This user does not have a wall!',
  postFail: 'Post has not been created!',
  postSuccess: 'Post has been created!',
  invalidPostId: 'There is no post with this ID!',
  postUpdated: 'Post has been updated!',
  postNotUpdated: 'Post has not been updated!',
  postRemoved: 'Post has been removed!',
  postNotRemoved: 'Post has not been removed',
};
