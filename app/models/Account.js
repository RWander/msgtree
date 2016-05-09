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


/**
 * Account - get all accounts with comments count
 *
 * @return {Promise}
 */
Account.statics.getWithCommentCount = function() {
  // NOTE: Only one query to db! :)
  return new Promise(function(resolve, reject) {
    mongoose.model('comments').aggregate([
      { $group: { _id : '$postedBy', count: { $sum: 1 } }},
      { $sort: { count: -1 } },
      { $lookup: { from: 'accounts', localField: '_id', foreignField: '_id', as: 'account' } },
      { $project: { _id: 0, 'account.username': 1, count: 1} },
      { $unwind: '$account' }
    ])
    .exec(function(err, users) {
      if (err) return reject(err);

      const result = users.map(u => {
        return {
          username: u.account.username,
          count: u.count
        };
      });

      resolve(result);
    });
  });
};

mongoose.model('accounts', Account);
