'use strict';

const express = require('express');
const { apiKey, permissionFunc } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
router.use(apiKey);
// check permission
router.use(permissionFunc('0000'));
router.use('/v1/api', require('./access'));

module.exports = router;
