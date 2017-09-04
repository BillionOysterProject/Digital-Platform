'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
  User = mongoose.model('User'),
  Expedition = mongoose.model('Expedition'),
  RestorationStation = mongoose.model('RestorationStation'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  _ = require('lodash'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  async = require('async'),
  crypto = require('crypto');

/**
 * Create a team
 */
var createInternal = function(teamJSON, user, successCallback, errorCallback) {
  var team = new Team(teamJSON);
  team.teamLead = user;
  team.teamLeads = [user];

  team.save(function (err) {
    if (err) {
      errorCallback(err);
    } else {
      successCallback(team);
    }
  });
};

exports.create = function (req, res) {
  createInternal(req.body, req.user,
    function(team) {
      res.json(team);
    }, function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

// Add a custom field to the Team, for determining if the current User is the "lead".
// NOTE: This field is NOT persisted to the database, since it doesn't exist in the Team model.
var addTeamPermissionsForCurrentUser = function(req, team) {
  if (team) {
    team.isCurrentUserTeamLead = req.user && team.teamLead && team.teamLead._id &&
      team.teamLead._id.toString() === req.user._id.toString() ? true : false;

    if (!team.isCurrentUserTeamLead && team.teamLeads && team.teamLeads.length > 0) {
      var indexL = _.findIndex(team.teamLeads, function(l) {
        var leadId = (l && l._id) ? l._id : l;
        console.log('leadId', leadId);
        console.log('userId', req.user._id);
        if (leadId && req.user && req.user._id) {
          return leadId.toString() === req.user._id.toString();
        } else {
          return false;
        }
      });
      team.isCurrentUserTeamLead = (indexL > -1) ? true : false;
    }

    var indexM = _.findIndex(team.teamMembers, function(m) {
      var memberId = (m && m._id) ? m._id : m;
      if (memberId && req.user && req.user._id) {
        return memberId.toString() === req.user._id.toString();
      } else {
        return false;
      }
    });
    team.isCurrentUserTeamMember = (indexM > -1) ? true : false;
  }
};

/**
 * Show the current team
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var team = req.team ? req.team.toJSON() : {};
  addTeamPermissionsForCurrentUser(req, team);
  res.json(team);
};

/**
 * Update a team
 */
exports.update = function (req, res) {
  var team = req.team;

  if (team) {
    team = _.extend(team, req.body);

    team.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(team);
      }
    });
  }
};

var deleteTeamInternal = function(team, res) {
  team.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};

/**
 * Delete a team
 */
exports.delete = function (req, res) {
  var team = req.team;

  if(team.teamMembers !== undefined && team.teamMembers !== null &&
    team.teamMembers.length > 0) {
    return res.status(400).send({
      message: 'The team ' + team.name + ' cannot be deleted because it still has members.'
    });
  }

  //does the team have expeditions? if so don't let it be deleted
  Expedition.find({ 'team': team._id }).exec(function(err, expeditions) {
    if (err) {
      return res.status(400).send({
        message: 'Could not find expeditions associated with team ' + team.name +
          '. Error is: ' + errorHandler.getErrorMessage(err)
      });
    } else {
      if(expeditions !== null && expeditions !== undefined && expeditions.length > 0) {
        return res.status(400).send({
          message: 'Team ' + team.name + ' cannot be deleted because there are expeditions associated with it.'
        });
      } else {
        deleteTeamInternal(team, res);
      }
    }
  });
};

exports.deleteMember = function (req, res) {
  var member = req.member;
  var team = req.team;

  var deleteUser = function() {
    member.remove(function (errDelUser) {
      if (errDelUser) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(errDelUser)
        });
      } else {
        res.json(member);
      }
    });
  };

  var memberIndex = function(member, team) {
    var index = _.findIndex(team.teamMembers, function(m) {
      return m._id.toString() === member._id.toString();
    });
    return index;
  };

  var removeMemberFromTeam = function(team, index, callback) {
    team.teamMembers.splice(index, 1);

    team.save(function (delSaveErr) {
      if (delSaveErr) {
        callback(delSaveErr);
      } else {
        if (member.pending === true) {
          member.remove(function (errDelUser) {
            if (errDelUser) {
              callback(errDelUser);
            } else {
              callback();
            }
          });
        } else {
          callback();
        }
      }
    });
  };

  var findAndRemoveMemberFromTeam = function(team, member, callback) {
    // Remove the user from the team
    var mIndex = memberIndex(member, team);
    if (mIndex > -1) {
      removeMemberFromTeam(team, mIndex, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, member);
        }
      });
    } else {
      callback('Member was not found in team');
    }
  };

  if(member === undefined || member === null) {
    return res.status(400).send({
      message: 'Member was not specified'
    });
  }

  Team.find({ $or:[{ 'teamMembers': member }, { 'teamLeads': member }] }).populate('teamMembers', 'displayName').exec(function(err, teams) {
    if (err) {
      return res.status(400).send({
        message: 'Member not found in a team'
      });
    } else {
      if(team === undefined || team === null) {
        async.forEach(teams, function(item, callback) {
          findAndRemoveMemberFromTeam(item, member, function(err, member) {
            callback();
          });
        }, function(err) {
          deleteUser();
        });
      } else {
        findAndRemoveMemberFromTeam(team, member, function(err, member) {
          if (!teams || (teams.length === 1 && team._id && teams[0]._id && team._id.toString() === teams[0]._id.toString())) {
            deleteUser();
          } else {
            res.json(member);
          }
        });
      }
    }
  });

};

/**
 * List of Teams
 */
exports.list = function (req, res) {
  var searchQuery = function(teamLeadIds) {
    var query;
    var userId = (req.query.userId ? req.query.userId : req.user._id);
    var and = [];

    if (req.query.byOwner) {
      and.push({
        $or: [
          { 'teamLead': userId },
          { 'teamLeads': userId }
        ]
      });
    }

    if (req.query.byMember) {
      and.push({ 'teamMembers': userId });
    }
    if (req.query.teamId) {
      and.push({ '_id': req.query.teamId });
    }

    if(req.query.orgId) {
      and.push({ 'schoolOrg': req.query.orgId });
    }

    if (req.query.organization) {
      and.push({ 'schoolOrg': req.query.organization });
    }

    if (req.query.withMembers) {
      and.push({ 'teamMembers': { $exists: true, $ne: [] } });
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
      or.push({ 'description': searchRe });
      or.push({ 'teamLead': { $in: teamLeadIds } });
      or.push({ 'teamLeads': { $in: teamLeadIds } });

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

    if (req.query.limit) {
      var limit = Number(req.query.limit);
      if (req.query.page) {
        var page = Number(req.query.page);
        query.skip(limit*(page-1)).limit(limit);
      } else {
        query.limit(limit);
      }
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
        if(teams === null || teams === undefined || teams.length < 1) {
          res.json([]);
        } else {
          var updatedTeams = [];
          async.forEach(teams, function(team, teamCallback) {
            var updatedTeam = team ? team.toJSON() : {};
            addTeamPermissionsForCurrentUser(req, updatedTeam);
            if (req.query.full) {
              Expedition.count({ team: team, status: 'published' }).exec(function(err, expeditionCount) {
                updatedTeam.expeditionCount = expeditionCount || 0;
                updatedTeams.push(updatedTeam);
                teamCallback();
              });
            } else {
              updatedTeams.push(updatedTeam);
              teamCallback();
            }
          }, function(err) {
            console.log('err', err);
            res.json(updatedTeams);
          });
        }
      }
    });
  };

  var findTeamLeadIds = function(callback) {
    var query;
    var and = [];

    and.push({ roles: 'team lead' });

    var searchOr = [];
    var searchRe;

    if (req.query.searchString) {
      try {
        searchRe = new RegExp(req.query.searchString, 'i');
      } catch(e) {
        callback('Search string is invalid', null);
      }
      searchOr.push({ displayName: searchRe });
      searchOr.push({ firstName: searchRe });
      searchOr.push({ lastName: searchRe });
      searchOr.push({ username: searchRe });
      searchOr.push({ email: searchRe });

      and.push({ $or: searchOr });
    }

    if (and.length === 1) {
      query = User.find(and[0]);
    } else if (and.length > 0) {
      query = User.find({ $and: and });
    } else {
      query = User.find();
    }

    query.exec(function(err, teamLeads) {
      if (err) {
        callback(null, errorHandler.getErrorMessage(err));
      } else if (teamLeads && teamLeads.length > 0) {
        var teamLeadIds = [];
        for (var i = 0; i < teamLeads.length; i++) {
          teamLeadIds.push(teamLeads[i]._id);
        }
        callback(teamLeadIds);
      } else {
        callback([]);
      }
    });
  };

  if (req.query.searchString) {
    findTeamLeadIds(function(teamLeadIds, error) {
      searchQuery(teamLeadIds);
    });
  } else {
    searchQuery();
  }
};

exports.listMembers = function (req, res) {
  var queryTeam;
  var andTeam = [];

  if (req.query.byOwner) {
    andTeam.push({
      $or: [
        { 'teamLead': req.user },
        { 'teamLeads': req.user }
      ]
    });

  }
  if (req.query.teamId) {
    andTeam.push({ '_id': req.query.teamId });
  }

  if (andTeam.length === 1) {
    queryTeam = Team.find(andTeam[0]);
  } else if (andTeam.length > 0) {
    queryTeam = Team.find({ $and: andTeam });
  } else {
    queryTeam = Team.find();
  }

  queryTeam.populate('teamLead', 'displayName firstName email')
  .populate('teamLeads', 'displayName firstName email').exec(function (err, teams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if(teams !== undefined && teams !== null && teams.length > 0){
      var memberIds = [];
      for (var i = 0; i < teams.length; i++) {
        memberIds = memberIds.concat(teams[i].teamMembers);
        if (req.query.includeLeads) {
          memberIds.push(teams[i].teamLead);
          memberIds = memberIds.concat(teams[i].teamLeads);
        }
      }

      if (memberIds.length > 0) {
        var query;
        var and = [];

        memberIds = _.uniqWith(memberIds, function(a, b) {
          if (a && b) {
            var aId = (a._id) ? a._id.toString() : a.toString();
            var bId = (b._id) ? b._id.toString() : b.toString();
            return aId === bId;
          } else {
            return false;
          }
        });

        and.push({ '_id': { $in: memberIds } });

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

        if (req.query.sort) {
          if (req.query.sort === 'firstName') {
            query.sort({ 'firstName': 1 });
          } else if (req.query.sort === 'lastName') {
            query.sort({ 'lastName': 1 });
          }
        } else {
          query.sort('-create');
        }

        if (req.query.limit) {
          if (req.query.page) {
            var limit = Number(req.query.limit);
            var page = Number(req.query.page);
            query.skip(limit*(page-1)).limit(limit);
          }
        } else {
          var limit2 = Number(req.query.limit);
          query.limit(limit2);
        }

        query.exec(function (err, members) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else if(members && members.length > 0) {
            var usersWithTeam = [];
            async.forEach(members, function(member, callback) {
              Team.find({ 'teamMembers': member }).exec(function(err, teams) {
                var memberJSON = member.toJSON();
                if (teams && teams.length > 0) {
                  memberJSON.team = teams[0];
                }
                usersWithTeam.push(memberJSON);
                callback();
              });
            }, function(err) {
              res.json(usersWithTeam);
            });
          } else {
            res.json([]);
          }
        });
      } else {
        res.json([]);
      }
    }
  });
};

/**
 * Team middleware
 */
exports.teamByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Team is invalid'
    });
  }

  Team.findById(id).populate('teamLead', 'displayName firstName lastName username email profileImageURL roles schoolOrg')
  .populate('teamLeads', 'displayName firstName lastName username email profileImageURL roles schoolOrg teamLeadType pending')
  .populate('teamMembers', 'displayName firstName lastName username email profileImageURL roles schoolOrg pending')
  .populate('schoolOrg', 'name')
  .exec(function (err, team) {
    if (err) {
      return next(err);
    } else if (!team) {
      return res.status(404).send({
        message: 'No team with that identifier has been found'
      });
    }
    req.team = team;
    next();
  });
};

exports.memberByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Member is invalid'
    });
  }

  User.findById(id).exec(function (err, member) {
    if (err) {
      return next(err);
    } else if (!member) {
      return res.status(404).send({
        message: 'No member with that identifier has been found'
      });
    }
    req.member = member;
    next();
  });
};

exports.uploadTeamPhoto = function (req, res) {
  var team = req.team;
  var upload = multer(config.uploads.teamPhotoUpload).single('teamPhoto');
  var imageUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = imageUploadFileFilter;

  if (team) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.teamPhotoUpload,
      function(fileInfo) {
        team.photo = fileInfo;

        team.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            res.json(team);
          }
        });
      }, function(errorMessage) {
        return res.status(400).send({
          message: errorMessage
        });
      });
  } else {
    res.status(400).send({
      message: 'Team does not exist'
    });
  }
};

exports.readMember = function(req, res) {
  // convert mongoose document to JSON
  var member = req.member ? req.member.toJSON() : {};

  res.json(member);
};
