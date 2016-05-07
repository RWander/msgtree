'use strict';

/* eslint-disable no-console */

const faker = require('faker');
const mongoose = require('mongoose');
const Account = mongoose.model('accounts');
const Comment = mongoose.model('comments');

function generate(done) {
  Promise.all([
    accounts(),
    messages()
  ]).then(
    () => done(null),
    err => done(err)
  );
}

function accounts() {
  return new Promise(function(resolve, reject) {
    // accounts
    const accounts = [];
    for (let i = 0; i < 5; i++) {
      accounts[i] = {
        username: faker.internet.userName(),
        password: faker.internet.password()
      };
    }

    Promise.all(
      accounts.map(account => Account.create(account.username, account.password))
    ).then(
      accounts => {
        accounts.forEach(account => {
          console.log(`account ${account.username} is added.`);
        });
        resolve(null);
      },
      err => reject(err)
    );
  });
}

function messages() {
  return new Promise(function(resolve, reject) {
    resolve(null);
  });
}

module.exports = generate;
