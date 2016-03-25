'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  ProtocolOysterMeasurement = mongoose.model('ProtocolOysterMeasurement'),
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

var validateOysterMeasurement = function(oysterMeasurement, successCallback, errorCallback) {
  for (var i = 0; i < oysterMeasurement.measuringOysterGrowth.substrateShells.length; i++) {
    oysterMeasurement.measuringOysterGrowth.substrateShells[i].setDate = 
      moment(oysterMeasurement.measuringOysterGrowth.substrateShells[i].setDate, 'MM-DD-YYYY').toDate();
  }

  var errorMessages = [];

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
exports.delete = function (req, res) {
  var oysterMeasurement = req.oysterMeasurement;

  oysterMeasurement.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(oysterMeasurement);
    }
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
        oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path = config.uploads.oysterCageConditionUpload.dest + req.file.filename;
        oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.originalname = req.file.originalname;
        oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.mimetype = req.file.mimetype;
        oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.filename = req.file.filename;
        
        oysterMeasurement.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            res.json(oysterMeasurement);
          }
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
      upload(req, res, function (uploadError) {
        if (uploadError) {
          return res.status(400).send({
            message: 'Error occurred while uploading outer substrate picture'
          });
        } else {
          oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex].outerSidePhoto.path = 
            config.uploads.outerSubstrateUpload.dest + req.file.filename;
          oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex].outerSidePhoto.originalname = req.file.originalname;
          oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex].outerSidePhoto.mimetype = req.file.mimetype;
          oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex].outerSidePhoto.filename = req.file.filename;
          
          oysterMeasurement.save(function (saveError) {
            if (saveError) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(saveError)
              });
            } else {
              res.json(oysterMeasurement);
            }
          });
        }
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

  if (oysterMeasurement && substrateIndex) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading inner substrate picture'
        });
      } else {
        if (oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex]) {
          oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex].innerSidePhoto.path = 
            config.uploads.innerSubstrateUpload.dest + req.file.filename;
          oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex].innerSidePhoto.originalname = req.file.originalname;
          oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex].innerSidePhoto.mimetype = req.file.mimetype;
          oysterMeasurement.measuringOysterGrowth.substrateShells[substrateIndex].innerSidePhoto.filename = req.file.filename;
          
          oysterMeasurement.save(function (saveError) {
            if (saveError) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(saveError)
              });
            } else {
              res.json(oysterMeasurement);
            }
          });
        } else {
          return res.status(400).send({
            message: 'Substrate for oyster measurement does not exist'
          });
        }
      }
    });
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