'use strict';

/* eslint-env jasmine */
/* eslint-disable no-console */

describe('msgtree routes', function()  {
  const _ = require('lodash');
  const request = require('supertest');
  const faker = require('faker');
  const app = require('../../app').app;

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

  const accountData = {
    username: faker.internet.userName(),
    password: faker.internet.password()
  };

  it('HTTP POST /register - successful register a new user account', function(done) {
    request(app)
      .post('/register')
      .send(accountData)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body).toEqual({ user: accountData.username });
        done();
      });
  });

  it('HTTP POST /register - failed register a new user account', function(done) {
    request(app)
      .post('/register')
      .send(accountData)
      .expect('Content-Type', /json/)
      .expect(500)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.error.name).toEqual('UserExistsError');
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

  let cookie;
  it('HTTP POST /login - successful login with the username and password', function(done) {
    request(app)
      .post('/login')
      .send(accountData)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        cookie = res.headers['set-cookie'];

        expect(res.body).toEqual({ username: accountData.username });
        done();
      });
  });

  const commentData = {
    text: faker.lorem.paragraph()
  };
  it('HTTP POST /createComment - create a new comment', function(done) {
    request(app)
      .post('/createComment')
      .set('cookie', cookie)
      .send(commentData)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.text).toEqual(commentData.text);
        done();
      });
  });

  it('HTTP GET /getComments - gets all comments', function(done) {
    request(app)
      .get('/getComments')
      .send()
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.length).toBeGreaterThan(1);
        done();
      });
  });

  it('HTTP GET /getMaxDepth - gets a comment with the max depth', function(done) {
    request(app)
      .get('/getMaxDepth')
      .send()
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body).hasFields(['_id', 'text', 'postedAt', 'postedBy', 'depth']);
        done();
      });
  });

  it('HTTP GET /getAccountsStatistic - get all accounts with comments count', function(done) {
    request(app)
      .get('/getAccountsStatistic')
      .send()
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const accounts = res.body;

        // check schema
        accounts.forEach(account => {
          expect(account).hasFields(['username', 'count']);
        });

        // check sorting
        const sorted = _.reverse(_.sortBy(accounts, 'count'));
        expect(accounts.map(a => a.count)).toEqual(sorted.map(a => a.count)); // ignore 'username' field

        done();
      });
  });
});
