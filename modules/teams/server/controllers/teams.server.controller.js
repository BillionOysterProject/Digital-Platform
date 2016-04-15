'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a team
 */
var createInternal = function(teamJSON, user, successCallback, errorCallback) {
  var team = new Team(teamJSON);
  team.teamLead = user;

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
  team.isCurrentUserTeamLead = req.user && team.teamLead && team.teamLead._id && team.teamLead._id.toString() === req.user._id.toString() ? true : false;

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
    if (req.query.page) {
      query.skip(req.query.limit*(req.query.page-1)).limit(req.query.limit);
    }
  } else {
    query.limit(req.query.limit);
  }

  query.populate('teamMembers', 'displayName firstName lastName username email profileImageURL pending')
  .populate('teamLead', 'displayName profileImageURL').populate('schoolOrg').exec(function (err, teams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teams);
    }
  });
};

exports.listMembers = function (req, res) {
  var query;
  var and = [];

  if (req.query.byOwner) {
    and.push({ 'teamLead': req.user });
  }
  if (req.query.teamId) {
    and.push({ '_id': req.query.teamId });
  }

  var searchRe;
  var or = [];
  if (req.query.searchString) {
    searchRe = new RegExp(req.query.searchString, 'i');
    or.push({ 'displayName': searchRe });
    or.push({ 'email': searchRe });
    or.push({ 'username': searchRe });

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
    if (req.query.page) {
      var limit = Number(req.query.limit);
      var page = Number(req.query.page);
      query.skip(limit*(page-1)).limit(limit);
    }
  } else {
    var limit2 = Number(req.query.limit);
    query.limit(limit2);
  }

  query.populate('teamMembers', 'displayName firstName lastName username email profileImageURL pending')
  .populate('teamLead', 'displayName').exec(function (err, teams) {
    if (err) {
      console.log('error', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var members = [];
      for (var i = 0; i < teams.length; i++) {
        var team = teams[i];
        for (var j = 0; j < team.teamMembers.length; j++) {
          var member = team.teamMembers[j];
          members.push({
            _id: member._id,
            displayName: member.displayName,
            firstName: member.firstName,
            lastName: member.lastName,
            username: member.username,
            email: member.email,
            profileImageURL: member.profileImageURL,
            pending: member.pending,
            team: {
              _id: team._id,
              name: team.name
            }
          });
        }
      }
      res.json(members);
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

  Team.findById(id).populate('teamLead', 'displayName')
  .populate('teamMembers', 'displayName firstName lastName username email profileImageURL pending')
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

/**
 * Team Member methods
 */
var createMemberInternal = function(userJSON, successCallback, errorCallback) {
  var user = new User(userJSON);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = ['team member', 'user'];
  user.username = user.email.substring(0, user.email.indexOf('@'));
  user.pending = true;

  // Then save the user
  user.save(function (err) {
    if (err) {
      errorCallback(errorHandler.getErrorMessage(err));
    } else {
      successCallback(user);
    }
  });
};

exports.createMember = function (req, res) {
  delete req.body.roles;

  createMemberInternal(req.body,
    function(member) {
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
    }, function(err) {
      return res.status(400).send({
        message: err
      });
    });
};

exports.updateMember = function (req, res) {
  var member = req.member;
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

exports.deleteMember = function (req, res) {
  var member = req.member;
  var team = req.team;

  if (team) {
    if (member) {
      var index = _.findIndex(team.teamMembers, function(m) { return m._id.toString() === member._id.toString(); });
      //var index = team.teamMembers ? team.teamMembers.indexOf(member._id) : -1;
      if (index > -1) {
        team.teamMembers.splice(index, 1);

        team.save(function (delSaveErr) {
          if (delSaveErr) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(delSaveErr)
            });
          } else {
            if (member.pending === true) {
              member.remove(function (errDelUser) {
                if (errDelUser) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(errDelUser)
                  });
                } else {
                  res.json(member);
                }
              });
            } else {
              res.json(member);
            }
          }
        });
      } else {
        return res.status(400).send({
          message: 'Could not find member to delete in team'
        });
      }
    } else {
      return res.status(400).send({
        message: 'Cound not find member to delete'
      });
    }
  } else {
    return res.status(400).send({
      message: 'Could not find team to delete member from'
    });
  }
};

exports.downloadMemberBulkFile = function(req, res) {
  var csvHeader = ['First Name *', 'Last Name *', 'Email *'];

  var csvString = csvHeader.join() + '\n' + 'John,Doe,jdoe@email.com';

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

  if (memberValues.firstName && memberValues.lastName && memberValues.email) {
    successCallback(memberValues);
  } else {
    errorCallback('Error converting member from csv');
  }
};

exports.createMemberCsv = function (req, res) {
  convertCsvMember(req.body.member,
    function(memberJSON) {
      createMemberInternal(memberJSON,
        function(member) {
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
                    res.json(member);
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
                    res.json(member);
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
                    res.json(member);
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
