'use strict';

/* eslint-disable no-console */

const faker = require('faker');
const mongoose = require('mongoose');
const Account = mongoose.model('accounts');
const Comment = mongoose.model('comments');

function generate(done) {
  // accounts
  const accounts = [];
  for (let i = 0; i < 5; i++) {
    accounts[i] = {
      username: faker.internet.userName(),
      password: faker.internet.password()
    };
  }

  // TODO: messages
  // ..

  Promise.all(
    accounts.map((account) => Account.create(account.username, account.password))
  ).then(
    accounts => done(null),
    err => done(err)
  );
}

module.exports = generate;
