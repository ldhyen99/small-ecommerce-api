'use strict';

const _ = require('lodash');
const crypto = require('crypto');

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

const generateLoginKey = () => {
  const privateKey = crypto.randomBytes(64).toString('hex');
  const publicKey = crypto.randomBytes(64).toString('hex');

  return {
    privateKey,
    publicKey,
  };
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (
      obj[key] === null ||
      obj[key] === undefined ||
      obj[key] === 'undefined'
    ) {
      delete obj[key];
    }
  });

  return obj;
};

module.exports = {
  getInfoData,
  generateLoginKey,
  removeUndefinedObject,
};
