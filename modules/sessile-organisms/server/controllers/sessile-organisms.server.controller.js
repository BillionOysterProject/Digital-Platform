'use strict';

/**
 * Modules dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  SessileOrganism = mongoose.model('SessileOrganism'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

/**
 * Create an Organism
 */
exports.create = function(req, res) {
  var sessileOrganism = new SessileOrganism(req.body);
  sessileOrganism.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(sessileOrganism);
    }
  });
};

/**
 * Show the current organism
 */
exports.read = function(req, res) {
  // convert mongoose docuemnt to JSON
  var sessileOrganism = req.sessileOrganism ? req.sessileOrganism.toJSON() : {};

  res.json(sessileOrganism);
};

/**
 * Update a organism
 */
exports.update = function(req, res) {
  var sessileOrganism = req.sessileOrganism;

  if (sessileOrganism) {
    sessileOrganism = _.extend(sessileOrganism, req.body);

    sessileOrganism.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(sessileOrganism);
      }
    });
  } else {
    return res.status(400).send({
      message: 'Cannot update the sessile organism'
    });
  }
};

/**
 * Delete a organism
 */
var deleteInternal = function(sessileOrganism, successCallback, errorCallback) {
  var filesToDelete = [];
  if (sessileOrganism && sessileOrganism.image && sessileOrganism.image.path) {
    filesToDelete.push(sessileOrganism.image.path);
  }

  var uploadRemote = new UploadRemote();
  uploadRemote.deleteRemote(filesToDelete,
  function() {
    sessileOrganism.remove(function (err) {
      if (err) {
        errorCallback(errorHandler.getErrorMessage(err));
      } else {
        successCallback(sessileOrganism);
      }
    });
  }, function(err) {
    errorCallback(err);
  });
};

exports.delete = function(req, res) {
  var sessileOrganism = req.sessileOrganism;

  deleteInternal(sessileOrganism,
  function(sessileOrganism) {
    res.json(sessileOrganism);
  }, function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of organisms
 */
exports.list = function(req, res) {
  var query;
  var and = [];

  if (and.length === 1) {
    query = SessileOrganism.find(and[0]);
  } else if (and.length > 0) {
    query = SessileOrganism.find({ $and: and });
  } else {
    query = SessileOrganism.find();
  }

  if (req.query.sort) {
    if (req.query.sort === 'latin') {
      query.sort('latinName');
    }
  } else {
    query.sort('commonName');
  }

  if (req.query.limit) {
    if (req.query.page) {
      query.skip(req.query.limit*(req.query.page-1)).limit(req.query.limit);
    }
  } else {
    query.limit(req.query.limit);
  }

  query.exec(function(err, sessileOrganisms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //Move Sediment/None to the top of the list
      var snIndex = _.findIndex(sessileOrganisms, function(s) {
        return s.commonName === 'None/Sediment';
      });
      if (snIndex > -1) {
        var snObj = sessileOrganisms.splice(snIndex, 1);
        sessileOrganisms = snObj.concat(sessileOrganisms);
      }

      res.json(sessileOrganisms);
    }
  });
};

var uploadFileSuccess = function(sessileOrganism, res) {
  sessileOrganism.save(function (saveError) {
    if (saveError) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(saveError)
      });
    } else {
      res.json(sessileOrganism);
    }
  });
};

var uploadFileError = function(sessileOrganism, errorMessage, res) {
  deleteInternal(sessileOrganism,
  function(sessileOrganism) {
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
 * Upload image to organism
 */
exports.uploadImage = function(req, res) {
  var sessileOrganism = req.sessileOrganism;
  var upload = multer(config.uploads.organismImageUpload).single('newOrganismImage');
  var organismImageUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = organismImageUploadFileFilter;

  if (sessileOrganism) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.organismImageUpload,
    function (fileInfo) {
      sessileOrganism.image = fileInfo;

      uploadFileSuccess(sessileOrganism, res);
    }, function (errorMessage) {
      uploadFileError(sessileOrganism, errorMessage, res);
    });
  } else {
    res.status(400).send({
      message: 'Organism does not exist'
    });
  }
};

/**
 * Sessile Organism middleware
 */
exports.sessileOrganismByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Organism is invalid'
    });
  }

  SessileOrganism.findById(id).exec(function(err, sessileOrganism) {
    console.log('id', id);
    if (err) {
      return next(err);
    } else if (!sessileOrganism) {
      return res.status(404).send({
        message: 'No mobile organism with that identifier has been found'
      });
    }

    req.sessileOrganism = sessileOrganism;
    next();
  });
};
