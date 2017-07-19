'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Research = mongoose.model('Research'),
  CommonUser = require('../../../users/tests/e2e/common-users.e2e.tests'),
  async = require('async');

var admin = CommonUser.admin;
var leader = CommonUser.leader;
var member1 = CommonUser.member1;
var member2 = CommonUser.member2;
var team = CommonUser.team;
var organization = CommonUser.organization;

/**
 * Globals
 */
var user,
  research;

/**
 * Unit tests
 */
describe('Research Model Unit Tests:', function() {
  beforeEach(function(done) {
    User.findOne({ 'username': member1.username }).exec(function(err, memberUser) {
      user = memberUser;
      research = new Research({
        color: '#ff00ff',
        font: 'serif',
        title: 'Test Research',
        intro: 'Hello World!',
        methods: 'Methods',
        results: 'Results',
        discussion: 'Discussion',
        cited: 'Cited',
        acknowledgments: 'Thanks!',
        other: {
          title: 'Different Section',
          content: 'Some stuff'
        },
        user: user,
        team: team._id
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return research.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      research.title = '';

      return research.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Research.find({ 'title': research.title }).exec(function(err, researches) {
      async.forEach(researches, function(research, callback) {
        research.remove(function(err) {
          callback();
        });
      }, function(err) {
        done();
      });
    });
  });
});
