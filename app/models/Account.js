const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({});

Account.plugin(passportLocalMongoose);

/**
 * Account - creates a new istance of Account
 *
 * @param  {string} username
 * @param  {string} password
 * @return {Promise}
 */
Account.statics.create = function(username, password) {
  const self = this;

  return new Promise(function(resolve, reject) {
    self.register(
      new self({ username : username }),
      password,
      function(err, account) {
        if (err) return reject(err);

        resolve(account);
      }
    );
  });
};

Account.statics.getWithCommentCount = function() {
  const self = this;

  return new Promise(function(resolve, reject) {
    // TODO
    // ..
  });
};

mongoose.model('accounts', Account);
