const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({});

Account.statics.create = function (username, password) {
  return new Promise(function(resolve, reject) {
    Account.register(
      new Account({ username : username }),
      password,
      function(err, account) {
        if (err) reject(err);

        //console.log(`account ${account.username} is added.`);

        resolve(account);
      }
    );
  });
};

Account.plugin(passportLocalMongoose);

mongoose.model('accounts', Account);
