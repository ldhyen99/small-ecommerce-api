const configProd = {
  app: {
    port: process.env.PROD_APP_PORT || 3055,
  },
  db: {
    host: process.env.PROD_APP_MONGO_HOST || 'localhost',
    port: process.env.PROD_APP_MONGO_PORT || 27017,
    name: process.env.PROD_APP_MONGO_NAME || 'dbUserFnBlogProd',
  },
};

module.exports = configProd;
