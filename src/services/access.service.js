'use strict';

const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');

const RoleUser = {
  USER: '4',
  WRITER: '1',
  EDITOR: '2',
  ADMIN: '0',
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // check email valid
      const holderUser = await userModel.findOne({ email }).lean();
      if (holderUser)
        return { code: 'xxxx', message: 'User already registerd!' };

      const passwordHass = await bcrypt.hash(password, 10);
      const newUser = await userModel.create({
        name,
        email,
        password: passwordHass,
        role: [RoleUser.USER],
      });

      if (newUser) {
        // create privateKey, publicKey for a big company
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1', // public key cryptoGraphy Stamdards
        //     format: 'pem',
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1', // public key cryptoGraphy Stamdards
        //     format: 'pem',
        //   },
        // });

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey,
          privateKey,
        });

        if (!keyStore)
          return {
            code: 'xxxx',
            message: 'keyStore error',
          };

        // created token pair
        const tokens = await createTokenPair(
          { userId: newUser._id, email },
          publicKey,
          privateKey
        );

        console.log({ tokens });

        return {
          code: 1,
          metadata: {
            user: getInfoData({
              fileds: ['_id', 'name', 'email'],
              object: newUser,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error',
      };
    }
  };
}

module.exports = AccessService;

