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
  var leader2 = CommonUser.leader2;
  var member1 = CommonUser.member1;
  var member2 = CommonUser.member2;
  var member3 = CommonUser.member3;
  var member4 = CommonUser.member4;
  var newLeader = CommonUser.newLeader;
  var newStudent = CommonUser.newStudent;
  var team = CommonUser.team;
  var team2 = CommonUser.team2;
  var organization = CommonUser.organization;

  var station1 = CommonProfiles.station1;
  var station2 = CommonProfiles.station2;

  var assertProfile = function(values, organization, teams, isTeamLead, isTeamMember) {
    //Profile image
    expect(element(by.css('img[class="img-circle img-responsive center-block"]')).isDisplayed()).toBe(true);
    //Name
    var name = element(by.css('a[ng-click="vm.openViewUserModal(vm.user)"]'));
    expect(name.isDisplayed()).toBe(true);
    expect(name.getText()).toEqual(values.displayName);
    //Contact
    var contact = element(by.id('profile-view-contact'));
    expect(contact.isDisplayed()).toBe(true);
    expect(contact.getText()).toEqual(values.username + '\n' + values.email);
    //Research interests
    var research = element(by.id('profile-view-research-interests'));
    expect(research.isDisplayed()).toBe(true);
    if (values.researchInterestsText) expect(research.getText()).toEqual(values.researchInterestsText);

    var createTeamButton = element(by.css('a[ng-click="vm.openTeamProfileForm()"]'));
    if (isTeamLead) {
      expect(createTeamButton.isDisplayed()).toBe(true);
    } else {
      expect(createTeamButton.isDisplayed()).toBe(false);
    }

    //Sidebar Organization
    var sideOrganization = element(by.id('profile-view-side-organization'));
    if (organization) {
      expect(sideOrganization.getText()).toEqual('ORGANIZATION\n' + organization.name + '\n' + organization.city + ', ' + organization.state);
      expect(element(by.css('a[ui-sref="profiles.organization-view({ schoolOrgId: vm.organization._id })"]')).isDisplayed()).toBe(true);
    }

    var sideTeams = element(by.id('profile-view-side-teams'));
    if (teams) {
      var sideTeamsText = ((teams.length > 1) ? 'TEAMS' : 'TEAM') + '\n';
      for (var i = 0; i < teams.length; i++) {
        sideTeamsText += teams[i].name;
        if (isTeamMember || i < teams.length-1) {
          sideTeamsText += '\n';
        }
        if (isTeamMember) {
          for (var j = 0; j < teams[i].teamLeads.length; j++) {
            sideTeamsText += teams[i].teamLeads[j].displayName;
            if (j < teams[i].teamLeads.length-1) {
              sideTeamsText += ', ';
            }
          }
        }
      }
      expect(sideTeams.isDisplayed()).toBe(true);
      expect(sideTeams.getText()).toEqual(sideTeamsText);
    }

    expect(element(by.cssContainingText('.btn-default', 'Edit profile')).isDisplayed()).toBe(true);
    expect(element(by.cssContainingText('.btn-default', 'Change profile picture')).isDisplayed()).toBe(true);
    expect(element(by.cssContainingText('.btn-default', 'Change password')).isDisplayed()).toBe(true);
  };

  describe('Profile View', function() {
    it('should allow team lead to view their profile', function() {
      //Sign in as leader
      signinAs(leader);
      //Assert that it went to correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
      browser.get('http://localhost:8081/profiles');

      assertProfile(leader, organization, [team, team2], true, false);
    });
  });
});
