'use strict';

const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const winston = require('winston');

const env = process.env.NODE_ENV || 'development';

module.exports = function (app, passport) {
  // Don't log during tests
  // Logging middleware
  if (env !== 'test') {
    // Use winston on production
    const log = env !== 'development'
      ? { stream: { write: message => winston.info(message) } }
      : 'dev';

    app.use(morgan(log));
  }

  // bodyParser should be above methodOverride
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // CookieParser should be above session
  app.use(cookieParser());
  //app.use(cookieSession({ secret: 'secret' }));
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'msgtree',
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      collection : 'sessions'
    })
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // connect flash for flash messages - should be declared after sessions
  app.use(flash());
};
