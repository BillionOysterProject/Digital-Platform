'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  UserActivity = mongoose.model('UserActivity'),
  SchoolOrg = mongoose.model('SchoolOrg'),
  async = require('async'),
  TeamRequest = mongoose.model('TeamRequest');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = [req.body.userrole, 'user'];
  if (req.body.schoolOrg === 'new') user.schoolOrg = null;

  // Then save the user
  user.save(function (err) {
    if (err) {
      var errorMessage = errorHandler.getErrorMessage(err);
      if (errorMessage.indexOf('username already exists') > -1) {
        errorMessage = 'Username already exists';
      } else if (errorMessage.indexOf('email already exists') > -1) {
        errorMessage = 'Email already exists';
      }
      return res.status(400).send({
        message: errorMessage
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      var loginNewUser = function() {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(user);
          }
        });
      };

      // Add team request
      if (req.body.userrole === 'team member pending') {
        var request = new TeamRequest({
          requester: user,
          teamLead: req.body.teamLead
        });

        request.save(function(saveErr) {
          if (saveErr) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveErr)
            });
          } else {
            User.findById(req.body.teamLead).exec(function(err, teamLead) {
              var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

              email.sendEmailTemplate(teamLead.email, user.displayName + ' has just requested to join your team ',
              'member_request', {
                FirstName: teamLead.firstName,
                TeamMemberName: user.displayName,
                LinkMemberRequest: httpTransport + req.headers.host + '/settings/members',
                LinkProfile: httpTransport + req.headers.host + '/settings/profile',
                Logo: 'http://staging.bop.fearless.tech/modules/core/client/img/brand/logo.svg'
              }, function(info) {
                loginNewUser();
              }, function(errorMessage) {
                loginNewUser();
              });
            });
          }
        });
      } else if (req.body.userrole === 'team lead pending') {
        var sendAdminNewTeamLeadEmail = function(callback) {
          var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

          email.sendEmailTemplate(config.mailer.admin, 'A new team lead is pending approval', 'lead_waiting', {
            LinkLogin: httpTransport + req.headers.host + '/authentication/signin',
            Logo: 'http://staging.bop.fearless.tech/modules/core/client/img/brand/logo.svg'
          }, function(info) {
            if (callback) callback();
          }, function(errorMessage) {
            if (callback) callback();
          });
        };

        var sendNewTeamLeadEmail = function() {
          var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

          email.sendEmailTemplate(user.email, 'Thanks for joining the Billion Oyster Project', 'lead_pending', {
            FirstName: user.firstName,
            TeamMemberName: user.displayName,
            LinkLogin: httpTransport + req.headers.host + '/authentication/signin',
            LinkProfile: httpTransport + req.headers.host + '/settings/profile',
            Logo: 'http://staging.bop.fearless.tech/modules/core/client/img/brand/logo.svg'
          }, function(info) {
            sendAdminNewTeamLeadEmail(loginNewUser());
          }, function(errorMessage) {
            sendAdminNewTeamLeadEmail(loginNewUser());
          });
        };

        if (req.body.schoolOrg === 'new') {
          if (req.body.addSchoolOrg) {
            var schoolOrg = new SchoolOrg(req.body.addSchoolOrg);
            schoolOrg.creator = user;
            schoolOrg.pending = true;

            schoolOrg.save(function (err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                user.schoolOrg = schoolOrg._id;
                user.save(function(err) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  }
                  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

                  var sendAdminNewOrganizationEmail = function(callback) {
                    email.sendEmailTemplate(config.mailer.admin, 'A new organization is pending approval', 'org_waiting', {
                      LinkLogin: httpTransport + req.headers.host + '/authentication/signin',
                      Logo: 'http://staging.bop.fearless.tech/modules/core/client/img/brand/logo.svg'
                    }, function(info) {
                      if (callback) callback();
                    }, function(errorMessage) {
                      if (callback) callback();
                    });
                  };

                  email.sendEmailTemplate(user.email, 'Your new organization request for ' + schoolOrg.name + ' is pending admin approval',
                  'org_pending', {
                    FirstName: user.firstName,
                    OrgName: schoolOrg.name,
                    LinkLogin: httpTransport + req.headers.host + '/authentication/signin',
                    LinkProfile: httpTransport + req.headers.host + '/settings/profile',
                    Logo: 'http://staging.bop.fearless.tech/modules/core/client/img/brand/logo.svg'
                  }, function(info) {
                    sendAdminNewOrganizationEmail(sendNewTeamLeadEmail());
                  }, function(errorMessage) {
                    sendAdminNewOrganizationEmail(sendNewTeamLeadEmail());
                  });
                });
              }
            });
          } else {
            sendNewTeamLeadEmail();
          }
        } else {
          sendNewTeamLeadEmail();
        }
      } else {
        loginNewUser();
      }
    }
  });
};

exports.validateNewUserToken = function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (!user) {
      return res.redirect('/claim-user/invalid');
    }

    res.redirect('/claim-user/' + req.params.token);
  });
};

/**
 * New User POST from email token
 */
exports.newUser = function (req, res) {
  // Init Variables
  var passwordDetails = req.body.passwordDetails;
  var username = req.body.username;

  async.waterfall([

    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!err && user) {
          if (passwordDetails.password === passwordDetails.verifyPassword) {
            user.password = passwordDetails.password;
            user.username = username;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.pending = false;
            user.roles = ['user', 'team member'];

            user.save(function (err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    // Remove sensitive data before return authenticated user
                    user.password = undefined;
                    user.salt = undefined;

                    res.json(user);

                    done(err);
                  }
                });
              }
            });
          } else {
            return res.status(400).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    },
  ], function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          var activity = new UserActivity({
            user: user,
            activity: 'login'
          });

          activity.save(function(err) {
            res.json(user);
          });
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;

    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(redirectURL || sessionRedirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
