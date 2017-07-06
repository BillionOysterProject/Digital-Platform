'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Research = mongoose.model('Research'),
  ResearchActivity = mongoose.model('ResearchActivity'),
  ResearchFeedback = mongoose.model('ResearchFeedback'),
  SavedResearch = mongoose.model('SavedResearch'),
  Team = mongoose.model('Team'),
  SchoolOrg = mongoose.model('SchoolOrg'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  archiver = require('archiver'),
  request = require('request'),
  path = require('path'),
  multer = require('multer'),
  async = require('async'),
  moment = require('moment'),
  wkhtmltoimage = require('wkhtmltoimage'),
  exec = require('child_process').exec,
  config = require(path.resolve('./config/config'));

var validateResearch = function(research, successCallback, errorCallback) {
  var errorMessages = [];

  if (!research.title) {
    errorMessages.push('Poster title is required');
  }

  if (!research.color) {
    errorMessages.push('Poster color is required');
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(research);
  }
};

var checkRole = function(user, role) {
  if (user) {
    var index = _.findIndex(user.roles, function(r) {
      return r === role;
    });
    return (index > -1) ? true : false;
  } else {
    return false;
  }
};

var getTeammates = function(user, callback) {
  Team.find({ 'teamMembers': user }).exec(function(err, teams) {
    if (err) {
      callback(err);
    } else {
      var teammates = [];
      for (var i = 0; i < teams.length; i++) {
        teammates.push(teams[i].teamLead);
        teammates = teammates.concat(teams[i].teamLeads);
        teammates = teammates.concat(teams[i].teamMembers);
      }
      teammates = _.uniqWith(teammates, _.isEqual);
      var index = _.findIndex(teammates, function(m) {
        return m.toString() === user._id.toString();
      });
      if (index > -1) {
        teammates.splice(index, 1);
      }
      callback(null, teammates);
    }
  });
};

var getTeams = function(user, callback) {
  Team.find({ $or: [{ 'teamLead': user },{ 'teamLeads': user }] }).exec(function(err, teams) {
    if (err) {
      callback(err);
    } else {
      var teamIds = [];
      for (var j = 0; j < teams.length; j++) {
        teamIds.push(teams[j]._id);
      }
      callback(null, teamIds);
    }
  });
};

var getTeamIdsByOrganizationName = function(searchRe, callback) {
  SchoolOrg.find({ 'name': searchRe }).exec(function(err, orgs) {
    if (err) {
      callback(err);
    } else {
      var orgIds = [];
      for (var i = 0; i < orgs.length; i++) {
        orgIds.push(orgs[i]._id);
      }
      Team.find({ 'schoolOrg': { $in: orgIds } }).exec(function(err, teams) {
        if (err) {
          callback(err);
        } else {
          var teamIds = [];
          for (var j = 0; j < teams.length; j++) {
            teamIds.push(teams[j]._id);
          }
          callback(null, teamIds);
        }
      });
    }
  });
};

var getTeamIdsByName = function(searchRe, callback) {
  Team.find({ 'name': searchRe }).exec(function(err, teams) {
    if (err) {
      callback(err);
    } else {
      var teamIds = [];
      for (var j = 0; j < teams.length; j++) {
        teamIds.push(teams[j]._id);
      }
      callback(null, teamIds);
    }
  });
};

var getAuthorIdsByName = function(searchRe, callback) {
  User.find({ $or: [{ 'displayName': searchRe }, { 'firstName': searchRe }, { 'lastName': searchRe },
  { 'email': searchRe }, { 'username': searchRe }] }).exec(function(err, users) {
    if (err) {
      callback(err);
    } else {
      var userIds = [];
      for (var i = 0; i < users.length; i++) {
        userIds.push(users[i]._id);
      }
      callback(null, userIds);
    }
  });
};

var getTeamIdsByTeamLeadName = function(searchRe, callback) {
  User.find({ $or: [{ 'displayName': searchRe }, { 'firstName': searchRe }, { 'lastName': searchRe },
  { 'email': searchRe }, { 'username': searchRe }] }).exec(function(err, users) {
    if (err) {
      callback(err);
    } else {
      var userIds = [];
      for (var i = 0; i < users.length; i++) {
        userIds.push(users[i]._id);
      }
      Team.find({ $or: [{ 'teamLead': { $in: userIds } }, { 'teamLeads': { $in: userIds } }] }).exec(function(err, teams) {
        if (err) {
          callback(err);
        } else {
          var teamIds = [];
          for (var j = 0; j < teams.length; j++) {
            teamIds.push(teams[j]._id);
          }
          callback(null, teamIds);
        }
      });
    }
  });
};

var alertTeamLeads = function(research, user, host, callback) {
  if (research.status === 'pending' || research.status === 'published') {
    var activity = new ResearchActivity({
      user: user,
      research: research,
      activity: (research.status === 'pending') ? 'submitted' : 'published'
    });

    activity.save(function(err) {
      if (research.status === 'pending') {
        var teamId = (research.team && research.team._id) ? research.team._id : research.team;
        if (teamId) {
          Team.findById(teamId).populate('teamLeads', 'firstName email').exec(function(err, team) {
            var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

            async.forEach(team.teamLeads, function(item,callback) {
              email.sendEmailTemplate(item.email, 'A new poster is pending approval', 'poster_waiting', {
                FirstName: item.firstName,
                TeamMemberName: user.displayName,
                PosterName: research.title,
                LinkPosterRequest: httpTransport + host + '/research/user',
                LinkProfile: httpTransport + host + '/profiles'
              }, function(info) {
                callback();
              }, function(errorMessage) {
                callback();
              });
            }, function(err) {
              callback(research);
            });
          });
        } else {
          callback(research);
        }
      } else {
        callback(research);
      }
    });
  } else {
    callback(research);
  }
};

var setImageToDownload = function(host, research, callback) {
  var httpTransport = (process.env.NODE_ENV === 'development-local') ? 'http://' : 'https://';
  var input = httpTransport + host + '/full-page/research/' + research._id;
  var filename = research._id + '.png';
  var mimetype = 'image/png';

  exec('wkhtmltoimage -f png ' + input + ' ' + path.resolve(config.uploads.researchDownloadImageUpload.dest) + '/' + filename, function(error, stdout, stderr) {
    if (error) {
      console.log('wkhtmltoimage error: ', error);
      callback(error);
    } else {
      console.log('wkhmtltoimage stderr: ', stderr);
      console.log('wkhtmltoimage stdout: ', stdout);
      var uploadRemote = new UploadRemote();
      uploadRemote.saveLocalAndRemote(filename, mimetype, config.uploads.researchDownloadImageUpload,
      function(fileInfo) {
        research.downloadImage = fileInfo;
        research.save(function(err) {
          if (err) {
            console.log('save file info error: ', err);
            callback(err);
          }
          callback(null, fileInfo);
        });
      }, function(errorMessage) {
        console.log('save image remotely error: ', errorMessage);
        callback(errorMessage);
      });
    }
  });
};

exports.saveResearchAsImage = function(req, res) {
  var research = req.research;
  setImageToDownload(req.headers.host, research, function(err, fileInfo) {
    if (fileInfo) research.downloadImage = fileInfo;
    res.json(fileInfo);
  });
};

/**
 * Create a Research
 */
exports.create = function(req, res) {
  validateResearch(req.body,
  function(researchJSON) {
    var research = new Research(researchJSON);
    research.user = req.user;

    if (checkRole(req.user, 'team lead') || checkRole(req.user, 'admin')) {
      research.status = researchJSON.status || 'published';
      if (!research.submitted) research.submitted = [];
      if (!research.published) research.published = [];
      research.published.push(Date.now());
    } else {
      research.status = researchJSON.status || 'pending';
      if (research.status === 'pending') {
        if (!research.submitted) research.submitted = [];
        research.submitted.push(Date.now());
      }
    }

    var pattern = /^data:image\/[a-z]*;base64,/i;
    if (research.headerImage && research.headerImage.path && pattern.test(research.headerImage.path)) {
      research.headerImage.path = '';
    }

    research.save(function(err) {
      if (err) {
        console.log('err', err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(research);
        setImageToDownload(req.headers.host, research, function(err, fileInfo) {
          alertTeamLeads(research, req.user, req.headers.host, function(research) {
            // res.json(research);
          });
        });
      }
    });
  }, function(errorMessages) {
    console.log('errorMessages', errorMessages);
    return res.status(400).send({
      message: errorMessages
    });
  });
};

var setOwnership = function(user, research, fullPage, callback) {
  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  research.isCurrentUserOwner = user && research.user && research.user._id.toString() === user._id.toString();

  var setTeam = function() {
    if (checkRole(user, 'team lead') && research.team && research.team._id) {
      Team.findOne({ '_id': research.team._id, 'teamLeads': user }).exec(function(err, team) {
        research.isCurrentUserTeamLead = (team) ? true : false;
        callback(research);
      });
    } else if (checkRole(user, 'team member') && research.team && research.team._id) {
      Team.findOne({ '_id': research.team._id, 'teamMembers': user }).exec(function(err, team) {
        research.isCurrentUserTeammate = (team) ? true : false;
        callback(research);
      });
    } else {
      callback(research);
    }
  };


  if (!research.isCurrentUserOwner) {
    if (fullPage) {
      setTeam();
    } else {
      var activity = new ResearchActivity({
        user: user,
        research: research,
        activity: 'viewed'
      });

      activity.save(function(err) {
        setTeam();
      });
    }
  } else {
    callback(research);
  }
};

/**
 * Show the current Research
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var research = req.research ? req.research.toJSON() : {};

  if (req.researchSaved) {
    research.saved = req.researchSaved;
  }

  if (research.team) {
    SchoolOrg.populate(research.team, { 'path': 'schoolOrg' }, function(err, output) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        setOwnership(req.user, research, req.query.fullPage, function(updatedResearch) {
          res.jsonp(updatedResearch);
        });
      }
    });
  } else if (checkRole(research.user, 'team lead') && research.user.schoolOrg) {
    SchoolOrg.populate(research.user, { 'path': 'schoolOrg' }, function(err, output) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        setOwnership(req.user, research, req.query.fullPage, function(updatedResearch) {
          res.jsonp(updatedResearch);
        });
      }
    });
  } else {
    setOwnership(req.user, research, req.query.fullPage, function(updatedResearch) {
      res.jsonp(updatedResearch);
    });
  }
};

/**
 * Update a Research
 */
exports.update = function(req, res) {
  var research = req.research;
  validateResearch(req.body,
  function(researchJSON) {
    if (research) {
      research = _.extend(research, researchJSON);
      research.returnedNotes = '';

      if (checkRole(req.user, 'team lead') || checkRole(req.user, 'admin')) {
        research.status = researchJSON.status || 'published';
        if (!research.submitted) research.submitted = [];
        if (!research.published) research.published = [];
        research.published.push(Date.now());
      } else {
        research.status = researchJSON.status || 'pending';
        if (research.status === 'pending') {
          if (!research.submitted) research.submitted = [];
          research.submitted.push(Date.now());
        }
      }

      var pattern = /^data:image\/[a-z]*;base64,/i;
      if (research.headerImage && research.headerImage.path && pattern.test(research.headerImage.path)) {
        research.headerImage.path = '';
      }

      if (!research.updated) research.updated = [];
      research.updated.push(Date.now());

      research.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(research);
          setImageToDownload(req.headers.host, research, function(err, fileInfo) {
            alertTeamLeads(research, req.user, req.headers.host, function(research) {
              // res.json(research);
            });
          });
        }
      });
    } else {
      return res.status(400).send({
        message: 'Cannot update the research'
      });
    }
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages
    });
  });
};

/**
 * Saves activity for sharing
 */
exports.share = function(req, res) {
  var research = req.research;

  if (research) {
    var activity = new ResearchActivity({
      user: req.user,
      research: research,
      activity: 'shared',
      additionalInfo: req.query.site
    });

    activity.save(function(err) {
      res.json(research);
    });
  } else {
    return res.status(400).send({
      message: 'No poster found'
    });
  }
};

/**
 * Publish a poster
 */
exports.publish = function(req, res) {
  var research = req.research;

  if (research) {
    research.status = 'published';
    research.returnedNotes = '';

    if (!research.published) research.published = [];
    research.published.push(Date.now());

    research.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var activity = new ResearchActivity({
          user: req.user,
          research: research,
          activity: 'published'
        });

        activity.save(function(err) {
          res.json(research);
          setImageToDownload(req.headers.host, research, function(err, fileInfo) {
            var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

            email.sendEmailTemplate(research.user.email, 'Your poster ' + research.title + ' has been approved',
            'poster_approved', {
              FirstName: research.user.firstName,
              PosterName: research.title,
              LinkPoster: httpTransport + req.headers.host + '/research/' + research._id,
              LinkProfile: httpTransport + req.headers.host + '/profiles'
            },
            function(response) {
              // res.json(research);
            }, function(errorMessage) {
              // return res.status(400).send({
              //   message: errorMessage
              // });
            });
          });
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Cannot update the poster'
    });
  }
};

/**
 * Return a poster
 */
exports.return = function(req, res) {
  var research = req.research;

  if (research) {
    research.status = 'returned';
    research.returnedNotes = req.body.returnedNotes;

    research.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var activity = new ResearchActivity({
          user: req.user,
          research: research,
          activity: 'returned',
          additionalInfo: req.body.returnedNotes
        });

        activity.save(function(err) {
          res.json(research);
          setImageToDownload(req.headers.host, research, function(err, fileInfo) {
            var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

            email.sendEmailTemplate(research.user.email, 'Your poster ' + research.title + ' has been returned',
            'poster_returned', {
              FirstName: research.user.firstName,
              PosterName: research.title,
              PosterReturnedNote: research.returnedNotes,
              LinkPoster: httpTransport + req.headers.host + '/research/' + research._id,
              LinkProfile: httpTransport + req.headers.host + '/profiles'
            },
            function(response) {
              // res.json(research);
            }, function(errorMessage) {
              // return res.status(400).send({
              //   message: errorMessage
              // });
            });
          });
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Cannot update the poster'
    });
  }
};

/**
 * Saved research methods
 */
exports.favoriteResearch = function(req, res) {
  var research = req.research;

  var savedResearch = new SavedResearch({
    user: req.user,
    research: research
  });

  savedResearch.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var activity = new ResearchActivity({
        user: req.user,
        research: research,
        activity: 'liked'
      });

      activity.save(function(err) {
        research.saved = true;
        res.json(research);
      });
    }
  });
};

exports.unfavoriteResearch = function(req, res) {
  var research = req.research;

  SavedResearch.findOne({ research: research, user: req.user }).exec(function(err, savedResearch) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!savedResearch) {
      return res.status(400).send({
        message: 'Saved research not found'
      });
    } else {
      savedResearch.remove(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var activity = new ResearchActivity({
            user: req.user,
            research: research,
            activity: 'unliked'
          });

          activity.save(function(err) {
            research.saved = false;
            res.json(research);
          });
        }
      });
    }
  });
};

exports.listFavorites = function(req, res) {
  SavedResearch.find({ user: req.user }).exec(function(err, savedResearch) {
    if (err) {
      console.log('err', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var researchIds = [];
      for (var i = 0; i < savedResearch.length; i++) {
        researchIds.push(savedResearch[i].research);
      }
      if (researchIds && researchIds.length > 0) {
        Research.find({ _id: { $in: researchIds } })
        .populate('user', 'displayName firstName lastName email profileImageURL username schoolOrg roles')
        .populate('team', 'name schoolOrg photo').exec(function (err, research) {
          if (err) {
            console.log('err2', err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(research);
          }
        });
      } else {
        res.json([]);
      }
    }
  });
};

/**
 * Feedback for a poster
 */
exports.researchFeedback = function(req, res) {
  var research = req.research;
  var user = req.user;

  var researchFeedback = new ResearchFeedback(req.body.feedback);
  researchFeedback.user = user;
  researchFeedback.research = research;

  researchFeedback.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var activity = new ResearchActivity({
        user: req.user,
        research: research,
        activity: 'feedback'
      });

      activity.save(function(err) {
        var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';
        var subject = 'Feedback from ' + req.user.displayName + ' about your poster ' + research.title;
        var toList = [research.user.email, config.mailer.admin];

        email.sendEmailTemplate(toList, subject,
        'poster_feedback', {
          FirstName: research.user.firstName,
          PosterFeedbackName: req.user.displayName,
          PosterName: research.title,
          TitleCreativeYNS: researchFeedback.title.creativeToThePoint,
          TitleAttentionYNS: researchFeedback.title.attentionGrabbing,
          TitleFeedback: researchFeedback.title.feedbackSuggestions,
          IntroHookYNS: researchFeedback.introduction.hookTheAudience,
          IntroCiteYNS: researchFeedback.introduction.citeThreeSources,
          IntroHypothesisYNS: researchFeedback.introduction.clearHypothesis,
          IntroVisualYNS: researchFeedback.introduction.includeOneVisual,
          IntroFeedback: researchFeedback.introduction.feedbackSuggestions,
          MaterialsExplainYNS: researchFeedback.materialMethods.clearExplanation,
          MaterialsAnalysisYNS: researchFeedback.materialMethods.describeAnalysis,
          MaterialsIllustrationsYNS: researchFeedback.materialMethods.includeVisuals,
          MaterialsFeedback: researchFeedback.materialMethods.feedbackSuggestions,
          ResultsWorkYNS: researchFeedback.results.stateConclusion,
          ResultsSurprisesYNS: researchFeedback.results.describeSurprises,
          ResultsAnalysisYNS: researchFeedback.results.quantitativeAnalysis,
          ResultsChartYNS: researchFeedback.results.includeOneVisual,
          ResultsChartSpeaksYNS: researchFeedback.results.understandableVisuals,
          ResultsFeedback: researchFeedback.results.feedbackSuggestions,
          DiscussionSignificanceYNS: researchFeedback.discussionConclusions.significancePresent,
          DiscussionProblemsYNS: researchFeedback.discussionConclusions.discussProblems,
          DiscussionConvinceYNS: researchFeedback.discussionConclusions.interestingImportant,
          DiscussionEcologyYNS: researchFeedback.discussionConclusions.significantToEcology,
          DiscussionStepsYNS: researchFeedback.discussionConclusions.explainsNextSteps,
          DiscussionFeedback: researchFeedback.discussionConclusions.feedbackSuggestions,
          CitedThreeYNS: researchFeedback.literatureCited.citeThreeSourcesCorrectly,
          CitedFeedback: researchFeedback.literatureCited.feedbackSuggestions,
          AcknowledgmentsFeedback: researchFeedback.acknowledgments.feedbackSuggestions,
          OtherFeedback: researchFeedback.other.feedbackSuggestions,
          GeneralFeedback: researchFeedback.generalComments,
          LinkPoster: httpTransport + req.headers.host + '/researches/' + research._id,
          LinkProfile: httpTransport + req.headers.host + '/profiles'
        },
        function(response) {
          res.json(researchFeedback);
        }, function(errorMessage) {
          return res.status(400).send({
            message: errorMessage
          });
        });
      });
    }
  });
};

exports.listFeedbackForResearch = function(req, res) {
  var research = req.research;

  ResearchFeedback.find({ research: research }).populate('research', 'title')
  .populate('user', 'displayName email team profileImageURL').exec(function(err, feedback) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(feedback);
    }
  });
};

exports.feedbackForResearch = function(req, res) {
  var research = req.research;

  ResearchFeedback.aggregate([
    { $match: { research: research._id } },
    { $group: {
      _id: null,
      titleRatingAvg: { $avg: '$title.rating' },
      introductionRatingAvg: { $avg: '$introduction.rating' },
      materialMethodsRatingAvg: { $avg: '$materialMethods.rating' },
      resultsRatingAvg: { $avg: '$results.rating' },
      discussionConclusionsRatingAvg: { $avg: '$discussionConclusions.rating' },
      literatureCitedRatingAvg: { $avg: '$literatureCited.rating' },
      acknowledgmentsRatingAvg: { $avg: '$acknowledgments.rating' },
      otherRatingAvg: { $avg: '$other.rating' }
    } },
  ], function(err, result) {
    if (err) {
      res.status(400).send({
        message: 'Could not retrieve averages'
      });
    } else {
      ResearchFeedback.find({ research: research._id }).sort('-created').populate('user', 'displayName').exec(function(err1, feedbackList) {
        if (err1) {
          res.status(400).send({
            message: 'Could not retrieve feedback'
          });
        } else {
          //Get array of feedback
          var titleFeedback = [];
          var introductionFeedback = [];
          var materialMethodsFeedback = [];
          var resultsFeedback = [];
          var discussionConclusionsFeedback = [];
          var literatureCitedFeedback = [];
          var acknowledgmentsFeedback = [];
          var otherFeedback = [];
          var generalComments = [];
          for (var i = 0; i < feedbackList.length; i++) {
            var feedback = feedbackList[i];
            var author = feedback.user.displayName;
            var date = moment(feedback.created).format('MMMM D, YYYY');

            if (feedback.title.feedbackSuggestions) titleFeedback.push({ author: author, date: date,
              feedback: feedback.title.feedbackSuggestions });
            if (feedback.introduction.feedbackSuggestions) introductionFeedback.push({ author: author, date: date,
              feedback: feedback.introduction.feedbackSuggestions });
            if (feedback.materialMethods.feedbackSuggestions) materialMethodsFeedback.push({ author: author, date: date,
              feedback: feedback.materialMethods.feedbackSuggestions });
            if (feedback.results.feedbackSuggestions) resultsFeedback.push({ author: author, date: date,
              feedback: feedback.results.feedbackSuggestions });
            if (feedback.discussionConclusions.feedbackSuggestions) discussionConclusionsFeedback.push({ author: author, date: date,
              feedback: feedback.discussionConclusions.feedbackSuggestions });
            if (feedback.literatureCited.feedbackSuggestions) literatureCitedFeedback.push({ author: author, date: date,
              feedback: feedback.literatureCited.feedbackSuggestions });
            if (feedback.acknowledgments.feedbackSuggestions) acknowledgmentsFeedback.push({ author: author, date: date,
              feedback: feedback.acknowledgments.feedbackSuggestions });
            if (feedback.other.feedbackSuggestions) otherFeedback.push({ author: author, date: date,
              feedback: feedback.other.feedbackSuggestions });
            if (feedback.generalComments) generalComments.push({ author: author, date: date,
              feedback: feedback.generalComments });
          }

          var feedbackResults = {
            feedbackCount: (feedbackList) ? feedbackList.length : 0,
            titleRatingAvg: (result[0]) ? result[0].titleRatingAvg : 0,
            titleFeedback: titleFeedback,
            introductionRatingAvg: (result[0]) ? result[0].introductionRatingAvg : 0,
            introductionFeedback: introductionFeedback,
            materialMethodsRatingAvg: (result[0]) ? result[0].materialMethodsRatingAvg : 0,
            materialMethodsFeedback: materialMethodsFeedback,
            resultsRatingAvg: (result[0]) ? result[0].resultsRatingAvg : 0,
            resultsFeedback: resultsFeedback,
            discussionConclusionsRatingAvg: (result[0]) ? result[0].discussionConclusionsRatingAvg : 0,
            discussionConclusionsFeedback: discussionConclusionsFeedback,
            literatureCitedRatingAvg: (result[0]) ? result[0].literatureCitedRatingAvg : 0,
            literatureCitedFeedback: literatureCitedFeedback,
            acknowledgmentsRatingAvg: (result[0]) ? result[0].acknowledgmentsRatingAvg : 0,
            acknowledgmentsFeedback: acknowledgmentsFeedback,
            otherRatingAvg: (result[0]) ? result[0].otherRatingAvg : 0,
            otherFeedback: otherFeedback,
            generalComments: generalComments
          };

          var yesNoSomewhatFields = [{
            field: '$title.creativeToThePoint',
            name: 'titleCreativeCounts'
          },{
            field: '$title.attentionGrabbing',
            name: 'titleAttentionCounts'
          },{
            field: '$introduction.hookTheAudience',
            name: 'introductionHookCounts'
          },{
            field: '$introduction.citeThreeSources',
            name: 'introductionSourcesCounts'
          },{
            field: '$introduction.clearHypothesis',
            name: 'introductionHypothesisCounts'
          },{
            field: '$introduction.includeOneVisual',
            name: 'introductionVisualCounts'
          },{
            field: '$materialMethods.clearExplanation',
            name: 'materialMethodsExplanationCounts'
          },{
            field: '$materialMethods.describeAnalysis',
            name: 'materialMethodsAnalysisCounts'
          },{
            field: '$materialMethods.includeVisuals',
            name: 'materialMethodsVisualsCounts'
          },{
            field: '$results.stateConclusion',
            name: 'resultsConclusionCounts'
          },{
            field: '$results.describeSurprises',
            name: 'resultsSurprisesCounts'
          },{
            field: '$results.quantitativeAnalysis',
            name: 'resultsAnalysisCounts'
          },{
            field: '$results.includeOneVisual',
            name: 'resultsIncludeVisualsCounts'
          },{
            field: '$results.understandableVisuals',
            name: 'resultsUnderstandableVisualsCounts'
          },{
            field: '$discussionConclusions.significancePresent',
            name: 'discussionConclusionsSignificanceCounts'
          },{
            field: '$discussionConclusions.discussProblems',
            name: 'discussionConclusionsProblemsCounts'
          },{
            field: '$discussionConclusions.interestingImportant',
            name: 'discussionConclusionsInterestingCounts'
          },{
            field: '$discussionConclusions.significantToEcology',
            name: 'disccusionConclusionsEcologyCounts'
          },{
            field: '$discussionConclusions.explainsNextSteps',
            name: 'discussionConclusionsNextStepsCounts'
          },{
            field: '$literatureCited.citeThreeSourcesCorrectly',
            name: 'literatureCitedSourcesCounts'
          }];
          async.forEach(yesNoSomewhatFields, function(field, callback) {
            ResearchFeedback.aggregate([
              { $match: { research: research._id } },
              { $group: { _id: field.field, count: { $sum: 1 } } },
            ], function(err, counts) {
              var values = { yes: 0, no: 0, somewhat: 0 };
              for (var i = 0; i < counts.length; i++) {
                var id = counts[i]._id;
                values[id] = counts[i].count;
              }
              feedbackResults[field.name] = values;
              callback();
            });
          }, function(err) {
            res.json(feedbackResults);
          });
        }
      });
    }
  });
};

/**
 * Delete an Research
 */
var deleteInternal = function(research, successCallback, errorCallback) {
  var filesToDelete = [];
  if (research) {
    if (research.headerImage && research.headerImage.path) {
      filesToDelete.push(research.headerImage.path);
    }

    if (filesToDelete.length > 0) {
      var uploadRemote = new UploadRemote();
      uploadRemote.deleteRemote(filesToDelete,
      function() {
        research.remove(function(err) {
          if (err) {
            errorCallback(errorHandler.getErrorMessage(err));
          } else {
            successCallback(research);
          }
        });
      }, function(err) {
        errorCallback(err);
      });
    } else {
      research.remove(function(err) {
        if (err) {
          errorCallback(errorHandler.getErrorMessage(err));
        } else {
          successCallback(research);
        }
      });
    }
  }
};

exports.delete = function(req, res) {
  var research = req.research;

  deleteInternal(research,
  function(research) {
    res.json(research);
  }, function(err) {
    return res.status(400).send({
      message: err
    });
  });
};

/**
 * List of Researches
 */
exports.list = function(req, res) {
  var search = function(searchStringOr, userIds, teamIds) {
    var query;
    var and = [];

    if (searchStringOr) {
      and.push({ $or: searchStringOr });
    }

    if (userIds && userIds.length > 0) {
      and.push({ 'user': { $in: userIds } });
    }

    if (teamIds && teamIds.length > 0) {
      and.push({ 'team': { $in: teamIds } });
    }

    if (req.query.byCreator) {
      if (req.query.byCreator === 'true') {
        and.push({ 'user': req.user });
      } else {
        and.push({ 'user': req.query.byCreator });
      }
    }

    if (req.query.status) {
      if (req.query.status === 'pending') {
        and.push({ 'status': 'pending' });
      } else if (req.query.status === 'published') {
        and.push({ 'status': 'published' });
      } else if (req.query.status === 'draft') {
        and.push({ 'status': 'draft' });
      }
    }

    if (req.query.published === 'true') {
      and.push({ 'status': 'published' });
    } else if (req.query.published === 'false') {
      and.push({ 'status': { '$ne': 'published' } });
    }

    if (and.length === 1) {
      query = Research.find(and[0]);
    } else if (and.length > 0) {
      query = Research.find({ $and: and });
    } else {
      query = Research.find();
    }

    if (req.query.sort) {
      if (req.query.sort === 'owner') {
        query.sort({ 'user.lastName': 1 });
      } else if (req.query.sort === 'title') {
        query.sort({ 'title': 1 });
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

    query.populate('user', 'displayName firstName lastName email profileImageURL username schoolOrg')
    .populate('team', 'name schoolOrg').exec(function(err, researches) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        if (researches && researches.length > 0) {
          async.forEach(researches, function(item,callback) {
            SchoolOrg.populate(item.team, { 'path': 'schoolOrg' }, function(err, output) {
              if (err) {
                return res.status(400).send({
                  message: err
                });
              } else {
                callback();
              }
            });
          }, function(err) {
            res.json(researches);
          });
        } else {
          res.json([]);
        }
      }
    });
  };

  var getSearchStringOr = function(callback) {
    var or = [];
    var searchRe;
    try {
      searchRe = new RegExp(req.query.searchString, 'i');
    } catch(e) {
      return res.status(400).send({
        message: 'Search string is invalid'
      });
    }

    or.push({ 'title': searchRe });
    or.push({ 'intro': searchRe });
    or.push({ 'methods': searchRe });
    or.push({ 'results': searchRe });
    or.push({ 'discussion': searchRe });
    or.push({ 'cited': searchRe });
    or.push({ 'methods': searchRe });
    or.push({ 'other.title': searchRe });
    or.push({ 'other.cited': searchRe });

    getTeamIdsByOrganizationName(searchRe, function(err, teamIds1) {
      getTeamIdsByName(searchRe, function(err, teamIds2) {
        // getTeamIdsByTeamLeadName(searchRe, function(err, teamIds3) {
        var teamIds = teamIds1.concat(teamIds2);
        // teamIds = teamIds.concat(teamIds3);
        teamIds = _.uniqWith(teamIds, _.isEqual);
        getAuthorIdsByName(searchRe, function(err, userIds) {
          if (teamIds && teamIds.length > 0) or.push({ 'team': { $in: teamIds } });
          if (userIds && userIds.length > 0) or.push({ 'user': { $in: userIds } });
          callback(or, teamIds, userIds);
        });
        // });
      });
    });
  };

  var findBySearchString = function(callback) {
    if (req.query.searchString) {
      getSearchStringOr(function(or) {
        callback(or);
      });
    } else {
      callback();
    }
  };

  var findByTeammates = function(callback) {
    if (req.query.byTeammates) {
      getTeammates(req.user, function(err, teammates) {
        callback(teammates);
      });
    } else {
      callback();
    }
  };

  var findBySubmitted = function(callback) {
    if (req.query.bySubmitted) {
      getTeams(req.user, function(err, teams) {
        callback(teams);
      });
    } else {
      callback();
    }
  };


  findByTeammates(function(teammatesIds) {
    findBySubmitted(function(teamIds) {
      findBySearchString(function(or) {
        search(or, teammatesIds, teamIds);
      });
    });
  });
};

/**
 * Downloads
 */
exports.download = function(req, res) {
  var research = req.research;

  var activity = new ResearchActivity({
    user: req.user,
    research: req.research,
    activity: 'downloaded'
  });

  activity.save(function(err) {
    if (research.downloadImage && research.downloadImage.mimetype && research.downloadImage.path) {
      res.setHeader('Content-disposition', 'attachment;');
      res.setHeader('content-type', research.downloadImage.mimetype);

      request(research.downloadImage.path).pipe(res);
    } else {
      setImageToDownload(req.headers.host, research, function(err, fileInfo) {
        if (err) {
          return res.status(400).send({
            message: err
          });
        } else {
          res.setHeader('Content-disposition', 'attachment;');
          res.setHeader('content-type', fileInfo.mimetype);

          request(fileInfo.path).pipe(res);
        }
      });
    }
  });
};

/**
 * Uploads
 */
var uploadFileSuccess = function(research, res) {
  research.save(function(saveError) {
    if (saveError) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(saveError)
      });
    } else {
      res.json(research);
    }
  });
};

var uploadFileError = function(research, errorMessage, res) {
  return res.status(400).send({
    message: errorMessage
  });
};

exports.uploadHeaderImage = function (req, res) {
  var research = req.research;
  var upload = multer(config.uploads.researchHeaderImageUpload).single('newHeaderImage');
  var headerImageUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = headerImageUploadFileFilter;

  if (research) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.researchHeaderImageUpload,
    function(fileInfo) {
      research.headerImage = fileInfo;

      uploadFileSuccess(research, res);
    }, function(errorMessage) {
      uploadFileError(research, errorMessage, res);
    });
  } else {
    res.status(400).send({
      message: 'Research does not exist'
    });
  }
};

// exports.downloadFile = function(req, res){
//   res.setHeader('Content-disposition', 'attachment;');
//   res.setHeader('content-type', req.query.mimetype);
//
//   request(req.query.path).pipe(res);
// };

/**
 * Research middleware
 */
exports.researchByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Research is invalid'
    });
  }

  Research.findById(id).populate('user', 'displayName firstName lastName email profileImageURL username schoolOrg roles')
  .populate('team', 'name schoolOrg photo teamLead teamLeads').exec(function (err, research) {
    if (err) {
      return next(err);
    } else if (!research) {
      return res.status(404).send({
        message: 'No Research with that identifier has been found'
      });
    }
    if (req.query.full) {
      User.populate(research.team, { 'path': 'teamLead', 'select': 'displayName' }, function(err, output) {
        User.populate(research.team, { 'path': 'teamLeads', 'select': 'displayName' }, function(err, output) {
          SavedResearch.findOne({ research: research, user: req.user }).exec(function(err, savedResearch) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              req.research = research;
              req.researchSaved = (savedResearch) ? true : false;
              next();
            }
          });
        });
      });
    } else {
      req.research = research;
      next();
    }
  });
};
