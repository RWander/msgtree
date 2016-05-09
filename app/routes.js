'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Account = mongoose.model('accounts');
const Comment = mongoose.model('comments');

module.exports = function (app, passport) {
  app.get('/ping', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('pong!');
  });

  app.post('/register', function(req, res, next) {
    const newAccount = new Account({ username : req.body.username });
    const password = req.body.password;

    Account.register(newAccount, password, function(err, account) {
      if (err) return next(err);

      passport.authenticate('local')(req, res, function() {
        req.session.save(function (err) {
          if (err) return next(err);

          res.json(req.session.passport);
        });
      });
    });
  });

  app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err);

      if (!user) {
        const err = new Error(info.message);
        err.name = info.name;
        err.status = 401;
        return next(err);
      }

      req.login(user, function (err) {
        if (err) return next(err);
        return res.json(_.pick(req.user, ['username']));
      });
    })(req, res, next);
  });

  app.post('/createComment', function(req, res, next) {
    // TODO: in real appication we should validate the schema of req.body!
    // (usually I use https://www.npmjs.com/package/json-schema)

    // TODO: get current user!
    Account.find(null).exec().then(
      accounts => {

        const data = req.body;
        data['postedBy'] = accounts[0]._id;

        Comment.create(data).then(
          comment => res.json(comment),
          err => next(err)
        );
      }
    );
  });

  app.get('/getComments', function(req, res, next) {
    Comment.getAll().then(
      comments => res.json(comments),
      err => next(err)
    );
  });

  app.get('/getMaxDepth', function(req, res, next) {
    Comment.getMaxDepth().then(
      comment => res.json(comment),
      err => next(err)
    );
  });

  app.get('/getAccountsStatistic', function(req, res, next) {
    Account.getWithCommentCount().then(
      accounts => res.json(accounts),
      err => next(err)
    );
  });
};
