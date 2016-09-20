'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  CalendarEvent = mongoose.model('CalendarEvent'),
  SchoolOrg = mongoose.model('SchoolOrg'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  _ = require('lodash'),
  request = require('request'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  moment = require('moment'),
  lodash = require('lodash');

var emptyString = function(string) {
  if (!string || string === null || string === '') {
    return true;
  } else {
    return false;
  }
};

var validateEvent = function(calendarEvent, dates, successCallback, errorCallback) {
  var errorMessages = [];

  if (emptyString(calendarEvent.title)) {
    errorMessages.push('Please fill in Event title');
  }
  if (emptyString(calendarEvent.description)) {
    errorMessages.push('Please fill in Event description');
  }
  if (emptyString(calendarEvent.category.type)) {
    errorMessages.push('Please fill in Event category');
  } else {
    if (calendarEvent.category.type === 'other' && emptyString(calendarEvent.category.otherType)) {
      errorMessages.push('Please fill in Event other category');
    }
  }
  if (dates.length === 0) {
    errorMessages.push('Please fill in Event date and start/end time');
  } else {
    for (var n = 0; n < dates.length; n++) {
      if (emptyString(dates[n].date) || emptyString(dates[n].startTime) || emptyString(dates[n].endTime)) {
        errorMessages.push('Please fill in Event date and start/end time');
      }
    }
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(calendarEvent);
  }
};

var getDateTime = function(date, time) {
  var dateString = '';
  if (date && time) {
    dateString += moment(date).format('YYYY/MM/DD');
    dateString += ' ';
    dateString += moment(time, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm:ss');
    return moment(dateString, 'YYYY/MM/DD HH:mm:ss').toDate();
  } else {
    return '';
  }
};

var firstIndexOfAfter = function(ordered, date) {
  var index = _.findLastIndex(ordered, function(d) {
    return moment(d.startDateTime).isBefore(moment(date));
  });
  return index;
};

var sortDates = function(dates) {
  var ordered = [];
  for (var n = 0; n < dates.length; n++) {
    if (ordered.length === 0) {
      ordered.push(dates[n]);
    } else {
      var index = firstIndexOfAfter(ordered, dates[n].startDateTime);
      if (index >= 0) {
        ordered.splice(index+1, 0, dates[n]);
      } else {
        ordered.splice(0, 0, dates[n]);
      }
    }
  }
  return ordered;
};

/**
 * Create a CalendarEvent
 */
exports.create = function(req, res) {
  validateEvent(req.body, req.body.dates,
  function(eventJSON) {
    var calendarEvent = new CalendarEvent(eventJSON);
    for (var i = 0; i < req.body.dates.length; i++) {
      calendarEvent.dates[i].startDateTime = getDateTime(req.body.dates[i].date,
        req.body.dates[i].startTime);
      calendarEvent.dates[i].endDateTime = getDateTime(req.body.dates[i].date,
        req.body.dates[i].endTime);
    }
    calendarEvent.dates = sortDates(calendarEvent.dates);
    calendarEvent.deadlineToRegister = (req.body.deadlineToRegister) ? moment(req.body.deadlineToRegister,
      'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('day').toDate() : '';
    calendarEvent.resources.resourcesFiles = [];
    calendarEvent.user = req.user;

    var pattern = /^data:image\/jpeg;base64,/i;
    if (pattern.test(calendarEvent.featuredImage.path)) {
      calendarEvent.featuredImage.path = '';
    }

    calendarEvent.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(calendarEvent);
      }
    });
  });
};

var fillInRegistrantsData = function(registrants, callback) {
  var getOrgTeamValues = function(index, registrantsList, callbackInternal) {
    if (index < registrantsList.length) {
      var registrant = registrantsList[index];
      SchoolOrg.findById(registrant.user.schoolOrg).select('name').exec(function(err, schoolOrg) {
        registrant.user.schoolOrg = schoolOrg;
        Team.find({ $or: [{ 'teamLead': registrant.user._id },
          { 'teamMembers': registrant.user._id }] }, { 'name': 1 }).exec(function(err, teams) {
            if (teams && teams.length > 0) {
              var teamNames = [];
              for (var i = 0; i < teams.length; i++) {
                teamNames.push(teams[i].name);
              }
              registrant.user.teams = teamNames.join(', ');
            }
            registrantsList[index] = registrant;
            getOrgTeamValues(index+1, registrantsList, callbackInternal);
          });
      });
    } else {
      callbackInternal(registrantsList);
    }
  };

  getOrgTeamValues(0, registrants, function(registrantsList) {
    callback(registrantsList);
  });
};

/**
 * Show the current CalendarEvent
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var calendarEvent = req.calendarEvent ? req.calendarEvent.toJSON() : {};

  if (req.user) {
    // is the current user the owner of the event
    calendarEvent.isCurrentUserOwner = req.user && calendarEvent.user &&
      calendarEvent.user._id.toString() === req.user._id.toString();

    // is the current user registered for the event
    var index = _.findIndex(calendarEvent.registrants, function(r) {
      return r.user._id.toString() === req.user._id.toString();
    });
    calendarEvent.isRegistered = (index > -1) ? true : false;
  }
  calendarEvent.dates = sortDates(calendarEvent.dates);

  if (req.query.full) {
    fillInRegistrantsData(calendarEvent.registrants, function(registrants) {
      calendarEvent.registrants = registrants;
      res.json(calendarEvent);
    });
  } else if (req.query.duplicate) {
    delete calendarEvent._id;
    delete calendarEvent._created;
    delete calendarEvent.title;
    delete calendarEvent.user;

    res.json(calendarEvent);
  } else {
    res.json(calendarEvent);
  }
};

/**
 * Update a CalendarEvent
 */
exports.update = function(req, res) {
  var calendarEvent = req.calendarEvent;
  validateEvent(req.body, req.body.dates,
  function(eventJSON) {
    if (calendarEvent) {
      calendarEvent = _.extend(calendarEvent, eventJSON);
      for (var i = 0; i < req.body.dates.length; i++) {
        calendarEvent.dates[i].startDateTime = getDateTime(req.body.dates[i].date,
          req.body.dates[i].startTime);
        calendarEvent.dates[i].endDateTime = getDateTime(req.body.dates[i].date,
          req.body.dates[i].endTime);
      }
      calendarEvent.dates = sortDates(calendarEvent.dates);

      calendarEvent.deadlineToRegister = (req.body.deadlineToRegister) ? moment(req.body.deadlineToRegister,
        'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('day').toDate() : '';

      var existingResources = [];
      for (var j = 0; j < calendarEvent.resources.resourcesFiles.length; j++) {
        var resource = calendarEvent.resources.resourcesFiles[j];
        if (resource.path && resource.originalname && resource.filename) {
          existingResources.push(resource);
        }
      }
      calendarEvent.resources.resourcesFiles = existingResources;

      var pattern = /^data:image\/jpeg;base64,/i;
      if (pattern.test(calendarEvent.featuredImage.path)) {
        calendarEvent.featuredImage.path = '';
      }

      calendarEvent.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(calendarEvent);
        }
      });
    } else {
      return res.status(400).send({
        message: 'Could not find event'
      });
    }
  });
};

var deleteInternal = function(calendarEvent, successCallback, errorCallback) {
  var filesToDelete = [];
  if (calendarEvent.featuredImage && calendarEvent.featuredImage.path) {
    filesToDelete.push(calendarEvent.featuredImage.path);
  }
  if (calendarEvent.resources && calendarEvent.resources.resourcesFiles) {
    for (var k = 0; k < calendarEvent.resources.resourcesFiles.length; k++) {
      filesToDelete.push(calendarEvent.resources.resourcesFiles[k].path);
    }
  }

  if (filesToDelete.length > 0) {
    var uploadRemote = new UploadRemote();
    uploadRemote.deleteRemote(filesToDelete,
    function() {
      calendarEvent.remove(function(err) {
        if (err) {
          errorCallback(errorHandler.getErrorMessage(err));
        } else {
          successCallback(calendarEvent);
        }
      });
    }, function(err) {
      errorCallback(err);
    });
  } else {
    calendarEvent.remove(function(err) {
      if (err) {
        errorCallback(errorHandler.getErrorMessage(err));
      } else {
        successCallback(calendarEvent);
      }
    });
  }
};

var uploadFileSuccess = function(calendarEvent, res) {
  calendarEvent.save(function (saveError) {
    if (saveError) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(saveError)
      });
    } else {
      res.json(calendarEvent);
    }
  });
};

var uploadFileError = function(calendarEvent, errorMessage, res) {
  deleteInternal(calendarEvent,
  function(calendarEvent) {
    return res.status(400).send({
      message: errorMessage
    });
  }, function(err) {
    return res.status(400).send({
      message: err
    });
  });
};

exports.uploadFeaturedImage = function (req, res) {
  var calendarEvent = req.calendarEvent;
  var upload = multer(config.uploads.eventFeaturedImageUpload).single('newFeaturedImage');
  var featuredImageUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = featuredImageUploadFileFilter;

  if (calendarEvent) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.eventFeaturedImageUpload,
    function(fileInfo) {
      calendarEvent.featuredImage = fileInfo;

      uploadFileSuccess(calendarEvent, res);
    }, function (errorMessage) {
      uploadFileError(calendarEvent, errorMessage, res);
    });
  } else {
    res.status(400).send({
      message: 'Event does not exist'
    });
  }
};

exports.uploadResources = function (req, res) {
  var calendarEvent = req.calendarEvent;
  var upload = multer(config.uploads.eventResourcesUpload).single('newResourceFile', 20);

  var resourceUploadFileFilter = require(path.resolve('./config/lib/multer')).fileUploadFileFilter;
  upload.fileFilter = resourceUploadFileFilter;

  if (calendarEvent) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.eventResourcesUpload,
    function(fileInfo) {
      calendarEvent.resources.resourcesFiles.push(fileInfo);
      uploadFileSuccess(calendarEvent, res);
    }, function(errorMessage) {
      uploadFileError(calendarEvent, errorMessage, res);
    });
  } else {
    res.status(400).send({
      message: 'Event does not exist'
    });
  }
};

exports.downloadFile = function(req, res) {
  res.setHeader('Content-disposition', 'attachment');
  res.setHeader('content-type', req.query.mimetype);

  request(req.query.path).pipe(res);
};

var findUserInRegistrants = function(user, registrants) {
  var index = _.findIndex(registrants, function(r) {
    return r.user._id.toString() === user._id.toString();
  });
  return index;
};

exports.register = function(req, res) {
  var calendarEvent = req.calendarEvent;
  var user = req.user;

  if (calendarEvent) {
    var index = findUserInRegistrants(user, calendarEvent.registrants);
    if (index > -1) {
      return res.status(400).send({
        message: 'User is already registered for event'
      });
    } else {
      calendarEvent.registrants.push({
        user: req.user,
        registrationDate: new Date()
      });

      calendarEvent.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var calendarEventJSON = calendarEvent ? calendarEvent.toJSON() : {};

          fillInRegistrantsData(calendarEventJSON.registrants, function(registrants) {
            calendarEventJSON.registrants = registrants;
            res.json(calendarEventJSON);
          });
        }
      });
    }
  } else {
    return res.status(400).send({
      message: 'Could not find event'
    });
  }
};

exports.unregister = function(req, res) {
  var calendarEvent = req.calendarEvent;
  var user = req.user;

  if (calendarEvent) {
    var index = findUserInRegistrants(user, calendarEvent.registrants);

    if (index === -1) {
      return res.status(400).send({
        message: 'User is not registered for event'
      });
    } else {
      calendarEvent.registrants.splice(index, 1);

      calendarEvent.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var calendarEventJSON = calendarEvent ? calendarEvent.toJSON() : {};

          fillInRegistrantsData(calendarEventJSON.registrants, function(registrants) {
            calendarEventJSON.registrants = registrants;
            res.json(calendarEventJSON);
          });
        }
      });
    }
  } else {
    return res.status(400).send({
      message: 'Could not find event'
    });
  }
};

/**
 * Delete an CalendarEvent
 */
exports.delete = function(req, res) {
  var calendarEvent = req.calendarEvent;

  deleteInternal(calendarEvent,
  function(calendarEvent) {
    res.json(calendarEvent);
  }, function(err) {
    return res.status(400).send({
      message: err
    });
  });
};

/**
 * List of CalendarEvents
 */
exports.list = function(req, res) {
  var query;
  var and = [];

  if (req.query.category) {
    and.push({ 'event.category.type': req.query.category });
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

    or.push({ 'title': searchRe });
    or.push({ 'description': searchRe });

    and.push({ $or: or });
  }

  var startDate;
  var endDate;
  if (req.query.startDate && req.query.endDate) {
    startDate = moment(req.query.startDate).toDate();
    endDate = moment(req.query.endDate).toDate();

    if (startDate && endDate) {
      and.push({ $and: [{ 'dates.startDateTime': { '$gte': startDate } }, { 'dates.startDateTime': { '$lte': endDate } },
      { 'dates.endDateTime': { '$gte': startDate } }, { 'dates.endDateTime': { '$lte': endDate } }] });
    }
  }

  if (and.length === 1) {
    query = CalendarEvent.find(and[0]);
  } else if (and.length > 0) {
    query = CalendarEvent.find({ $and: and });
  } else {
    query = CalendarEvent.find();
  }

  query.sort('dates.startDateTime')
    .populate('user', 'displayName')
    .populate('registrants.user', 'displayName email schoolOrg')
    .populate('registrants.user.schoolOrg', 'name')
    .exec(function(err, events) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(events);
      }
    });
};

/**
 * CalendarEvent middleware
 */
exports.eventByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Event is invalid'
    });
  }

  CalendarEvent.findById(id)
    .populate('user', 'displayName')
    .populate('registrants.user', 'displayName email schoolOrg')
    .populate('registrants.user.schoolOrg', 'name')
    .exec(function (err, calendarEvent) {
      if (err) {
        return next(err);
      } else if (!calendarEvent) {
        return res.status(404).send({
          message: 'No Event with that identifier has been found'
        });
      }

      req.calendarEvent = calendarEvent;
      next();
    });
};
