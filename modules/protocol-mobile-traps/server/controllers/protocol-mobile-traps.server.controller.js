'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
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

var validateMobileTrap = function(mobileTrap, successCallback, errorCallback) {
  var errorMessages = [];

  if (mobileTrap.mobileOrganisms.length <= 0) {
    errorMessages.push('At least one mobile organism is required');
  } else {
    for (var i = 0; i < mobileTrap.mobileOrganisms.length; i++) {
      var mobileOrganism = mobileTrap.mobileOrganisms[i];
      if (!mobileOrganism.organism) {
        errorMessages.push('Mobile organism is required');
      }
      if (mobileOrganism.count <= 0) {
        errorMessages.push('Count of mobile organism is required');
      }
      if (!mobileOrganism.sketchPhoto) {
        errorMessages.push('Sketch or photo of mobile organism is required');
      }
    }
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(mobileTrap);
  }
};

/**
 * Create a protocol mobile trap
 */
exports.create = function (req, res) {
  validateMobileTrap(req.body,
  function(mobileTrapJSON) {
    var mobileTrap = new ProtocolMobileTrap(mobileTrapJSON);
    mobileTrap.collectionTime = moment(req.body.collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
    mobileTrap.scribeMember = req.user;

    mobileTrap.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(mobileTrap);
      }
    });
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages
    });
  });
};

/**
 * Show the current protocol mobile trap
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var mobileTrap = req.mobileTrap ? req.mobileTrap.toJSON() : {};

  res.json(mobileTrap);
};

exports.incrementalSave = function (req, res) {
  var mobileTrap = req.mobileTrap;

  if (mobileTrap) {
    mobileTrap = _.extend(mobileTrap, req.body);
    mobileTrap.collectionTime = moment(req.body.collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
    mobileTrap.scribeMember = req.user;

    mobileTrap.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        validateMobileTrap(req.body,
        function(mobileTrapJSON) {
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
      }
    });
  } else {
    return res.status(400).send({
      message: 'Protocol mobile trap not found'
    });
  }
};

/**
 * Update a protocol mobile trap
 */
exports.update = function (req, res) {
  validateMobileTrap(req.body,
  function(mobileTrapJSON) {
    var mobileTrap = req.mobileTrap;

    if (mobileTrap) {
      mobileTrap = _.extend(mobileTrap, mobileTrapJSON);
      mobileTrap.collectionTime = moment(req.body.collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
      mobileTrap.scribeMember = req.user;
      mobileTrap.status = 'submitted';
      mobileTrap.submitted = new Date();

      mobileTrap.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(mobileTrap);
        }
      });
    } else {
      return res.status(400).send({
        message: 'Protocol mobile trap not found'
      });
    }
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages
    });
  });
};

var deleteInternal = function(mobileTrap, successCallback, errorCallback) {
  var filesToDelete = [];
  for (var i = 0; i < mobileTrap.mobileOrganisms.length; i++) {
    if (mobileTrap && mobileTrap.mobileOrganisms && mobileTrap.mobileOrganisms[i] &&
      mobileTrap.mobileOrganisms[i].sketchPhoto && mobileTrap.mobileOrganisms[i].sketchPhoto.path) {
      filesToDelete.push(mobileTrap.mobileOrganisms[i].sketchPhoto.path);
    }
  }

  var uploadRemote = new UploadRemote();
  uploadRemote.deleteRemote(filesToDelete,
  function() {
    mobileTrap.remove(function(err) {
      if (err) {
        errorCallback(errorHandler.getErrorMessage(err));
      } else {
        successCallback(mobileTrap);
      }
    });
  }, function(err) {
    errorCallback(err);
  });
};

/**
 * Delete a protocol mobile trap
 */
exports.delete = function (req, res) {
  var mobileTrap = req.mobileTrap;

  deleteInternal(mobileTrap,
  function(mobileTrap) {
    res.json(mobileTrap);
  }, function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

var uploadFileSuccess = function(mobileTrap, res) {
  console.log('mobileTrap', mobileTrap);
  mobileTrap.save(function (saveError) {
    if (saveError) {
      console.log('save error', saveError);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(saveError)
      });
    } else {
      res.json(mobileTrap);
    }
  });
};

var uploadFileError = function(mobileTrap, errorMessage, res) {
  deleteInternal(mobileTrap,
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
    var index = -1;
    console.log('organismId', organismId);
    for (var i = 0; i < mobileTrap.mobileOrganisms.length; i++) {
      console.log('organism._id', mobileTrap.mobileOrganisms[i].organism._id);
      if (mobileTrap.mobileOrganisms[i].organism._id.toString() === organismId.toString()) {
        index = i;
        console.log('set equal');
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
    res.status(400).send({
      message: 'Mobile trap does not exist'
    });
  }
};

/**
 * List of protocol mobile trap
 */
// exports.list = function(req, res) {
//   ProtocolMobileTrap.find().sort('-created').populate('user', 'displayName').exec(function(err, mobileTrap) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(mobileTrap);
//     }
//   });
// };

/**
 * Protocol Mobile Trap middleware
 */
exports.mobileTrapByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Protocol Mobile Trap is invalid'
    });
  }

  ProtocolMobileTrap.findById(id).populate('teamLead', 'displayName').populate('mobileOrganisms.organism').exec(function (err, mobileTrap) {
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
