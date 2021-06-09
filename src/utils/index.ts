import * as fs from 'fs';
import { Post } from '../entity';

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
    'There is no user with this ID to send him/her a post!',
  userDoesNotHaveWall: 'This user does not have a wall!',
  postFail: 'Post has not been created!',
  postSuccess: 'Post has been created!',
  invalidPostId: 'There is no post with this ID!',
  postUpdated: 'Post has been updated!',
  postNotUpdated: 'Post has not been updated!',
  postRemoved: 'Post has been removed!',
  postNotRemoved: 'Post has not been removed!',
  invalidPhotoAlbumOrUserId:
    'There is no photo album with this ID or you do not own it!',
  invalidPhotoAlbumId: 'There is no photo album with this ID!',
  invalidPhotoOrUserId: 'There is no photo with this ID or you do not own it!',
  invalidPhotoId: 'There is no photo with this ID!',
  photoRemoved: 'Photo has been removed!',
  photoNotRemoved: 'Photo has not been removed!',
  needPhotoAlbumIdOrAvatar:
    'You have to provide photo album ID or set isAvatar to true',
  emptyTextField: 'The text field is empty!',
  // invalidRecipientId: 'Invalid recipient ID!',
  invalidUserIdToSendMessage:
    'There is no user with this ID to send him/her a message!',
  messageSuccess: 'Message has been sent!',
  messageFail: 'Message has not been sent!',
};

export const uploadFile = async (createReadStream, pathName) => {
  const readStream = createReadStream();
  const writeStream = fs.createWriteStream(pathName);

  return new Promise((resolve, reject) => {
    readStream
      .pipe(writeStream)
      .on('finish', () => {
        resolve(response(true, 'File has been uploaded!'));
      })
      .on('error', error => {
        reject(response(false, 'File has not been uploaded!'));
      });
  });
};

export const OPINIONS = ['VERY_BAD', 'BAD', 'NEUTRAL', 'GOOD', 'VERY_GOOD'];
export const KEYS = ['veryBad', 'bad', 'neutral', 'good', 'veryGood'];
export const constToKey = (constant: string): string =>
  KEYS[OPINIONS.indexOf(constant)];

export const recalculateKarmaTo = async user => {
  const posts = await Post.find({ where: { author: user } });
  const votesValues = posts.map(post => post.votesValue);
  const votesCounts = posts.map(photo => photo.votesCount);
  if (
    votesValues.length < 1 ||
    votesCounts.length < 1 ||
    votesValues[0] < 1 ||
    votesCounts[0] < 1
  ) {
    user.karma = 0;
    await user.save();
    return;
  }
  const votesValue = votesValues.reduce((total, number) => total + number);
  const votesCount = votesCounts.reduce((total, number) => total + number);

  user.karma = parseFloat((votesValue / votesCount).toFixed(1));
  await user.save();
};
