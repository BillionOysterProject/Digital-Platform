'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaSubjectArea = mongoose.model('MetaSubjectArea'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a subject area
 */
exports.create = function (req, res) {
  var subjectArea = new MetaSubjectArea(req.body);

  subjectArea.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subjectArea);
    }
  });
};

/**
 * Show the current subject area
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var subjectArea = req.subjectArea ? req.subjectArea.toJSON() : {};

  res.json(subjectArea);
};

/**
 * Update a subject area
 */
exports.update = function (req, res) {
  var subjectArea = req.subjectArea;

  if (subjectArea) {
    subjectArea = _.extend(subjectArea, req.body);

    subjectArea.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(subjectArea);
      }
    });
  }
};

/**
 * Delete a subject area
 */
exports.delete = function (req, res) {
  var subjectArea = req.subjectArea;

  subjectArea.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subjectArea);
    }
  });
};

/**
 * List of Subject Areas
 */
exports.list = function (req, res) {
  var query;

  var searchRe;
  if (req.query.searchString) {
    try {
      searchRe = new RegExp(req.query.searchString, 'i');
      query = MetaSubjectArea.find({ 'subject': searchRe });
    } catch(e) {
      return res.status(400).send({
        message: 'Search string is invalid'
      });
    }
  } else {
    query = MetaSubjectArea.find();
  }

  query.sort('subject').exec(function (err, subjectAreas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subjectAreas);
    }
  });
};

/**
 * Subject Area middleware
 */
exports.subjectAreaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Subject area is invalid'
    });
  }

  MetaSubjectArea.findById(id).exec(function (err, subjectArea) {
    if (err) {
      return next(err);
    } else if (!subjectArea) {
      return res.status(404).send({
        message: 'No subject area with that identifier has been found'
      });
    }
    req.subjectArea = subjectArea;
    next();
  });
};
