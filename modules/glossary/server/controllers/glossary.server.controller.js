'use strict';

/**
 * Modules dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Glossary = mongoose.model('Glossary'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create an Organism
 */
exports.create = function(req, res) {
  var term = new Glossary(req.body);
  term.user = req.user;
  term.term = _.capitalize(term.term);

  term.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(term);
    }
  });
};

/**
 * Show the current term
 */
exports.read = function(req, res) {
  // convert mongoose document to json
  var term = req.term ? req.term.toJSON() : {};

  term.isCurrentUserOwner = req.user && term.user && term.user._id.toString() === req.user._id.toString() ? true : false;

  res.json(term);
};

/**
 * Update a term
 */
exports.update = function(req, res) {
  var term = req.term;

  if (term) {
    term = _.extend(term, req.body);
    term.term = _.capitalize(term.term);

    term.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(term);
      }
    });
  } else {
    return res.status(400).send({
      message: 'Cannot update the term'
    });
  }
};

/**
 * Delete a term
 */
exports.delete = function(req, res) {
  var term = req.term;

  term.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(term);
    }
  });
};

/**
 * List of terms
 */
exports.list = function(req, res) {
  var query;
  var and = [];

  var searchRe;
  var or = [];
  if (req.query.searchString) {
    try {
      searchRe = new RegExp(req.query.searchString, 'i');
    } catch(e) {
      return res.status(400).send({
        message: 'Search string is invalid'
      });
    }
    
    or.push({ 'term': searchRe });
    or.push({ 'definition': searchRe });

    and.push({ $or: or });
  }

  if (and.length === 1) {
    query = Glossary.find(and[0]);
  } else if (and.length > 0) {
    query = Glossary.find({ $and: and });
  } else {
    query = Glossary.find();
  }

  if (req.query.sort) {
    if (req.query.sort === 'date') {
      query.sort('-created');
    } else if (req.query.sort === 'relevance') {

    }
  } else {
    query.sort('term');
  }

  if (req.query.limit) {
    var limit = Number(req.query.limit);
    if (req.query.page) {
      var page = Number(req.query.page);
      query.skip(limit*(page-1)).limit(limit);
    } else {
      query.limit(limit);
    }
  }

  query.exec(function(err, terms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(terms);
    }
  });
};

/**
 * Glossary middleware
 */
exports.termByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Term is invalid'
    });
  }

  Glossary.findById(id).populate('user', 'displayName email').exec(function(err, term) {
    if (err) {
      return next(err);
    } else if (!term) {
      return res.status(404).send({
        message: 'No term with that identifier has been found'
      });
    }
    req.term = term;
    next();
  });
};
