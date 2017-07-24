'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  SchoolOrg = mongoose.model('SchoolOrg'),
  Team = mongoose.model('Team'),
  TeamRequest = mongoose.model('TeamRequest'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  _ = require('lodash'),
  queryString = require('query-string'),
  async = require('async'),
  crypto = require('crypto');

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;
  user.teamLeadType = req.body.teamLeadType;
  user.schoolOrg = req.body.schoolOrg;

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

var hasRole = function(user, role) {
  var index = _.findIndex(user.roles, function(r) {
    return r === role;
  });
  return (index > -1) ? true : false;
};

var isAdmin = function(user) {
  return hasRole(user, 'admin');
};

//call this when appropriate references to the user have been deleted
//and it's safe to remove the object from the user table
var deleteUserInternal = function(user, res) {
  user.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  //TODO: should we be deleting everything in the db that the user did???
  //like useractivities, expeditions, protocols, expeditionactivities, glosarries,
  //lessons, event registration/attendance???

  //check if the user is a team lead or team member
  if(hasRole(user, 'team lead') || hasRole(user, 'team lead pending') || hasRole(user, 'admin')) {
    //if the user is a team lead and they are associated with any teams,
    //throw an error that we cannot delete them. The team must be
    //deleted or assigned to another user as teamLead before we could delete this user.

    //TODO: this will have to change when teams can have multiple leads
    Team.find({ 'teamLead': user._id }).exec(function(err, team) {
      if (err) {
        return res.status(400).send({
          message: 'Could not find teams associated with team lead ' + user.displayName +
            '. Error is: ' + errorHandler.getErrorMessage(err)
        });
      } else {
        if(team !== null && team !== undefined && team.length > 0) {
          return res.status(400).send({
            message: 'User ' + user.displayName + ' is a team lead for ' + team.name + '. ' +
            'The team must be deleted or re-assigned to a different team lead before this ' +
            'user can be deleted.'
          });
        } else {
          deleteUserInternal(user, res);
        }
      }
    });
  } else if(hasRole(user, 'team member') || hasRole(user, 'team member pending')) {
    //delete any team requests for this user
    TeamRequest.find({ 'requester': user._id }).exec(function(err, teamRequests) {
      if(err) {
        return res.status(400).send({
          message: 'Could not find team requests associated with user ' + user.displayName +
            '. Error is: ' + errorHandler.getErrorMessage(err)
        });
      } else {
        if(teamRequests !== undefined && teamRequests !== null && teamRequests.length > 0) {
          var removeTeamRequest = function(teamRequest) {
            teamRequest.remove(function (err) {
              if (err) {
                return res.status(400).send({
                  message: 'Error deleting team request for user ' + user.displayName +
                    '. Error was: ' + errorHandler.getErrorMessage(err)
                });
              }
            });
          };
          for(var i = 0; i < teamRequests.length; i++) {
            removeTeamRequest(teamRequests[i]);
          }
        }

        //if the user is a team member, delete the reference to them from the
        //teamMembers list in the Team model
        Team.find({ 'teamMembers': user._id }).exec(function(err, teams) {
          if (err) {
            return res.status(400).send({
              message: 'Could not find teams associated with user ' + user.displayName +
                '. Error is: ' + errorHandler.getErrorMessage(err)
            });
          } else {
            var memberIndex = function(member, team) {
              var index = _.findIndex(team.teamMembers, function(m) {
                return m.toString() === member._id.toString();
              });
              return index;
            };
            var delTeamMember = function(user, team) {
              team.save(function (delSaveErr) {
                if (delSaveErr) {
                  return res.status(400).send({
                    message: 'Could not delete user as member from team ' + team.name + '. Error is: ' + delSaveErr
                  });
                } else {
                  deleteUserInternal(user, res);
                }
              });
            };
            if(teams === null || teams === undefined || teams.length === 0) {
              deleteUserInternal(user, res);
            } else {
              for(var i = 0; i < teams.length; i++) {
                var team = teams[i];
                var index = memberIndex(user, team);
                if(index > -1) {
                  team.teamMembers.splice(index, 1);
                  delTeamMember(user, team);
                }
              }
            }
          }
        });
      }
    });
  }
};

exports.approve = function (req, res) {
  var user = req.model;

  if (isAdmin(req.user)) {
    var index = _.findIndex(user.roles, function(r) {
      return r === 'team lead pending';
    });
    if (index > -1) {
      user.roles.splice(index, 1);
    }
    user.roles.push('team lead');

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

        email.sendEmailTemplate(user.email, 'Your request to be a Team Lead  on The Billion Oyster Project was approved',
        'lead_approved', {
          FirstName: user.firstName,
          LinkLogin: httpTransport + req.headers.host + '/authentication/signin',
          LinkProfile: httpTransport + req.headers.host + '/profiles'
        }, function(info) {
          res.json(user);
        }, function(errorMessage) {
          res.json(user);
        });
      }
    });
  } else {
    return res.status(403).send({
      message: 'Permission denied'
    });
  }
};

exports.deny = function(req, res) {
  var user = req.model;

  if (isAdmin(req.user)) {
    user.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      res.json(user);
    });
  } else {
    return res.status(403).send({
      message: 'Permission denied'
    });
  }
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  var query;
  var queryCount;
  var and = [];
  var admin = isAdmin(req.user);

  if (req.query.role && req.query.role !== undefined && req.query.role !== null && req.query.role !== '') {
    if (admin) {
      if (req.query.role === 'team lead') {
        and.push({ $or: [{ 'roles': 'team lead' }, { 'roles': 'team lead pending' }] });
      } else if (req.query.role === 'team member') {
        and.push({ $or: [{ 'roles': 'team member' }, { 'roles': 'team member pending' }] });
      } else {
        and.push({ 'roles': req.query.role });
      }
    } else {
      and.push({ 'roles': req.query.role });
      and.push({ 'roles': { $nin: ['admin', 'team lead pending', 'team member pending'] } });
    }
  } else {
    if (admin) {
      and.push({ $or: [{ 'roles': 'admin' }, { 'roles': 'team lead' }, { 'roles': 'team lead pending' },
      { 'roles': 'team member' }, { 'roles': 'team member pending' }, { 'roles': 'partner' }] });
    } else {
      and.push({ $or: [{ 'roles': 'team lead' }, { 'roles': 'team member' }, { 'roles': 'partner' }] });
      and.push({ 'roles': { $nin: ['admin', 'team lead pending', 'team member pending'] } });
    }
  }

  if (req.query.teamLeadType) {
    and.push({ 'teamLeadType': req.query.teamLeadType });
  }

  if (req.query.organizationId) {
    and.push({ 'schoolOrg': req.query.organizationId });
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
    queryCount = User.find(and[0], '-salt -password');
  } else if (and.length > 0) {
    query = User.find({ $and: and }, '-salt -password');
    queryCount = User.find({ $and: and }, '-salt -password');
  } else {
    query = User.find({}, '-salt -password');
    queryCount = User.find({}, '-salt -password');
  }

  queryCount.count().exec(function(err, count) {
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
      var limit = Number(req.query.limit);
      if (req.query.page) {
        var page = Number(req.query.page);
        query.skip(limit*(page-1)).limit(limit);
      } else {
        query.limit(limit);
      }
    }

    query.populate('user', 'displayName email roles profileImageURL')
    .populate('schoolOrg', 'name pending streetAddress city state description').exec(function (err, users) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      if (req.query.showTeams) {
        if (users && users.length > 0) {
          var updatedUsers = [];
          async.forEach(users, function(user, callback) {
            var queryTeam;
            var userJSON = user ? user.toJSON() : {};
            if (hasRole(userJSON, 'team member')) {
              queryTeam = Team.find({ 'teamMembers': userJSON });
            } else {
              queryTeam = Team.find({ 'teamLead': userJSON });
            }
            queryTeam.populate('teamMembers', 'displayName profileImageURL email username')
            .populate('teamLead', 'displayName profileImageURL email')
            .populate('schoolOrg', 'name')
            .exec(function(err, teams) {
              userJSON.teams = teams;
              updatedUsers.push(userJSON);
              callback();
            });
          }, function(err) {
            res.json({
              totalCount: count,
              users: updatedUsers
            });
          });
        } else {
          res.json({
            totalCount: count,
            users: users
          });
        }
      } else {
        res.json({
          totalCount: count,
          users: users
        });
      }
    });
  });
};

/**
 * List of Team Leads
 */
exports.listTeamLeads = function (req, res) {
  if (req.query.teamId) {
    Team.findById(req.query.teamId).exec(function (err, team) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (team) {
        var teamLeads = [team.teamLead];
        teamLeads = teamLeads.concat(team.teamLeads);

        User.find({ '_id': { $in: teamLeads } }).exec(function(err, users) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(users);
          }
        });
      } else {
        res.json([]);
      }
    });
  } else {
    var query;
    var and = [{ 'roles': 'team lead' }];

    if (req.query.organizationId) {
      and.push({ 'schoolOrg': req.query.organizationId });
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
      var limit = Number(req.query.limit);
      if (req.query.page) {
        var page = Number(req.query.page);
        query.skip(limit*(page-1)).limit(limit);
      } else {
        query.limit(limit);
      }
    }

    query.populate('user', 'displayName email profileImageURL')
    .populate('schoolOrg', 'name pending').exec(function (err, users) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(users);
      }
    });
  }
};


/**
 * User middleware
 */
exports.userByUsername = function (req, res) {
  var username = req.query.username;

  User.findOne({ 'username': username }, '-salt -password').populate('schoolOrg').exec(function (err, user) {
    if (err) {
      res.status(400).send({
        message: err
      });
    } else {
      res.json(user);
    }
  });
};

exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').populate('schoolOrg').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};

// inviting users
var createUserInternal = function(userJSON, schoolOrg, role, successCallback, errorCallback) {
  User.findOne({ 'email': userJSON.email }).exec(function(userErr, user) {
    if (userErr) {
      console.log('finding a user', userErr);
      errorCallback(errorHandler.getErrorMessage(userErr));
    } else if (user) {
      //if the user doesn't have the role specified, add it
      var roleIndex = function(user, role) {
        var index = _.findIndex(user.roles, function(r) {
          return r.toString() === role.toString();
        });
        return index;
      };

      if(roleIndex(user, role) >= 0) {
        successCallback(user);
      } else {
        //the user doesn't have the role - add it
        user.roles.push(role);
        user.save(function (err) {
          if (err) {
            console.log('user saver err', err);
            errorCallback(errorHandler.getErrorMessage(err));
          } else {
            successCallback(user);
          }
        });
      }
    } else {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        // create user
        user = new User(userJSON);
        user.provider = 'local';
        user.displayName = user.firstName + ' ' + user.lastName;
        user.roles = [role, 'user'];
        user.pending = true;
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + (86400000 * 30); //30 days
        user.schoolOrg = schoolOrg;
        if (!user.username) user.username = user.email.substring(0, user.email.indexOf('@'));

        // Then save the user
        user.save(function (err) {
          if (err) {
            console.log('create new user save err', err);
            errorCallback(errorHandler.getErrorMessage(err));
          } else {
            successCallback(user, token);
          }
        });
      });
    }
  });
};

var updateUserInternal = function(user, userJSON, successCallback, errorCallback) {
  if (user) {
    user.firstName = userJSON.firstName;
    user.lastName = userJSON.lastName;
    user.displayName = user.firstName + ' ' + user.lastName;
    user.email = userJSON.email;
    user.teamLeadType = userJSON.teamLeadType;
    user.schoolOrg = userJSON.schoolOrg;
    if (userJSON.roles) user.roles = userJSON.roles;
    user.researchInterests = userJSON.researchInterests;

    user.save(function (err) {
      if (err) {
        errorCallback(errorHandler.getErrorMessage(err));
      } else {
        successCallback(user);
      }
    });
  } else {
    errorCallback('Could not find user to update');
  }
};


var sendInviteEmail = function(user, host, leadName, teamOrOrg, teamOrOrgName, memberOrLead, token, successCallback, errorCallback) {
  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

  var usernameParams = queryString.stringify({ username: user.username });

  email.sendEmailTemplate(user.email, 'You\'ve been invited by ' + leadName + ' to be a ' + memberOrLead + ' of the ' +
  teamOrOrg + ' ' + teamOrOrgName, 'member_invite', {
    FirstName: user.firstName,
    LeadName: leadName,
    TeamOrOrg: teamOrOrg,
    TeamOrOrgName: teamOrOrgName,
    MemberOrLead: memberOrLead,
    Username: user.username,
    LinkCreateAccount: httpTransport + host + '/api/auth/claim-user/' + token + '?' + usernameParams
  }, function(info) {
    successCallback(info);
  }, function(errorMessage) {
    errorCallback('Failure sending email');
  });
};

var sendExistingInviteEmail = function(user, host, leadName, teamOrOrg, teamOrOrgName, memberOrLead, successCallback, errorCallback) {
  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

  email.sendEmailTemplate(user.email, 'You\'ve been invited by ' + leadName + ' to be a ' + memberOrLead + ' of the ' +
  teamOrOrg + ' ' + teamOrOrgName, 'member_existing_invite', {
    FirstName: user.firstName,
    LeadName: leadName,
    TeamOrOrg: teamOrOrg,
    TeamOrOrgName: teamOrOrgName,
    MemberOrLead: memberOrLead,
    LinkLogin: httpTransport + host + '/authentication/signin'
  }, function(info) {
    successCallback();
  }, function(errorMessage) {
    errorCallback('Failure sending email');
  });
};

var addToTeamOrOrg = function(user, team, schoolOrg, role, teamOrOrg, successCallback, errorCallback) {
  if (teamOrOrg === 'team') {
    var teamId = (team && team._id) ? team._id : team;
    Team.findById(teamId).exec(function(err, team) {
      if (err) {
        console.log('find team err', err);
        errorCallback(err);
      } else {
        var memberIndex = function(member, team) {
          var index = _.findIndex(team.teamMembers, function(m) {
            return m.toString() === member._id.toString();
          });
          return index;
        };

        var leadIndex = function(lead, team) {
          var index = _.findIndex(team.teamLeads, function(l) {
            return l.toString() === lead._id.toString();
          });
          return index;
        };

        if(memberIndex(user, team) >= 0 || leadIndex(user, team) >= 0) {
          errorCallback('The user ' + user.username + ' already exists in the team ' + team.name);
        } else {
          if (role === 'team member pending') {
            team.teamMembers.push(user);
          } else if (role === 'team lead pending') {
            team.teamLeads.push(user);
          }
          team.save(function(err) {
            if (err) {
              console.log('team saving err', err);
              errorCallback(err);
            }
            successCallback(team, schoolOrg);
          });
        }
      }
    });
  } else if (teamOrOrg === 'organization') {
    var schoolOrgId = (schoolOrg && schoolOrg._id) ? schoolOrg._id : schoolOrg;
    SchoolOrg.findById(schoolOrgId).exec(function(err, schoolOrg) {
      if (err) {
        console.log('find org err', err);
        errorCallback(err);
      } else {
        var leadIndex = function(user, org) {
          var index = _.findIndex(org.orgLeads, function(l) {
            return l.toString() === user._id.toString();
          });
          return index;
        };

        if(leadIndex(user, schoolOrg) >= 0) {
          errorCallback('The user ' + user.username + ' already exists in the organization ' + schoolOrg.name);
        } else {
          schoolOrg.orgLeads.push(user);
          schoolOrg.save(function(err) {
            if (err) {
              console.log('org save err', err);
              errorCallback(err);
            }
            successCallback(null, schoolOrg);
          });
        }
      }
    });
  }
};

var removeFromArray = function(user, array) {
  var index = _.findIndex(array, function(n) {
    var id = (n && n._id) ? n._id : n;
    return id.toString() === user._id.toString();
  });
  array.splice(index, 1);
  return array;
};

var removeFromTeamOrOrg = function(user, team, schoolOrg, role, teamOrOrg, successCallback, errorCallback) {
  if (teamOrOrg === 'team') {
    var teamId = (team && team._id) ? team._id : team;
    Team.findById(teamId).exec(function(err, team) {
      if (err) {
        errorCallback(err);
      } else {
        if (role === 'team member pending' || role === 'team member') {
          team.teamMembers = removeFromArray(user, team.teamMembers);
        } else if (role === 'team lead pending' || role === 'team lead') {
          team.teamLeads = removeFromArray(user, team.teamLeads);
        }
        team.save(function(err) {
          if (err) {
            errorCallback(err);
          }
          successCallback(team, schoolOrg);
        });
      }
    });
  } else if (teamOrOrg === 'organization') {
    var schoolOrgId = (schoolOrg && schoolOrg._id) ? schoolOrg._id : schoolOrg;
    SchoolOrg.findById(schoolOrgId).exec(function(err, schoolOrg) {
      if (err) {
        errorCallback(err);
      } else {
        schoolOrg.orgLeads = removeFromArray(user, schoolOrg.orgLeads);
        schoolOrg.save(function(err) {
          if (err) {
            errorCallback(err);
          }
          successCallback(null, schoolOrg);
        });
      }
    });
  }
};

exports.createUser = function (req, res) {
  delete req.body.user.roles;
  var teamOrOrg = req.body.teamOrOrg;
  var role = req.body.role;

  createUserInternal(req.body.user, req.body.organization, role,
    function(user, token) {
      addToTeamOrOrg (user, req.body.team, req.body.organization, role, teamOrOrg,
        function(team, schoolOrg) {
          var teamOrOrgName = (teamOrOrg === 'team' && team) ? team.name : schoolOrg.name;
          var memberOrLead = (hasRole(user, 'team lead') || hasRole(user, 'team lead pending')) ? 'lead' : 'member';
          if (token) {
            sendInviteEmail(user, req.headers.host, req.user.displayName, teamOrOrg, teamOrOrgName, memberOrLead, token,
              function() {
                res.json(user);
              }, function() {
                res.json(user);
              });
          } else {
            sendExistingInviteEmail(user, req.headers.host, req.user.displayName, teamOrOrg, teamOrOrgName, memberOrLead,
              function() {
                res.json(user);
              }, function() {
                res.json(user);
              });
          }
        }, function(errorMessage) {
          console.log('addToTeamOrOrg', errorMessage);
          return res.status(400).send({
            message: errorMessage
          });
        });
    }, function(errorMessage) {
      console.log('createUserInternal', errorMessage);
      return res.status(400).send({
        message: errorMessage
      });
    });
};

exports.updateUser = function (req, res) {
  delete req.body.user.roles;
  var existingUser = req.model;

  var teamOrOrg = req.body.teamOrOrg;
  var role = req.body.role;
  var oldSchoolOrg = req.body.oldOrganization;
  var newSchoolOrg = (req.body.newOrganization) ? req.body.newOrganization : req.body.oldOrganization;
  var oldTeam = req.body.oldTeam;
  var newTeam = req.body.newTeam;

  updateUserInternal(existingUser, req.body.user,
    function(user) {
      if (teamOrOrg === 'team' && oldTeam && newTeam) {
        var oldTeamId = (oldTeam && oldTeam._id) ? oldTeam._id : oldTeam;
        var newTeamId = (newTeam && newTeam._id) ? newTeam._id : newTeam;
        if (oldTeamId.toString() !== newTeamId.toString()) {
          removeFromTeamOrOrg(user, oldTeamId, oldSchoolOrg, role, teamOrOrg,
            function(team, schoolOrg) {
              addToTeamOrOrg(user, newTeamId, newSchoolOrg, role, teamOrOrg,
                function(team, schoolOrg) {
                  res.json(user);
                }, function(errorMessage) {
                  return res.status(400).send({
                    message: errorMessage
                  });
                });
            }, function(errorMessage) {
              return res.status(400).send({
                message: errorMessage
              });
            });
        } else {
          res.json(user);
        }
      } else if (teamOrOrg === 'organization' && oldSchoolOrg && newSchoolOrg) {
        var oldSchoolOrgId = (oldSchoolOrg && oldSchoolOrg._id) ? oldSchoolOrg._id : oldSchoolOrg;
        var newSchoolOrgId = (newSchoolOrg && newSchoolOrg._id) ? newSchoolOrg._id : newSchoolOrg;
        if (oldSchoolOrgId.toString() !== newSchoolOrgId.toString()) {
          removeFromTeamOrOrg(user, oldTeam, oldSchoolOrgId, role, teamOrOrg,
            function(team, schoolOrg) {
              addToTeamOrOrg(user, newTeam, newSchoolOrgId, role, teamOrOrg,
                function(team, schoolOrg) {
                  res.json(user);
                }, function(errorMessage) {
                  return res.status(400).send({
                    message: errorMessage
                  });
                });
            }, function(errorMessage) {
              return res.status(400).send({
                message: errorMessage
              });
            });
        } else {
          res.json(user);
        }
      } else {
        res.json(user);
      }
    }, function(errorMessage) {
      return res.status(400).send({
        message: errorMessage
      });
    });
};

var sendReminderInviteEmail = function(user, host, leadName, teamOrOrg, teamOrOrgName, token, successCallback, errorCallback) {
  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

  var usernameParams = queryString.stringify({ username: user.username });

  email.sendEmailTemplate(user.email, 'Reminder: You\'ve been invited by ' + leadName + ' to join the ' + teamOrOrg + ' ' + teamOrOrgName,
  'invite_reminder', {
    FirstName: user.firstName,
    LeadName: leadName,
    TeamOrOrg: teamOrOrg,
    TeamOrOrgName: teamOrOrgName,
    Username: user.username,
    LinkCreateAccount: httpTransport + host + '/api/auth/claim-user/' + token + '?' + usernameParams,
    LinkProfile: httpTransport + host + '/profiles'
  }, function(info) {
    successCallback();
  }, function(errorMessage) {
    errorCallback('Failure sending email');
  });
};

exports.remindInvitee = function (req, res) {
  var user = req.model;
  var teamOrOrg = req.body.teamOrOrg;
  var role = req.body.role;
  var team = req.body.team;
  var schoolOrg = req.body.organization;

  var teamOrOrgName = (teamOrOrg === 'team' && team) ? team.name : schoolOrg.name;
  if (user.resetPasswordToken) {
    sendReminderInviteEmail(user, req.headers.host, req.user.displayName, teamOrOrg, teamOrOrgName, user.resetPasswordToken,
      function() {
        res.json(user);
      }, function(errorMessage) {
        res.json(user);
      });
  } else {
    if (user.pending === true) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        // update user
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + (86400000 * 30); //30 days

        // Then save the user
        user.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            sendReminderInviteEmail(user, req.headers.host, req.user.displayName, teamOrOrg, teamOrOrgName, token,
              function() {
                res.json(user);
              }, function(errorMessage) {
                res.json(user);
              });
          }
        });
      });
    }
  }
};

exports.deleteTeamLead = function (req, res) {
  var user = req.model;
  var team = req.team;

  if(team.teamLeads !== null && team.teamLeads !== undefined &&
    team.teamLeads.length === 1) {
    return res.status(400).send({
      message: 'There are no other team leads for ' + team.name + '.' +
        ' Please assign an additional team lead before deleting ' + user.username
    });
  }

  removeFromTeamOrOrg(user, team, null, 'team lead', 'team',
    function(team, schoolOrg) {
      res.json(team);
    }, function(err) {
      return res.status(400).send({
        message: 'Error removing team lead: ' + errorHandler.getErrorMessage(err)
      });
    });
};

exports.deleteOrgLead = function (req, res) {
  var user = req.model;
  var schoolOrg = req.schoolOrg;

  if(schoolOrg.orgLeads !== null && schoolOrg.orgLeads !== undefined &&
    schoolOrg.orgLeads.length === 1) {
    return res.status(400).send({
      message: 'There are no other org leads for ' + schoolOrg.name + '.' +
        ' Please assign an additional org lead before deleting ' + user.username
    });
  }

  removeFromTeamOrOrg(user, null, schoolOrg, 'org lead', 'organization',
    function(team, schoolOrg) {
      res.json(schoolOrg);
    }, function(err) {
      return res.status(400).send({
        message: 'Error removing org lead: ' + errorHandler.getErrorMessage(err)
      });
    });
};

exports.downloadMemberBulkFile = function(req, res) {
  var csvHeader = ['First Name *', 'Last Name *', 'Username', 'Email *'];

  var csvString = csvHeader.join() + '\n' + 'John,Doe,jdoe,jdoe@email.com';

  res.setHeader('Content-disposition', 'attachment; filename=employees.csv');
  res.setHeader('content-type', 'text/csv');
  res.send(csvString);
};

var convertCsvMember = function(csvMember, successCallback, errorCallback) {
  var memberValues = {
    firstName: csvMember['First Name *'],
    lastName: csvMember['Last Name *'],
    email: csvMember['Email *']
  };

  if (csvMember.Username) {
    memberValues.username = csvMember.Username;
  }

  if (memberValues.firstName && memberValues.lastName && memberValues.email) {
    successCallback(memberValues);
  } else {
    errorCallback('Error converting member from csv');
  }
};

exports.validateMemberCsv = function (req, res) {
  convertCsvMember(req.body.member,
    function(memberJSON) {
      var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var email = memberJSON.email;
      var username = (memberJSON.username) ? memberJSON.username : email.substring(0, email.indexOf('@'));
      if(!pattern.test(email)) {
        return res.status(400).send({
          message: 'Email is invalid'
        });
      } else {
        User.find({ $or: [{ 'email': email },{ 'username': username }] }).exec(function(userErr, users) {
          if (userErr) {
            return res.status(400).send({
              message: userErr
            });
          } else {
            if (users && users.length > 0) {
              var nameIndex = _.findIndex(users, function(u) {
                return u.username === memberJSON.username;
              });

              var emailIndex = _.findIndex(users, function(u) {
                return u.email === email;
              });

              if (nameIndex > -1 && emailIndex === -1) {
                return res.status(400).send({
                  message: 'Username is already in use'
                });
              } else if (nameIndex === -1 && emailIndex > -1) {
                return res.status(400).send({
                  message: 'Email is already in use'
                });
              } else {
                return res.status(400).send({
                  message: 'Username and email address are already in use'
                });
              }
            } else {
              return res.status(200).send({
                message: 'Valid member'
              });
            }
          }
        });
      }
    }, function (err) {
      return res.status(400).send({
        message: err
      });
    });
};

exports.createMemberCsv = function (req, res) {
  var teamOrOrg = req.body.teamOrOrg;
  var role = req.body.role;

  convertCsvMember(req.body.user,
    function(userJSON) {
      createUserInternal(userJSON, req.body.organization, role,
        function(user, token) {
          addToTeamOrOrg(user, req.body.team, req.body.organization, role, teamOrOrg,
            function(team, schoolOrg) {
              var teamOrOrgName = (teamOrOrg === 'team' && team) ? team.name : schoolOrg.name;
              var memberOrLead = (hasRole(user, 'team lead') || hasRole(user, 'team lead pending')) ? 'lead' : 'member';
              if (token) {
                sendInviteEmail(user, req.headers.host, req.user.displayName, teamOrOrg, teamOrOrgName, memberOrLead, token,
                  function() {
                    res.json(user);
                  }, function() {
                    res.json(user);
                  });
              } else {
                sendExistingInviteEmail(user, req.headers.host, req.user.displayName, teamOrOrg, teamOrOrgName, memberOrLead,
                  function() {
                    res.json(user);
                  }, function() {
                    res.json(user);
                  });
              }
            });
        }, function(err) {
          return res.status(400).send({
            message: err
          });
        });
    }, function (err) {
      return res.status(400).send({
        message: err
      });
    });
};
