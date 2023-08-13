'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

// authen
router.use(authenticationV2);
// logout
router.post('', asyncHandler(productController.createProduct));

module.exports = router;
