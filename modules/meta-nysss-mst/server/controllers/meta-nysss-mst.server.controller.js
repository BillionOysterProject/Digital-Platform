'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaNysssMst = mongoose.model('MetaNysssMst'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a standard
 */
exports.create = function (req, res) {
  var standard = new MetaNysssMst(req.body);

  standard.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(standard);
    }
  });
};

/**
 * Show the current standard
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var standard = req.standard ? req.standard.toJSON() : {};
  if (req.query.select) {
    standard = {
      _id: standard._id,
      value: standard.code + ' - ' + standard.description
    };
  }
  res.json(standard);
};

/**
 * Update a standard type
 */
exports.update = function (req, res) {
  var standard = req.standard;

  if (standard) {
    standard = _.extend(standard, req.body);

    standard.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(standard);
      }
    });
  }
};

/**
 * Delete a standard type
 */
exports.delete = function (req, res) {
  var standard = req.standard;

  standard.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(standard);
    }
  });
};

/**
 * List of Standards
 */
exports.list = function (req, res) {
  var query;

  var searchRe;
  if (req.query.searchString) {
    try {
      searchRe = new RegExp(req.query.searchString, 'i');
      query = MetaNysssMst.find({ $or: [{ 'code': searchRe }, { 'description': searchRe }] });
    } catch(e) {
      return res.status(400).send({
        message: 'Search string is invalid'
      });
    }
  } else {
    query = MetaNysssMst.find();
  }

  query.sort('code').exec(function (err, standards) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (req.query.select) {
        var values = [];
        for (var i = 0; i < standards.length; i++) {
          values.push({
            _id: standards[i]._id,
            value: standards[i].code + ' - ' + standards[i].description
          });
        }
        res.json(values);
      } else {
        res.json(standards);
      }
    }
  });
};

/**
 * Standards middleware
 */
exports.standardByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Standard is invalid'
    });
  }

  MetaNysssMst.findById(id).exec(function (err, standard) {
    if (err) {
      return next(err);
    } else if (!standard) {
      return res.status(404).send({
        message: 'No standard with that identifier has been found'
      });
    }
    req.standard = standard;
    next();
  });
};
