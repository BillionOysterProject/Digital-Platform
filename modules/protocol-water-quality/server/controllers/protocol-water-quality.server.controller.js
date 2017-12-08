'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  Expedition = mongoose.model('Expedition'),
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

var validate = function(waterQuality, successCallback, errorCallback) {
  var errorMessages = [];

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
      // TODO: delete this code eventually!
      //if (!sample.dissolvedOxygen.results[0] || !sample.dissolvedOxygen.results[1] ||
      //  !sample.dissolvedOxygen.average) {
      //  errorMessages.push('Dissolved oxygen measurements are required');
      //}
      //if (!sample.salinity.results[0] || !sample.salinity.results[1] || !sample.salinity.average) {
      //  errorMessages.push('Salinity measurements are required');
      //}
      //if (!sample.pH.results[0] || !sample.pH.results[1] || !sample.pH.average) {
      //  errorMessages.push('pH measurements are required');
      //}
    }
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(waterQuality);
  }
};

/**
 * Show the current protocol water quality
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var waterQuality = req.waterQuality ? req.waterQuality.toJSON() : {};

  res.json(waterQuality);
};

exports.validate = function (req, res) {
  var waterQuality = req.body;
  validate(waterQuality, function(waterQualityJSON) {
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
};

exports.createInternal = function(collectionTime, latitude, longitude, teamList, callback) {
  if (teamList && teamList.length > 0) {
    var waterQuality = new ProtocolWaterQuality({
      collectionTime: moment(collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('minute').toDate(),
      latitude: latitude,
      longitude: longitude,
      teamMembers: teamList
    });
    waterQuality.save(function(err) {
      if (err) {
        callback('Could not create a water quality protocol');
      } else {
        callback(null, waterQuality);
      }
    });
  } else {
    callback();
  }
};

/**
 * Update a protocol water quality
 */
exports.updateInternal = function(waterQualityReq, waterQualityBody, user, shouldValidate, callback) {
  var save = function(waterQualityJSON, errorMessages) {
    var waterQuality = waterQualityReq;

    if (waterQuality) {
      waterQuality = _.extend(waterQuality, waterQualityJSON);
      waterQuality.collectionTime = moment(waterQualityBody.collectionTime).startOf('minute').toDate();
      if (user) waterQuality.scribeMember = user;
      if (waterQuality.status === 'submitted') waterQuality.submitted = new Date();

      waterQuality.save(function (err) {
        if (err) {
          callback(errorHandler.getErrorMessage(err), waterQuality, errorMessages);
        } else {
          callback(null, waterQuality, errorMessages);
        }
      });
    } else {
      callback('Protocol water quality not found', waterQuality, errorMessages);
    }
  };

  if (shouldValidate) {
    validate(waterQualityBody, function(waterQualityJSON) {
      save(waterQualityJSON, null);
    }, function(errorMessages) {
      save(waterQualityBody, errorMessages);
    });
  } else {
    save(waterQualityBody, null);
  }
};

exports.update = function (req, res) {
  var waterQualityBody = req.body;
  exports.updateInternal(req.waterQuality, waterQualityBody, req.user, true,
  function(err, waterQuality, errorMessages) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      var result = {
        waterQuality: waterQuality
      };
      if (errorMessages) {
        result.errors = errorMessages;
      } else {
        result.successful = true;
      }
      res.json(result);
    }
  });
};

exports.deleteInternal = function(waterQuality, callback) {
  if (waterQuality) {
    waterQuality.remove(function (err) {
      if (err) {
        callback(errorHandler.getErrorMessage(err));
      } else {
        callback(null, waterQuality);
      }
    });
  } else {
    callback();
  }
};

exports.updateFromExpedition = function(existing, updated, user, callback) {
  var existingWQ = existing.protocols.waterQuality;
  var updatedWQ = updated.protocols.waterQuality;
  if (!existingWQ && updatedWQ) {
    exports.createInternal(updated.monitoringStartDate, updated.station.latitude, updated.station.longitude,
      updated.teamLists.waterQuality, function(err, waterQuality) {
        callback(err, waterQuality);
      });
  } else if (existingWQ && !updatedWQ) {
    exports.deleteInternal(existingWQ, function(err, waterQuality) {
      callback(err, null);
    });
  } else if (existingWQ && updatedWQ) {
    ProtocolWaterQuality.findOne({ _id: existingWQ._id }).exec(function(err, databaseWQ) {
      updatedWQ.teamMembers = updated.teamLists.waterQuality;
      exports.updateInternal(databaseWQ, updatedWQ, user, false, function(err, waterQuality, errorMessages) {
        if (errorMessages) {
          callback(errorMessages, waterQuality);
        } else {
          callback(err, waterQuality);
        }
      });
    });
  } else {
    callback(null, existingWQ);
  }
};

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
