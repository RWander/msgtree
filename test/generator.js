'use strict';

/* eslint-disable no-console */

const faker = require('faker');
const mongoose = require('mongoose');
const Account = mongoose.model('accounts');

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
    accounts.map(addAccount)
  ).then(
    accounts => done(null),
    err => done(err)
  );
}

function addAccount(data) {
  return new Promise(function(resolve, reject) {
    Account.register(
      new Account({ username : data.username }),
      data.password,
      function(err, account) {
        if (err) reject(err);

        console.log(`account ${account.username} is added.`);

        resolve(account);
      }
    );
  });
}

module.exports = generate;
