'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ProtocolSiteCondition = mongoose.model('ProtocolSiteCondition'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var emptyString = function(string) {
  if (!string || string === null || string === '') {
    return true;
  } else {
    return false;
  }
};

var validateSiteCondition = function(siteCondition, successCallback, errorCallback) {
  var errorMessages = [];
  if (siteCondition.waterConditions.garbage.garbagePresent) {
    if (emptyString(siteCondition.waterConditions.garbage.hardPlastic)) {
      errorMessages.push('Water Condition - Hard Plastic extent is required.');
    }
    if (emptyString(siteCondition.waterConditions.garbage.softPlastic)) {
      errorMessages.push('Water Condition - Soft Plastic extent is required.');
    }
    if (emptyString(siteCondition.waterConditions.garbage.metal)) {
      errorMessages.push('Water Condition - Metal extent is required.');
    }
    if (emptyString(siteCondition.waterConditions.garbage.paper)) {
      errorMessages.push('Water Condition - Paper extent is required.');
    }
    if (emptyString(siteCondition.waterConditions.garbage.glass)) {
      errorMessages.push('Water Condition - Glass extent is required.');
    }
    if (emptyString(siteCondition.waterConditions.garbage.organic)) {
      errorMessages.push('Water Condition - Organic extent is required.');
    }
    if (emptyString(siteCondition.waterConditions.garbage.other.description)) {
      errorMessages.push('Water Condition - Other garbage description is required.');
    }
    if (emptyString(siteCondition.waterConditions.garbage.other.extent)) {
      errorMessages.push('Water Condition - Other garbage extent is required.');
    }
  }

  if (siteCondition.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent) {
    if (!siteCondition.waterConditions.markedCombinedSewerOverflowPipes.location.latitude ||
      siteCondition.waterConditions.markedCombinedSewerOverflowPipes.location.latitude === 0) {
      errorMessages.push('Water Condition - marked CSO pipe latitude is required.');
    }
    if (!siteCondition.waterConditions.markedCombinedSewerOverflowPipes.location.longitude || 
      siteCondition.waterConditions.markedCombinedSewerOverflowPipes.location.longitude === 0) {
      errorMessages.push('Water Condition - marked CSO pipe longitude is required.');
    }
    if (siteCondition.waterConditions.markedCombinedSewerOverflowPipes.flowThroughPresent) {
      if (emptyString(siteCondition.waterConditions.markedCombinedSewerOverflowPipes.howMuchFlowThrough)) {
        errorMessages.push('Water Condition - marked CSO pipe flow through amount is required.');
      }
    }
  }

  if (siteCondition.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent) {
    if (!siteCondition.waterConditions.unmarkedOutfallPipes.location.latitude ||
      siteCondition.waterConditions.unmarkedOutfallPipes.location.latitude === 0) {
      errorMessages.push('Water Condition - unmarked pipe latitude is required.');
    }
    if (!siteCondition.waterConditions.unmarkedOutfallPipes.location.longitude || 
      siteCondition.waterConditions.unmarkedOutfallPipes.location.longitude === 0) {
      errorMessages.push('Water Condition - unmarked pipe longitude is required.');
    }
    if (!siteCondition.waterConditions.unmarkedOutfallPipes.approximateDiameterCM ||
      siteCondition.waterConditions.unmarkedOutfallPipes.approximateDiameterCM === 0) {
      errorMessages.push('Water Condition - unmarked pipe approximate diameter is required.');
    }
    if (siteCondition.waterConditions.unmarkedOutfallPipes.flowThroughPresent) {
      if (emptyString(siteCondition.waterConditions.unmarkedOutfallPipes.howMuchFlowThrough)) {
        errorMessages.push('Water Condition - unmarked pipe flow through amount is required.');
      }
    }
  }

  if (siteCondition.landConditions.garbage.garbagePresent) {
    if (emptyString(siteCondition.landConditions.garbage.hardPlastic)) {
      errorMessages.push('Land Condition - Hard Plastic extent is required.');
    }
    if (emptyString(siteCondition.landConditions.garbage.softPlastic)) {
      errorMessages.push('Land Condition - Soft Plastic extent is required.');
    }
    if (emptyString(siteCondition.landConditions.garbage.metal)) {
      errorMessages.push('Land Condition - Metal extent is required.');
    }
    if (emptyString(siteCondition.landConditions.garbage.paper)) {
      errorMessages.push('Land Condition - Paper extent is required.');
    }
    if (emptyString(siteCondition.landConditions.garbage.glass)) {
      errorMessages.push('Land Condition - Glass extent is required.');
    }
    if (emptyString(siteCondition.landConditions.garbage.organic)) {
      errorMessages.push('Land Condition - Organic extent is required.');
    }
    if (emptyString(siteCondition.landConditions.garbage.other.description)) {
      errorMessages.push('Land Condition - Other garbage description is required.');
    }
    if (emptyString(siteCondition.landConditions.garbage.other.extent)) {
      errorMessages.push('Land Condition - Other garbage extent is required.');
    }
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback();
  }
};

/**
 * Create a protocol site condition 
 */
exports.create = function (req, res) {
  validateSiteCondition(req.body, 
  function() {
    var siteCondition = new ProtocolSiteCondition(req.body);

    siteCondition.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(siteCondition);
      }
    });
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages.join()
    });
  });
};

/**
 * Show the current protocol site condition
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var siteCondition = req.siteCondition ? req.siteCondition.toJSON() : {};

  res.json(siteCondition);
};

/**
 * Update a protocol site condition
 */
exports.update = function (req, res) {
  validateSiteCondition(req.body, 
  function() {
    var siteCondition = req.siteCondition;

    if (siteCondition) {
      siteCondition = _.extend(siteCondition, req.body);

      siteCondition.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(siteCondition);
        }
      });
    }
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages.join()
    });
  });
};

/**
 * Delete a protocol site condition
 */
exports.delete = function (req, res) {
  var siteCondition = req.siteCondition;

  siteCondition.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(siteCondition);
    }
  });
};

/**
 * Protocol Site Condition middleware
 */
exports.siteConditionByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Protocol Site Condition is invalid'
    });
  }

  ProtocolSiteCondition.findById(id).populate('user', 'displayName').exec(function (err, siteCondition) {
    if (err) {
      return next(err);
    } else if (!siteCondition) {
      return res.status(400).send({
        message: 'No Protocol Site Condition with that identifier has been found'
      });
    }
    req.siteCondition = siteCondition;
    next();
  });
};