'use strict';

// const express = require('express');
// const passport = require('passport');
// const Account = require('../models/Account');
// const router = express.Router();

module.exports = function (app, passport) {
  app.get('/ping', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('pong!');
  });

  // router.post('/register', function(req, res, next) {
  //   const newAccount = new Account({ username : req.body.username });
  //   const pswd = req.body.password;
  //
  //   Account.register(newAccount, pswd, function(err, account) {
  //     if (err) return res.render('register', { error : err.message });
  //
  //     passport.authenticate('local')(req, res, function () {
  //       req.session.save(function (err) {
  //         if (err) return next(err);
  //
  //         // TODO (rwander): send 200 HTTP status
  //         //res.redirect('/');
  //       });
  //     });
  //   });
  // });

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
