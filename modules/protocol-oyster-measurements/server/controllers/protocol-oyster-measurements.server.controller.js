'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  ProtocolOysterMeasurement = mongoose.model('ProtocolOysterMeasurement'),
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

var validateOysterMeasurement = function(oysterMeasurement, successCallback, errorCallback) {
  for (var i = 0; i < oysterMeasurement.measuringOysterGrowth.substrateShells.length; i++) {
    oysterMeasurement.measuringOysterGrowth.substrateShells[i].setDate =
      moment(oysterMeasurement.measuringOysterGrowth.substrateShells[i].setDate, 'MM-DD-YYYY').toDate();
  }

  var errorMessages = [];

  if (!oysterMeasurement.depthOfOysterCage || oysterMeasurement.depthOfOysterCage.submergedDepthofCageM < 0) {
    errorCallback.push('Submerged depth of oyster cage is required');
  }

  if (!oysterMeasurement.conditionOfOysterCage) {
    errorCallback.push('Condition of oyster cage data is required');
  } else {
    if (!oysterMeasurement.conditionOfOysterCage.oysterCagePhoto) {
      errorCallback.push('Photo of oyster cage is required');
    }
    if (emptyString(oysterMeasurement.conditionOfOysterCage.bioaccumulationOnCage)) {
      errorCallback.push('Bioaccumulation on cage is required');
    }
    if (emptyString(oysterMeasurement.conditionOfOysterCage.notesOnDamageToCage)) {
      errorCallback.push('Notes on damage to cage is required');
    }
  }

  if (!oysterMeasurement.measuringOysterGrowth || oysterMeasurement.measuringOysterGrowth.substrateShells.length <= 0) {
    errorCallback.push('Substrate shell measurements are required');
  } else {
    for (var j = 0; j < oysterMeasurement.measuringOysterGrowth.substrateShells.length; j++) {
      var substrateShell = oysterMeasurement.measuringOysterGrowth.substrateShells[j];
      if (!substrateShell.outerSidePhoto) {
        errorCallback.push('Outer side photo is required for Substrate Shell #' + j+1);
      }
      if (!substrateShell.innerSidePhoto) {
        errorCallback.push('Inner side photo is required for Substrate Shell #' + j+1);
      }
      if (substrateShell.totalNumberOfLiveOystersOnShell <= 0) {
        errorCallback.push('The total number of live oysters on the shell must be greater than 0');
      } else {
        if (substrateShell.totalNumberOfLiveOystersOnShell !== substrateShell.measurements.length) {
          errorCallback.push('The number of measurements must be equal to the total number of live oysters on the shell');
        }
      }
    }
  }
  if (oysterMeasurement.minimumSizeOfAllLiveOysters < 0) {
    errorCallback.push('The minimum size of all live oysters must be positive');
  }
  if (oysterMeasurement.maximumSizeOfAllLiveOysters < 0) {
    errorCallback.push('The maximum size of all live oysters must be positive');
  }
  if (oysterMeasurement.averageSizeOfAllLiveOysters < 0) {
    errorCallback.push('The average size of all live oysters must be positive');
  }
  if (oysterMeasurement.totalNumberOfAllLiveOysters < 0) {
    errorCallback.push('The total number of all live oysters must be positive');
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(oysterMeasurement);
  }
};

/**
 * Create a protocol oyster oysterMeasurement
 */
exports.create = function (req, res) {
  validateOysterMeasurement(req.body,
  function(oysterMeasurementJSON) {
    var oysterMeasurement = new ProtocolOysterMeasurement(oysterMeasurementJSON);

    oysterMeasurement.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(oysterMeasurement);
      }
    });
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages.join()
    });
  });
};

/**
 * Show the current protocol oyster measurement
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var oysterMeasurement = req.oysterMeasurement ? req.oysterMeasurement.toJSON() : {};

  res.json(oysterMeasurement);
};

exports.incrementalSave = function (req, res) {
  var oysterMeasurement = req.oysterMeasurement;

  if (oysterMeasurement) {
    oysterMeasurement = _.extend(oysterMeasurement, req.body);

    oysterMeasurement.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(oysterMeasurement);
      }
    });
  } else {
    return res.status(400).send({
      message: 'Protocol oyster measurement not found'
    });
  }
};

/**
 * Update a protocol oyster measurement
 */
exports.update = function (req, res) {
  validateOysterMeasurement(req.body,
  function(oysterMeasurementJSON) {
    var oysterMeasurement = req.oysterMeasurement;

    if (oysterMeasurement) {
      oysterMeasurement = _.extend(oysterMeasurement, oysterMeasurementJSON);

      oysterMeasurement.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(oysterMeasurement);
        }
      });
    } else {
      return res.status(400).send({
        message: 'Protocol oyster measurement not found'
      });
    }
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages.join()
    });
  });
};

/**
 * Delete a protocol oyster measurement
 */
var deleteInternal = function(oysterMeasurement, successCallback, errorCallback) {
  var filesToDelete = [];
  if (oysterMeasurement) {
    if (oysterMeasurement.conditionOfOysterCage && oysterMeasurement.conditionOfOysterCage.oysterCagePhoto &&
    oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path) {
      filesToDelete.push(oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path);
    }
    for (var i = 0; i < oysterMeasurement.measuringOysterGrowth.substrateShells.length; i++) {
      if (oysterMeasurement.measuringOysterGrowth && oysterMeasurement.measuringOysterGrowth.substrateShells[i]) {
        if (oysterMeasurement.measuringOysterGrowth.substrateShells[i].outerSidePhoto &&
        oysterMeasurement.measuringOysterGrowth.substrateShells[i].outerSidePhoto.path) {
          filesToDelete.push(oysterMeasurement.measuringOysterGrowth.substrateShells[i].outerSidePhoto.path);
        }
        if (oysterMeasurement.measuringOysterGrowth.substrateShells[i].innerSidePhoto &&
        oysterMeasurement.measuringOysterGrowth.substrateShells[i].innerSidePhoto.path) {
          filesToDelete.push(oysterMeasurement.measuringOysterGrowth.substrateShells[i].innerSidePhoto.path);
        }
      }
    }
  }

  var uploadRemote = new UploadRemote();
  uploadRemote.deleteRemote(filesToDelete,
  function() {
    oysterMeasurement.remove(function (err) {
      if (err) {
        errorCallback(errorHandler.getErrorMessage(err));
      } else {
        successCallback(oysterMeasurement);
      }
    });
  }, function(err) {
    errorCallback(err);
  });
};

exports.delete = function (req, res) {
  var oysterMeasurement = req.oysterMeasurement;

  deleteInternal(oysterMeasurement,
  function(oysterMeasurement) {
    res.json(oysterMeasurement);
  }, function (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

var uploadFileSuccess = function(oysterMeasurement, res) {
  oysterMeasurement.save(function (saveError) {
    if (saveError) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(saveError)
      });
    } else {
      res.json(oysterMeasurement);
    }
  });
};

var uploadFileError = function(oysterMeasurement, errorMessage, res) {
  deleteInternal(oysterMeasurement,
  function(oysterMeasurement) {
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
 * Upload images to protocol oyster measurement
 */
exports.uploadOysterCageConditionPicture = function (req, res) {
  var oysterMeasurement = req.oysterMeasurement;
  var upload = multer(config.uploads.oysterCageConditionUpload).single('newOysterCageConditionPicture');
  var oysterCageConditionUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = oysterCageConditionUploadFileFilter;

  if (oysterMeasurement) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading oyster cage condition picture'
        });
      } else {
        var uploadRemote = new UploadRemote();
        uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.oysterCageConditionUpload,
        function (fileInfo) {
          oysterMeasurement.conditionOfOysterCage.oysterCagePhoto = fileInfo;

          uploadFileSuccess(oysterMeasurement, res);
        }, function (errorMessage) {
          uploadFileError(oysterMeasurement, errorMessage, res);
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'Oyster measurement does not exist'
    });
  }
};

exports.uploadOuterSubstratePicture = function (req, res) {
  var oysterMeasurement = req.oysterMeasurement;
  var substrateIndex = req.substrateIndex;
  var upload = multer(config.uploads.outerSubstrateUpload).single('newOuterSubstratePicture');
  var outerSubstrateUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = outerSubstrateUploadFileFilter;

  if (oysterMeasurement) {
    if (substrateIndex && oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex]) {
      var uploadRemote = new UploadRemote();
      uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.outerSubstrateUpload,
      function (fileInfo) {
        oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex].outerSidePhoto = fileInfo;

        uploadFileSuccess(oysterMeasurement, res);
      }, function(errorMessage) {
        uploadFileError(oysterMeasurement, errorMessage, res);
      });
    } else {
      return res.status(400).send({
        message: 'Substrate for oyster measurement does not exist'
      });
    }
  } else {
    res.status(400).send({
      message: 'Oyster measurement does not exist'
    });
  }
};

exports.uploadInnerSubstratePicture = function (req, res) {
  var oysterMeasurement = req.oysterMeasurement;
  var substrateIndex = req.substrateIndex;
  var upload = multer(config.uploads.innerSubstrateUpload).single('newInnerSubstratePicture');
  var innerSubstrateUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = innerSubstrateUploadFileFilter;

  if (oysterMeasurement) {
    if (substrateIndex && oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex]) {
      var uploadRemote = new UploadRemote();
      uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.innerSubstrateUpload,
      function(fileInfo) {
        oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex].innerSidePhoto = fileInfo;

        uploadFileSuccess(oysterMeasurement, res);
      }, function(errorMessage) {
        uploadFileError(oysterMeasurement, errorMessage, res);
      });
    } else {
      return res.status(400).send({
        message: 'Substrate for oyster measurement does not exist'
      });
    }
  } else {
    res.status(400).send({
      message: 'Oyster measurement does not exist'
    });
  }
};

/**
 * List of protocol oyster measurement
 */
// exports.list = function(req, res) {
//   ProtocolOysterMeasurement.find().sort('-created').populate('user', 'displayName').exec(function(err, oysterMeasurement) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(oysterMeasurement);
//     }
//   });
// };

/**
 * Protocol Oyster Measurement middleware
 */
exports.oysterMeasurementByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Protocol Oyster Measurement is invalid'
    });
  }

  ProtocolOysterMeasurement.findById(id).populate('teamLead', 'displayName').exec(function (err, oysterMeasurement) {
    if (err) {
      return next(err);
    } else if (!oysterMeasurement) {
      return res.status(400).send({
        message: 'No Protocol Oyster Measurement with that identifier has been found'
      });
    }
    req.oysterMeasurement = oysterMeasurement;
    next();
  });
};

exports.substrateIndexByID = function (req, res, next, id) {
  req.substrateIndex = id;
  next();
};
