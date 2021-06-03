import { IResolvers } from 'graphql-tools';
import { User, Post, Wall, Photo } from '../../../entity';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { GraphQLScalarType, GraphQLError } from 'graphql';
import isPromise from 'is-promise';

const GraphQLUpload = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue: value => {
    if (value != null && isPromise(value.promise)) {
      // graphql-upload v10
      return value.promise;
    } else if (isPromise(value)) {
      // graphql-upload v9
      return value;
    }
    throw new GraphQLError('Upload value invalid.');
  },
  // serialization requires to support schema stitching
  serialize: value => value,
  parseLiteral: ast => {
    throw new GraphQLError('Upload literal unsupported.', ast);
  },
});

export const resolvers: IResolvers = {
  Upload: GraphQLUpload,
  Query: {
    getAllPhotoLocations: async () => {
      const locations = await Photo.find({ select: ['location'] });
      return locations.map(i => i.location);
    },
    getPhotoByUserId: async (_, { userId }) => {
      //
    },
  },
  Mutation: {
    uploadPhoto: async (_, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      const filenameWithUuid = `${uuid()}-${filename}`;
      const pathName = path.join(`./public/photos/${filenameWithUuid}`);
      const location = `http://localhost:4000/photos/${filenameWithUuid}`;
      const stream = createReadStream();

      return new Promise((resolve, reject) => {
        stream
          .pipe(fs.createWriteStream(pathName))
          .on('finish', async () => {
            await Photo.create({
              filename: filenameWithUuid,
              encoding,
              mimetype,
              location,
            }).save();
            resolve({
              success: true,
              message: 'Successfully Uploaded',
              mimetype,
              filename: filenameWithUuid,
              encoding,
              location,
            });
          })
          .on('error', err => {
            console.log('Error Event Emitted');
            reject({
              success: false,
              message: 'Failed',
            });
          });
      });
    },
  },
};
