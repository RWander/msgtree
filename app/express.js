'use strict';

// const session = require('express-session');
const morgan = require('morgan');
// const cookieParser = require('cookie-parser');
// const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
// const csrf = require('csurf');

// const mongoStore = require('connect-mongo')(session);
// const flash = require('connect-flash');
const winston = require('winston');
// const helpers = require('view-helpers');
// const config = require('./config');

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
  // app.use(cookieParser());
  // app.use(cookieSession({ secret: 'secret' }));
  // app.use(session({
  //   resave: true,
  //   saveUninitialized: true,
  //   secret: pkg.name,
  //   store: new mongoStore({
  //     url: config.db,
  //     collection : 'sessions'
  //   })
  // }));

  // use passport session
  // app.use(passport.initialize());
  // app.use(passport.session());

  // connect flash for flash messages - should be declared after sessions
  // app.use(flash());

  // should be declared after session and flash
  // app.use(helpers(pkg.name));

  // if (env !== 'test') {
  //   app.use(csrf());
  //
  //   // This could be moved to view-helpers :-)
  //   app.use(function (req, res, next) {
  //     res.locals.csrf_token = req.csrfToken();
  //     next();
  //   });
  // }
};
