'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  User = require('mongoose').model('User'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  UniqueTokenStrategy = require('passport-unique-token').Strategy;

/**
 * Module init function
 */
module.exports = function (app, db) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id
    }, '-salt -password', function (err, user) {
      done(err, user);
    });
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // setup mapping of user tokens to passport
  passport.use(
    new UniqueTokenStrategy({
      tokenQuery:  'token',
      tokenParams: null,
      tokenField:  null,
      tokenHeader: 'X-BOP-Token',
      failedOnMissing: false
    }, function (token, done) {
      User.findOne({
        apiTokens: token,
      }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      });
    }
  ));

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(passport.authenticate('token', {
    session: false,
  }));
};
