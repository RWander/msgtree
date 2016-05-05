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

          res.json(_.pick(account, ['username']));
        });
      });
    });
  });

  app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.send(req.user.username);
    }
  );

  // router.post('/login',
  //   passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  //   function(req, res, next) {
  //   req.session.save(function (err) {
  //     if (err) {
  //       return next(err);
  //     }
  //     res.redirect('/');
  //   });
  // });

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
