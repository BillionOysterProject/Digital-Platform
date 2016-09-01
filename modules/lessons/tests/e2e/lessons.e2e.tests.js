'use strict';

var path = require('path'),
  CommonUser = require('../../../users/tests/e2e/common-users.e2e.tests'),
  signinAs = CommonUser.signinAs,
  EC = protractor.ExpectedConditions;

describe('Lesson E2E Tests', function() {
  var leader = CommonUser.leader;
  var member1 = CommonUser.member1;
  var member2 = CommonUser.member2;
  var team = CommonUser.team;
  var organization = CommonUser.organization;
  var station = CommonUser.station;
  var station2 = CommonUser.station2;

//############################################################################//
// TEAM LEAD - VIEW PUBLISHED LESSONS
//############################################################################//
  describe('List/Search Lesson Tests', function() {
    describe('Search Lessons', function() {
      var searchField = element(by.model('vm.filter.searchString'));
      var showAllButton = element(by.css('[ng-click="vm.clearFilters()"]'));

      var subjectAreaField = element(by.id('subjectAreaSelection'));
      var subjectAreaToggle = subjectAreaField.element(by.cssContainingText('.dropdown-toggle', 'Subject Area'));
      var subjectAreaAllField = subjectAreaField.element(by.css('[ng-click="vm.subjectAreaSelected()"]'));

      var settingField = element(by.id('settingSelection'));
      var settingToggle = settingField.element(by.cssContainingText('.dropdown-toggle', 'Setting'));
      var settingAllField = settingField.element(by.css('[ok-sel="*"]'));
      var settingClassroomField = settingField.element(by.css('[ok-sel=".Classroom"]'));
      var settingFieldField = settingField.element(by.css('[ok-sel=".Field"]'));

      var unitField = element(by.id('unitSelection'));
      var unitsToggle = unitField.element(by.cssContainingText('.dropdown-toggle', 'Units'));
      var unitAllField = unitField.element(by.css('[ng-click="vm.unitSelected()"]'));


      var subjectAreaFilterId = '.5706e1b9ecf01e67b1b304f1';
      var subjectAreaFilterName = 'Data Analysis';

      var unitFilterId = '.57083bd5a30222a60a46259c';
      var unitFilterName = 'Unit 5: Water Quality';

      it('should allow a team lead to view lessons', function() {
        // Sign in as team lead
        signinAs(leader);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
        // Assert taht there are 6 expeditions
        var lessons = element.all(by.repeater('lesson in vm.lessons track by lesson._id'));
        expect(lessons.count()).toEqual(6);
      });

      it('should allow a team lead to filter by subject areas - Data Analysis', function() {
        subjectAreaToggle.click();
        element(by.css('[ok-sel="'+subjectAreaFilterId+'"]')).click();

        var lessons = element.all(by.repeater('lesson in vm.lessons track by lesson._id'));
        expect(lessons.count()).toEqual(2);
        expect(subjectAreaToggle.getText()).toEqual('Subject Area(s): ' + subjectAreaFilterName);

        showAllButton.click();
      });

      it('should allow a team lead to filter by setting - Field', function() {
        settingToggle.click();
        settingFieldField.click();

        var lessons = element.all(by.repeater('lesson in vm.lessons track by lesson._id'));
        expect(lessons.count()).toEqual(2);
        expect(settingToggle.getText()).toEqual('Setting: Field');

        showAllButton.click();
      });

      it('should allow a team lead to filter by setting - Classroom', function() {
        settingToggle.click();
        settingClassroomField.click();

        var lessons = element.all(by.repeater('lesson in vm.lessons track by lesson._id'));
        expect(lessons.count()).toEqual(4);
        expect(settingToggle.getText()).toEqual('Setting: Classroom');

        showAllButton.click();
      });

      it('should allow a team lead to filter by units - Water Quality', function() {
        unitsToggle.click();
        element(by.css('[ok-sel="'+unitFilterId+'"]')).click();

        var lessons = element.all(by.repeater('lesson in vm.lessons track by lesson._id'));
        expect(lessons.count()).toEqual(2);
        expect(unitsToggle.getText()).toEqual('Units: ' + unitFilterName);

        showAllButton.click();
      });

      it('should allow a team lead to filter by subject area, setting, and unit', function() {
        subjectAreaToggle.click();
        element(by.css('[ok-sel="'+subjectAreaFilterId+'"]')).click();

        settingToggle.click();
        settingFieldField.click();

        unitsToggle.click();
        element(by.css('[ok-sel="'+unitFilterId+'"]')).click();

        var lessons = element.all(by.repeater('lesson in vm.lessons track by lesson._id'));
        expect(lessons.count()).toEqual(1);
        expect(unitsToggle.getText()).toEqual('Units: ' + unitFilterName);

        showAllButton.click();
      });
    });
  });
});
