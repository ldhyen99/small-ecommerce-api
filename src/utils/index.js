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
module.exports = {
  getInfoData,
  generateLoginKey,
};
