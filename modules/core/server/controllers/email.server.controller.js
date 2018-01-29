'use strict';

var path = require('path'),
  fs = require('fs'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  ses = require('nodemailer-ses-transport');

var defaultFrom = process.env.MAILER_FROM || 'Billion Oyster Project <bop.digital.platform@nyharbor.org>';
var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

var transporter = nodemailer.createTransport(ses(config.mailer.options.ses));

var toAddresses = function(to) {
  if (_.isArray(to)) {
    return to.join(', ');
  } else {
    return to;
  }
};

var runTemplate = function(string, data) {
  var compiled = _.template(string);
  return compiled(data);
};


/**
 * Send email
 */
exports.sendEmail = function(to, subject, bodyText, bodyHtml, successCallback, errorCallback, attachments) {
  if (to && subject && bodyText && bodyHtml) {
    to = toAddresses(to);
    if (!attachments) {
      attachments = [];
    }

    transporter.sendMail({
      from: defaultFrom,
      bcc: to,
      subject: subject,
      text: bodyText,
      html: bodyHtml,
      attachments: attachments
    }, function(err, info) {
      if (err) errorCallback(err.message);
      successCallback(info);
    });
  } else {
    errorCallback('Must have to address(es), subject, and body');
  }
};

var sendTemplate = function(to, from, subject, bodyTemplate, data, successCallback, errorCallback, attachments) {
  if (to && subject && bodyTemplate && data) {
    to = toAddresses(to);

    var textContent = fs.readFileSync(
      path.resolve('./modules/core/server/templates/email-text/' + bodyTemplate + '.txt'), 'binary');

    var htmlContent = fs.readFileSync(
      path.resolve('./modules/core/server/templates/email-html/' + bodyTemplate + '.html'), 'binary');

    var bodyText = runTemplate(textContent, data);
    var bodyHtml = runTemplate(htmlContent, data);

    if (!attachments) {
      attachments = [];
    }
    attachments.push({
      filename: 'logo.png',
      path: 'https://s3-us-west-1.amazonaws.com/digital-platform-dev-files/uploads/logo.png',
      cid: 'bop-logo.ee' //same cid value as in the html img src
    });

    transporter.sendMail({
      from: defaultFrom,
      replyTo: from,
      bcc: to,
      subject: subject,
      text: bodyText,
      html: bodyHtml,
      attachments: attachments
    }, function(err, info) {
      if (err) {
        console.log('err', err);
        errorCallback(err.message);
      } else {
        //console.log('info', info);
        successCallback(info);
      }
    });
  } else {
    errorCallback('Must have to addresses(es), subject, and body');
  }
};

exports.sendEmailTemplate = function(to, subject, bodyTemplate, data, successCallback, errorCallback, attachments) {
  sendTemplate(to, defaultFrom, subject, bodyTemplate, data, successCallback, errorCallback, attachments);
};

exports.sendEmailTemplateFromUser = function(to, from, subject, bodyTemplate, data, successCallback, errorCallback, attachments) {
  sendTemplate(to, from, subject, bodyTemplate, data, successCallback, errorCallback, attachments);
};

exports.sendFeedback = function(to, from, subject, data, template, req, res) {
  if (to && from && subject && template && data) {
    sendTemplate(to, from, subject, template, data,
    function(info) {
      return res.status(200).send({
        message: 'Feedback send successfully'
      });
    }, function(errorMessage) {
      return res.status(400).send({
        message: errorMessage
      });
    });
  } else {
    return res.status(400).send({
      message: 'Must have to address, from address, subject, and body'
    });
  }
};

exports.sendBugReport = function(req, res) {
  var data = {
    UserName: (req.user) ? req.user.displayName + '<' + req.user.email + '>' : 'Guest',
    BrowserDetails: req.headers['user-agent'],
    Location: req.body.location,
    Issue: req.body.issue
  };
  var email = (req.user) ? req.user.email : defaultFrom;
  exports.sendFeedback('bop.digital.platform@nyharbor.org', email, req.body.subject, data, 'bug_report', req, res);
};

exports.sendGeneralFeedback = function(req, res) {
  var data = {
    FeedbackNote: req.body.message,
    FeedbackName: (req.user) ? req.user.displayName : 'Guest',
    FeedbackEmail: (req.user) ? req.user.email : 'N/A',
    OrgName: (req.user && req.user.schoolOrg) ? req.user.schoolOrg.name : 'N/A'
  };
  var email = (req.user) ? req.user.email : defaultFrom;
  exports.sendFeedback(defaultFrom, email, 'BOP General Feedback: ' + req.body.subject, data, 'feedback', req, res);
};

exports.sendHelpQuestion = function(req, res) {
  var data = {
    FeedbackNote: req.body.message,
    FeedbackName: (req.user) ? req.user.displayName : 'Guest',
    FeedbackEmail: (req.user) ? req.user.email : 'N/A',
    OrgName: (req.user && req.user.schoolOrg) ? req.user.schoolOrg.name : 'N/A'
  };
  var email = (req.user) ? req.user.email : defaultFrom;
  exports.sendFeedback(defaultFrom, email, 'BOP Help Question: ' + req.body.subject, data, 'feedback', req, res);
};

exports.sendUnitFeedback = function(req, res) {
  var subject = 'Feedback from ' + req.user.displayName + ' about your unit ' + req.body.unit.title;
  var data = {
    FirstName: req.body.unit.user.firstName,
    UnitFeedbackName: req.user.displayName,
    UnitName: req.body.unit.title,
    UnitFeedbackNote: req.body.message,
    LinkUnit: httpTransport + req.headers.host + '/units/' + req.body.unit._id,
    LinkProfile: httpTransport + req.headers.host + '/profiles'
  };
  exports.sendFeedback(req.body.unit.user.email, req.user.email, subject, data, 'unit_feedback', req, res);
};

exports.sendShare = function(req, res) {
  var subject = req.body.subject;
  var data = {
    ShareSubject: subject,
    ShareToName: req.body.toName,
    ShareMessage: req.body.message,
    ShareLink: req.body.link,
    ShareFromName: req.user.displayName
  };
  exports.sendFeedback(req.body.toEmail, req.user.email, subject, data, 'share', req, res);
};
