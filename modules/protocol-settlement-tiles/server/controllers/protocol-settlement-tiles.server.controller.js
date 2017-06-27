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

// /**
//  * Create a protocol settlement tiles
//  */
// exports.create = function (req, res) {
//   validateSettlementTiles(req.body,
//   function(settlementTilesJSON) {
//     //settlementTilesJSON.settlementTiles = convertOrganisms(req.body.settlementTiles);
//     var settlementTiles = new ProtocolSettlementTile(settlementTilesJSON);
//     settlementTiles.collectionTime = moment(req.body.collectionTime).startOf('minute').toDate();
//     settlementTiles.scribeMember = req.user;
//
//     settlementTiles.save(function (err) {
//       if (err) {
//         return res.status(400).send({
//           message: errorHandler.getErrorMessage(err)
//         });
//       } else {
//         res.json(settlementTiles);
//       }
//     });
//   }, function(errorMessages) {
//     return res.status(400).send({
//       message: errorMessages
//     });
//   });
// };

/**
 * Show the current protocol settlement tiles
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var settlementTiles = req.settlementTiles ? req.settlementTiles.toJSON() : {};

  res.json(settlementTiles);
};

// var removeFiles = function(existingSt, updatedSt, successCallback, errorCallback) {
//   var filesToDelete = [];
//   if (updatedSt) {
//     if (updatedSt.settlementTiles && updatedSt.settlementTiles.length > 0) {
//       for (var i = 0; i < updatedSt.settlementTiles.length; i++) {
//         if (existingSt.settlementTiles[i].tilePhoto.path !== '' &&
//           updatedSt.settlementTiles[i].tilePhoto.path === '') {
//           filesToDelete.push(existingSt.settlementTiles[i].tilePhoto.path);
//         }
//       }
//     }
//   }
//
//   if (filesToDelete && filesToDelete.length > 0) {
//     var uploadRemote = new UploadRemote();
//     uploadRemote.deleteRemote(filesToDelete,
//     function() {
//       successCallback();
//     }, function(err) {
//       errorCallback(err);
//     });
//   } else {
//     successCallback();
//   }
// };

exports.validate = function (req, res) {
  var settlementTiles = req.body;
  validate(settlementTiles,
  function(settlementTilesJSON) {
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

// exports.incrementalSave = function (req, res) {
//   var settlementTiles = req.settlementTiles;
//
//   if (settlementTiles) {
//     settlementTiles = _.extend(settlementTiles, req.body);
//     settlementTiles.collectionTime = moment(req.body.collectionTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('minute').toDate();
//     settlementTiles.scribeMember = req.user;
//
//     // remove base64 text
//     var pattern = /^data:image\/[a-z]*;base64,/i;
//     if (settlementTiles.settlementTiles && settlementTiles.settlementTiles.length > 0) {
//       for (var j = 0; j < settlementTiles.settlementTiles.length; j++) {
//         if (settlementTiles.settlementTiles[j].tilePhoto &&
//         settlementTiles.settlementTiles[j].tilePhoto.path &&
//         pattern.test(settlementTiles.settlementTiles[j].tilePhoto.path)) {
//           settlementTiles.settlementTiles[j].tilePhoto.path = '';
//         }
//       }
//     }
//
//     settlementTiles.save(function (err) {
//       if (err) {
//         return res.status(400).send({
//           message: errorHandler.getErrorMessage(err)
//         });
//       } else {
//         validateSettlementTiles(settlementTiles,
//         function(settlementTilesJSON) {
//           res.json({
//             settlementTiles: settlementTiles,
//             successful: true
//           });
//         }, function(errorMessages) {
//           res.json({
//             settlementTiles: settlementTiles,
//             errors: errorMessages
//           });
//         });
//       }
//     });
//   } else {
//     return res.status(400).send({
//       message: 'Protocol settlement tiles not found'
//     });
//   }
// };

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
exports.updateInternal = function(settlementTilesReq, settlementTilesBody, user, validate, callback) {
  var save = function(settlementTilesJSON) {
    var settlementTiles = settlementTilesReq;

    if (settlementTiles) {
      //settlementTilesJSON.settlementTiles = convertOrganisms(req.body.settlementTiles);
      settlementTiles = _.extend(settlementTiles, settlementTilesJSON);
      settlementTiles.collectionTime = moment(settlementTilesBody.collectionTime).startOf('minute').toDate();
      settlementTiles.scribeMember = user;
      settlementTiles.submitted = new Date();

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
          callback(errorHandler.getErrorMessage(err));
        } else {
          callback(null, settlementTiles);
        }
      });
    } else {
      callback('Protocol settlement tiles not found');
    }
  };

  if (validate) {
    validate(settlementTilesBody,
    function(settlementTilesJSON) {
      save(settlementTilesJSON);
    }, function(errorMessages) {
      callback(null, null, errorMessages);
    });
  } else {
    save(settlementTilesBody);
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

// exports.updateTeamMembers = function(settlementTiles, list, successCallback, errorCallback) {
//   settlementTiles.teamMembers = list;
//   settlementTiles.save(function (err) {
//     if (err) {
//       errorCallback(errorHandler.getErrorMessage(err));
//     } else {
//       successCallback(settlementTiles);
//     }
//   });
// };

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
  if (!existing.protocols.waterQuality && updated.protocols.waterQuality) {
    exports.createInternal(updated.monitoringStartDate, updated.station.latitude, updated.station.longitude,
      updated.teamLists.waterQuality, function(err, waterQuality) {
        callback(err, waterQuality);
      });
  } else if (existing.protocols.waterQuality && !updated.protocols.waterQuality) {
    exports.deleteInternal(existing.protocols.waterQuality, function(err, waterQuality) {
      callback(err, waterQuality);
    });
  } else if (existing.protocols.waterQuality && updated.protocols.waterQuality) {
    existing.protocols.waterQuality.teamMembers = existing.teamLists.waterQuality;
    exports.updateInternal(existing, updated, user, false, function(err, waterQuality, errorMessages) {
      if (errorMessages) {
        callback(errorMessages, waterQuality);
      } else {
        callback(err, waterQuality);
      }
    });
  } else {
    callback(null, existing.protocols.waterQuality);
  }
};

// exports.delete = function (req, res) {
//   var settlementTiles = req.settlementTiles;
//
//   deleteInternal(settlementTiles,
//   function(settlementTiles) {
//     res.json(settlementTiles);
//   }, function (err) {
//     return res.status(400).send({
//       message: errorHandler.getErrorMessage(err)
//     });
//   });
// };

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
