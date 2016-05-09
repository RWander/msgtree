'use strict';

/* eslint-env jasmine */
/* eslint-disable no-console */

const mongoose = require('mongoose');
const server = require('../../../app');
const generator = require('../../generator');

beforeAll(function(done)  {
  // run server
  server.start(() => {
    // drop test database
    mongoose.connection.db.dropDatabase(() => {
      console.log('Test database is dropped.');

      // create test database
      generator((err) => {
        if (err) throw err;
        console.log('Test database is filled.');
        done();
      });
    });
  });
});
