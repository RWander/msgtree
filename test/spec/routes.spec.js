'use strict';

/* eslint-env jasmine */
/* eslint-disable no-console */

describe('Athlete routes', function()  {
  const mongoose = require('mongoose');
  const request = require('supertest');
  const faker = require('faker');
  const server = require('../../app');
  const generator = require('../generator');

  const app = server.app;

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

  it('HTTP GET /ping - ping REST API', function(done) {
    request(app)
      .get('/ping')
      .send()
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.text).toBe('pong!');
        done();
      });
  });

  const postData = {
    username: faker.internet.userName(),
    password: faker.internet.password()
  };

  it('HTTP POST /register - successful register a new user account', function(done) {
    request(app)
      .post('/register')
      .send(postData)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body).toEqual({ user: postData.username });
        done();
      });
  });

  it('HTTP POST /register - failed register a new user account', function(done) {
    request(app)
      .post('/register')
      .send(postData)
      .expect('Content-Type', /json/)
      .expect(500)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.error.name).toEqual('UserExistsError');
        done();
      });
  });

  it('HTTP POST /login - successful login with the username and password', function(done) {
    request(app)
      .post('/login')
      .send(postData)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body).toEqual({ username: postData.username });
        done();
      });
  });

  const wrongAccount = {
    username: faker.internet.userName(),
    password: faker.internet.password()
  };

  it('HTTP POST /login - failed login with the unknown username and password', function(done) {
    request(app)
      .post('/login')
      .send(wrongAccount)
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.error.name).toEqual('IncorrectUsernameError');
        done();
      });
  });
});
