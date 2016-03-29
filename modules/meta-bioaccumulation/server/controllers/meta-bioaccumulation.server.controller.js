'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaBioaccumulation = mongoose.model('MetaBioaccumulation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a bioaccumulation
 */
exports.create = function (req, res) {
  var bioaccumulation = new MetaBioaccumulation(req.body);

  bioaccumulation.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bioaccumulation);
    }
  });
};

/**
 * Show the current bioaccumulation
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var bioaccumulation = req.bioaccumulation ? req.bioaccumulation.toJSON() : {};

  res.json(bioaccumulation);
};

/**
 * Update a bioaccumulation
 */
exports.update = function (req, res) {
  var bioaccumulation = req.bioaccumulation;

  if (bioaccumulation) {
    bioaccumulation = _.extend(bioaccumulation, req.body);

    bioaccumulation.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(bioaccumulation);
      }
    });
  }
};

/**
 * Delete a bioaccumulation
 */
exports.delete = function (req, res) {
  var bioaccumulation = req.bioaccumulation;

  bioaccumulation.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bioaccumulation);
    }
  });
};

/**
 * List of Bioaccumulation
 */
exports.list = function (req, res) {
  MetaBioaccumulation.find().sort('order').exec(function (err, bioaccumulations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bioaccumulations);
    }
  });
};

/**
 * Bioaccumulation middleware
 */
exports.bioaccumulationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bioaccumulation is invalid'
    });
  }

  MetaBioaccumulation.findById(id).exec(function (err, bioaccumulations) {
    if (err) {
      return next(err);
    } else if (!bioaccumulations) {
      return res.status(404).send({
        message: 'No bioaccumulation with that identifier has been found'
      });
    }
    req.bioaccumulations = bioaccumulations;
    next();
  });
};
