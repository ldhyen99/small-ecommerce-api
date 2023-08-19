'use strict';

const ProductServiceV2 = require('../services/product.service.v2');

const { SuccessResponse } = require('../core/success.response');

class ProductController {
  createProduct = async (req, res, next) => {
    console.log(123, req.body);
    new SuccessResponse({
      message: 'Create new product success!',
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all draft for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */

  getAllDraftsForShop = async (req, res) => {
    new SuccessResponse({
      message: 'Get list draft successed!',
      metadata: await ProductServiceV2.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  postPublistProductByShop = async (req, res) => {
    new SuccessResponse({
      message: 'Update draft successed!',
      metadata: await ProductServiceV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  postUnpublistProductByShop = async (req, res) => {
    new SuccessResponse({
      message: 'Update un publish successed!',
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res) => {
    new SuccessResponse({
      message: 'Get list product publish successed!',
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res) => {
    new SuccessResponse({
      message: 'Get list product by search successed!',
      metadata: await ProductServiceV2.searchProducts({
        key_search: req.params.keySearch,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
