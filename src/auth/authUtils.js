'use strict';

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');

// service
const KeyTokenService = require('../services/keyToken.service');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rtoken-id',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        // console.error(`error verify::`, err);
      } else {
        // console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1 - check userId missing
   * 2 - get accessToken
   * 3 - verifyToken
   * 4 - check user in db
   * 5 - check keyStore with this userId
   * 6 - OK all => return next
   */
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid Request');
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore');
  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid Request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError('Invalid Userid');
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /**
   * 1 - check userId missing
   * 2 - get accessToken
   * 3 - verifyToken
   * 4 - check user in db
   * 5 - check keyStore with this userId
   * 6 - OK all => return next
   */
  const userId = req.headers[HEADER.CLIENT_ID];
  console.log(userId);
  if (!userId) throw new AuthFailureError('Invalid Request');
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore');

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.publicKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError('Invalid Userid');
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refeshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid Request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError('Invalid Userid');
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2,
};
