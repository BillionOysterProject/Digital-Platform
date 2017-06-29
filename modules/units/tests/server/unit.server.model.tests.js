'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  User = mongoose.model('User'),
  Unit = mongoose.model('Unit'),
  MetaCclsElaScienceTechnicalSubject = mongoose.model('MetaCclsElaScienceTechnicalSubject'),
  MetaCclsMathematics = mongoose.model('MetaCclsMathematics'),
  MetaNgssCrossCuttingConcept = mongoose.model('MetaNgssCrossCuttingConcept'),
  MetaNgssDisciplinaryCoreIdea = mongoose.model('MetaNgssDisciplinaryCoreIdea'),
  MetaNgssScienceEngineeringPractice = mongoose.model('MetaNgssScienceEngineeringPractice'),
  MetaNycssUnit = mongoose.model('MetaNycssUnit'),
  MetaNysssKeyIdea = mongoose.model('MetaNysssKeyIdea'),
  MetaNysssMajorUnderstanding = mongoose.model('MetaNysssMajorUnderstanding'),
  MetaNysssMst = mongoose.model('MetaNysssMst'),
  CommonUser = require('../../../users/tests/e2e/common-users.e2e.tests'),
  async = require('async');

var admin = CommonUser.admin;
var leader = CommonUser.leader;
var member1 = CommonUser.member1;
var team = CommonUser.team;
var organization = CommonUser.organization;

var metaCclsElaScienceTechnicalSubject = '57028f85ecf01e67b1b3031f';
var metaCclsMathematics = '570284b0ecf01e67b1b302f6';
var metaNgssCrossCuttingConcept = '57029504ecf01e67b1b3036e';
var metaNgssDisciplinaryCoreIdea = '570295b9ecf01e67b1b30393';
var metaNgssScienceEngineeringPractice = '570297bfecf01e67b1b303f4';
var metaNycssUnit = '57029868ecf01e67b1b30418';
var metaNysssKeyIdea = '570299daecf01e67b1b30424';
var metaNysssMajorUnderstanding = '57029b08ecf01e67b1b30430';
var metaNysssMst = '57029c16ecf01e67b1b304d8';

/**
 * Globals
 */
var user, unit;

/**
 * Unit tests
 */
describe('Unit Model Unit Tests:', function() {
  beforeEach(function(done) {
    User.findOne({ 'username': admin.username }).exec(function(err, adminUser) {
      should.not.exist(err);

      user = adminUser;
      unit = new Unit({
        title: 'Test Unit',
        color: '#00ff00',
        icon: 'fa fa-anchor',
        highlights: 'Highlight',
        rationale: 'Rationale',
        standards: {
          cclsElaScienceTechnicalSubjects: [metaCclsElaScienceTechnicalSubject],
          cclsMathematics: [metaCclsMathematics],
          ngssCrossCuttingConcepts: [metaNgssCrossCuttingConcept],
          ngssDisciplinaryCoreIdeas: [metaNgssDisciplinaryCoreIdea],
          ngssScienceEngineeringPractices: [metaNgssScienceEngineeringPractice],
          nycsssUnits: [metaNycssUnit],
          nysssKeyIdeas: [metaNysssKeyIdea],
          nysssMajorUnderstandings: [metaNysssMajorUnderstanding],
          nysssMst: [metaNysssMst]
        },
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return unit.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function(done) {
      unit.title = '';

      return unit.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when trying to save without a user', function(done) {
      unit.user = null;

      return unit.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Unit.find({ 'title': unit.title }).exec(function(err, units) {
      async.forEach(units, function(unit,callback) {
        unit.remove(function(err) {
          callback();
        });
      }, function(err) {
        done();
      });
    });
  });
});
