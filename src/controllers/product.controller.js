'use strict';

const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.xx');

const { CREATED, SuccessResponse } = require('../core/success.response');

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
}

module.exports = new ProductController();
