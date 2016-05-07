const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({});

Account.plugin(passportLocalMongoose);

mongoose.model('accounts', Account);
