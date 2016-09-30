'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  RestorationStation = mongoose.model('RestorationStation'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  path = require('path'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  _ = require('lodash');

// var getTeam = function(teamId, successCallback, errorCallback) {
//   // Get School/Organization from team
//   Team.findById(teamId).exec(function (err, team) {
//     if (err) {
//       errorCallback(errorHandler.getErrorMessage(err));
//     } else {
//       successCallback(team);
//     }
//   });
// };

/**
 * Create a restoration station
 */
exports.create = function (req, res) {
  var station = new RestorationStation(req.body);

  // getTeam(req.body.team, function(team) {
  station.team = null;
  station.schoolOrg = req.user.schoolOrg;
  station.teamLead = req.user;

  var pattern = /^data:image\/jpeg;base64,/i;
  if (station.photo && station.photo.path && pattern.test(station.photo.path)) {
    station.photo.path = '';
  }

  station.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(station);
    }
  });
  // }, function(errorMessage) {
  //   return res.status(400).send({
  //     message: errorMessage
  //   });
  // });
};

/**
 * Show the current restoration station
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var station = req.station ? req.station.toJSON() : {};

  station.isCurrentUserOwner = req.user && station.teamLead &&
    station.teamLead._id.toString() === req.user._id.toString();

  res.json(station);
};

/**
 * Update a restoration station
 */
exports.update = function (req, res) {
  var station = req.station;

  if (station) {
    station = _.extend(station, req.body);
    // if (!req.body.photo) {
    //   delete station.photo;
    // }
    var pattern = /^data:image\/jpeg;base64,/i;
    if (station.photo && station.photo.path && pattern.test(station.photo.path)) {
      station.photo.path = '';
    }

    // getTeam(req.body.team, function(team) {
    station.team = null;
    station.schoolOrg = req.user.schoolOrg;
    station.teamLead = req.user;

    station.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(station);
      }
    });
    // }, function(errorMessage) {
    //   return res.status(400).send({
    //     message: errorMessage
    //   });
    // });
  }
};

/**
 * Delete a restoration station
 */
exports.delete = function (req, res) {
  var station = req.station;

  station.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(station);
    }
  });
};

/**
 * List of Restoration Stations
 */
exports.list = function (req, res) {
  var query;
  var and = [];

  if (req.query.teamLeadId) {
    and.push({ 'teamLeadId': req.query.teamLeadId });
  }
  if (req.query.teamLead) {
    and.push({ 'teamLead': req.user._id });
  }
  if (req.query.schoolOrgId) {
    and.push({ 'schoolOrg': req.query.schoolOrgId });
  }

  if (and.length === 1) {
    query = RestorationStation.find(and[0]);
  } else if (and.length > 0) {
    query = RestorationStation.find({ $and: and });
  } else {
    query = RestorationStation.find();
  }

  if (req.query.sort) {
    if (req.query.sort === 'date') {
      query.sort('-created');
    }
  } else {
    query.sort('name');
  }

  if (req.query.limit) {
    var limit = Number(req.query.limit);
    if (req.query.page) {
      var page = Number(req.query.page);
      query.skip(limit*(page-1)).limit(limit);
    } else {
      query.limit(limit);
    }
  }

  query.populate('teamLead', 'displayName').populate('schoolOrg', 'name').exec(function (err, stations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var stationsJSON = [];
      for (var i = 0; i < stations.length; i++) {
        var station = stations[i] ? stations[i].toJSON() : {};

        station.isCurrentUserOwner = req.user && station.teamLead &&
          station.teamLead._id.toString() === req.user._id.toString();
        stationsJSON.push(station);
      }

      res.json(stationsJSON);
    }
  });
};

/**
 * Restoration station middleware
 */
exports.stationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Restoration station is invalid'
    });
  }

  RestorationStation.findById(id).populate('teamLead', 'displayName').populate('schoolOrg', 'name').exec(function (err, station) {
    if (err) {
      return next(err);
    } else if (!station) {
      return res.status(404).send({
        message: 'No restoration station with that identifier has been found'
      });
    }
    req.station = station;
    next();
  });
};

var deleteInternal = function(station, successCallback, errorCallback) {
  var filesToDelete = [];

  if (station) {
    if (station.photo && station.photo.path) {
      filesToDelete.push(station.photo.path);
    }

    var uploadRemote = new UploadRemote();
    uploadRemote.deleteRemote(filesToDelete,
    function() {
      station.remove(function(err) {
        if (err) {
          errorCallback(errorHandler.getErrorMessage(err));
        } else {
          successCallback(station);
        }
      }, function(err) {
        errorCallback(err);
      });
    });
  } else {
    successCallback();
  }
};

/**
 * Upload image to station
 */
exports.uploadStationPhoto = function (req, res) {
  var station = req.station;
  var upload = multer(config.uploads.stationPhotoUpload).single('stationPhoto');
  var imageUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = imageUploadFileFilter;

  if (station) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.stationPhotoUpload,
      function(fileInfo) {
        station.photo = fileInfo;

        station.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            res.json(station);
          }
        });
      }, function(errorMessage) {
        console.log('errorMessage', errorMessage);
        deleteInternal(station,
        function(station) {
          return res.status(400).send({
            message: errorMessage
          });
        }, function(err) {
          return res.status(400).send({
            message: err
          });
        });
      });
  } else {
    res.status(400).send({
      message: 'Station does not exist'
    });
  }
};
