'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  ProtocolSiteCondition = mongoose.model('ProtocolSiteCondition'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
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

  var errorMessages = [];

  if (siteCondition.tideConditions.closestHighTide && !moment(siteCondition.tideConditions.closestHighTide, 'MM-DD-YYYY HH:mm').isValid()) {
    errorMessages.push('Tide Conditions - Closest High Tide is not valid');
  }

  if (siteCondition.tideConditions.closestLowTide && !moment(siteCondition.tideConditions.closestLowTide, 'MM-DD-YYYY HH:mm').isValid()) {
    errorMessages.push('Tide Conditions - Closest Low Tide is not valid');
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
    siteCondition.tideConditions.closestHighTide = 
      moment(req.body.tideConditions.closestHighTide, 'MM-DD-YYYY HH:mm').toDate();
    siteCondition.tideConditions.closestLowTide = 
      moment(req.body.tideConditions.closestLowTide, 'MM-DD-YYYY HH:mm').toDate();

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
  siteCondition.tideConditions.closestHighTide = moment(siteCondition.tideConditions.closestHighTide).format('MM-DD-YYYY HH:mm');
  siteCondition.tideConditions.closestLowTide = moment(siteCondition.tideConditions.closestLowTide).format('MM-DD-YYYY HH:mm');

  res.json(siteCondition);
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
      siteCondition.tideConditions.closestHighTide = 
        moment(req.body.tideConditions.closestHighTide, 'MM-DD-YYYY HH:mm').toDate();
      siteCondition.tideConditions.closestLowTide = 
        moment(req.body.tideConditions.closestLowTide, 'MM-DD-YYYY HH:mm').toDate();

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
 * Upload images to protocol site condition
 */
exports.uploadWaterConditionPicture = function (req, res) {
  var siteCondition = req.siteCondition;
  var upload = multer(config.uploads.waterConditionUpload).single('newWaterConditionPicture');
  var waterConditionUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = waterConditionUploadFileFilter;

  if (siteCondition) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading water condition picture'
        });
      } else {
        console.log('file', req.file);
        siteCondition.waterConditions.waterConditionPhoto.path = config.uploads.waterConditionUpload.dest + req.file.filename;
        siteCondition.waterConditions.waterConditionPhoto.originalname = req.file.originalname;
        siteCondition.waterConditions.waterConditionPhoto.mimetype = req.file.mimetype;
        siteCondition.waterConditions.waterConditionPhoto.filename = req.file.filename;

        siteCondition.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            res.json(siteCondition);
          }
        });
      }
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
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading land condition picture'
        });
      } else {
        console.log('file', req.file);
        siteCondition.landConditions.landConditionPhoto.path = config.uploads.landConditionUpload.dest + req.file.filename;
        siteCondition.landConditions.landConditionPhoto.originalname = req.file.originalname;
        siteCondition.landConditions.landConditionPhoto.mimetype = req.file.mimetype;
        siteCondition.landConditions.landConditionPhoto.filename = req.file.filename;

        siteCondition.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            res.json(siteCondition);
          }
        });
      }
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