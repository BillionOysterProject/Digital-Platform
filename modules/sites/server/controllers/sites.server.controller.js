'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Site = mongoose.model('Site'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a site
 */
exports.create = function (req, res) {
  var site = new Site(req.body);

  site.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(site);
    }
  });
};

/**
 * Show the current site
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var site = req.site ? req.site.toJSON() : {};

  res.json(site);
};

/**
 * Update a site
 */
exports.update = function (req, res) {
  var site = req.site;

  if (site) {
    site = _.extend(site, req.body);

    site.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(site);
      }
    });
  }
};

/**
 * Delete a site
 */
exports.delete = function (req, res) {
  var site = req.site;

  site.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(site);
    }
  });
};

/** 
 * List of Sites
 */
exports.list = function (req, res) {
  Site.find().sort('label').exec(function (err, sites) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(sites);
    }
  });
};

/**
 * Site middleware
 */
exports.siteByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Site is invalid'
    });
  }

  Site.findById(id).exec(function (err, site) {
    if (err) {
      return next(err);
    } else if (!site) {
      return res.status(404).send({
        message: 'No site with that identifier has been found'
      });
    }
    req.site = site;
    next();
  });
};