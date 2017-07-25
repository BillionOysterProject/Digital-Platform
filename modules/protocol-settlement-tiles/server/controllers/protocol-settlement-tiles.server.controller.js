'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  Expedition = mongoose.model('Expedition'),
  ProtocolSettlementTile = mongoose.model('ProtocolSettlementTile'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  _ = require('lodash'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  moment = require('moment');

var emptyString = function(string) {
  if (!string || string === null || string === '' || string === undefined) {
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

var validate = function(settlementTiles, successCallback, errorCallback) {
  var errorMessages = [];

  if (!settlementTiles.settlementTiles || settlementTiles.settlementTiles.length < 1) {
    errorMessages.push('Must have at least one settlement tile');
  } else {
    var oneSuccessfulSettlementTile = false;

    var allGridsFilledIn = function(tile, i) {
      var successfulGrids = true;
      for (var j = 1; j <= 25; j++) {
        if (tile['grid'+j]) {
          if ((tile['grid'+j].organism === null || tile['grid'+j].organism === undefined ||
          tile['grid'+j].organism === '') && tile['grid'+j].notes === '') {
            successfulGrids = false;
          }
        } else {
          successfulGrids = false;
        }
      }
      return successfulGrids;
    };

    var noGridsFilledIn = function(tile, i) {
      var emptyGrids = true;
      for (var j = 1; j <= 25; j++) {
        if (tile['grid'+j]) {
          if (tile['grid'+j].organism !== null && tile['grid'+j].organism !== undefined &&
          tile['grid'+j].organism !== '') {
            emptyGrids = false;
          }
        }
      }
      return emptyGrids;
    };

    for (var i = 0; i < settlementTiles.settlementTiles.length; i++) {
      var tile = settlementTiles.settlementTiles[i];

      if (tile.tilePhoto && tile.tilePhoto.path !== undefined &&
        tile.tilePhoto.path !== '' && allGridsFilledIn(tile, i)) {
        oneSuccessfulSettlementTile = true;
      } else if (!tile.description && (!tile.tilePhoto || tile.tilePhoto.path === undefined ||
        tile.tilePhoto.path === '') && noGridsFilledIn(tile, i)) {

      } else {
        if (!tile.tilePhoto || !tile.tilePhoto.path || tile.tilePhoto.path === '') {
          errorMessages.push('Photo is required for Settlement Tile #' + (i+1));
        }

        if (!allGridsFilledIn(tile, i)) {
          errorMessages.push('Settlement Tile #' + (i+1) + ' must have a dominant organism specified for all 25 grid spaces');
        }
      }
    }

    if (errorMessages.length === 0 && !oneSuccessfulSettlementTile) {
      errorMessages.push('Must have one settlement tile completed');
    }
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(settlementTiles);
  }
};

/**
 * Show the current protocol settlement tiles
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var settlementTiles = req.settlementTiles ? req.settlementTiles.toJSON() : {};

  res.json(settlementTiles);
};

exports.validate = function (req, res) {
  var settlementTiles = req.body;
  validate(settlementTiles, function(settlementTilesJSON) {
    res.json({
      settlementTiles: settlementTiles,
      successful: true
    });
  }, function(errorMessages) {
    res.json({
      settlementTiles: settlementTiles,
      errors: errorMessages
    });
  });
};

exports.createInternal = function(collectionTime, latitude, longitude, teamList, callback) {
  if (teamList && teamList.length > 0) {
    var settlementTiles = new ProtocolSettlementTile({
      collectionTime: moment(collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('minute').toDate(),
      latitude: latitude,
      longitude: longitude,
      teamMembers: teamList
    });
    settlementTiles.save(function(err) {
      if (err) {
        callback('Could not create a settlement tile protocol');
      } else {
        callback(null, settlementTiles);
      }
    });
  } else {
    callback();
  }
};

/**
 * Update a protocol settlement tiles
 */
exports.updateInternal = function(settlementTilesReq, settlementTilesBody, user, shouldValidate, callback) {
  var save = function(settlementTilesJSON, errorMessages) {
    var settlementTiles = settlementTilesReq;

    if (settlementTiles) {
      //settlementTilesJSON.settlementTiles = convertOrganisms(req.body.settlementTiles);
      settlementTiles = _.extend(settlementTiles, settlementTilesJSON);
      settlementTiles.collectionTime = moment(settlementTilesBody.collectionTime).startOf('minute').toDate();
      if (user) settlementTiles.scribeMember = user;
      if (settlementTiles.status === 'submitted') settlementTiles.submitted = new Date();

      // remove base64 text
      var pattern = /^data:image\/[a-z]*;base64,/i;
      if (settlementTiles.settlementTiles && settlementTiles.settlementTiles.length > 0) {
        for (var j = 0; j < settlementTiles.settlementTiles.length; j++) {
          if (settlementTiles.settlementTiles[j].tilePhoto &&
          settlementTiles.settlementTiles[j].tilePhoto.path &&
          pattern.test(settlementTiles.settlementTiles[j].tilePhoto.path)) {
            settlementTiles.settlementTiles[j].tilePhoto.path = '';
          }
        }
      }

      settlementTiles.save(function (err) {
        if (err) {
          callback(errorHandler.getErrorMessage(err), settlementTiles, errorMessages);
        } else {
          callback(null, settlementTiles, errorMessages);
        }
      });
    } else {
      callback('Protocol settlement tiles not found', settlementTiles, errorMessages);
    }
  };

  if (shouldValidate) {
    validate(settlementTilesBody, function(settlementTilesJSON) {
      save(settlementTilesJSON, null);
    }, function(errorMessages) {
      save(settlementTilesBody, errorMessages);
    });
  } else {
    save(settlementTilesBody, null);
  }
};

exports.update = function (req, res) {
  var settlementTilesBody = req.body;
  exports.updateInternal(req.settlementTiles, settlementTilesBody, req.user, true,
  function(err, settlementTiles, errorMessages) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      var result = {
        settlementTiles: settlementTiles
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
 * Delete a protocol settlement tiles
 */
exports.deleteInternal = function(settlementTiles, callback) {
  if (settlementTiles) {
    var filesToDelete = [];
    if (settlementTiles.settlementTiles && settlementTiles.settlementTiles.length > 0) {
      for (var i = 0; i < settlementTiles.settlementTiles.length; i++) {
        filesToDelete.push(settlementTiles.settlementTiles[i].tilePhoto.path);
      }
    }

    var uploadRemote = new UploadRemote();
    uploadRemote.deleteRemote(filesToDelete,
    function() {
      settlementTiles.remove(function (err) {
        if (err) {
          callback(errorHandler.getErrorMessage(err));
        } else {
          callback(null, settlementTiles);
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
  var existingST = existing.protocols.settlementTiles;
  var updatedST = updated.protocols.settlementTiles;
  if (!existingST && updatedST) {
    exports.createInternal(updated.monitoringStartDate, updated.station.latitude, updated.station.longitude,
      updated.teamLists.settlementTiles, function(err, settlementTiles) {
        callback(err, settlementTiles);
      });
  } else if (existingST && !updatedST) {
    exports.deleteInternal(existingST, function(err, settlementTiles) {
      callback(err, null);
    });
  } else if (existingST && updatedST) {
    ProtocolSettlementTile.findOne({ _id: existingST._id }).exec(function(err, databaseST) {
      updatedST.teamMembers = updated.teamLists.settlementTiles;
      exports.updateInternal(databaseST, updatedST, user, false, function(err, settlementTiles, errorMessages) {
        if (errorMessages) {
          callback(errorMessages, settlementTiles);
        } else {
          callback(err, settlementTiles);
        }
      });
    });
  } else {
    callback(null, existingST);
  }
};

var uploadFileSuccess = function(settlementTiles, res) {
  settlementTiles.save(function (saveError) {
    if (saveError) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(saveError)
      });
    } else {
      res.json(settlementTiles);
    }
  });
};

var uploadFileError = function(settlementTiles, errorMessage, res) {
  exports.deleteInternal(settlementTiles,
  function(settlementTiles) {
    return res.status(400).send({
      message: errorMessage
    });
  }, function(err) {
    return res.status(400).send({
      message: err
    });
  });
};

exports.uploadSettlementTilePicture = function (req, res) {
  var settlementTiles = req.settlementTiles;
  var settlementTileIndex = req.settlementTileIndex;
  var upload = multer(config.uploads.settlementTilesUpload).single('newSettlementTilePicture');
  var settlementTileUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = settlementTileUploadFileFilter;

  if (settlementTiles) {
    if (settlementTileIndex && settlementTiles.settlementTiles[settlementTileIndex]) {
      var uploadRemote = new UploadRemote();
      uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.settlementTilesUpload,
      function (fileInfo) {
        settlementTiles.settlementTiles[settlementTileIndex].tilePhoto = fileInfo;

        uploadFileSuccess(settlementTiles, res);
      }, function(errorMessage) {
        uploadFileError(settlementTiles, errorMessage, res);
      });
    } else {
      return res.status(400).send({
        message: 'Substrate for settlement tiles does not exist'
      });
    }
  } else {
    res.status(400).send({
      message: 'Settlement tiles does not exist'
    });
  }
};

/**
 * Protocol Settlement Tiles middleware
 */
exports.settlementTilesByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Protocol Settlement Tiles is invalid'
    });
  }

  ProtocolSettlementTile.findById(id).populate('scribeMember', 'displayName username')
  //.populate('settlementTiles.grid1')
  .populate('teamLead', 'displayName username')
  .exec(function (err, settlementTiles) {
    if (err) {
      return next(err);
    } else if (!settlementTiles) {
      return res.status(400).send({
        message: 'No Protocol Settlement Tiles with that identifier has been found'
      });
    }
    req.settlementTiles = settlementTiles;
    next();
  });
};

exports.settlementTileIndexByID = function (req, res, next, id) {
  req.settlementTileIndex = id;
  next();
};
