'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

//signUp
router.post('/user/signup', asyncHandler(accessController.signUp));
router.post('/user/login', asyncHandler(accessController.login));

// authen
router.use(authentication);
// logout
router.post('/user/logout', asyncHandler(accessController.logout));
router.post(
  '/user/handlerRefreshToken',
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
