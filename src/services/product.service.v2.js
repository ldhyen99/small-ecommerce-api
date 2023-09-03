'use strict';

const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  updateProductById,
  updateNestedObjectParse,
} = require('./repositories/product.repo');
const { removeUndefinedObject } = require('../utils');

// define Factory class to create product
class ProductFactory {
  static productRegistry = {}; // key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return unPublishProductByShop({ product_shop, product_id });
  }

  static async searchProducts({ key_search }) {
    return await searchProductByUser({ key_search });
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_attributes = product_attributes;
    this.product_shop = product_shop;
  }

  // create new product
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }

  // update Product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product });
  }
}

// define sub class for diff product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError('create new Clothing error');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParse(objectParams.product_attributes),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParse(objectParams)
    );

    return updateProduct;
  }
}

// define sub class for diff product types Electronic
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError('create new Electronic error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError('create new Furniture error');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }
}

// register product type
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
