'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  SchoolOrg = mongoose.model('SchoolOrg'),
  Team = mongoose.model('Team'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a school/organization
 */
exports.create = function(req, res) {
  var schoolOrg = new SchoolOrg(req.body);

  schoolOrg.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schoolOrg);
    }
  });
};

/**
 * Show the current school/organization
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var schoolOrg = req.schoolOrg ? req.schoolOrg.toJSON() : {};

  res.json(schoolOrg);
};

/**
 * Update a school/organization
 */
exports.update = function (req, res) {
  var schoolOrg = req.schoolOrg;

  if (schoolOrg) {
    schoolOrg = _.extend(schoolOrg, req.body);

    schoolOrg.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(schoolOrg);
      }
    });
  }
};

/**
 * Delete a school/organization
 */
exports.delete = function (req, res) {
  var schoolOrg = req.schoolOrg;

  schoolOrg.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schoolOrg);
    }
  });
};

/**
 * List of School/Organizations
 */
exports.list = function (req, res) {
  SchoolOrg.find().exec(function (err, schoolOrgs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schoolOrgs);
    }
  });
};

/**
 * List of Teams by School/Organizations
 */
exports.teamsBySchoolOrgs = function (req, res) {
  var schoolOrg = req.schoolOrg;

  Team.find({ schoolOrg: schoolOrg }).populate('teamLead', 'displayName').exec(function (err, teams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teams);
    }
  });
};

/**
 * List of Team Leads by School/Organizations
 */
exports.teamLeadsBySchoolOrg = function (req, res) {
  var schoolOrg = req.schoolOrg;
  Team.find({ schoolOrg: schoolOrg }).distinct('teamLead').exec(function (err, teamLeadIds) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      User.find({ _id: { $in: teamLeadIds } }).exec(function (teamErr, teamLeads) {
        if (teamErr) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(teamErr)
          });
        } else {
          res.json(teamLeads);
        }
      });
    }
  });
};

/**
 * List of Teams By School/Organization and Team Lead
 */
exports.teamsBySchoolOrgsAndTeamLeads = function (req, res) {
  var schoolOrg = req.schoolOrg;
  var teamLead = req.teamLead;

  Team.find({ schoolOrg: schoolOrg, teamLead: teamLead }).exec(function (err, teams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teams);
    }
  });
};

/**
 * Team middleware
 */
exports.schoolOrgByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'School/Organization is invalid'
    });
  }

  SchoolOrg.findById(id).exec(function (err, schoolOrg) {
    if (err) {
      return next(err);
    } else if (!schoolOrg) {
      return res.status(400).send({
        message: 'No school/organization with that identifier has been found'
      });
    }
    req.schoolOrg = schoolOrg;
    next();
  });
};

exports.teamLeadByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Team Lead is invalid'
    });
  }

  User.findById(id).exec(function (err, teamLead) {
    if (err) {
      return next(err);
    } else if (!teamLead) {
      return res.status(400).send({
        message: 'No team lead with that identifier has been found'
      });
    }
    req.teamLead = teamLead;
    next();
  });
};
