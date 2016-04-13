'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  ProtocolWaterQuality = mongoose.model('ProtocolWaterQuality'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var emptyString = function(string) {
  if (!string || string === null || string === '') {
    return true;
  } else {
    return false;
  }
};

var validateWaterQuality = function(waterQuality, successCallback, errorCallback) {
  var errorMessages = [];

  if (!waterQuality.samples || waterQuality.samples.length <= 0) {
    errorMessages.push('At least one sample is required');
  } else {
    for (var i = 0; i < waterQuality.samples.length; i++) {
      var sample = waterQuality.samples[i];
      if (sample.depthOfWaterSampleM < 0) {
        errorMessages.push('Depth of water sample must be positive');
      }
    }
  }


  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(waterQuality);
  }
};

/**
 * Create a protocol water quality
 */
exports.create = function (req, res) {
  validateWaterQuality(req.body,
  function(waterQualityJSON) {
    var waterQuality = new ProtocolWaterQuality(waterQualityJSON);

    waterQuality.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(waterQuality);
      }
    });
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages.join()
    });
  });
};

/**
 * Show the current protocol water quality
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var waterQuality = req.waterQuality ? req.waterQuality.toJSON() : {};

  res.json(waterQuality);
};

exports.incrementalSave = function (req, res) {
  var waterQuality = req.waterQuality;

  if (waterQuality) {
    waterQuality = _.extend(waterQuality, req.body);

    waterQuality.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(waterQuality);
      }
    });
  } else {
    return res.status(400).send({
      message: 'Protocol water quality not found'
    });
  }
};

/**
 * Update a protocol water quality
 */
exports.update = function (req, res) {
  validateWaterQuality(req.body,
  function(waterQualityJSON) {
    var waterQuality = req.waterQuality;

    if (waterQuality) {
      waterQuality = _.extend(waterQuality, waterQualityJSON);

      waterQuality.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(waterQuality);
        }
      });
    } else {
      return res.status(400).send({
        message: 'Protocol water quality not found'
      });
    }
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages.join()
    });
  });
};

/**
 * Delete a protocol water quality
 */
exports.delete = function (req, res) {
  var waterQuality = req.waterQuality;

  waterQuality.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterQuality);
    }
  });
};

/**
 * List of protocol water quality
 */
// exports.list = function(req, res) {
//   ProtocolWaterQuality.find().sort('-created').populate('user', 'displayName').exec(function(err, waterQualities) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(waterQualities);
//     }
//   });
// };

/**
 * Protocol Water Quality middleware
 */
exports.waterQualityByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Protocol Water Quality is invalid'
    });
  }

  ProtocolWaterQuality.findById(id).populate('teamLead', 'displayName').exec(function (err, waterQuality) {
    if (err) {
      return next(err);
    } else if (!waterQuality) {
      return res.status(400).send({
        message: 'No Protocol Water Quality with that identifier has been found'
      });
    }
    req.waterQuality = waterQuality;
    next();
  });
};
