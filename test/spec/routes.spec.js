'use strict';

/*eslint-env jasmine */
/* eslint-disable no-console */

describe('Athlete routes', function()  {
  const mongoose = require('mongoose');
  const request = require('supertest');
  const server = require('../../app');
  const generator = require('../generator');

  let app;

  beforeAll(function(done)  {
    // run server
    app = server.app;
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

  it('HTTP GET /ping - ping REST API', function(done) {
    request(app)
      .get('/ping')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.text).toBe('pong!');
        done();
      });
  });

  // it('HTTP POST /login - login with username and password', function(done) {
  //   request(app)
  //     .post('/login')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .end(function(err, res) {
  //       if (err) throw err;
  //
  //       expect(res.text).toBe('TODO');
  //       done();
  //     });
  // });
});
