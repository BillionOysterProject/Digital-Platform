'use strict';

var validator = require('validator');

var safeUser = function(user) {
  var safeUserObject = null;
  if (user) {
    safeUserObject = {
      displayName: validator.escape(user.displayName),
      provider: validator.escape(user.provider),
      username: validator.escape(user.username),
      created: user.created.toString(),
      roles: user.roles,
      profileImageURL: user.profileImageURL,
      email: validator.escape(user.email),
      lastName: validator.escape(user.lastName),
      firstName: validator.escape(user.firstName),
      additionalProvidersData: user.additionalProvidersData
    };
  }
  return safeUserObject;
};

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var safeUserObject = safeUser(req.user);

  res.render('modules/core/server/views/index', {
    user: safeUserObject
  });
};

exports.renderFullPage = function (req, res) {
  var safeUserObject = safeUser(req.user);

  res.render('modules/core/server/views/full-page', {
    user: safeUserObject
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
