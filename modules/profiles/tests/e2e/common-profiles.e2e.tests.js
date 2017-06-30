'use strict';

var path = require('path'),
  EC = protractor.ExpectedConditions;

var station1 = {
  name: 'Test Station',
  location: {
    latitude: '39.765',
    longitude: '-76.234'
  },
  bodyOfWater: 'Flushing Bay',
  boroughCounty: 'Queens',
  shoreLineText: 'Fixed Pier',
  statusText: 'Active',
  siteCoordinatorName: 'Site1 Coordinator',
  propertyOwnerName: 'Property1'
};
var station2 = {
  name: 'Other Station',
  location: {
    latitude: '39.765',
    longitude: '-76.234'
  },
  bodyOfWater: 'Bronx River',
  boroughCounty: 'Bronx',
  shoreLineText: 'Dirt/Sand',
  statusText: 'Active',
  siteCoordinatorName: 'Site2 Coordinator',
  propertyOwnerName: 'Property2'
};

var assertORSProfile = function(values, teamLead, organization, isAdmin, isOwner) {
  // Station image
  if (values.photo) {
    expect(element(by.id('ors-view-image')).isDisplayed()).toBe(true);
  }

  // Status indicators
  if (values.statusText === 'Active') {
    expect(element(by.css('i[class="glyphicon glyphicon-map-marker green"]')).isDisplayed()).toBe(true);
    expect(element(by.css('span[class="label ng-binding label-success"]')).isDisplayed()).toBe(true);
    expect(element(by.css('span[class="label ng-binding label-success"]')).getText()).toEqual(values.statusText);
  } else {
    expect(element(by.css('i[class="glyphicon glyphicon-map-marker red"]')).isDisplayed()).toBe(true);
    expect(element(by.css('span[class="label ng-binding label-danger"]')).isDisplayed()).toBe(true);
    expect(element(by.css('span[class="label ng-binding label-danger"]')).getText()).toEqual(values.statusText);
  }

  // Info
  expect(element(by.id('ors-view-info')).getText()).toEqual(values.name + '    ' + values.statusText);
  expect(element(by.id('ors-view-location')).getText()).toEqual(values.bodyOfWater + ', ' + values.boroughCounty + '\n\n\n' +
    values.location.latitude + ', ' + values.location.longitude);

  // Owner
  var owner = element(by.id('ors-view-owner'));
  expect(owner.getText()).toEqual('OWNER\n' + teamLead.displayName + '\n' + teamLead.email);
  expect(owner.element(by.css('a[ng-click="openTeamLeadView(station.teamLead)"]')).isDisplayed()).toBe(true);
  expect(owner.element(by.css('a[href="mailto:'+teamLead.email+'"]')).isDisplayed()).toBe(true);

  // Organization
  var organizationDiv = element(by.id('ors-view-organization'));
  var orgText = (organization.city && organization.state) ? 'ORGANIZATION\n' + organization.name + '\n' + organization.city + ', ' + organization.state :
    'ORGANIZATION\n' + organization.name + '\n';
  expect(organizationDiv.getText()).toEqual(orgText);
  expect(organizationDiv.element(by.css('a[ui-sref="profiles.organization-view({ schoolOrgId: station.schoolOrg._id })"]')).isDisplayed()).toBe(true);

  // Buttons
  if (isAdmin || isOwner) {
    expect(element(by.css('a[ng-click="openOrsForm()"]')).isDisplayed()).toBe(true);
  } else {
    expect(element(by.css('a[ng-click="openOrsForm()"]')).isDisplayed()).toBe(false);
  }
  expect(element(by.css('a[ng-click="openOrsStatus()"]')).isDisplayed()).toBe(true);

  // Expeditions
  if (values.expeditions && values.expeditions.length > 0) {
    var expeditions = element.all(by.repeater('expedition in station.expeditions'));
    for (var i = 0; i < values.expeditions.length; i++) {
      var expedition = expeditions.get(i);
      expect(expedition.getText()).toEqual(values.expeditions[i]);
      expect(expedition.element(by.css('a[ui-sref="expeditions.view({ expeditionId: expedition._id })"]')).isDisplayed()).toBe(true);
    }
  }

  // Extra
  var extras = element(by.id('ors-view-extra'));
  var extraText = 'Site Coordinator\n';
  if (values.siteCoordinatorName) extraText += ((values.siteCoordinatorName === 'Other' && values.otherSiteCoordinator) ?
    values.otherSiteCoordinator.displayName : values.siteCoordinatorName) + '\n';
  extraText += 'Property Owner\n';
  if (values.propertyOwnerName) extraText += ((values.propertyOwnerName === 'Other' && values.otherPropertyOwner) ?
    values.otherPropertyOwner.name : values.propertyOwnerName) + '\n';
  extraText += 'Shoreline Type\n';
  if (values.shoreLineText) extraText += values.shoreLineText + '\n';
  extraText += 'Notes';
  if (values.notes) extraText += '\n' + values.notes;
  expect(extras.getText()).toEqual(extraText);
};

module.exports = {
  assertORSProfile: assertORSProfile,
  station1: station1,
  station2: station2
};
