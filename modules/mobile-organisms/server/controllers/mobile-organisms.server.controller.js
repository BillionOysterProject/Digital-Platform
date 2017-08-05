'use strict';

/**
 * Modules dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MobileOrganism = mongoose.model('MobileOrganism'),
  MetaOrganismCategory = mongoose.model('MetaOrganismCategory'),
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
  var mobileOrganism = new MobileOrganism(req.body);
  mobileOrganism.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mobileOrganism);
    }
  });
};

/**
 * Show the current mobile organism
 */
exports.read = function(req, res) {
  // convert mongoose docuemnt to JSON
  var mobileOrganism = req.mobileOrganism ? req.mobileOrganism.toJSON() : {};

  res.json(mobileOrganism);
};

/**
 * Update a mobile organism
 */
exports.update = function(req, res) {
  var mobileOrganism = req.mobileOrganism;

  if (mobileOrganism) {
    mobileOrganism = _.extend(mobileOrganism, req.body);

    mobileOrganism.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(mobileOrganism);
      }
    });
  } else {
    return res.status(400).send({
      message: 'Cannot update the mobile organism'
    });
  }
};

/**
 * Delete a mobile organism
 */
var deleteInternal = function(mobileOrganism, successCallback, errorCallback) {
  var filesToDelete = [];
  if (mobileOrganism && mobileOrganism.image && mobileOrganism.image.path) {
    filesToDelete.push(mobileOrganism.image.path);
  }

  var uploadRemote = new UploadRemote();
  uploadRemote.deleteRemote(filesToDelete,
  function() {
    mobileOrganism.remove(function (err) {
      if (err) {
        errorCallback(errorHandler.getErrorMessage(err));
      } else {
        successCallback(mobileOrganism);
      }
    });
  }, function(err) {
    errorCallback(err);
  });
};

exports.delete = function(req, res) {
  var mobileOrganism = req.mobileOrganism;

  deleteInternal(mobileOrganism,
  function(mobileOrganism) {
    res.json(mobileOrganism);
  }, function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of mobile organisms
 */
exports.list = function(req, res) {
  var query;
  var and = [];

  if (req.query.category) {
    and.push({ 'category': req.query.category });
  }

  if (and.length === 1) {
    query = MobileOrganism.find(and[0]);
  } else if (and.length > 0) {
    query = MobileOrganism.find({ $and: and });
  } else {
    query = MobileOrganism.find();
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

  query.exec(function(err, mobileOrganisms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var sortedMobileOrganisms = [];
      _.forEach(mobileOrganisms, function(m) {
        if (m && m.commonName === 'Other/Unknown') {
          sortedMobileOrganisms.push(m);
        }
      });
      var findUnknownIndex = function() {
        var index = _.findIndex(mobileOrganisms, function(m) {
          return m.commonName === 'Other/Unknown';
        });
        return index;
      };
      while (findUnknownIndex() > -1) {
        mobileOrganisms.splice(findUnknownIndex(), 1);
      }
      mobileOrganisms = sortedMobileOrganisms.concat(mobileOrganisms);
      res.json(mobileOrganisms);
    }
  });
};

var uploadFileSuccess = function(mobileOrganism, res) {
  mobileOrganism.save(function (saveError) {
    if (saveError) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(saveError)
      });
    } else {
      res.json(mobileOrganism);
    }
  });
};

var uploadFileError = function(mobileOrganism, errorMessage, res) {
  deleteInternal(mobileOrganism,
  function(mobileOrganism) {
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
 * Upload image to mobile organism
 */
exports.uploadImage = function(req, res) {
  var mobileOrganism = req.mobileOrganism;
  var upload = multer(config.uploads.organismImageUpload).single('newOrganismImage');
  var organismImageUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = organismImageUploadFileFilter;

  if (mobileOrganism) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.organismImageUpload,
    function (fileInfo) {
      mobileOrganism.image = fileInfo;

      uploadFileSuccess(mobileOrganism, res);
    }, function (errorMessage) {
      uploadFileError(mobileOrganism, errorMessage, res);
    });
  } else {
    res.status(400).send({
      message: 'Organism does not exist'
    });
  }
};

/**
 * Mobile Organism middleware
 */
exports.mobileOrganismByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Organism is invalid'
    });
  }

  MobileOrganism.findById(id).exec(function(err, mobileOrganism) {
    if (err) {
      return next(err);
    } else if (!mobileOrganism) {
      return res.status(404).send({
        message: 'No mobile organism with that identifier has been found'
      });
    }

    MetaOrganismCategory.findOne({ value: mobileOrganism.category }).exec(function(err, organismCategory) {
      if (err) {
        return next(err);
      } else {
        mobileOrganism.category = (organismCategory && organismCategory.label) ? organismCategory.label : '';
        req.mobileOrganism = mobileOrganism;
        next();
      }
    });
  });
};
