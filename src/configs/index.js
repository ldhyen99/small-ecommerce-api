'use strict';
const configDev = require('./dev');
const configProd = require('./prod');

const config = { configDev, configProd };
const env = process.env.NODE_ENV || 'configDev';
module.exports = config[env];
