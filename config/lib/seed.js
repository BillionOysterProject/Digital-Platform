'use strict';

var _ = require('lodash'),
  config = require('../config'),
  mongoose = require('mongoose'),
  chalk = require('chalk'),
  crypto = require('crypto');

// global seed options object
var seedOptions = {};

function removeOrganization (organization) {
  return new Promise(function (resolve, reject) {
    var Organization = mongoose.model('SchoolOrg');
    Organization.find({ name: organization.name }).remove(function (err) {
      if (err) {
        reject(new Error('Failed to remove local ' + organization.name));
      }
      resolve();
    });
  });
}

function removeUser (user) {
  return new Promise(function (resolve, reject) {
    var User = mongoose.model('User');
    User.find({ username: user.username }).remove(function (err) {
      if (err) {
        reject(new Error('Failed to remove local ' + user.username));
      }
      resolve();
    });
  });
}

function removeTeam (team) {
  return new Promise(function (resolve, reject) {
    var Team = mongoose.model('Team');
    Team.find({ name: team.name }).remove(function (err) {
      if (err) {
        reject(new Error('Failed to remove local ' + team.name));
      }
      resolve();
    });
  });
}

function removeStation (ors) {
  return new Promise(function (resolve, reject) {
    var Station = mongoose.model('RestorationStation');
    Station.find({ name: ors.name }).remove(function (err) {
      if (err) {
        reject(new Error('Failed to remove local ' + ors.name));
      }
      resolve();
    });
  });
}

function saveOrganization (organization) {
  return function() {
    return new Promise(function (resolve, reject) {
      // Then save the organization
      organization.save(function (err, theorganization) {
        if (err) {
          reject(new Error('Failed to add local ' + organization.name));
        } else {
          resolve(theorganization);
        }
      });
    });
  };
}

function saveUser (user) {
  return function() {
    return new Promise(function (resolve, reject) {
      // Then save the user
      user.save(function (err, theuser) {
        if (err) {
          reject(new Error('Failed to add local ' + user.username));
        } else {
          resolve(theuser);
        }
      });
    });
  };
}

function saveTeam (team) {
  return function() {
    return new Promise(function (resolve, reject) {
      // Then save the team
      team.save(function (err, theteam) {
        if (err) {
          reject(new Error('Failed to add local ' + team.name));
        } else {
          resolve(theteam);
        }
      });
    });
  };
}

function saveStation (ors) {
  return function() {
    return new Promise(function (resolve, reject) {
      // Then save the station
      ors.save(function (err, theors) {
        if (err) {
          reject(new Error('Failed to add local ' + ors.name));
        } else {
          resolve(theors);
        }
      });
    });
  };
}

function checkOrganizationNotExists (organization) {
  return new Promise(function (resolve, reject) {
    var Organization = mongoose.model('SchoolOrg');
    Organization.find({ name: organization.name }, function (err, organizations) {
      if (err) {
        reject(new Error('Failed to find local organization ' + organization.name));
      }

      if (organizations.length === 0) {
        resolve();
      } else {
        reject(new Error('Failed to find local organization ' + organization.name));
      }
    });
  });
}

function checkUserNotExists (user) {
  return new Promise(function (resolve, reject) {
    var User = mongoose.model('User');
    User.find({ username: user.username }, function (err, users) {
      if (err) {
        reject(new Error('Failed to find local account ' + user.username));
      }

      if (users.length === 0) {
        resolve();
      } else {
        reject(new Error('Failed due to local account already exists: ' + user.username));
      }
    });
  });
}

function checkTeamNotExists (team) {
  return new Promise(function (resolve, reject) {
    var Team = mongoose.model('Team');
    Team.find({ name: team.name }, function (err, teams) {
      if (err) {
        reject(new Error('Failed to find local team ' + team.name));
      }

      if (teams.length === 0) {
        resolve();
      } else {
        reject(new Error('Failed due to local team already exists: ' + team.name));
      }
    });
  });
}

function checkStationNotExists (ors) {
  return new Promise(function (resolve, reject) {
    var Station = mongoose.model('RestorationStation');
    Station.find({ name: ors.name }, function (err, stations) {
      if (err) {
        reject(new Error('Failed to find local team ' + ors.name));
      }

      if (stations.length === 0) {
        resolve();
      } else {
        reject(new Error('Failed due to local station already exists: ' + ors.name));
      }
    });
  });
}

function reportSuccess (password) {
  return function (user) {
    return new Promise(function (resolve, reject) {
      if (seedOptions.logResults) {
        console.log(chalk.bold.red('Database Seeding:\t\t\tLocal ' + user.username + ' added with password set to ' + password));
      }
      resolve();
    });
  };
}

// save the specified organization from the resolved promise
function seedTheOrganization (organization) {
  return new Promise(function (resolve, reject) {
    var Organization = mongoose.model('SchoolOrg');

    if (process.env.NODE_ENV === 'production') {
      checkOrganizationNotExists(organization)
        .then(saveOrganization(organization))
        .then(function () {
          resolve();
        })
        .catch(function (err) {
          reject(err);
        });
    } else {
      removeOrganization(organization)
        .then(saveOrganization(organization))
        .then(function() {
          resolve();
        })
        .catch(function (err) {
          reject(err);
        });
    }
  });
}

// save the specified user with the password provided from the resolved promise
function seedTheUser (user, organization, manualPassword) {
  return function (password) {
    return new Promise(function (resolve, reject) {

      var User = mongoose.model('User');
      // set the new password
      if (manualPassword) {
        // user.salt = crypto.randomBytes(16).toString('base64');
        // user.password = User.getHashedPassword(manualPassword, user.salt);
        user.password = manualPassword;
      } else {
        user.password = password;
      }
      user.password = (manualPassword) ? manualPassword : password;
      user.schoolOrg = organization;

      if (user.username === seedOptions.seedAdmin.username && process.env.NODE_ENV === 'production') {
        checkUserNotExists(user)
          .then(saveUser(user))
          .then(reportSuccess(user.password))
          .then(function () {
            resolve();
          })
          .catch(function (err) {
            reject(err);
          });
      } else {
        removeUser(user)
          .then(saveUser(user))
          .then(reportSuccess(user.password))
          .then(function () {
            resolve();
          })
          .catch(function (err) {
            reject(err);
          });
      }
    });
  };
}

function seedTheTeam (team, leader, member1, member2, organization) {
  return new Promise(function (resolve, reject) {
    var Team = mongoose.model('Team');
    team.schoolOrg = organization;
    team.teamLead = leader;
    team.teamMembers = [member1, member2];

    if (process.env.NODE_ENV === 'production') {
      checkTeamNotExists(team)
        .then(saveTeam(team))
        .then(function() {
          resolve();
        })
        .catch(function (err) {
          reject(err);
        });
    } else {
      removeUser(team)
        .then(saveTeam(team))
        .then(function () {
          resolve();
        })
        .catch(function (err) {
          reject(err);
        });
    }
  });
}

function seedTheStation (ors, organization, team) {
  return new Promise(function (resolve, reject) {
    var Station = mongoose.model('RestorationStation');
    ors.schoolOrg = organization;
    ors.team = team;

    if (process.env.NODE_ENV === 'production') {
      checkStationNotExists(ors)
        .then(saveStation(ors))
        .then(function() {
          resolve();
        })
        .catch(function (err) {
          reject(err);
        });
    } else {
      removeStation(ors)
        .then(saveStation(ors))
        .then(function() {
          resolve();
        })
        .catch(function (err) {
          reject(err);
        });
    }
  });
}

// report the error
function reportError (reject) {
  return function (err) {
    if (seedOptions.logResults) {
      console.log();
      console.log('Database Seeding:\t\t\t' + err);
      console.log();
    }
    reject(err);
  };
}

module.exports.start = function start(options) {
  // Initialize the default seed options
  seedOptions = _.clone(config.seedDB.options, true);

  // Check for provided options

  if (_.has(options, 'logResults')) {
    seedOptions.logResults = options.logResults;
  }

  if (_.has(options, 'seedOrganization')) {
    seedOptions.seedOrganization = options.seedOrganization;
  }

  if (_.has(options, 'seedTeam')) {
    seedOptions.seedTeam = options.seedTeam;
  }

  if (_.has(options, 'seedStation')) {
    seedOptions.seedStation = options.seedStation;
  }

  if (_.has(options, 'seedUserLeader')) {
    seedOptions.seedUserLeader = options.seedUserLeader;
  }

  if (_.has(options, 'seedUserMember1')) {
    seedOptions.seedUserMember1 = options.seedUserMember1;
  }

  if (_.has(options, 'seedUserMember2')) {
    seedOptions.seedUserMember2 = options.seedUserMember2;
  }

  if (_.has(options, 'seedAdmin')) {
    seedOptions.seedAdmin = options.seedAdmin;
  }

  var Organization = mongoose.model('SchoolOrg');
  var User = mongoose.model('User');
  var Team = mongoose.model('Team');
  var Stations = mongoose.model('RestorationStation');
  return new Promise(function (resolve, reject) {

    var org = new Organization(seedOptions.seedOrganization);
    var adminAccount = new User(seedOptions.seedAdmin);
    var leaderAccount = new User(seedOptions.seedUserLeader);
    var memberAccount1 = new User(seedOptions.seedUserMember1);
    var memberAccount2 = new User(seedOptions.seedUserMember2);
    var team = new Team(seedOptions.seedTeam);
    var ors = new Stations(seedOptions.seedStation);

    //If production only seed admin if it does not exist
    if (process.env.NODE_ENV === 'production') {
      seedTheOrganization(org)
        .then(function() {
          User.generateRandomPassphrase()
            .then(seedTheUser(adminAccount, org))
            .then(function () {
              resolve();
            })
            .catch(reportError(reject));
        })
        .catch(reportError(reject));
    } else {
      // Add both Admin and User account

      seedTheOrganization(org)
        .then(function() {
          User.generateRandomPassphrase()
            .then(seedTheUser(adminAccount, org))
            .then(seedTheUser(leaderAccount, org, 'P@$$w0rd!!'))
            .then(seedTheUser(memberAccount1, org, 'P@$$w0rd!!'))
            .then(seedTheUser(memberAccount2, org, 'P@$$w0rd!!'))
            .then(function () {
              seedTheTeam(team, leaderAccount, memberAccount1, memberAccount2, org)
                .then(function() {
                  seedTheStation(ors, org, team)
                    .then(function () {
                      resolve();
                    })
                    .catch(reportError(reject));
                })
                .catch(reportError(reject));
            })
            .catch(reportError(reject));
        })
        .catch(reportError(reject));
    }
  });
};
