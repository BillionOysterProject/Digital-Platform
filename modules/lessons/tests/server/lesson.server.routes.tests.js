'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  User = mongoose.model('User'),
  Lesson = mongoose.model('Lesson'),
  express = require(path.resolve('./config/lib/express')),
  CommonUser = require('../../../users/tests/e2e/common-users.e2e.tests');

var admin = CommonUser.admin;
var leader = CommonUser.leader;

/**
  * Globals
  */
var app,
  agent,
  user,
  credentials,
  lesson;

describe('Lesson CRUD tests', function () {
  before(function (done) {
    credentials = {
      username: leader.username,
      password: leader.password
    };

    done();
  });

  beforeEach(function(done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    User.findOne({ 'username': credentials.username }).exec(function(err, leaderUser) {
      should.not.exist(err);

      user = leaderUser;
      lesson = {

      };

      done();
    });
  });
});
