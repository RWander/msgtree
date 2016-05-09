'use strict';

/* eslint-disable no-console */

const _ = require('lodash');
const faker = require('faker');
const mongoose = require('mongoose');
const Account = mongoose.model('accounts');
const Comment = mongoose.model('comments');

function generate(done) {
  createAccounts()
    .then(createComments)
    .then(comments => done(null))
    .catch(done);
}

function createAccounts() {
  return new Promise(function(resolve, reject) {
    const accounts = [];
    for (let i = 0; i < 5; i++) {
      accounts[i] = {
        username: faker.internet.userName(),
        password: faker.internet.password()
      };
    }

    // save to db
    Promise.all(
      accounts.map(account => Account.create(account.username, account.password))
    ).then(
      accounts => {
        accounts.forEach(account => {
          console.log(`account ${account.username} is added.`);
        });
        console.log(`Total account count: ${accounts.length}.`);
        resolve(accounts);
      },
      err => reject(err)
    );
  });
}

function createComments(users) {
  return new Promise(function(resolve, reject) {
    const comments = [];
    for (let i = 0; i < 100; i++) {
      const hasParent = comments.length !== 0 && (faker.random.boolean() || faker.random.boolean()); // для увеличения вероятности, что у сообщения есть parent

      let ancestors;
      let parent;

      if (hasParent === true) {
        const parentNum = faker.random.number({
          min: 0,
          max: comments.length - 1
        });
        parent = comments[parentNum];
        ancestors = _.concat(parent.ancestors, parent._id);
      } else {
        parent = null;
        ancestors = [];
      }

      comments[i] = {
        _id: mongoose.Types.ObjectId(),
        text: faker.lorem.paragraph(),
        postedBy: users[faker.random.number({min:0, max:users.length - 1})]._id,
        ancestors: ancestors,
        parent: parent !== null ? parent._id : null
      };
    }

    Promise.all(
      comments.map(comment => Comment.create(comment))
    ).then(
      data => {
        data.forEach(comment => {
          console.log(`comment ${comment._id} is added.`);
        });
        console.log(`Total comment count: ${data.length}.`);
        resolve(data);
      },
      err => reject(err)
    );
  });
}

module.exports = generate;
