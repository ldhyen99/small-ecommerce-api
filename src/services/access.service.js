'use strict';

const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData, generateLoginKey } = require('../utils');
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require('../core/error.response');
const { findByEmail } = require('./user.service');

const RoleUser = {
  USER: '4',
  WRITER: '1',
  EDITOR: '2',
  ADMIN: '0',
};

class AccessService {
  static handleRefreshTokenV2 = async ({ keyStore, user, refeshToken }) => {
    const { userId, email } = user;

    if (keyStore.refeshTokensUsed.includes(refeshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something wrong happend! Please re-login');
    }

    if (keyStore.refeshToken !== refeshToken)
      throw new AuthFailureError('Shop did not registeted');

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop did not registeted');

    // create a new pair token
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await keyStore.update({
      $set: {
        refeshToken: tokens.refreshToken,
      },
      $addToSet: {
        refeshTokensUsed: refeshToken,
      },
    });
    return {
      user,
      tokens,
    };
  };

  /**
   * check this token used with JWT
   */
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );

    if (foundToken) {
      // decode who user are?
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log(1, { userId, email });
      // delete
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something wrong happend!!! Please re-login');
    }

    // Check token is exist?

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError('User not registeted');

    // verifyToken
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    // check userId
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new AuthFailureError('User not registeted');

    // create a new token
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    //update token
    await holderToken.updateOne({
      $set: {
        refeshToken: tokens.refreshToken,
      },
      $addToSet: {
        refeshTokensUsed: refreshToken, // used to get new token
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  /**
   * 1: Check email in dbs
   * 2 - match password?
   * 3 - create accept token & refresh token & save
   * 4 - generate tokens
   * 5 - get data return login
   */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1
    const foundUser = await findByEmail({ email });
    if (!foundUser) {
      throw new BadRequestError('Error: Email is not registered!');
    }

    // 2
    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchPassword) throw new AuthFailureError('Authentication error');

    //3
    const { privateKey, publicKey } = generateLoginKey();

    //4
    const { _id: userId } = foundUser;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refeshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });

    return {
      user: getInfoData({
        fileds: ['_id', 'name', 'email'],
        object: foundUser,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // check email valid
    const holderUser = await userModel.findOne({ email }).lean();
    if (holderUser) {
      throw new BadRequestError('Error: User already registered!');
    }

    const passwordHass = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      password: passwordHass,
      role: [RoleUser.USER],
    });

    if (newUser) {
      const { privateKey, publicKey } = generateLoginKey();
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError('Error: keyStore error');
      }
      // created token pair
      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );

      await KeyTokenService.createKeyToken({});

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
  };
}

module.exports = AccessService;
