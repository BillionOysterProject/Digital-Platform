'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaBoroughsCounty = mongoose.model('MetaBoroughsCounty'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a borough/county
 */
exports.create = function(req, res) {
  var boroughCounty = new MetaBoroughsCounty(req.body);
  boroughCounty.user = req.user;

  boroughCounty.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(boroughCounty);
    }
  });
};

/**
 * Show the current borough/county
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var boroughCounty = req.boroughCounty ? req.boroughCounty.toJSON() : {};

  res.json(boroughCounty);
};

/**
 * Update a borough/county
 */
exports.update = function(req, res) {
  var boroughCounty = req.boroughCounty;

  boroughCounty = _.extend(boroughCounty, req.body);

  boroughCounty.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(boroughCounty);
    }
  });
};

/**
 * Delete a borough/county
 */
exports.delete = function(req, res) {
  var boroughCounty = req.boroughCounty;

  boroughCounty.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(boroughCounty);
    }
  });
};

/**
 * List of boroughs/counties
 */
exports.list = function(req, res) {
  MetaBoroughsCounty.find().sort('order').exec(function(err, metaBoroughsCounties) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(metaBoroughsCounties);
    }
  });
};

/**
 * Borough/county middleware
 */
exports.boroughCountyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Borough/county is invalid'
    });
  }

  MetaBoroughsCounty.findById(id).exec(function (err, boroughCounty) {
    if (err) {
      return next(err);
    } else if (!boroughCounty) {
      return res.status(404).send({
        message: 'No borough/county with that identifier has been found'
      });
    }
    req.boroughCounty = boroughCounty;
    next();
  });
};
