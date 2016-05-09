'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  ProtocolSiteCondition = mongoose.model('ProtocolSiteCondition'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  _ = require('lodash'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  moment = require('moment');

var emptyString = function(string) {
  if (!string || string === null || string === '') {
    return true;
  } else {
    return false;
  }
};

var validateSiteCondition = function(siteCondition, successCallback, errorCallback) {
  if (!siteCondition.recentRainfall.rainedIn24Hours) siteCondition.recentRainfall.rainedIn24Hours = false;
  if (!siteCondition.recentRainfall.rainedIn72Hours) siteCondition.recentRainfall.rainedIn72Hours = false;
  if (!siteCondition.recentRainfall.rainedIn7Days) siteCondition.recentRainfall.rainedIn7Days = false;
  if (!siteCondition.waterConditions.oilSheen) siteCondition.waterConditions.oilSheen = false;
  if (!siteCondition.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent) siteCondition.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent = false;
  if (!siteCondition.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent) siteCondition.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent = false;

  var errorMessages = [];

  if (!siteCondition.meteorologicalConditions) {
    errorMessages.push('Meterological Conditions are required');
  } else {
    if (emptyString(siteCondition.meteorologicalConditions.weatherConditions)) {
      errorMessages.push('Weather conditions are required');
    }
    if (!siteCondition.meteorologicalConditions.airTemperatureC) {
      errorMessages.push('Air temperature is required');
    }
    if (siteCondition.meteorologicalConditions.windSpeedMPH < 0) {
      errorMessages.push('Wind speed must be positive');
    }
    if (emptyString(siteCondition.meteorologicalConditions.windDirection)) {
      errorMessages.push('Wind direction is required');
    }
    if (siteCondition.meteorologicalConditions.humidityPer < 0) {
      errorMessages.push('Humidity percentage is required');
    }
  }

  if (!siteCondition.tideConditions) {
    errorMessages.push('Tide conditions are required');
  }
  if (emptyString(siteCondition.tideConditions.closestHighTide)) {
    errorMessages.push('Closest high tide is required');
  } else {
    if (!moment(siteCondition.tideConditions.closestHighTide).isValid()) {
      errorMessages.push('Tide Conditions - Closest High Tide is not valid');
    }
  }

  if (emptyString(siteCondition.tideConditions.closestLowTide)) {
    errorMessages.push('Closest low tide is required');
  } else {
    if (!moment(siteCondition.tideConditions.closestLowTide).isValid()) {
      errorMessages.push('Tide Conditions - Closest Low Tide is not valid');
    }
  }
  if (siteCondition.tideConditions.currentSpeedMPH < 0) {
    errorMessages.push('Current speed must be positive');
  }
  if (emptyString(siteCondition.tideConditions.currentDirection)) {
    errorMessages.push('Current direction is required');
  }
  if (emptyString(siteCondition.tideConditions.tidalCurrent)) {
    errorMessages.push('Tidal current is required');
  }

  if (!siteCondition.waterConditions) {
    errorMessages.push('Water condition is required');
  }
  if (!siteCondition.waterConditions.waterConditionPhoto) {
    errorMessages.push('Water condition photo is required');
  }
  if (emptyString(siteCondition.waterConditions.waterColor)) {
    errorMessages.push('Water color is required');
  }
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
    if (siteCondition.waterConditions.garbage.other &&
      !emptyString(siteCondition.waterConditions.garbage.other.description) &&
      emptyString(siteCondition.waterConditions.garbage.other.extent)) {
      errorMessages.push('Water Condition - Other garbage extent is required.');
    }
  }

  if (siteCondition.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent === true) {
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

  if (siteCondition.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent === true) {
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

  if (!siteCondition.landConditions) {
    errorMessages.push('Land conditions is required');
  }
  if (!siteCondition.landConditions.landConditionPhoto) {
    errorMessages.push('Land condition photo is required');
  }
  if (siteCondition.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer +
    siteCondition.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer +
    siteCondition.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer !== 100) {
    errorMessages.push('Estimated percent surface cover should add up to 100%');
  }
  if (emptyString(siteCondition.landConditions.shoreLineType)) {
    errorMessages.push('Shore line type is required');
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

    if (siteCondition.landConditions.garbage.other &&
      !emptyString(siteCondition.landConditions.garbage.other.description) &&
      emptyString(siteCondition.landConditions.garbage.other.extent)) {
      errorMessages.push('Land Condition - Other garbage extent is required.');
    }
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(siteCondition);
  }
};

/**
 * Create a protocol site condition
 */
exports.create = function (req, res) {
  validateSiteCondition(req.body,
  function(siteConditionJSON) {
    var siteCondition = new ProtocolSiteCondition(siteConditionJSON);
    siteCondition.collectionTime = moment(req.body.collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
    siteCondition.tideConditions.closestHighTide =
      moment(req.body.tideConditions.closestHighTide, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
    siteCondition.tideConditions.closestLowTide =
      moment(req.body.tideConditions.closestLowTide, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
    siteCondition.scribeMember = req.user;

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
      message: errorMessages
    });
  });
};

/**
 * Show the current protocol site condition
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var siteCondition = req.siteCondition ? req.siteCondition.toJSON() : {};
  // siteCondition.collectionTime =
  //   moment(req.body.collection, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
  // siteCondition.tideConditions.closestHighTide =
  //   moment(req.body.tideConditions.closestHighTide, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
  // siteCondition.tideConditions.closestLowTide =
  //   moment(req.body.tideConditions.closestLowTide, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();

  res.json(siteCondition);
};

exports.incrementalSave = function (req, res) {
  var siteCondition = req.siteCondition;

  if (siteCondition) {
    siteCondition = _.extend(siteCondition, req.body);
    siteCondition.collectionTime = moment(req.body.collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
    siteCondition.tideConditions.closestHighTide =
      moment(req.body.tideConditions.closestHighTide, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
    siteCondition.tideConditions.closestLowTide =
      moment(req.body.tideConditions.closestLowTide, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
    siteCondition.scribeMember = req.user;

    siteCondition.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        validateSiteCondition(siteCondition, function(siteConditionJSON) {
          res.json({
            siteCondition: siteCondition,
            successful: true
          });
        }, function(errorMessages) {
          res.json({
            siteCondition: siteCondition,
            errors: errorMessages
          });
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Protocol site condition not found'
    });
  }
};

/**
 * Update a protocol site condition
 */
exports.update = function (req, res) {
  validateSiteCondition(req.body,
  function(siteConditionJSON) {
    var siteCondition = req.siteCondition;

    if (siteCondition) {
      siteCondition = _.extend(siteCondition, siteConditionJSON);
      siteCondition.collectionTime = moment(req.body.collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
      siteCondition.tideConditions.closestHighTide =
        moment(req.body.tideConditions.closestHighTide, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
      siteCondition.tideConditions.closestLowTide =
        moment(req.body.tideConditions.closestLowTide, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
      siteCondition.scribeMember = req.user;
      siteCondition.status = 'submitted';
      siteCondition.submitted = new Date();

      siteCondition.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(siteCondition);
        }
      });
    } else {
      return res.status(400).send({
        message: 'Protocol site condition not found'
      });
    }
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages
    });
  });
};

/**
 * Delete a protocol site condition
 */

var deleteInternal = function(siteCondition, successCallback, errorCallback) {
  var filesToDelete = [];
  if (siteCondition) {
    if (siteCondition.waterConditions && siteCondition.waterConditions.waterConditionPhoto &&
    siteCondition.waterConditions.waterConditionPhoto.path) {
      filesToDelete.push(siteCondition.waterConditions.waterConditionPhoto.path);
    }
    if (siteCondition.landConditions && siteCondition.landConditions.landConditionPhoto &&
    siteCondition.landConditions.landConditionPhoto.path) {
      filesToDelete.push(siteCondition.landConditions.landConditionPhoto.path);
    }
  }

  var uploadRemote = new UploadRemote();
  uploadRemote.deleteRemote(filesToDelete,
  function() {
    siteCondition.remove(function (err) {
      if (err) {
        errorCallback(errorHandler.getErrorMessage(err));
      } else {
        successCallback(siteCondition);
      }
    });
  }, function(err) {
    errorCallback(err);
  });
};

exports.delete = function (req, res) {
  var siteCondition = req.siteCondition;

  deleteInternal(siteCondition,
  function(siteCondition) {
    res.json(siteCondition);
  }, function(err) {
    return res.status(400).send({
      message: err
    });
  });
};

var uploadFileSuccess = function(siteCondition, res) {
  siteCondition.save(function (saveError) {
    if (saveError) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(saveError)
      });
    } else {
      res.json(siteCondition);
    }
  });
};

var uploadFileError = function(siteCondition, errorMessage, res) {
  deleteInternal(siteCondition,
  function(siteCondition) {
    return res.status(400).send({
      message: errorMessage
    });
  }, function(err) {
    return res.status(400).send({
      message: err
    });
  });
};

/**
 * Upload images to protocol site condition
 */
exports.uploadWaterConditionPicture = function (req, res) {
  var siteCondition = req.siteCondition;
  var upload = multer(config.uploads.waterConditionUpload).single('newWaterConditionPicture');
  var waterConditionUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = waterConditionUploadFileFilter;

  if (siteCondition) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.waterConditionUpload,
    function(fileInfo) {
      siteCondition.waterConditions.waterConditionPhoto = fileInfo;
      uploadFileSuccess(siteCondition, res);
    }, function (errorMessage) {
      // delete siteCondition
      uploadFileError(siteCondition, errorMessage, res);
    });
  } else {
    res.status(400).send({
      message: 'Site condition does not exist'
    });
  }
};

exports.uploadLandConditionPicture = function (req, res) {
  var siteCondition = req.siteCondition;
  var upload = multer(config.uploads.landConditionUpload).single('newLandConditionPicture');
  var landConditionUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = landConditionUploadFileFilter;

  if (siteCondition) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.landConditionUpload,
    function(fileInfo) {
      siteCondition.landConditions.landConditionPhoto = fileInfo;
      uploadFileSuccess(siteCondition, res);
    }, function(errorMessage) {
      // delete siteCondition
      uploadFileError(siteCondition, errorMessage, res);
    });
  } else {
    res.status(400).send({
      message: 'Site condition does not exist'
    });
  }
};

/**
 * List of protocol site condition
 */
// exports.list = function(req, res) {
//   ProtocolSiteCondition.find().sort('-created').populate('user', 'displayName').exec(function(err, siteConditions) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(siteConditions);
//     }
//   });
// };

/**
 * Protocol Site Condition middleware
 */
exports.siteConditionByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Protocol Site Condition is invalid'
    });
  }

  ProtocolSiteCondition.findById(id).populate('teamLead', 'displayName').exec(function (err, siteCondition) {
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
