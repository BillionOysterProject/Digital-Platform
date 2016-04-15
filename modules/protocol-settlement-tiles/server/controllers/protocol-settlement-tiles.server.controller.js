'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
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

var validateSettlementTiles = function(settlementTiles, successCallback, errorCallback) {
  var errorMessages = [];

  if (!settlementTiles.settlementTiles || settlementTiles.settlementTiles.length < 1) {
    errorMessages.push('Must have at least one settlement tile');
  } else {
    for (var i = 0; i < settlementTiles.settlementTiles.length; i++) {
      var tile = settlementTiles.settlementTiles[i];
      if (!tile.description) {
        errorMessages.push('Settlement Tile #' + (i+1) + ' description is required');
      }
      if (!tile.tilePhoto) {
        errorMessages.push('Settlement Tile #' + (i+1) + ' photo is required');
      }

      var successfulGrids = true;
      for (var j = 1; j <= 25; j++) {
        if (tile['grid'+j]) {
          console.log('grid', tile['grid'+j]);
          if ((tile['grid'+j].organism === null || tile['grid'+j].organism === undefined) &&
          emptyString(tile['grid'+j].notes)) {
            successfulGrids = false;
            errorMessages.push('Settlement Tile #' + (i+1) + ' must have a dominate species selected for grid space ' + (j));
          }
        } else {
          successfulGrids = false;
        }
      }
      if (!successfulGrids) {
        errorMessages.push('Settlement Tile #' + (i+1) + ' must have 25 dominant organisms');
      }
    }
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(settlementTiles);
  }
};

// var convertOrganisms = function(settlementTiles) {
//   console.log('settlementTiles', settlementTiles);
//   for (var i = 0; i < settlementTiles.length; i++) {
//     for (var j = 0; j < settlementTiles[i].grids.length; j++) {
//       console.log('settlementTiles[i].grids[j]', settlementTiles[i].grids[j]);
//       console.log('settlementTiles[i].grids[j].organism', settlementTiles[i].grids[j].organism);
//       var organism = (settlementTiles[i].grids[j] &&
//         settlementTiles[i].grids[j].organism && settlementTiles[i].grids[j].organism._id) ?
//         settlementTiles[i].grids[j].organism._id : settlementTiles[i].grids[j].organism;
//       settlementTiles[i].grids[j].organism = organism;
//       console.log('organism', organism);
//     }
//   }
//   return settlementTiles;
// };

/**
 * Create a protocol settlement tiles
 */
exports.create = function (req, res) {
  validateSettlementTiles(req.body,
  function(settlementTilesJSON) {
    //settlementTilesJSON.settlementTiles = convertOrganisms(req.body.settlementTiles);
    var settlementTiles = new ProtocolSettlementTile(settlementTilesJSON);

    settlementTiles.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(settlementTiles);
      }
    });
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages.join()
    });
  });
};

/**
 * Show the current protocol settlement tiles
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var settlementTiles = req.settlementTiles ? req.settlementTiles.toJSON() : {};

  res.json(settlementTiles);
};

exports.incrementalSave = function (req, res) {
  var settlementTiles = req.settlementTiles;

  if (settlementTiles) {
    console.log('req.body', req.body);
    //req.body.settlementTiles = convertOrganisms(req.body.settlementTiles);
    settlementTiles = _.extend(settlementTiles, req.body);
    settlementTiles.collectionTime = moment(req.body.collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();

    settlementTiles.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(settlementTiles);
      }
    });
  } else {
    return res.status(400).send({
      message: 'Protocol settlement tiles not found'
    });
  }
};

/**
 * Update a protocol settlement tiles
 */
exports.update = function (req, res) {
  validateSettlementTiles(req.body,
  function(settlementTilesJSON) {
    var settlementTiles = req.settlementTiles;

    if (settlementTiles) {
      //settlementTilesJSON.settlementTiles = convertOrganisms(req.body.settlementTiles);
      settlementTiles = _.extend(settlementTiles, settlementTilesJSON);

      settlementTiles.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(settlementTiles);
        }
      });
    } else {
      return res.status(400).send({
        message: 'Protocol settlement tiles not found'
      });
    }
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages.join()
    });
  });
};

/**
 * Delete a protocol settlement tiles
 */
var deleteInternal = function(settlementTiles, successCallback, errorCallback) {
  var filesToDelete = [];
  if (settlementTiles) {
    if (settlementTiles.settlementTiles && settlementTiles.settlementTiles.length > 0) {
      for (var i = 0; i < settlementTiles.settlementTiles.length; i++) {
        filesToDelete.push(settlementTiles.settlementTiles[i].tilePhoto.path);
      }
    }

  }

  var uploadRemote = new UploadRemote();
  uploadRemote.deleteRemote(filesToDelete,
  function() {
    settlementTiles.remove(function (err) {
      if (err) {
        errorCallback(errorHandler.getErrorMessage(err));
      } else {
        successCallback(settlementTiles);
      }
    });
  }, function(err) {
    errorCallback(err);
  });
};

exports.delete = function (req, res) {
  var settlementTiles = req.settlementTiles;

  deleteInternal(settlementTiles,
  function(settlementTiles) {
    res.json(settlementTiles);
  }, function (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
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
  deleteInternal(settlementTiles,
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
 * List of protocol settlement tiles
 */
// exports.list = function(req, res) {
//   ProtocolSettlementTile.find().sort('-created').exec(function(err, settlementTiles) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(settlementTiles);
//     }
//   });
// };

/**
 * Protocol Settlement Tiles middleware
 */
exports.settlementTilesByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Protocol Settlement Tiles is invalid'
    });
  }

  ProtocolSettlementTile.findById(id)
  //.populate('settlementTiles.grid1')
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
