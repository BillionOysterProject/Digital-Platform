'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  RestorationStation = mongoose.model('RestorationStation'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var getTeam = function(teamId, successCallback, errorCallback) {
  // Get School/Organization from team
  Team.findById(teamId).exec(function (err, team) {
    if (err) {
      errorCallback(errorHandler.getErrorMessage(err));
    } else {
      successCallback(team);
    }
  });
};

/**
 * Create a restoration station
 */
exports.create = function (req, res) {
  var station = new RestorationStation(req.body);

  getTeam(req.body.team, function(team) {
    station.schoolOrg = team.schoolOrg;

    station.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
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
};

/**
 * Show the current restoration station
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var station = req.station ? req.station.toJSON() : {};

  res.json(station);
};

/**
 * Update a restoration station
 */
exports.update = function (req, res) {
  var station = req.station;

  if (station) {
    station = _.extend(station, req.body);

    getTeam(req.body.team, function(team) {
      station.schoolOrg = team.schoolOrg;

      station.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
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

  if (req.query.teamId) {
    and.push({ 'team': req.query.teamId });
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
    if (req.query.page) {
      query.skip(req.query.limit*(req.query.page-1)).limit(req.query.limit);
    }
  } else {
    query.limit(req.query.limit);
  }

  query.populate('team', 'name').exec(function (err, stations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(stations);
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

  RestorationStation.findById(id).exec(function (err, station) {
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
