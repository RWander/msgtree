'use strict';

/*eslint-env jasmine */

describe('Athlete routes', function()  {
  const request = require('supertest');
  const server = require('../../app');

  let app;

  beforeAll(function(done)  {
    app = server.app;
    server.start(done);
  });

  it('HTTP GET / - ping', function(done) {
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
});
