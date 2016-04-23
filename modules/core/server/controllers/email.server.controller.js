'use strict';

var path = require('path'),
  fs = require('fs'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  ses = require('nodemailer-ses-transport');

var defaultFrom = process.env.MAILER_FROM || 'Billion Oyster Project <bop@fearless.tech>';

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
exports.sendEmail = function(to, subject, bodyText, bodyHtml, successCallback, errorCallback) {
  if (to && subject && bodyText && bodyHtml) {
    to = toAddresses(to);

    transporter.sendMail({
      from: defaultFrom,
      to: to,
      subject: subject,
      text: bodyText,
      html: bodyHtml
    }, function(err, info) {
      if (err) errorCallback(err.message);
      successCallback(info);
    });
  } else {
    errorCallback('Must have to address(es), subject, and body');
  }
};

var sendTemplate = function(to, from, subject, bodyTemplate, data, successCallback, errorCallback) {
  if (to && subject && bodyTemplate && data) {
    to = toAddresses(to);

    var textContent = fs.readFileSync(
      path.resolve('./modules/core/server/templates/email-text/' + bodyTemplate + '.txt'), 'binary');

    var htmlContent = fs.readFileSync(
      path.resolve('./modules/core/server/templates/email-html/' + bodyTemplate + '.html'), 'binary');

    var bodyText = runTemplate(textContent, data);
    var bodyHtml = runTemplate(htmlContent, data);

    transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: bodyText,
      html: bodyHtml
    }, function(err, info) {
      if (err) errorCallback(err.message);
      successCallback(info);
    });
  } else {
    errorCallback('Must have to addresses(es), subject, and body');
  }
};

exports.sendEmailTemplate = function(to, subject, bodyTemplate, data, successCallback, errorCallback) {
  sendTemplate(to, defaultFrom, subject, bodyTemplate, data, successCallback, errorCallback);
};

var sendFeedback = function(to, from, template, res, req) {
  if (to && from && req.body.subject && template && req.body.data) {
    sendTemplate(to, from, req.body.subject, template, req.body.data,
    function(info) {
      res.status(200).send({
        message: 'Feedback send successfully'
      });
    }, function(errorMessage) {
      return res.status(400).send({
        message: errorMessage
      });
    });
  } else {
    res.status(400).send({
      message: 'Must have to address, from address, subject, and body'
    });
  }
};

exports.sendBugReport = function(req, res) {
  if (req.body.data) req.body.data.browser = req.headers['user-agent'];
  sendFeedback('jira@fearless.jira.com', defaultFrom, '', req, res);
};

exports.sendGeneralFeedback = function(req, res) {
  sendFeedback(defaultFrom, req.user.email, '', req, res);
};

exports.sendHelpQuestion = function(req, res) {
  sendFeedback(defaultFrom, req.user.email, '', req, res);
};

exports.sendLessonFeedback = function(req, res) {
  sendFeedback(req.body.to, req.user.email, 'lesson_feedback', req, res);
};

exports.sendUnitFeedback = function(req, res) {
  sendFeedback(req.body.to, req.user.email, 'unit_feedback', req, res);
};
