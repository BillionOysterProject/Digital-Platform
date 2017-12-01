'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  Expedition = mongoose.model('Expedition'),
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

var checkRole = function(role, user) {
  var roleIndex = _.findIndex(user.roles, function(r) {
    return r === role;
  });
  return (roleIndex > -1) ? true : false;
};

var validate = function(oysterMeasurement, successCallback, errorCallback) {
  var errorMessages = [];

  // TODO: clean up this code later- remove depth of cage requirement.
  // if(!oysterMeasurement.depthOfOysterCage || oysterMeasurement.depthOfOysterCage.submergedDepthofCageM === undefined ||
  //   oysterMeasurement.depthOfOysterCage.submergedDepthofCageM === null) {
  //   errorMessages.push('Submerged depth of oyster cage is required and must be greater than 0');
  // } else if(oysterMeasurement.depthOfOysterCage.submergedDepthofCageM < 0) {
  //   errorMessages.push('Submerged depth of oyster cage must be greater than 0');
  // }
 
  // TODO: clean up this code later- removing requirements to upload a photo of the cage
  // and removing requirement to describe bioaccumulation.
  // if (!oysterMeasurement.conditionOfOysterCage) {
  //   errorMessages.push('Cage Condition photo is required');
  //   errorMessages.push('Bioaccumulation on cage is required');
  // } else {

  //   if (!oysterMeasurement.conditionOfOysterCage.oysterCagePhoto ||
  //     oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path === undefined ||
  //     oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path === '') {
  //     errorMessages.push('Photo of oyster cage is required');
  //   }
  //   if (emptyString(oysterMeasurement.conditionOfOysterCage.bioaccumulationOnCage)) {
  //     errorMessages.push('Bioaccumulation on cage is required');
  //   }
  // }

  if (!oysterMeasurement.measuringOysterGrowth || !oysterMeasurement.measuringOysterGrowth.substrateShells ||
    oysterMeasurement.measuringOysterGrowth.substrateShells.length < 0) {
    errorMessages.push('Substrate shell measurements are required');
  } else {
    var oneSuccessfulSubstrateShell = false;

    var allOystersMeasured = function(substrateShell) {
      var filledOutCount = 0;
      for (var k = 0; k < substrateShell.measurements.length; k++) {
        if (substrateShell.measurements[k].sizeOfLiveOysterMM !== null) {
          filledOutCount++;
        }
      }
      return substrateShell.totalNumberOfLiveOystersOnShell === filledOutCount;
    };

    for (var j = 0; j < oysterMeasurement.measuringOysterGrowth.substrateShells.length; j++) {
      var substrateShell = oysterMeasurement.measuringOysterGrowth.substrateShells[j];

      if (substrateShell.totalNumberOfLiveOystersOnShell > 0 && allOystersMeasured(substrateShell)) {
        oneSuccessfulSubstrateShell = true;
      } else if (substrateShell.totalNumberOfLiveOystersOnShell === undefined || substrateShell.totalNumberOfLiveOystersOnShell <= 1) {

      } else {
        var shellNumber = 1+j;
        if (substrateShell.totalNumberOfLiveOystersOnShell < 0) {
          errorMessages.push('The total number of live oysters on Substrate Shell #' + shellNumber + ' must be a positive number');
        } else {
          if (!allOystersMeasured(substrateShell)) {
            errorMessages.push('The number of measurements must be equal to the total number of live oysters on Substrate Shell #' + shellNumber);
          }
        }
      }
    }

    if (!oneSuccessfulSubstrateShell) {
      errorMessages.push('There must be at least one substrate shell');
    }
  }
  if (oysterMeasurement.minimumSizeOfAllLiveOysters < 0) {
    errorMessages.push('The minimum size of all live oysters must be positive');
  }
  if (oysterMeasurement.maximumSizeOfAllLiveOysters < 0) {
    errorMessages.push('The maximum size of all live oysters must be positive');
  }
  if (oysterMeasurement.averageSizeOfAllLiveOysters < 0) {
    errorMessages.push('The average size of all live oysters must be positive');
  }
  if (oysterMeasurement.totalNumberOfAllLiveOysters < 0) {
    errorMessages.push('The total number of all live oysters must be positive');
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(oysterMeasurement);
  }
};

/**
 * Show the current protocol oyster measurement
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var oysterMeasurement = req.oysterMeasurement ? req.oysterMeasurement.toJSON() : {};

  res.json(oysterMeasurement);
};

exports.validate = function (req, res) {
  var oysterMeasurement = req.body;
  validate(oysterMeasurement, function(oysterMeasurementJSON) {
    res.json({
      oysterMeasurement: oysterMeasurement,
      successful: true
    });
  }, function(errorMessages) {
    res.json({
      oysterMeasurement: oysterMeasurement,
      errors: errorMessages
    });
  });
};

exports.createInternal = function(collectionTime, latitude, longitude, teamList, callback) {
  if (teamList && teamList.length > 0) {
    var oysterMeasurement = new ProtocolOysterMeasurement({
      collectionTime: moment(collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('minute').toDate(),
      latitude: latitude,
      longitude: longitude,
      teamMembers: teamList
    });
    oysterMeasurement.save(function (err) {
      if (err) {
        callback('Could not create an oyster measurement protocol');
      } else {
        callback(null, oysterMeasurement);
      }
    });
  } else {
    callback();
  }
};

/**
 * Update a protocol oyster measurement
 */
exports.updateInternal = function (oysterMeasurmentReq, oysterMeasurementBody, user, shouldValidate, callback) {
  var save = function(oysterMeasurementJSON, errorMessages) {
    var oysterMeasurement = oysterMeasurmentReq;

    if (oysterMeasurement) {
      oysterMeasurement = _.extend(oysterMeasurement, oysterMeasurementJSON);
      oysterMeasurement.collectionTime = moment(oysterMeasurementBody.collectionTime).startOf('minute').toDate();
      if (user) oysterMeasurement.scribeMember = user;
      if (oysterMeasurementBody.measuringOysterGrowth) {
        for (var i = 0; i < oysterMeasurementBody.measuringOysterGrowth.substrateShells.length; i++) {
          if (oysterMeasurementBody.measuringOysterGrowth.substrateShells[i].setDate) {
            oysterMeasurement.measuringOysterGrowth.substrateShells[i].setDate =
              moment(oysterMeasurementBody.measuringOysterGrowth.substrateShells[i].setDate).startOf('day').toDate();
          }
        }
      }
      if (oysterMeasurement.status === 'submitted') oysterMeasurement.submitted = new Date();

      // remove base64 text
      var pattern = /^data:image\/[a-z]*;base64,/i;
      if (oysterMeasurement.conditionOfOysterCage && oysterMeasurement.conditionOfOysterCage.oysterCagePhoto &&
      oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path &&
      pattern.test(oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path)) {
        oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path = '';
      }
      if (oysterMeasurement.measuringOysterGrowth && oysterMeasurement.measuringOysterGrowth.substrateShells &&
      oysterMeasurement.measuringOysterGrowth.substrateShells.length > 0) {
        for (var j = 0; j < oysterMeasurement.measuringOysterGrowth.substrateShells.length; j++) {
          if (oysterMeasurement.measuringOysterGrowth.substrateShells[j].outerSidePhoto &&
          oysterMeasurement.measuringOysterGrowth.substrateShells[j].outerSidePhoto.path &&
          pattern.test(oysterMeasurement.measuringOysterGrowth.substrateShells[j].outerSidePhoto.path)) {
            oysterMeasurement.measuringOysterGrowth.substrateShells[j].outerSidePhoto.path = '';
          }
          if (oysterMeasurement.measuringOysterGrowth.substrateShells[j].innerSidePhoto &&
          oysterMeasurement.measuringOysterGrowth.substrateShells[j].innerSidePhoto.path &&
          pattern.test(oysterMeasurement.measuringOysterGrowth.substrateShells[j].innerSidePhoto.path)) {
            oysterMeasurement.measuringOysterGrowth.substrateShells[j].innerSidePhoto.path = '';
          }
        }
      }

      oysterMeasurement.save(function (err) {
        if (err) {
          callback(errorHandler.getErrorMessage(err), oysterMeasurement, errorMessages);
        } else {
          callback(null, oysterMeasurement, errorMessages);
        }
      });
    } else {
      callback('Protocol oyster measurement not found', oysterMeasurement, errorMessages);
    }
  };

  if (shouldValidate) {
    validate(oysterMeasurementBody, function(oysterMeasurementJSON) {
      save(oysterMeasurementJSON, null);
    }, function(errorMessages) {
      save(oysterMeasurementBody, errorMessages);
    });
  } else {
    save(oysterMeasurementBody, null);
  }
};

exports.update = function (req, res) {
  var oysterMeasurementBody = req.body;
  exports.updateInternal(req.oysterMeasurement, oysterMeasurementBody, req.user, true,
  function(err, oysterMeasurement, errorMessages) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      var result = {
        oysterMeasurement: oysterMeasurement
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

/**
 * Delete a protocol oyster measurement
 */
exports.deleteInternal = function(oysterMeasurement, callback) {
  if (oysterMeasurement) {
    var filesToDelete = [];
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

    var uploadRemote = new UploadRemote();
    uploadRemote.deleteRemote(filesToDelete,
    function() {
      oysterMeasurement.remove(function (err) {
        if (err) {
          callback(errorHandler.getErrorMessage(err));
        } else {
          callback(null, oysterMeasurement);
        }
      });
    }, function(err) {
      callback(err);
    });
  } else {
    callback();
  }
};

exports.updateFromExpedition = function(existing, updated, user, callback) {
  var existingOM = existing.protocols.oysterMeasurement;
  var updatedOM = updated.protocols.oysterMeasurement;
  if (!existingOM && updatedOM) {
    exports.createInternal(updated.monitoringStartDate, updated.station.latitude, updated.station.longitude,
      updated.teamLists.oysterMeasurement, function(err, oysterMeasurement) {
        callback(err, oysterMeasurement);
      });
  } else if (existingOM && !updatedOM) {
    exports.deleteInternal(existingOM, function(err, oysterMeasurement) {
      callback(err, null);
    });
  } else if (existingOM && updatedOM) {
    ProtocolOysterMeasurement.findOne({ _id: existingOM._id }).exec(function(err, databaseOM) {
      updatedOM.teamMembers = updated.teamLists.oysterMeasurement;
      exports.updateInternal(databaseOM, updatedOM, user, false, function(err, oysterMeasurement, errorMessages) {
        if (errorMessages) {
          callback(errorMessages, oysterMeasurement);
        } else {
          callback(err, oysterMeasurement);
        }
      });
    });
  } else {
    callback(null, existingOM);
  }
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
  exports.deleteInternal(oysterMeasurement,
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
    if (oysterMeasurement.status === 'incomplete' || oysterMeasurement.status === 'returned' ||
    (checkRole('team lead', req.user) && oysterMeasurement.status === 'submitted')) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          return res.status(400).send({
            message: 'Error occurred while uploading oyster cage condition picture'
          });
        } else {
          var uploadRemote = new UploadRemote();
          uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.oysterCageConditionUpload,
          function (fileInfo) {
            if (!oysterMeasurement.conditionOfOysterCage) {
              oysterMeasurement.conditionOfOysterCage = {
                oysterCagePhoto: {}
              };
            }
            oysterMeasurement.conditionOfOysterCage.oysterCagePhoto = fileInfo;

            uploadFileSuccess(oysterMeasurement, res);
          }, function (errorMessage) {
            uploadFileError(oysterMeasurement, errorMessage, res);
          });
        }
      });
    } else {
      res.json({
        status: oysterMeasurement.status,
        scribe: oysterMeasurement.scribeMember.displayName
      });
    }
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
    if (oysterMeasurement.status === 'incomplete' || oysterMeasurement.status === 'returned' ||
    (checkRole('team lead', req.user) && oysterMeasurement.status === 'submitted')) {
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
      res.json({
        status: oysterMeasurement.status,
        scribe: oysterMeasurement.scribeMember.displayName
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
    if (oysterMeasurement.status === 'incomplete' || oysterMeasurement.status === 'returned' ||
    (checkRole('team lead', req.user) && oysterMeasurement.status === 'submitted')) {
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
      res.json({
        status: oysterMeasurement.status,
        scribe: oysterMeasurement.scribeMember.displayName
      });
    }
  } else {
    res.status(400).send({
      message: 'Oyster measurement does not exist'
    });
  }
};

/**
 * Protocol Oyster Measurement middleware
 */
exports.oysterMeasurementByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Protocol Oyster Measurement is invalid'
    });
  }

  ProtocolOysterMeasurement.findById(id).populate('teamLead', 'displayName username').populate('scribeMember', 'displayName username')
  .exec(function (err, oysterMeasurement) {
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

exports.previousOysterMeasurement = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Protocol Oyster Measurement is invalid'
    });
  }

  Expedition.findOne({ 'protocols.oysterMeasurement': id }).populate('protocols.oysterMeasurement')
  .exec(function(err, expedition) {
    if (err) {
      return next(err);
    } else if (!expedition) {
      return res.status(404).send({
        message: 'No protocol with that identifier has been found associated with an expedition'
      });
    }

    Expedition.find({ 'station': expedition.station, 'status': 'published', '_id': { $ne: expedition._id } })
    .populate('protocols.oysterMeasurement').sort('-published').exec(function (err, previousPublished) {
      if (err) {
        return res.status(404).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (!previousPublished) {
        Expedition.find({ 'station': expedition.station, 'team': expedition.team, '_id': { $ne: expedition._id } })
        .populate('protocols.oysterMeasurement').sort('-monitoringStartDate').exec(function (err, previousTeams) {
          if (err) {
            return res.status(404).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            req.oysterMeasurement = (previousTeams && previousTeams.length > 0) ?
              previousTeams[0].protocols.oysterMeasurement : null;
            next();
          }
        });
      } else {
        req.oysterMeasurement = (previousPublished && previousPublished.length > 0) ?
          previousPublished[0].protocols.oysterMeasurement : null;
        next();
      }
    });
  });
};
