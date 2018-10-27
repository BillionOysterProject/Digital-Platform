'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  RestorationStation = mongoose.model('RestorationStation'),
  SchoolOrg = mongoose.model('SchoolOrg'),
  User = mongoose.model('User'),
  ProtocolOysterMeasurement = mongoose.model('ProtocolOysterMeasurement'),
  MetaPropertyOwner = mongoose.model('MetaPropertyOwner'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  path = require('path'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  userAdmin = require(path.resolve('./modules/users/server/controllers/admin.server.controller')),
  moment = require('moment'),
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

var SITE_COORDINATOR = 'site coordinator';

var sendAdminEmailOther = function(subject, emailName, stationName, userName, otherName, otherEmail, formLink, profileLink, callback) {
  email.sendEmailTemplate(config.mailer.admin, subject, emailName, {
    ORSName: stationName,
    TeamLeadName: userName,
    OtherName: otherName || '',
    OtherEmail: otherEmail || '',
    LinkORSForm: formLink,
    LinkProfile: profileLink
  }, function(info) {
    callback();
  }, function(errorMessage) {
    callback();
  });
};

var setUpSiteCoordinator = function(req, station, callback) {
  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';
  var orsFormLink = httpTransport + req.headers.host + '/restoration?openORSForm=' + station._id;
  var profileLink = httpTransport + req.headers.host + '/profiles';

  if (req.body.siteCoordinator && req.body.siteCoordinator._id === '-1') {
    station.siteCoordinator = undefined;
    if ((req.body.siteCoordinator.displayName !== station.otherSiteCoordinator.name) &&
    (req.body.siteCoordinator.email !== station.otherSiteCoordinator.email)) {
      station.otherSiteCoordinator.name = req.body.siteCoordinator.displayName;
      station.otherSiteCoordinator.email = req.body.siteCoordinator.email;

      sendAdminEmailOther('Unlisted Site Coordinator Added for ORS ' + station.name, 'ors_other_site_coordinator',
        station.name, req.user.displayName, station.otherSiteCoordinator.name, station.otherSiteCoordinator.email, orsFormLink, profileLink,
        function() {
          callback();
        });
    } else {
      callback();
    }
  } else {
    station.otherSiteCoordinator = {};
    callback();
  }
};

var setUpPropertyOwner = function(req, station, callback) {
  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';
  var orsFormLink = httpTransport + req.headers.host + '/restoration?openORSForm=' + station._id;
  var profileLink = httpTransport + req.headers.host + '/profiles';

  if (req.body.propertyOwner && req.body.propertyOwner._id === '-1') {
    station.propertyOwner = undefined;
    if ((req.body.propertyOwner.name !== station.otherPropertyOwner.name) &&
    (req.body.propertyOwner.email !== station.otherPropertyOwner.email)) {
      station.otherPropertyOwner.name = req.body.propertyOwner.name;
      station.otherPropertyOwner.email = req.body.propertyOwner.email;

      sendAdminEmailOther('Unlisted Property Owner Added for ORS ' + station.name, 'ors_other_property_owner',
        station.name, req.user.displayName, station.otherPropertyOwner.name, station.otherPropertyOwner.email, orsFormLink, profileLink,
        function() {
          callback();
        });
    } else {
      callback();
    }
  } else {
    station.otherPropertyOwner = {};
    callback();
  }
};

/**
 * Create a restoration station
 */
exports.create = function (req, res) {
  var station = new RestorationStation(req.body);
  station.team = null;
  station.schoolOrg = req.user.schoolOrg;
  station.teamLead = req.user;
  station.site = req.body.site;

  var pattern = /^data:image\/[a-z]*;base64,/i;
  if (station.photo && station.photo.path && pattern.test(station.photo.path)) {
    station.photo.path = '';
  }

  station.baseline = {};
  //set default baseline information
  for (var i = 1; i <= 10; i++) {
    station.baseline['substrateShell'+i] = [];
  }

  setUpSiteCoordinator(req, station, function() {
    setUpPropertyOwner(req, station, function() {
      station.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(station);
        }
      });
    });
  });
};

/**
 * Show the current restoration station
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var station = req.station ? req.station.toJSON() : {};

  station.isCurrentUserOwner = req.user && station.teamLead &&
    station.teamLead._id.toString() === req.user._id.toString();

  if (req.query.full) {

  }

  res.json(station);
};

/**
 * Update a restoration station
 */
exports.update = function (req, res) {
  var station = req.station;

  if (station) {
    station = _.extend(station, req.body);
    station.team = null;

    var pattern = /^data:image\/[a-z]*;base64,/i;
    if (station.photo && station.photo.path && pattern.test(station.photo.path)) {
      station.photo.path = '';
    }

    setUpSiteCoordinator(req, station, function() {
      setUpPropertyOwner(req, station, function() {
        station.save(function(err) {
          if (err) {
            console.log('err', err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(station);
          }
        });
      });
    });
  }
};

/**
 * Add a baseline to the history
 */
exports.updateBaselines = function (req, res) {
  var station = req.station;

  if (station) {
    var index = req.body.substrateShellNumber;
    if (req.body.substrateShellNumber && station.baselines['substrateShell'+index]) {
      var baseline = req.body;
      baseline.entered = new Date();
      baseline.setDate = moment(req.body.setDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('day').toDate();
      station.baselines['substrateShell'+index].push(baseline);

      station.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var baselines = station.baselines['substrateShell'+index];
          var latestBaseline = baselines[baselines.length-1];
          res.json(latestBaseline);
        }
      });
    } else {
      return res.status(400).send({
        message: 'Substrate Shell #' + index + ' does not exist'
      });
    }
  } else {
    return res.status(400).send({
      message: 'ORS could not be found'
    });
  }
};

exports.updateStatusHistory = function(req, res) {
  var station = req.station;

  if (station) {
    station.statusHistory.push({
      status: req.body.status,
      description: req.body.description
    });

    station.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var index = (station.statusHistory.length - 1);
        res.json({
          station: station,
          index: index
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'ORS could not be found'
    });
  }
};

var calculateValuesForSubstrateForMonth = function(substrateIndex, startDate, endDate, callback) {
  ProtocolOysterMeasurement.findOne({ 'collectionTime': { '$gte': startDate, '$lt': endDate } }).sort('collectionTime')
  .exec(function(err, samples) {
    if (err) {
      callback(err);
    } else if (!samples || samples.length === 0) {
      callback(null, {
        mortality: 0,
        averageMass: 0,
        averageSize: 0
      });
    } else {
      var numberAlive = Number.MAX_VALUE;
      var totalMass = 0;
      var totalSize = 0;

      for (var i = 0; i < samples.length; i++) {
        var sample = samples[i];
        var measurements = sample.measuringOysterGrowth.substrateShells[substrateIndex];
        //find mortality
        if (measurements.totalNumberOfLiveOystersOnShell < numberAlive) {
          numberAlive = measurements.totalNumberOfLiveOystersOnShell;
        }
        //sum mass
        totalMass += measurements.averageSizeOfLiveOysters;
        //sum size
        totalSize += measurements.totalMassOfScrubbedSubstrateShellOystersTagG;
      }

      var averageMass = totalMass / samples.length;
      var averageSize = totalSize / samples.length;
      callback(null, {
        mortality: numberAlive,
        averageMass: averageMass,
        averageSize: averageSize
      });
    }
  });
};

var calculateValuesForSubstrate = function(baseline, earliestSetDate, callback) {
  var setDate = baseline.setDate;

  var values = {
    mortality: [],
    averageMass: [],
    averageSize: []
  };
  var baselineMoment = moment(setDate).startOf('month');

  var earliestMoment = moment(earliestSetDate).startOf('month');
  var todayMoment = moment().startOf('month');
  if (earliestMoment.isBefore(baselineMoment)) {
    var months = moment.duration(baselineMoment.toDate() - earliestMoment.toDate()).asMonths();
    for (var i = 0; i < months; i++) {
      values.mortality.push(0);
      values.averageMass.push(0);
      values.averageSize.push(0);
    }
  }

  function getValue(valueCallback) {
    if (baselineMoment.isBefore(todayMoment)) {
      //get start and end dates
      var startDate = baselineMoment.toDate();
      var endDate = baselineMoment.endOf('month').toDate();
      //set baseline to beginning of the next month
      baselineMoment.add(2, 'days');
      baselineMoment.startOf('month');
      //get values
      calculateValuesForSubstrateForMonth((baseline.substrateShellNumber-1), startDate, endDate, function(err, value) {
        if (err) {
          valueCallback(err);
        } else {
          values.mortality.push(value.mortality);
          values.averageMass.push(value.averageMass);
          values.averageSize.push(value.averageSize);
          getValue(valueCallback);
        }
      });
    } else {
      valueCallback(null);
    }
  }

  getValue(function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null, values);
    }
  });
};

exports.measurementChartData = function(req, res) {
  var station = req.station;
  var mortalitySeries = [];
  var averageMassSeries = [];
  var averageSizeSeries = [];

  function getValuesForSubstrate (index, baselineArray, earliestSetDate, callback) {
    if (index < baselineArray.length) {
      var baseline = baselineArray[index];

      calculateValuesForSubstrate(baseline, earliestSetDate, function (err, values) {
        if (err) {
          return res.status(400).send({
            message: err
          });
        } else {
          mortalitySeries.push(values.mortality);
          averageMassSeries.push(values.averageMass);
          averageSizeSeries.push(values.averageSize);
          getValuesForSubstrate((index+1), baselineArray, earliestSetDate, callback);
        }
      });
    } else {
      callback();
    }
  }

  if (station) {
    var baselines = station.baselines;

    //find earliestDate;
    var earliestSetDate = moment();
    var baselineArray = [];
    for(var i = 1; i < 11; i++) {
      var history = baselines['substrateShell'+i];
      if (history) {
        var baseline = history[history.length - 1];
        if (baseline) {
          baselineArray.push(baseline);
          if (earliestSetDate.isAfter(baseline.setDate)) {
            earliestSetDate = moment(baseline.setDate);
          }
        }
      }
    }

    //get values by months for all substrate shells
    if (baselineArray.length > 0) {
      getValuesForSubstrate (0, baselineArray, earliestSetDate, function() {
        res.json({
          mortality: mortalitySeries,
          averageMass: averageMassSeries,
          averageSize: averageSizeSeries
        });
      });
    } else {
      return res.status(400).send({
        message: 'No baseline values'
      });
    }
  } else {
    return res.status(400).send({
      message: 'ORS could not be found'
    });
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
  var user = (req.query.userId ? req.query.userId : req.user._id);
  var and = [];

  if (req.query.status) {
    and.push({ 'status': req.query.status });
  }
  if (req.query.teamLeadId) {
    and.push({ 'teamLead': req.query.teamLeadId });
  }
  if (req.query.teamLead) {
    if (req.query.teamLead === 'true') {
      and.push({ 'teamLead': user });
    } else {
      and.push({ 'teamLead': req.query.teamLead });
    }
  }
  if (req.query.team) {
    and.push({ 'team': req.query.team });
  }
  if (req.query.schoolOrgId) {
    and.push({ 'schoolOrg': req.query.schoolOrgId });
  }
  if (req.query.organization) {
    and.push({ 'schoolOrg': req.query.organization });
  }

  var or = [];
  var searchRe;
  if (req.query.searchString) {
    try {
      searchRe = new RegExp(req.query.searchString, 'i');
    } catch(e) {
      return res.status(400).send({
        message: 'Search string is invalid'
      });
    }

    or.push({ 'name': searchRe });
    or.push({ 'bodyOfWater': searchRe });
    or.push({ 'boroughCounty': searchRe });
    or.push({ 'shoreLineType': searchRe });
    or.push({ 'notes': searchRe });

    and.push({ $or: or });
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

  query.populate('teamLead', 'displayName firstName lastName email schoolOrg roles username profileImageURL teamLeadType')
  .populate('schoolOrg', 'name').exec(function (err, stations) {
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
 * List of Site Coordinators
 */
exports.listSiteCoordinators = function (req, res) {
  User.find({ 'teamLeadType': SITE_COORDINATOR }).sort('displayName').exec(function (err, siteCoordinators) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(siteCoordinators);
    }
  });
};

/**
 * List of Property Owner
 */
exports.listPropertyOwners = function (req, res) {
  MetaPropertyOwner.find().sort('name').exec(function (err, propertyOwners) {
    if (err) {
      console.log('err', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(propertyOwners);
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

  RestorationStation.findById(id).populate('teamLead', 'displayName firstName lastName email schoolOrg roles username profileImageURL teamLeadType')
  .populate('siteCoordinator', 'displayName email schoolOrg roles')
  .populate('propertyOwner', 'name email')
  .populate('schoolOrg', 'name city state').exec(function (err, station) {
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

exports.statusHistoryByIndex = function (req, res, next, id) {
  req.statusHistoryIndex = id;
  next();
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

exports.uploadStationStatusPhoto = function (req, res) {
  var station = req.station;
  var index = req.statusHistoryIndex;
  var upload = multer(config.uploads.stationStatusPhotoUpload).single('stationStatusPhoto');
  var imageUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = imageUploadFileFilter;

  if (station && index) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.stationStatusPhotoUpload,
      function(fileInfo) {
        station.statusHistory[index].photo = fileInfo;

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
        return res.status(400).send({
          message: errorMessage
        });
      });
  } else {
    res.status(400).send({
      message: 'Station does not exist'
    });
  }
};

exports.sendORSStatusEmail = function(req, res) {
  var station = req.station;
  var index = req.statusHistoryIndex;

  if (station && index) {
    SchoolOrg.findById(req.user.schoolOrg).exec(function(err, org) {
      if (err) {
        return res.status(400).send({
          message: 'User organization not found'
        });
      } else {
        var to = [config.mailer.ors];
        if (req.user) to.push(req.user.email);
        if (station.teamLead && station.teamLead.email) to.push(station.teamLead.email);

        var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';
        var statusHistory = station.statusHistory[index];

        var attachments = [];
        if (statusHistory.photo) {
          attachments.push({
            filename: statusHistory.photo.originalname,
            path: statusHistory.photo.path,
            cid: 'ors-status.ee'
          });
        }

        email.sendEmailTemplate(to, 'ORS status change reported for ' + station.name, 'ors_report', {
          ORSName: station.name,
          FeedbackName: req.user.displayName,
          FeedbackOrg: org.name,
          ORSStatus: statusHistory.status,
          ORSDescription: statusHistory.description,
          LinkORSPhoto: (statusHistory.photo) ? statusHistory.photo.path : '',
          LinkORSForm: httpTransport + req.headers.host + '/restoration?openORSForm=' + station._id,
          LinkProfile: httpTransport + req.headers.host + '/profiles'
        }, function(info) {
          res.json(station);
        }, function(errorMessage) {
          res.json(station);
        }, attachments);
      }
    });
  } else {
    return res.status(400).send({
      message: 'Station and/or status history index not found'
    });
  }
};
