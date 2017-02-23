'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  SchoolOrg = mongoose.model('SchoolOrg'),
  Team = mongoose.model('Team'),
  User = mongoose.model('User'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  _ = require('lodash'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

var isAdmin = function(user) {
  var index = _.findIndex(user.roles, function(r) {
    return r === 'admin';
  });
  return (index > -1) ? true : false;
};

/**
 * Create a school/organization
 */
exports.create = function(req, res) {
  var schoolOrg = new SchoolOrg(req.body);
  schoolOrg.creator = req.user;
  schoolOrg.pending = false;

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

var findTeamStats = function(orgToFind, callback) {
  var findTeams = function(org, callback) {
    Team.find({ 'schoolOrg' : org }).exec(function(err, teams) {
      callback(teams);
    });
  };

  findTeams(orgToFind, function(teams) {
    var org = orgToFind ? orgToFind.toJSON() : {};
    var teamLeads = [];
    var teamMembers = [];
    if (teams && teams.length) {
      for (var i = 0; i < teams.length; i++) {
        teamLeads.push(teams[i].teamLead);
        teamLeads = teamLeads.concat(teams[i].teamLeads);
        teamMembers = teamMembers.concat(teams[i].teamMembers);
      }
      teamLeads = _.uniq(teamLeads);
      teamMembers = _.uniq(teamMembers);
    }
    org.teams = {
      teamLeads: teamLeads,
      teamLeadCount: (teamLeads) ? teamLeads.length : 0,
      teamCount: (teams) ? teams.length : 0,
      teamMembers: teamMembers,
      teamMemberCount: (teamMembers) ? teamMembers.length : 0
    };
    if (callback) callback(org);
  });
};

/**
 * Show the current school/organization
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  if (req.query.full) {
    findTeamStats(req.schoolOrg, function(org) {
      var indexO = _.findIndex(org.orgLeads, function(o) {
        var orgId = (o && o._id) ? o._id : o;
        return orgId.toString() === req.user._id.toString();
      });
      org.isCurrentUserOrgLead = (indexO > -1) ? true : false;

      var indexL = _.findIndex(org.teamLeads, function(l) {
        var teamLeadId = (l && l._id) ? l._id : l;
        return teamLeadId.toString() === req.user._id.toString();
      });
      org.isCurrentUserTeamLead = (indexL > -1) ? true : false;

      var indexM = _.findIndex(org.teamMembers, function(m) {
        var teamMemberId = (m && m._id) ? m._id : m;
        return teamMemberId.toString() === req.user._id.toString();
      });
      org.isCurrentUserTeamMember = (indexM > -1) ? true : false;

      res.json(org);
    });
  } else {
    var schoolOrg = req.schoolOrg ? req.schoolOrg.toJSON() : {};
    res.json(schoolOrg);
  }
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

exports.approve = function (req, res) {
  var schoolOrg = req.schoolOrg;

  if (schoolOrg && isAdmin(req.user)) {
    if(schoolOrg.creator === null || schoolOrg.creator === undefined) {
      return res.status(400).send({
        message: 'Error approving organization. Creator is null.'
      });
    }

    schoolOrg.pending = false;

    schoolOrg.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

        email.sendEmailTemplate(schoolOrg.creator.email, 'Your organization ' + schoolOrg.name + ' was approved',
        'org_approved', {
          FirstName: schoolOrg.creator.firstName,
          OrgName: schoolOrg.name,
          LinkLogin: httpTransport + req.headers.host + '/authentication/signin',
          LinkProfile: httpTransport + req.headers.host + '/settings/profile'
        }, function(info) {
          res.json(schoolOrg);
        }, function(errorMessage) {
          res.json(schoolOrg);
        });
      }
    });
  } else {
    return res.status(403).send({
      message: 'Permission denied'
    });
  }
};

exports.deny = function (req, res) {
  var schoolOrg = req.schoolOrg;

  if (schoolOrg && isAdmin(req.user)) {
    schoolOrg.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(schoolOrg);
      }
    });
  } else {
    return res.status(403).send({
      message: 'Permission denied'
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
  var query;
  var and = [];

  if (req.query.type) {
    if (req.query.type === 'other') {
      and.push({ $or: [{ organizationType: req.query.type },{ organizationType: { $exists: false } }] });
    } else {
      and.push({ organizationType: req.query.type });
    }
  }

  if (req.query.pending) {
    and.push({ 'pending': true });
  } else if (req.query.approvedOnly) {
    and.push({ 'pending': false });
  }

  var searchRe;
  var or = [];
  if (req.query.searchString) {
    try {
      searchRe = new RegExp(req.query.searchString, 'i');
    } catch(e) {
      return res.status(400).send({
        message: 'Search string is invalid'
      });
    }

    or.push({ 'name': searchRe });
    or.push({ 'city': searchRe });
    or.push({ 'state': searchRe });

    and.push({ $or: or });
  }

  if (and.length === 1) {
    query = SchoolOrg.find(and[0]);
  } else if (and.length > 0) {
    query = SchoolOrg.find({ $and: and });
  } else {
    query = SchoolOrg.find();
  }

  if (req.query.sort) {
    if (req.query.sort === 'name') {
      query.sort({ 'name': 1 });
    }
  } else {
    query.sort('-created');
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

  query.populate('creator', 'displayName')
  .populate('orgLeads', 'displayName firstName lastName username email profileImageURL pending')
  .exec(function (err, schoolOrgs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //Move Unaffiliated/None to the top of the list
      var unIndex = _.findIndex(schoolOrgs, function(o) {
        return o.name === 'Unaffiliated/None';
      });
      if (unIndex > -1) {
        var unObj = schoolOrgs.splice(unIndex, 1);
        schoolOrgs = unObj.concat(schoolOrgs);
      }

      if (req.query.showTeams) {
        var findTeamsForOrg = function(index, schoolOrgs, updatedSchoolOrgs, callback) {
          if (index < schoolOrgs.length) {
            findTeamStats(schoolOrgs[index], function(org) {
              updatedSchoolOrgs.push(org);
              findTeamsForOrg(index+1, schoolOrgs, updatedSchoolOrgs, callback);
            });
          } else {
            callback(updatedSchoolOrgs);
          }
        };

        findTeamsForOrg(0, schoolOrgs, [], function(updatedSchoolOrgs) {
          res.json(updatedSchoolOrgs);
        });
      } else {
        res.json(schoolOrgs);
      }
    }
  });
};

/**
 * List of Teams by School/Organizations
 */
exports.teamsBySchoolOrgs = function (req, res) {
  var schoolOrg = req.schoolOrg;
  var query;
  var and = [];

  and.push({ schoolOrg: schoolOrg });

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
    or.push({ 'description': searchRe });

    and.push({ $or: or });
  }

  if (and.length === 1) {
    query = Team.find(and[0]);
  } else if (and.length > 0) {
    query = Team.find({ $and: and });
  } else {
    query = Team.find();
  }

  if (req.query.sort) {
    if (req.query.sort === 'owner') {
      query.sort({ 'teamLead': 1, 'name': 1 });
    }
  } else {
    query.sort('name');
  }

  query.populate('teamMembers', 'displayName firstName lastName username email profileImageURL pending')
  .populate('teamLead', 'displayName firstName lastName username email profileImageURL pending')
  .populate('teamLeads', 'displayName firstName lastName username email profileImageURL pending')
  .populate('schoolOrg').exec(function (err, teams) {
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

  var query;
  var and = [];

  and.push({ schoolOrg: schoolOrg });

  if (req.query.pending) {
    and.push({ $or: [{ roles: 'team lead' }, { roles: 'team lead pending' }] });
  } else {
    and.push({ roles: 'team lead' });
  }

  var searchRe;
  var or = [];
  if (req.query.searchString) {
    try {
      searchRe = new RegExp(req.query.searchString, 'i');
    } catch(e) {
      return res.status(400).send({
        message: 'Search string is invalid'
      });
    }

    or.push({ 'displayName': searchRe });
    or.push({ 'firstName': searchRe });
    or.push({ 'lastName': searchRe });
    or.push({ 'email': searchRe });
    or.push({ 'username': searchRe });

    and.push({ $or: or });
  }

  if (and.length === 1) {
    query = User.find(and[0], '-salt -password');
  } else if (and.length > 0) {
    query = User.find({ $and: and }, '-salt -password');
  } else {
    query = User.find({}, '-salt -password');
  }

  query.sort({ 'firstName': 1 }).exec(function(err, teamLeads) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teamLeads);
    }
  });
};

exports.teamMembersBySchoolOrg = function (req, res) {
  var schoolOrg = req.schoolOrg;

  var query;
  var and = [];

  and.push({ schoolOrg: schoolOrg });

  if (req.query.pending) {
    and.push({ $or: [{ roles: 'team member' }, { roles: 'team member pending' }] });
  } else {
    and.push({ roles: 'team member' });
  }

  var searchRe;
  var or = [];
  if (req.query.searchString) {
    try {
      searchRe = new RegExp(req.query.searchString, 'i');
    } catch(e) {
      return res.status(400).send({
        message: 'Search string is invalid'
      });
    }

    or.push({ 'displayName': searchRe });
    or.push({ 'firstName': searchRe });
    or.push({ 'lastName': searchRe });
    or.push({ 'email': searchRe });
    or.push({ 'username': searchRe });

    and.push({ $or: or });
  }

  if (and.length === 1) {
    query = User.find(and[0], '-salt -password');
  } else if (and.length > 0) {
    query = User.find({ $and: and }, '-salt -password');
  } else {
    query = User.find({}, '-salt -password');
  }

  query.sort({ 'firstName': 1 }).exec(function(err, teamMembers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teamMembers);
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

  SchoolOrg.findById(id).populate('creator', 'firstName displayName email')
  .populate('orgLeads', 'displayName firstName lastName username email profileImageURL roles schoolOrg pending')
  .exec(function (err, schoolOrg) {
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

exports.uploadOrgPhoto = function (req, res) {
  var schoolOrg = req.schoolOrg;
  var upload = multer(config.uploads.organizationPhotoUpload).single('orgPhoto');
  var imageUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = imageUploadFileFilter;

  if (schoolOrg) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.organizationPhotoUpload,
      function(fileInfo) {
        schoolOrg.photo = fileInfo;

        schoolOrg.save(function(saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            res.json(schoolOrg);
          }
        });
      }, function(errorMessage) {
        return res.status(400).send({
          message: errorMessage
        });
      });
  } else {
    res.status(400).send({
      message: 'Organization does not exist'
    });
  }
};
