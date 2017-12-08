'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  ProtocolSiteCondition = mongoose.model('ProtocolSiteCondition'),
  Expedition = mongoose.model('Expedition'),
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

var emptyNumber = function(num) {
  if(num === null || num === undefined) {
    return true;
  }
  return false;
};

var checkRole = function(role, user) {
  var roleIndex = _.findIndex(user.roles, function(r) {
    return r === role;
  });
  return (roleIndex > -1) ? true : false;
};

var validate = function(siteCondition, successCallback, errorCallback) {
  var errorMessages = [];

  if (siteCondition) {
    if (!siteCondition.meteorologicalConditions || emptyString(siteCondition.meteorologicalConditions.weatherConditions)) {
      errorMessages.push('Weather conditions are required');
    }
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(siteCondition);
  }
};

/**
 * Show the current protocol site condition
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var siteCondition = req.siteCondition ? req.siteCondition.toJSON() : {};

  res.json(siteCondition);
};

exports.validate = function (req, res) {
  var siteCondition = req.body;
  validate(siteCondition, function(siteConditionJSON) {
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
};

exports.createInternal = function(collectionTime, latitude, longitude, teamList, callback) {
  if (teamList && teamList.length > 0) {
    var siteCondition = new ProtocolSiteCondition({
      collectionTime: moment(collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('minute').toDate(),
      latitude: latitude,
      longitude: longitude,
      teamMembers: teamList
    });
    siteCondition.save(function (err) {
      if (err) {
        callback('Could not create a site condition protocol');
      } else {
        callback(null, siteCondition);
      }
    });
  } else {
    callback();
  }
};

/**
 * Update a protocol site condition
 */
exports.updateInternal = function(siteConditionReq, siteConditionBody, user, shouldValidate, callback) {
  var save = function(siteConditionJSON, errorMessages) {
    var siteCondition = siteConditionReq;

    if (siteCondition) {
      siteCondition = _.extend(siteCondition, siteConditionJSON);
      siteCondition.collectionTime = moment(siteConditionBody.collectionTime).startOf('minute').toDate();
      if (siteCondition.tideConditions && siteConditionBody.tideConditions) {
        siteCondition.tideConditions.closestHighTide =
          moment(siteConditionBody.tideConditions.closestHighTide).startOf('minute').toDate();
        siteCondition.tideConditions.closestLowTide =
          moment(siteConditionBody.tideConditions.closestLowTide).startOf('minute').toDate();
      }
      if (user) siteCondition.scribeMember = user;
      if (siteCondition.status === 'submitted') siteCondition.submitted = new Date();

      // remove base64 text
      var pattern = /^data:image\/[a-z]*;base64,/i;
      if (siteCondition.waterConditions && siteCondition.waterConditions.waterConditionPhoto &&
      siteCondition.waterConditions.waterConditionPhoto.path &&
      pattern.test(siteCondition.waterConditions.waterConditionPhoto.path)) {
        siteCondition.waterConditions.waterConditionPhoto.path = '';
      }
      if (siteCondition.landConditions && siteCondition.landConditions.landConditionPhoto &&
      siteCondition.landConditions.landConditionPhoto.path &&
      pattern.test(siteCondition.landConditions.landConditionPhoto.path)) {
        siteCondition.landConditions.landConditionPhoto.path = '';
      }

      siteCondition.save(function (err) {
        if (err) {
          console.log('siteCondition save', err);
          callback(errorHandler.getErrorMessage(err), siteCondition, errorMessages);
        } else {
          callback(null, siteCondition, errorMessages);
        }
      });
    } else {
      callback('Protocol site condition not found', siteCondition, errorMessages);
    }
  };

  if (shouldValidate) {
    validate(siteConditionBody, function(siteConditionJSON) {
      save(siteConditionJSON, null);
    }, function(errorMessages) {
      save(siteConditionBody, errorMessages);
    });
  } else {
    save(siteConditionBody, null);
  }
};

exports.update = function (req, res) {
  var siteConditionBody = req.body;
  exports.updateInternal(req.siteCondition, siteConditionBody, req.user, true,
  function(err, siteCondition, errorMessages) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      var result = {
        siteCondition: siteCondition,
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

exports.deleteInternal = function(siteCondition, callback) {
  if (siteCondition) {
    var filesToDelete = [];

    if (siteCondition.waterConditions && siteCondition.waterConditions.waterConditionPhoto &&
    siteCondition.waterConditions.waterConditionPhoto.path) {
      filesToDelete.push(siteCondition.waterConditions.waterConditionPhoto.path);
    }
    if (siteCondition.landConditions && siteCondition.landConditions.landConditionPhoto &&
    siteCondition.landConditions.landConditionPhoto.path) {
      filesToDelete.push(siteCondition.landConditions.landConditionPhoto.path);
    }

    var uploadRemote = new UploadRemote();
    uploadRemote.deleteRemote(filesToDelete,
    function() {
      siteCondition.remove(function (err) {
        if (err) {
          callback(errorHandler.getErrorMessage(err));
        } else {
          callback(null, siteCondition);
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
  var existingSC = existing.protocols.siteCondition;
  var updatedSC = updated.protocols.siteCondition;
  if (!existingSC && updatedSC) {
    exports.createInternal(updated.monitoringStartDate, updated.station.latitude, updated.station.longitude,
      updated.teamLists.siteCondition, function(err, siteCondition) {
        callback(err, siteCondition);
      });
  } else if (existingSC && !updatedSC) {
    exports.deleteInternal(existingSC, function(err, siteCondition) {
      callback(err, null);
    });
  } else if (existingSC && updatedSC) {
    ProtocolSiteCondition.findOne({ _id: existingSC._id }).exec(function(err, databaseSC) {
      updatedSC.teamMembers = updated.teamLists.siteCondition;
      exports.updateInternal(databaseSC, updatedSC, user, false, function(err, siteCondition, errorMessages) {
        if (errorMessages) {
          callback(errorMessages, siteCondition);
        } else {
          callback(err, siteCondition);
        }
      });
    });
  } else {
    callback(null, existingSC);
  }
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
  exports.deleteInternal(siteCondition,
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
    if (siteCondition.status === 'incomplete' || siteCondition.status === 'returned' ||
    (checkRole('team lead', req.user) && siteCondition.status === 'submitted')) {
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
      res.json({
        status: siteCondition.status,
        scribe: siteCondition.scribeMember.displayName
      });
    }
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
    if (siteCondition.status === 'incomplete' || siteCondition.status === 'returned' ||
    (checkRole('team lead', req.user) && siteCondition.status === 'submitted')) {
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
      res.json({
        status: siteCondition.status,
        scribe: siteCondition.scribeMember.displayName
      });
    }
  } else {
    res.status(400).send({
      message: 'Site condition does not exist'
    });
  }
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

  ProtocolSiteCondition.findById(id).populate('teamLead', 'displayName username').populate('scribeMember', 'displayName username')
  .exec(function (err, siteCondition) {
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
