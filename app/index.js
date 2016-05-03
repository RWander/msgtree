'use strict';

/* eslint-disable no-console */

const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('config');

const models = join(__dirname, 'models');
const app = express();
const env = app.get('env');

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

// Bootstrap routes
require('./passport')(passport);
require('./express')(app, passport);
require('./routes')(app, passport);

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

function listen () {
  const server = app.listen(config.http.port, config.http.host, () => {
    const address = server.address();
    const host = address.address;
    const port = address.port;

    console.log('RESTful server "%s" listening at http://%s:%s', env, host, port);
  });
}

function connect () {
  const options = { server: { socketOptions: { keepAlive: 1 } } };
  return mongoose.connect(config.get('db').uri, options).connection;
}
