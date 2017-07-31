'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  Expedition = mongoose.model('Expedition'),
  ProtocolMobileTrap = mongoose.model('ProtocolMobileTrap'),
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

var validate = function(mobileTrap, successCallback, errorCallback) {
  var errorMessages = [];

  for (var i = 0; i < mobileTrap.mobileOrganisms.length; i++) {
    var mobileOrganism = mobileTrap.mobileOrganisms[i];
    if (!mobileOrganism.organism) {
      errorMessages.push('Mobile organism is required');
    }
    if (mobileOrganism.count <= 0) {
      errorMessages.push('Count of mobile organism is required');
    }
    if (mobileOrganism.organism.commonName === 'Other/Unknown' &&
    (!mobileOrganism.sketchPhoto || !mobileOrganism.sketchPhoto.path)) {
      errorMessages.push('Sketch or photo of mobile organism is required');
    }
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(mobileTrap);
  }
};

/**
 * Show the current protocol mobile trap
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var mobileTrap = req.mobileTrap ? req.mobileTrap.toJSON() : {};

  res.json(mobileTrap);
};

exports.validate = function (req, res) {
  var mobileTrap = req.body;
  validate(mobileTrap, function(mobileTrapJSON) {
    res.json({
      mobileTrap: mobileTrap,
      successful: true
    });
  }, function(errorMessages) {
    res.json({
      mobileTrap: mobileTrap,
      errors: errorMessages
    });
  });
};

exports.createInternal = function(collectionTime, latitude, longitude, teamList, callback) {
  if (teamList && teamList.length > 0) {
    var mobileTrap = new ProtocolMobileTrap({
      collectionTime: moment(collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSSZ').startOf('minute').toDate(),
      latitude: latitude,
      longitude: longitude,
      teamMembers: teamList
    });
    mobileTrap.save(function (err) {
      if (err) {
        callback('Could not create a mobile trap protocol');
      } else {
        callback(null, mobileTrap);
      }
    });
  } else {
    callback();
  }
};

/**
 * Update a protocol mobile trap
 */
exports.updateInternal = function (mobileTrapReq, mobileTrapBody, user, shouldValidate, callback) {
  var save = function(mobileTrapJSON, errorMessages) {
    var mobileTrap = mobileTrapReq;

    if (mobileTrap) {
      mobileTrap = _.extend(mobileTrap, mobileTrapJSON);
      mobileTrap.collectionTime = moment(mobileTrapBody.collectionTime).startOf('minute').toDate();
      if (user) mobileTrap.scribeMember = user;
      if (mobileTrap.status === 'submitted') mobileTrap.submitted = new Date();

      // remove base64 text
      var pattern = /^data:image\/[a-z]*;base64,/i;
      if (mobileTrap.mobileOrganisms && mobileTrap.mobileOrganisms.length > 0) {
        for (var j = 0; j < mobileTrap.mobileOrganisms.length; j++) {
          if (mobileTrap.mobileOrganisms[j].sketchPhoto &&
          mobileTrap.mobileOrganisms[j].sketchPhoto.path &&
          pattern.test(mobileTrap.mobileOrganisms[j].sketchPhoto.path)) {
            mobileTrap.mobileOrganisms[j].sketchPhoto.path = '';
          }
        }
      }

      mobileTrap.save(function (err) {
        if (err) {
          callback(errorHandler.getErrorMessage(err), mobileTrap, errorMessages);
        } else {
          callback(null, mobileTrap, errorMessages);
        }
      });
    } else {
      callback('Protocol mobile trap not found', mobileTrap, errorMessages);
    }
  };

  if (shouldValidate) {
    validate(mobileTrapBody, function(mobileTrapJSON) {
      save(mobileTrapJSON, null);
    }, function(errorMessages) {
      save(mobileTrapBody, errorMessages);
    });
  } else {
    save(mobileTrapBody, null);
  }
};

exports.update = function (req, res) {
  var mobileTrapBody = req.body;
  exports.updateInternal(req.mobileTrap, mobileTrapBody, req.user, true,
  function(err, mobileTrap, errorMessages) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      var result = {
        mobileTrap: mobileTrap
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

exports.deleteInternal = function(mobileTrap, callback) {
  if (mobileTrap) {
    var filesToDelete = [];
    for (var i = 0; i < mobileTrap.mobileOrganisms.length; i++) {
      if (mobileTrap.mobileOrganisms && mobileTrap.mobileOrganisms[i] &&
        mobileTrap.mobileOrganisms[i].sketchPhoto && mobileTrap.mobileOrganisms[i].sketchPhoto.path) {
        filesToDelete.push(mobileTrap.mobileOrganisms[i].sketchPhoto.path);
      }
    }

    var uploadRemote = new UploadRemote();
    uploadRemote.deleteRemote(filesToDelete,
    function() {
      mobileTrap.remove(function(err) {
        if (err) {
          callback(errorHandler.getErrorMessage(err));
        } else {
          callback(null, mobileTrap);
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
  var existingMT = existing.protocols.mobileTrap;
  var updatedMT = updated.protocols.mobileTrap;
  if (!existingMT && updatedMT) {
    exports.createInternal(updated.monitoringStartDate, updated.station.latitude, updated.station.longitude,
      updated.teamLists.mobileTrap, function(err, mobileTrap) {
        callback(err, mobileTrap);
      });
  } else if (existingMT && !updatedMT) {
    exports.deleteInternal(existingMT, function(err, mobileTrap) {
      callback(err, null);
    });
  } else if (existingMT && updatedMT) {
    ProtocolMobileTrap.findOne({ _id: existingMT._id }).exec(function(err, databaseMT) {
      updatedMT.teamMembers = updated.teamLists.mobileTrap;
      exports.updateInternal(databaseMT, updatedMT, user, false, function(err, mobileTrap, errorMessages) {
        if (errorMessages) {
          callback(errorMessages, mobileTrap);
        } else {
          callback(err, mobileTrap);
        }
      });
    });
  } else {
    callback(null, existingMT);
  }
};

var uploadFileSuccess = function(mobileTrap, res) {
  mobileTrap.save(function (saveError) {
    if (saveError) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(saveError)
      });
    } else {
      res.json(mobileTrap);
    }
  });
};

var uploadFileError = function(mobileTrap, errorMessage, res) {
  exports.deleteInternal(mobileTrap,
  function(mobileTrap) {
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
 * Upload images to protocol mobile trap
 */
exports.uploadSketchPhoto = function (req, res) {
  var mobileTrap = req.mobileTrap;
  var organismId = req.organismId;
  var upload = multer(config.uploads.mobileTrapSketchPhotoUpload).single('newSketchPhotoPicture');
  var sketchPhotoUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = sketchPhotoUploadFileFilter;
  if (mobileTrap) {
    if (mobileTrap.status === 'incomplete' || mobileTrap.status === 'returned' ||
    (checkRole('team lead', req.user) && mobileTrap.status === 'submitted')) {
      var index = -1;
      for (var i = 0; i < mobileTrap.mobileOrganisms.length; i++) {
        if (mobileTrap.mobileOrganisms[i].organism._id.toString() === organismId.toString()) {
          index = i;
        }
      }

      if (index > -1 && mobileTrap.mobileOrganisms[index]) {
        var uploadRemote = new UploadRemote();
        uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.mobileTrapSketchPhotoUpload,
        function (fileInfo) {
          mobileTrap.mobileOrganisms[index].sketchPhoto = fileInfo;

          uploadFileSuccess(mobileTrap, res);
        }, function (errorMessage) {
          uploadFileError(mobileTrap, errorMessage, res);
        });
      } else {
        return res.status(400).send({
          message: 'Organism for mobile trap does not exist'
        });
      }
    } else {
      res.json({
        status: mobileTrap.status,
        scribe: mobileTrap.scribeMember.displayName
      });
    }
  } else {
    res.status(400).send({
      message: 'Mobile trap does not exist'
    });
  }
};

/**
 * Protocol Mobile Trap middleware
 */
exports.mobileTrapByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Protocol Mobile Trap is invalid'
    });
  }

  ProtocolMobileTrap.findById(id).populate('teamLead', 'displayName username').populate('scribeMember', 'displayName username')
  .populate('mobileOrganisms.organism').exec(function (err, mobileTrap) {
    if (err) {
      return next(err);
    } else if (!mobileTrap) {
      return res.status(400).send({
        message: 'No Protocol Mobile Trap with that identifier has been found'
      });
    }
    req.mobileTrap = mobileTrap;
    next();
  });
};

exports.organismIdByID = function (req, res, next, id) {
  req.organismId = id;
  next();
};
