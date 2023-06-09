const configDev = {
  app: {
    port: process.env.DEV_APP_PORT || 3055,
  },
  db: {
    host: process.env.DEV_APP_MONGO_HOST || 'localhost',
    port: process.env.DEV_APP_MONGO_PORT || 27017,
    name: process.env.DEV_APP_MONGO_NAME || 'dbFnBlogDev',
  },
};

module.exports = configDev;
