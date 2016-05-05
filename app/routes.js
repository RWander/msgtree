'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Account = mongoose.model('accounts');

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

  // router.get('/logout', function(req, res, next) {
  //     req.logout();
  //     req.session.save(function (err) {
  //         if (err) {
  //             return next(err);
  //         }
  //         res.redirect('/');
  //     });
  // });
};
