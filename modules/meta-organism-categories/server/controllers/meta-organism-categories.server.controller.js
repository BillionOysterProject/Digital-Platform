'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaOrganismCategory = mongoose.model('MetaOrganismCategory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a organism category
 */
exports.create = function (req, res) {
  var organismCategory = new MetaOrganismCategory(req.body);

  organismCategory.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(organismCategory);
    }
  });
};

/**
 * Show the current organism category
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var organismCategory = req.organismCategory ? req.organismCategory.toJSON() : {};

  res.json(organismCategory);
};

/**
 * Update a organism category
 */
exports.update = function (req, res) {
  var organismCategory = req.organismCategory;

  if (organismCategory) {
    organismCategory = _.extend(organismCategory, req.body);

    organismCategory.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(organismCategory);
      }
    });
  }
};

/**
 * Delete a organism category
 */
exports.delete = function (req, res) {
  var organismCategory = req.organismCategory;

  organismCategory.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(organismCategory);
    }
  });
};

/**
 * List of Organism Categories
 */
exports.list = function (req, res) {
  MetaOrganismCategory.find().sort('order').exec(function (err, organismCategories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(organismCategories);
    }
  });
};

/**
 * Organism Category middleware
 */
exports.organismCategoryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Organism category is invalid'
    });
  }

  MetaOrganismCategory.findById(id).exec(function (err, organismCategory) {
    if (err) {
      return next(err);
    } else if (!organismCategory) {
      return res.status(404).send({
        message: 'No bioaccumulation with that identifier has been found'
      });
    }
    req.organismCategory = organismCategory;
    next();
  });
};
