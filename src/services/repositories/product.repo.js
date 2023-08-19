'use strict';

const { product } = require('../../models/product.model');
const { Types } = require('mongoose');

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  return togglePublishProduct({
    product_shop,
    product_id,
    isDraft: false,
    isPublished: true,
  });
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  return togglePublishProduct({
    product_shop,
    product_id,
    isDraft: true,
    isPublished: false,
  });
};

const togglePublishProduct = async ({
  product_shop,
  product_id,
  isDraft,
  isPublished,
}) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = isDraft;
  foundShop.isPublished = isPublished;
  await foundShop.save();
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const searchProductByUser = async ({ key_search }) => {
  const regexSearch = new RegExp(key_search);
  const result = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();

  return result;
};

module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
};
