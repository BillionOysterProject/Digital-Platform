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

var validateMobileTrap = function(mobileTrap, successCallback, errorCallback) {
  var errorMessages = [];

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
      message: errorMessages.join()
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

/**
 * Update a protocol mobile trap
 */
exports.update = function (req, res) {
  validateMobileTrap(req.body,
  function(mobileTrapJSON) {
    var mobileTrap = req.mobileTrap;

    if (mobileTrap) {
      mobileTrap = _.extend(mobileTrap, mobileTrapJSON);

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
      message: errorMessages.join()
    });
  });
};

/**
 * Delete a protocol mobile trap
 */
exports.delete = function (req, res) {
  var mobileTrap = req.mobileTrap;

  mobileTrap.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mobileTrap);
    }
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
    for (var i = 0; i < mobileTrap.mobileOrganisms.length; i++) {
      if (mobileTrap.mobileOrganisms[i].organism._id.toString() === organismId.toString()) {
        index = i;
      }
    }

    if (index > -1 && mobileTrap.mobileOrganisms[index]) {
      var uploadRemote = new uploadRemote();
      uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.mobileTrapSketchPhotoUpload,
      function (fileInfo) {
        mobileTrap.mobileOrganisms[index].sketchPhoto = fileInfo;

        mobileTrap.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            res.json(mobileTrap);
          }
        });
      }, function (errorMessage) {
        return res.status(400).send({
          message: errorMessage
        });
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
