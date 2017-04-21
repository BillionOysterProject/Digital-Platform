'use strict';

var path = require('path'),
  moment = require('moment'),
  CommonUser = require('../../../users/tests/e2e/common-users.e2e.tests'),
  signinAs = CommonUser.signinAs,
  signout = CommonUser.signout,
  signup = CommonUser.signup,
  CommonExpedition = require('../../../expeditions/tests/e2e/common-expeditions.e2e.tests'),
  uploadImage = CommonExpedition.uploadImage,
  assertImage = CommonExpedition.assertImage,
  defaultMapCoordinates = CommonExpedition.defaultMapCoordinates,
  assertMapCoordinates = CommonExpedition.assertMapCoordinates,
  CommonProfiles = require('../../../profiles/tests/e2e/common-profiles.e2e.tests'),
  assertORSProfile = CommonProfiles.assertORSProfile,
  EC = protractor.ExpectedConditions;

describe('Profile E2E Tests', function() {
  var admin = CommonUser.admin;
  var leader = CommonUser.leader;
  var member1 = CommonUser.member1;
  var member2 = CommonUser.member2;
  var newLeader = CommonUser.newLeader;
  var newStudent = CommonUser.newStudent;
  var team = CommonUser.team;
  var organization = CommonUser.organization;

  var station1 = CommonProfiles.station1;
  var station2 = CommonProfiles.station2;
});
