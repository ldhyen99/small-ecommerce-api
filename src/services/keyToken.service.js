'use strict';

const keytokenModel = require('../models/keytoken.model');
const {
  Types: { ObjectId },
  isValidObjectId,
} = require('mongoose');
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refeshToken,
  }) => {
    try {
      // const publicKeyString = publicKey.toString();

      //level 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens ? tokens.publicKey : null;

      //level 1
      const filter = { user: userId },
        update = { publicKey, privateKey, refeshTokensUsed: [], refeshToken },
        options = { upsert: true, new: true };
      let tokens;
      if (userId) {
        tokens = await keytokenModel.findOneAndUpdate(filter, update, options);
      }

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({ refeshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOneAndUpdate(
      { refeshToken: refreshToken },
      {},
      { new: true }
    );
  };

  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({
      user: userId,
    });
  };
}
module.exports = KeyTokenService;
