'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.get(
  '/search/:keySearch',
  asyncHandler(productController.getListSearchProduct)
);

// authen
router.use(authenticationV2);

router.post('', asyncHandler(productController.createProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct));
router.post(
  '/publish/:id',
  asyncHandler(productController.postPublistProductByShop)
);

router.post(
  '/un-publish/:id',
  asyncHandler(productController.postUnpublistProductByShop)
);

router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get(
  '/publish/all',
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
