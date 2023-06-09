require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const app = express();

// init middlewares
// app.use(morgan('dev'));
// morgan('dev');
// morgan('combined'); // use for production
// morgan('common');
// morgan('short');
// morgan('tiny');

app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// init db
require('./dbs/init.mongodb');
// init routes
app.use('/', require('./routes'));
//handling error

module.exports = app;
