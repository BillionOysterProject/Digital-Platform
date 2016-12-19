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

/**
 * Show the current team
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var team = req.team ? req.team.toJSON() : {};

  // Add a custom field to the Team, for determining if the current User is the "lead".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Team model.
  team.isCurrentUserTeamLead = req.user && team.teamLead && team.teamLead._id &&
    team.teamLead._id.toString() === req.user._id.toString() ? true : false;

  if (!team.isCurrentUserTeamLead) {
    var indexL = _.findIndex(team.teamLeads, function(l) {
      var leadId = (l && l._id) ? l._id : l;
      return leadId.toString() === req.user._id.toString();
    });
    team.isCurrentUserTeamLead = (indexL > -1) ? true : false;
  }

  var indexM = _.findIndex(team.teamMembers, function(m) {
    var memberId = (m && m._id) ? m._id : m;
    return memberId.toString() === req.user._id.toString();
  });
  team.isCurrentUserTeamMember = (indexM > -1) ? true : false;

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

/**
 * Delete a team
 */
exports.delete = function (req, res) {
  var team = req.team;

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
 * List of Teams
 */
exports.list = function (req, res) {
  var searchQuery = function(teamLeadIds) {
    var query;
    var and = [];

    if (req.query.byOwner) {
      and.push({ 'teamLead': req.user });
    }

    if (req.query.byMember) {
      and.push({ 'teamMembers': req.user });
    }
    if (req.query.teamId) {
      and.push({ '_id': req.query.teamId });
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
        if (req.query.full) {
          var getExpeditionCount = function(team, callback) {
            Expedition.count({ team: team }).exec(function(err, expeditionCount) {
              if (err) {
                callback(0);
              } else {
                callback(expeditionCount);
              }
            });
          };

          var getORSCount = function(team, callback) {
            RestorationStation.count({ team: team }).exec(function(err, orsCount) {
              if (err) {
                callback(0);
              } else {
                callback(orsCount);
              }
            });
          };

          var getCounts = function(teams, index, callback) {
            if (index < teams.length) {
              var teamObj = teams[index];
              var team = teamObj ? teamObj.toJSON() : {};
              getExpeditionCount(team, function(expeditionCount) {
                getORSCount(team, function(orsCount) {
                  team.expeditionCount = expeditionCount;
                  team.orsCount = orsCount;
                  teams[index] = team;
                  getCounts(teams, index+1, callback);
                });
              });
            } else {
              callback();
            }
          };

          getCounts(teams, 0, function() {
            res.json(teams);
          });
        } else {
          res.json(teams);
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
    andTeam.push({ 'teamLead': req.user });
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

  queryTeam.populate('teamLead', 'displayName').exec(function (err, teams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var memberIds = [];
      for (var i = 0; i < teams.length; i++) {
        memberIds = memberIds.concat(teams[i].teamMembers);
      }

      if (memberIds.length > 0) {
        var query;
        var and = [];

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

        query.populate('teamLead', 'displayName').exec(function (err, members) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(members);
          }
        });
      } else {
        res.json({});
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
  .populate('teamLeads', 'displayName firstName lastName username email profileImageURL roles schoolOrg pending')
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

/**
 * Team Member methods
 */
var createMemberInternal = function(userJSON, schoolOrg, successCallback, errorCallback) {
  User.findOne({ 'email': userJSON.email }).exec(function(userErr, user) {
    if (userErr) {
      errorCallback(errorHandler.getErrorMessage(userErr));
    } else if (user) {
      successCallback(user);
    } else {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        //create user
        user = new User(userJSON);
        user.provider = 'local';
        user.displayName = user.firstName + ' ' + user.lastName;
        user.roles = ['team member pending', 'user'];
        user.pending = true;
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + (86400000 * 30); //30 days
        user.schoolOrg = schoolOrg;
        if (!user.username) user.username = user.email.substring(0, user.email.indexOf('@'));

        // Then save the user
        user.save(function (err) {
          if (err) {
            errorCallback(errorHandler.getErrorMessage(err));
          } else {
            successCallback(user, token);
          }
        });
      });
    }
  });
};

var sendInviteEmail = function(user, host, teamLeadName, teamName, token, successCallback, errorCallback) {
  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

  email.sendEmailTemplate(user.email, 'You\'ve been invited by ' + teamLeadName + ' to join the team ' + teamName,
  'member_invite', {
    FirstName: user.firstName,
    TeamLeadName: teamLeadName,
    TeamName: teamName,
    LinkCreateAccount: httpTransport + host + '/api/auth/claim-user/' + token
  }, function(info) {
    successCallback(info);
  }, function(errorMessage) {
    errorCallback('Failure sending email');
  });
};

var sendExistingInviteEmail = function(user, host, teamLeadName, teamName, successCallback, errorCallback) {
  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

  email.sendEmailTemplate(user.email, 'You\'ve been invited by ' + teamLeadName + ' to join the team ' + teamName,
  'member_existing_invite', {
    FirstName: user.firstName,
    TeamLeadName: teamLeadName,
    TeamName: teamName,
    LinkLogin: httpTransport + host + '/authentication/signin'
  }, function(info) {
    successCallback();
  }, function(errorMessage) {
    errorCallback('Failure sending email');
  });
};

var sendReminderInviteEmail = function(user, host, teamLeadName, teamName, token, successCallback, errorCallback) {
  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

  email.sendEmailTemplate(user.email, 'Reminder: You\'ve been invited by ' + teamLeadName + ' to join the team ' + teamName,
  'invite_reminder', {
    FirstName: user.firstName,
    TeamLeadName: teamLeadName,
    TeamName: teamName,
    LinkCreateAccount: httpTransport + host + '/api/auth/claim-user/' + token
  }, function(info) {
    successCallback();
  }, function(errorMessage) {
    errorCallback('Failure sending email');
  });
};

exports.createMember = function (req, res) {
  delete req.body.roles;

  createMemberInternal(req.body, req.user.schoolOrg,
    function(member, token) {
      if (req.body.newTeamName) {
        var teamJSON = {
          name: req.body.newTeamName,
          schoolOrg: req.user.schoolOrg,
          teamMembers: [member]
        };
        createInternal(teamJSON, req.user,
          function(team) {
            if (token) {
              sendInviteEmail(member, req.headers.host, req.user.displayName, team.name, token,
              function() {
                res.json(member);
              }, function() {
                res.json(member);
              });
            } else {
              sendExistingInviteEmail(member, req.headers.host, req.user.displayName, team.name,
              function() {
                res.json(member);
              }, function() {
                res.json(member);
              });
            }
          }, function(err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          });
      } else {
        Team.findById(req.body.team._id).exec(function (errTeam, team) {
          if (errTeam || !team) {
            return res.status(400).send({
              message: 'Error adding member to team'
            });
          } else {
            team.teamMembers.push(member);

            team.save(function (errSave) {
              if (errSave) {
                return res.status(400).send({
                  message: 'Error adding member to team'
                });
              } else {
                if (token) {
                  sendInviteEmail(member, req.headers.host, req.user.displayName, team.name, token,
                  function() {
                    res.json(member);
                  }, function() {
                    res.json(member);
                  });
                } else {
                  sendExistingInviteEmail(member, req.headers.host, req.user.displayName, team.name,
                  function() {
                    res.json(member);
                  }, function() {
                    res.json(member);
                  });
                }
              }
            });
          }
        });
      }
    }, function(err) {
      return res.status(400).send({
        message: err
      });
    });
};

exports.updateMember = function (req, res) {
  var member = req.member;
  var changeTeam = function() {
    Team.findById(req.body.oldTeamId).exec(function (errDelTeam, delTeam) {
      if (errDelTeam) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(errDelTeam)
        });
      } else {
        var index = delTeam.teamMembers ? delTeam.teamMembers.indexOf(member._id) : -1;
        if (index > -1) {
          delTeam.teamMembers.splice(index, 1);

          delTeam.save(function (delSaveErr) {
            if (delSaveErr) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(delSaveErr)
              });
            } else {
              if (req.body.newTeamName) {
                var teamJSON = {
                  name: req.body.newTeamName,
                  schoolOrg: req.user.schoolOrg,
                  teamMembers: [member]
                };
                createInternal(teamJSON, req.user,
                  function(team) {
                    res.json(member);
                  }, function(err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  });
              } else {
                Team.findById(req.body.team._id).exec(function (errTeam, team) {
                  if (errTeam || !team) {
                    return res.status(400).send({
                      message: 'Error adding member to team'
                    });
                  } else {
                    team.teamMembers.push(member);

                    team.save(function (errSave) {
                      if (errSave) {
                        return res.status(400).send({
                          message: 'Error adding member to team'
                        });
                      } else {
                        res.json(member);
                      }
                    });
                  }
                });
              }
            }
          });
        } else {
          return res.status(400).send({
            message: 'Could not remove member from previous team'
          });
        }
      }
    });
  };

  if (member) {
    member = _.extend(member, req.body);
    member.displayName = member.firstName + ' ' + member.lastName;

    member.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        if (req.member.email !== req.body.email) {
          sendInviteEmail(member, req.headers.host, member.displayName, req.body.team.name, member.resetPasswordToken,
          function() {
            if (req.body.oldTeamId !== req.body.team._id) {
              changeTeam();
            } else {
              res.json(member);
            }
          }, function() {
            if (req.body.oldTeamId !== req.body.team._id) {
              changeTeam();
            } else {
              res.json(member);
            }
          });
        } else if (req.body.oldTeamId !== req.body.team._id) {
          changeTeam();
        } else {
          res.json(member);
        }
      }
    });
  } else {
    return res.status(400).send({
      message: 'Could not find member'
    });
  }
};

exports.remindMember = function (req, res) {
  var member = req.member;
  User.findById(member._id).exec(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (user) {
      if (user.resetPasswordToken) {
        sendReminderInviteEmail(member, req.headers.host, req.user.displayName, req.body.team.name, user.resetPasswordToken,
        function() {
          res.json(member);
        }, function() {
          res.json(member);
        });
      } else {
        crypto.randomBytes(20, function (err, buffer) {
          var token = buffer.toString('hex');
          //create user
          user.pending = true;
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + (86400000 * 30); //30 days

          // Then save the user
          user.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              sendReminderInviteEmail(member, req.headers.host, req.user.displayName, req.body.team.name, user.resetPasswordToken,
              function() {
                res.json(member);
              }, function() {
                res.json(member);
              });
            }
          });
        });
      }
    } else {
      return res.status(400).send({
        message: 'Member not found'
      });
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

  // Remove the user from the team
  var mIndex = memberIndex(member, team);
  if (mIndex > -1) {
    removeMemberFromTeam(team, mIndex, function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        Team.find({ $or:[{ 'teamMembers': member }, { 'teamLead': member }] }).exec(function(err, teams) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else if (teams && teams.length > 0) {
            res.json(member);
          } else {
            deleteUser();
          }
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Member was not found in team'
    });
  }
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
      var email = memberJSON.email;
      var username = email.substring(0, email.indexOf('@'));
      User.find({ $or: [{ 'email': email },{ 'username': username }] }).exec(function(userErr, users) {
        if (userErr) {
          return res.status(400).send({
            message: userErr
          });
        } else {
          if (users && users.length > 0) {
            var nameIndex = _.findIndex(users, function(u) {
              return u.username === username;
            });

            var emailIndex = _.findIndex(users, function(u) {
              return u.email === email;
            });

            if (nameIndex > -1 && emailIndex === -1) {
              return res.status(400).send({
                message: 'Email address is already in use'
              });
            } else if (nameIndex === -1 && emailIndex > -1) {
              return res.status(400).send({
                message: 'Username is already in use'
              });
            } else {
              return res.status(400).send({
                message: 'Username and email address is already in use'
              });
            }
          } else {
            return res.status(200).send({
              message: 'Valid member'
            });
          }
        }
      });
    }, function (err) {
      return res.status(400).send({
        message: err
      });
    });
};

exports.createMemberCsv = function (req, res) {
  convertCsvMember(req.body.member,
    function(memberJSON) {
      createMemberInternal(memberJSON, req.user.schoolOrg,
        function(member, token) {
          if (req.body.newTeamName) {
            Team.findOne({ 'name': req.body.newTeamName }, function (teamByNameErr, teamByName) {
              if (teamByNameErr) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(teamByNameErr)
                });
              } else if (teamByName) {
                teamByName.teamMembers.push(member);

                teamByName.save(function (errSave) {
                  if (errSave) {
                    return res.status(400).send({
                      message: 'Error adding member to team'
                    });
                  } else {
                    if (token) {
                      sendInviteEmail(member, req.headers.host, req.user.displayName, teamByName.name, token,
                      function() {
                        res.json(member);
                      }, function() {
                        res.json(member);
                      });
                    } else {
                      res.json(member);
                    }
                  }
                });
              } else {
                var teamJSON = {
                  name: req.body.newTeamName,
                  schoolOrg: req.user.schoolOrg,
                  teamMembers: [member]
                };

                createInternal(teamJSON, req.user,
                  function(team) {
                    if (token) {
                      sendInviteEmail(member, req.headers.host, req.user.displayName, team.name, token,
                      function() {
                        res.json(member);
                      }, function() {
                        res.json(member);
                      });
                    } else {
                      res.json(member);
                    }
                  }, function(err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  });
              }
            });
          } else {
            Team.findById(req.body.teamId).exec(function (errTeam, team) {
              if (errTeam || !team) {
                return res.status(400).send({
                  message: 'Error adding member to team'
                });
              } else {
                team.teamMembers.push(member);

                team.save(function (errSave) {
                  if (errSave) {
                    return res.status(400).send({
                      message: 'Error adding member to team'
                    });
                  } else {
                    if (token) {
                      sendInviteEmail(member, req.headers.host, req.user.displayName, team.name, token,
                      function() {
                        res.json(member);
                      }, function() {
                        res.json(member);
                      });
                    } else {
                      res.json(member);
                    }
                  }
                });
              }
            });
          }
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

exports.readMember = function(req, res) {
  // convert mongoose document to JSON
  var member = req.member ? req.member.toJSON() : {};

  res.json(member);
};
