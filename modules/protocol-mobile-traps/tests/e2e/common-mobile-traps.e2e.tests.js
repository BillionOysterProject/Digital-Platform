'use strict';

var CommonExpedition = require('../../../expeditions/tests/e2e/common-expeditions.e2e.tests'),
  uploadImage = CommonExpedition.uploadImage,
  assertImage = CommonExpedition.assertImage,
  defaultMapCoordinates = CommonExpedition.defaultMapCoordinates,
  assertMapCoordinates = CommonExpedition.assertMapCoordinates,
  EC = protractor.ExpectedConditions;

var mobileTrap1 = {
  organismDetails: {
    notes: 'Test organism details'
  },
  count: 1,
  organism: {
    commonName: 'Other',
    latinName: 'Unlisted organism'
  }
};

var mobileTrap2 = {
  organismDetails: {
    notes: 'Test organism details2'
  },
  count: 1,
  organism: {
    commonName: 'Black-fingered mud crab',
    latinName: 'Panopeus herbstii'
  }
};

var mobileTrap3 = {
  organismDetails: {
    notes: 'Test organism details3'
  },
  count: 2,
  organism: {
    commonName: 'Blackfish, Tautog',
    latinName: 'Tautoga onitis'
  }
};

var mobileTrap4 = {
  organismDetails: {
    notes: 'Test organism details4'
  },
  count: 1,
  organism: {
    commonName: 'Blue crab',
    latinName: 'Callinectes sapidus'
  }
};

var assertMobileOrganismDetails = function(mobileOrganism, details) {
  var emptyCount = mobileOrganism.element(by.id('empty-mobile-organism-count'));
  var count = mobileOrganism.element(by.id('mobile-organism-count'));
  expect(count.isPresent()).toBe(true);
  expect(emptyCount.isPresent()).toBe(true);
  expect(count.getText()).toEqual(' 1 ');

  mobileOrganism.element(by.css('[ng-click="addOrganism(organism)"]')).getAttribute('organism-id').then(function(value) {
    // Get the id for the mobileOrganism
    var organismId = value;

    // Click the button to open the mobile organism details modal
    mobileOrganism.element(by.css('[ng-click="openOrganismDetails(organism)"]')).click();

    // Wait until the modal is open
    var modal = element(by.id('modal-organism-details-'+organismId));
    browser.wait(EC.visibilityOf(modal), 5000);

    // Add an image to the mobile organism details
    assertImage('mobileTrapSketchPhoto-'+organismId); // Mobile Trap Organism Detail Image Upload
    // Add a description
    expect(modal.element(by.model('organismDetails.notes')).getAttribute('value')).toEqual(details.organismDetails.notes);
    // Don't change the mobile organism details
    modal.element(by.buttonText('Cancel')).click();
    // Wait until the modal is closed and return
    browser.wait(EC.invisibilityOf(modal), 5000);
  });
};

var assertMobileTrap = function() {
  var mobileOrganisms = element.all(by.repeater('organism in mobileOrganisms track by organism._id'));
  assertMobileOrganismDetails(mobileOrganisms.get(0), mobileTrap1);
  assertMobileOrganismDetails(mobileOrganisms.get(1), mobileTrap2);
};

var fillOutMobileOrganismDetails = function(mobileOrganism, details) {
  var addButton = mobileOrganism.element(by.css('[ng-click="addOrganism(organism)"]'));
  addButton.getAttribute('organism-id').then(function(value) {
    // Get the id for the mobileOrganism
    var organismId = value;

    // Click the button to open the mobile organism details modal
    addButton.click();
    mobileOrganism.element(by.css('[ng-click="openOrganismDetails(organism)"]')).click();

    // Wait until the modal is open
    var modal = element(by.id('modal-organism-details-'+organismId));
    browser.wait(EC.visibilityOf(modal), 5000);

    // Add an image to the mobile organism details
    uploadImage('mobileTrapSketchPhoto-'+organismId); // Mobile Trap Organism Detail Image Upload
    // Add a description
    modal.element(by.model('organismDetails.notes')).sendKeys(details.organismDetails.notes);
    // Save the mobile organism details
    modal.element(by.buttonText('Save')).click();
    // Wait until the modal is closed and return
    browser.wait(EC.invisibilityOf(modal), 5000);
  });
};

var fillOutMobileTraps = function() {
  // Fill in values, if you change these values, change the assert too
  var mobileOrganisms = element.all(by.repeater('organism in mobileOrganisms track by organism._id'));
  var organism1 = mobileOrganisms.get(0);
  var organism2 = mobileOrganisms.get(1);
  fillOutMobileOrganismDetails(organism1, mobileTrap1);
  fillOutMobileOrganismDetails(organism2, mobileTrap2);
};

var assertMobileTrapView = function() {
};

module.exports = {
  mobileTrap1: mobileTrap1,
  mobileTrap2: mobileTrap2,
  mobileTrap3: mobileTrap3,
  mobileTrap4: mobileTrap4,
  assertMobileOrganismDetails: assertMobileOrganismDetails,
  assertMobileTrap: assertMobileTrap,
  fillOutMobileOrganismDetails: fillOutMobileOrganismDetails,
  fillOutMobileTraps: fillOutMobileTraps,
  assertMobileTrapView: assertMobileTrapView
};
