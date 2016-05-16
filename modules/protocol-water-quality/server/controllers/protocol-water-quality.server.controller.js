'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  ProtocolWaterQuality = mongoose.model('ProtocolWaterQuality'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  moment = require('moment'),
  _ = require('lodash');

var emptyString = function(string) {
  if (!string || string === null || string === '') {
    return true;
  } else {
    return false;
  }
};

var checkRole = function(role, user) {
  var roleIndex = _.findIndex(user.roles, function(r) {
    return r === role;
  });
  return (roleIndex > -1) ? true : false;
};

var validateWaterQuality = function(waterQuality, successCallback, errorCallback) {
  var errorMessages = [];

  console.log('waterQuality.samples', waterQuality.samples);
  if (!waterQuality.samples || waterQuality.samples.length <= 0) {
    errorMessages.push('At least one sample is required');
  } else {
    for (var i = 0; i < waterQuality.samples.length; i++) {
      var sample = waterQuality.samples[i];
      if (sample.depthOfWaterSampleM < 0) {
        errorMessages.push('Depth of water sample must be positive');
      }
      if (!sample.waterTemperature.results[0] || !sample.waterTemperature.results[1] ||
        !sample.waterTemperature.average) {
        errorMessages.push('Water temperature measurements are required');
      }
      if (!sample.dissolvedOxygen.results[0] || !sample.dissolvedOxygen.results[1] ||
        !sample.dissolvedOxygen.average) {
        errorMessages.push('Dissolved oxygen measurements are required');
      }
      if (!sample.salinity.results[0] || !sample.salinity.results[1] || !sample.salinity.average) {
        errorMessages.push('Salinity measurements are required');
      }
      if (!sample.pH.results[0] || !sample.pH.results[1] || !sample.pH.average) {
        errorMessages.push('pH measurements are required');
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
    waterQuality.collectionTime = moment(req.body.collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('minute').toDate();
    waterQuality.scribeMember = req.user;

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
      message: errorMessages
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
    if (waterQuality.status === 'incomplete' || waterQuality.status === 'returned' ||
      (checkRole('team lead', req.user) && waterQuality.status === 'submitted')) {
      waterQuality = _.extend(waterQuality, req.body);
      waterQuality.collectionTime = moment(req.body.collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('minute').toDate();
      waterQuality.scribeMember = req.user;

      console.log('waterQuality', waterQuality);
      waterQuality.save(function (err) {
        if (err) {
          console.log('water quality save error', err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          validateWaterQuality(waterQuality,
          function(waterQualityJSON) {
            res.json({
              waterQuality: waterQuality,
              successful: true
            });
          }, function (errorMessages) {
            res.json({
              waterQuality: waterQuality,
              errors: errorMessages
            });
          });
        }
      });
    } else {
      res.json({
        status: waterQuality.status,
        scribe: waterQuality.scribeMember.displayName
      });
    }
  } else {
    return res.status(400).send({
      message: 'Protocol water quality not found'
    });
  }
};

/**
 * Update a protocol water quality
 */
exports.updateInternal = function(waterQualityReq, waterQualityBody, user, successCallback, errorCallback) {
  validateWaterQuality(waterQualityBody,
  function(waterQualityJSON) {
    var waterQuality = waterQualityReq;

    if (waterQuality) {
      waterQuality = _.extend(waterQuality, waterQualityJSON);
      waterQuality.collectionTime = moment(waterQualityBody.collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('minute').toDate();
      waterQuality.scribeMember = user;
      waterQuality.submitted = new Date();

      waterQuality.save(function (err) {
        if (err) {
          errorCallback(errorHandler.getErrorMessage(err));
        } else {
          successCallback(waterQuality);
        }
      });
    } else {
      errorCallback('Protocol water quality not found');
    }
  }, function(errorMessages) {
    errorCallback(errorMessages);
  });
};

exports.update = function (req, res) {
  var waterQualityBody = req.body;
  waterQualityBody.status = 'submitted';

  exports.updateInternal(req.waterQuality, waterQualityBody, req.user,
  function(waterQuality) {
    res.json(waterQuality);
  }, function(errorMessage) {
    return res.status(400).send({
      message: errorMessage
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

  ProtocolWaterQuality.findById(id).populate('teamLead', 'displayName username').populate('scribeMember', 'displayName username')
  .exec(function (err, waterQuality) {
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
