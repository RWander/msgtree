'use strict';

const mongoose = require('mongoose');
const Account = mongoose.model('accounts');

module.exports = function(passport) {
  passport.use(Account.createStrategy());
  passport.serializeUser(Account.serializeUser());
  passport.deserializeUser(Account.deserializeUser());
};
