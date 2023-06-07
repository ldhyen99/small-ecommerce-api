'use strict';

const mongoose = require('mongoose');
const {
  db: { host, name, port },
} = require('../configs');

const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    if (1 === 0) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectString)
      .then((_) => {
        console.log({ connectString });
        const { countConnect } = require('../helpers/check.connect');
        countConnect();
      })
      .catch((err) => console.log(`Error Connect: ${err}`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
