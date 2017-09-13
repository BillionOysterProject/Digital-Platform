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
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
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

var getExistingResources = function(resourcesFiles) {
  var existingResources = [];
  if (resourcesFiles) {
    for (var j = 0; j < resourcesFiles.length; j++) {
      var resource = resourcesFiles[j];
      if (resource.path !== undefined && resource.path !== '' &&
        resource.originalname !== undefined && resource.originalname !== '' &&
        resource.filename !== undefined && resource.filename !== '' &&
        resource.mimetype !== undefined && resource.mimetype !== '') {
        existingResources.push(resource);
      }
    }
  }
  return existingResources;
};

/**
 * Create a CalendarEvent
 */
exports.create = function(req, res) {
  validateEvent(req.body, req.body.dates,
  function(eventJSON) {
    var calendarEvent = new CalendarEvent(eventJSON);
    for (var i = 0; i < req.body.dates.length; i++) {
      calendarEvent.dates[i].startDateTime = moment(req.body.dates[i].startDateTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
      calendarEvent.dates[i].endDateTime = moment(req.body.dates[i].endDateTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    }
    calendarEvent.dates = sortDates(calendarEvent.dates);
    calendarEvent.deadlineToRegister = (req.body.deadlineToRegister) ?
      moment(req.body.deadlineToRegister,'YYYY-MM-DDTHH:mm:ss.SSSZ') : '';

    if (!calendarEvent.resources) {
      calendarEvent.resources = {
        resourcesFiles: []
      };
    } else {
      calendarEvent.resources.resourcesFiles = [];
    }
    calendarEvent.resources.resourcesFiles = getExistingResources(req.body.resources.resourcesFiles);
    calendarEvent.user = req.user;

    var pattern = /^data:image\/[a-z]*;base64,/i;
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
  }, function(errorMessages) {
    var msgConcat = 'Error validating event data';
    if(errorMessages !== undefined && errorMessages !== null && errorMessages.length > 0) {
      msgConcat += ': ';
      for(var i = 0; i < errorMessages.length; i++) {
        msgConcat += errorMessages[i];
        if(i < errorMessages.length-1) {
          msgConcat += '; ';
        }
      }
    }
    return res.status(400).send({
      message: msgConcat
    });
  });
};

var fillInRegistrantsData = function(registrants, callback) {
  var getOrgTeamValues = function(index, registrantsList, callbackInternal) {
    if (index < registrantsList.length) {
      var registrant = registrantsList[index];
      if (registrant && registrant.user) {
        var registrantId = (registrant.user._id) ? registrant.user._id : registrant.user;
        Team.find({ $or: [{ 'teamLead': registrantId },
        { 'teamMembers': registrantId }] }, { 'name': 1 }).exec(function(err, teams) {
          if (teams && teams.length > 0) {
            var teamNames = [];
            for (var i = 0; i < teams.length; i++) {
              teamNames.push(teams[i].name);
            }
            if (registrant.user && registrant.user._id) {
              registrant.user.teams = teamNames.join(', ');
            } else {
              registrant.user = {
                _id: registrantId,
                teams: teamNames.join(', ')
              };
            }
          }
          if (registrant.user.schoolOrg) {
            var schoolOrgId = (registrant.user.schoolOrg._id) ? registrant.user.schoolOrg._id : registrant.user.schoolOrg;
            SchoolOrg.findById(schoolOrgId).select('name').exec(function(err, schoolOrg) {
              registrant.user.schoolOrg = schoolOrg;
              registrantsList[index] = registrant;
              getOrgTeamValues(index+1, registrantsList, callbackInternal);
            });
          } else {
            registrantsList[index] = registrant;
            getOrgTeamValues(index+1, registrantsList, callbackInternal);
          }
        });
      } else {
        getOrgTeamValues(index+1, registrantsList, callbackInternal);
      }
    } else {
      callbackInternal(registrantsList);
    }
  };

  getOrgTeamValues(0, registrants, function(registrantsList) {
    callback(registrantsList);
  });
};

var getAttendees = function(registrants) {
  var attendees = [];
  if (registrants) {
    for (var i = 0; i < registrants.length; i++) {
      if (registrants[i].attended === true) {
        attendees.push(registrants[i]);
      }
    }
  }
  return attendees;
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
      if (r && r.user && r.user._id && req.user && req.user._id) {
        return r.user._id.toString() === req.user._id.toString();
      } else {
        return false;
      }
    });
    calendarEvent.isRegistered = (index > -1) ? true : false;
  }
  calendarEvent.dates = sortDates(calendarEvent.dates);

  if (req.query.full) {
    fillInRegistrantsData(calendarEvent.registrants, function(registrants) {
      calendarEvent.registrants = registrants;
      calendarEvent.attendees = getAttendees(calendarEvent.registrants);
      res.json(calendarEvent);
    });
  } else if (req.query.duplicate) {
    delete calendarEvent._id;
    delete calendarEvent._created;
    delete calendarEvent.user;
    delete calendarEvent.registrants;
    delete calendarEvent.dates;
    calendarEvent.dates = [];
    delete calendarEvent.deadlineToRegister;

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
        calendarEvent.dates[i].startDateTime = moment(req.body.dates[i].startDateTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
        calendarEvent.dates[i].endDateTime = moment(req.body.dates[i].endDateTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
      }
      calendarEvent.dates = sortDates(calendarEvent.dates);

      calendarEvent.deadlineToRegister = (req.body.deadlineToRegister) ?
        moment(req.body.deadlineToRegister,'YYYY-MM-DDTHH:mm:ss.SSSZ') : '';

      if (!calendarEvent.resources) {
        calendarEvent.resources = {
          resourcesFiles: []
        };
      } else {
        calendarEvent.resources.resourcesFiles = [];
      }
      calendarEvent.resources.resourcesFiles = getExistingResources(req.body.resources.resourcesFiles);

      var pattern = /^data:image\/[a-z]*;base64,/i;
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
    if (r && r.user && r.user._id && user && user._id) {
      return r.user._id.toString() === user._id.toString();
    } else {
      return false;
    }
  });
  return index;
};

exports.register = function(req, res) {
  var calendarEvent = req.calendarEvent;
  var user = req.user;
  var eventDate = req.body.dateTimeString;

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

            var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

            var sendEventFullEmail = function(callback) {
              if (calendarEventJSON.maximumCapacity === calendarEventJSON.registrants.length) {
                email.sendEmailTemplate(calendarEventJSON.user.email, calendarEventJSON.title + ' registration is now full', 'event_maxcapacity', {
                  FirstName: calendarEventJSON.user.firstName,
                  EventName: calendarEventJSON.title,
                  EventDate: eventDate,
                  LinkEvent: httpTransport + req.headers.host + '/events/' + calendarEventJSON._id,
                  LinkProfile: httpTransport + req.headers.host + '/profiles'
                }, function(info) {
                  callback();
                }, function(errorMessage) {
                  callback();
                });
              } else {
                callback();
              }
            };

            email.sendEmailTemplate(req.user.email, 'You are now registered for ' + calendarEventJSON.title, 'event_confirmation', {
              EventName: calendarEventJSON.title,
              FirstName: req.user.firstName,
              EventDate: eventDate,
              LinkEvent: httpTransport + req.headers.host + '/events/' + calendarEventJSON._id,
              LinkProfile: httpTransport + req.headers.host + '/profiles'
            }, function (info) {
              sendEventFullEmail(function () {
                res.json(calendarEventJSON);
              });
            }, function (errorMessage) {
              sendEventFullEmail(function () {
                res.json(calendarEventJSON);
              });
            });
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

exports.attended = function(req, res) {
  var calendarEvent = req.calendarEvent;
  var user = req.body.registrant;

  if (calendarEvent) {
    var index = findUserInRegistrants(user, calendarEvent.registrants);
    if (index > -1) {
      calendarEvent.registrants[index].attended = true;

      calendarEvent.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var calendarEventJSON = calendarEvent ? calendarEvent.toJSON() : {};

          fillInRegistrantsData(calendarEventJSON.registrants, function(registrants) {
            calendarEventJSON.registrants = registrants;
            calendarEventJSON.attendees = getAttendees(calendarEventJSON.registrants);

            res.json(calendarEventJSON);
          });
        }
      });
    } else {
      return res.status(400).send({
        message: 'User is not registered for event'
      });
    }
  } else {
    return res.status(400).send({
      message: 'Could not find event'
    });
  }
};

exports.notAttended = function(req, res) {
  var calendarEvent = req.calendarEvent;
  var user = req.body.registrant;

  if (calendarEvent) {
    var index = findUserInRegistrants(user, calendarEvent.registrants);
    if (index > -1) {
      calendarEvent.registrants[index].attended = false;

      calendarEvent.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var calendarEventJSON = calendarEvent ? calendarEvent.toJSON() : {};

          fillInRegistrantsData(calendarEventJSON.registrants, function(registrants) {
            calendarEventJSON.registrants = registrants;
            calendarEventJSON.attendees = getAttendees(calendarEventJSON.registrants);

            res.json(calendarEventJSON);
          });
        }
      });
    } else {
      return res.status(400).send({
        message: 'User is not registered for event'
      });
    }
  } else {
    return res.status(400).send({
      message: 'Could not find event'
    });
  }
};

exports.registrantNotes = function(req, res) {
  var calendarEvent = req.calendarEvent;
  var user = req.body.registrant;
  var note = req.body.note;

  if (calendarEvent) {
    var index = findUserInRegistrants(user, calendarEvent.registrants);
    if (index > -1) {
      calendarEvent.registrants[index].note = note;

      calendarEvent.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var calendarEventJSON = calendarEvent ? calendarEvent.toJSON() : {};

          fillInRegistrantsData(calendarEventJSON.registrants, function(registrants) {
            calendarEventJSON.registrants = registrants;
            calendarEventJSON.attendees = getAttendees(calendarEventJSON.registrants);

            res.json(calendarEventJSON);
          });
        }
      });
    } else {
      return res.status(400).send({
        message: 'User is not registered for event'
      });
    }
  } else {
    return res.status(400).send({
      message: 'Could not find event'
    });
  }
};

var getRegistrantsList = function(registrants) {
  var emailArray = [];
  emailArray = emailArray.concat(_.map(registrants, 'user.email'));
  return emailArray;
};

exports.emailRegistrants = function(req, res) {
  var calendarEvent = req.calendarEvent;
  var user = req.user;
  var attendeesOnly = req.body.attendeesOnly;
  var subject = req.body.subject;
  var message = req.body.message;
  var footer = req.body.footer;
  var eventDate = req.body.dateTimeString;

  if (calendarEvent) {
    var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

    var emailList = (attendeesOnly) ? getAttendees(calendarEvent.registrants) : calendarEvent.registrants;
    var toList = getRegistrantsList(emailList);

    email.sendEmailTemplate(toList, subject, 'event_email', {
      EventEmailSubject: subject,
      EventEmailMessage: message,
      Footer: footer,
      EventName: calendarEvent.title,
      EventDate: eventDate,
      LinkEvent: httpTransport + req.headers.host + '/events/' + calendarEvent._id,
      LinkProfile: httpTransport + req.headers.host + '/profiles'
    }, function (info) {
      res.json(calendarEvent);
    }, function (errorMessage) {
      res.json(calendarEvent);
    });
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
  var user = (req.query.userId ? req.query.userId : req.user);
  var and = [];

  if(req.query.byRegistrants) {
    and.push({ 'registrants.user': user });
  }

  if (req.query.type) {
    and.push({ 'category.type': req.query.type });
  }

  if (req.query.timeFrame === 'Upcoming events') {
    var today1 = moment().local().startOf('day').toDate();
    and.push({ 'dates.startDateTime': { '$gte': today1 } });
  } else if (req.query.timeFrame === 'Past events') {
    var today2 = moment().local().startOf('day').toDate();
    and.push({ 'dates.startDateTime': { '$lt': today2 } });
  }

  if (req.query.availability === 'Registration open') {

  } else if (req.query.availability === 'Registration closed') {

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
    or.push({ 'skillsTaught': searchRe });

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

  var limit = req.query.limit ? parseInt(req.query.limit, 10) : 0;
  query.sort({ 'dates.startDateTime': 1 })
    .limit(limit)
    .populate('user', 'displayName')
    .populate('registrants.user', 'displayName email schoolOrg')
    .populate('registrants.user.schoolOrg', 'name')
    .populate('category.type')
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
    .populate('user', 'displayName firstName email')
    .populate('registrants.user', 'displayName email schoolOrg')
    .populate('registrants.user.schoolOrg', 'name')
    .populate('category.type')
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
