'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  request = require('request'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  moment = require('moment'),
  lodash = require('lodash');

/**
 * Calculate metrics related to people using the system
 */
exports.getPeopleMetrics = function(req, res) {
  var query = User.count({ pending: false });
  query.exec(function(err, totalUserCount) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(totalUserCount);
    }
  });
};
