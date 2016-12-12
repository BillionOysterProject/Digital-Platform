'use strict';

var path = require('path'),
  EC = protractor.ExpectedConditions;

module.exports = {
  expedition1: { name: 'Test Expedition 1 - Auto Assign' },
  expedition2: {
    name: 'Test Expedition 2 - Fully Filled Out',
    notes: 'Test special instructions',
    monitoringStartDate: '2016-08-24T14:00:00.000Z',
    _id: '57bf2bcdd9bd331294fdf6c8'
  },
  expedition3: {
    name: 'Test Expedition 3 - Only Required Filled Out',
    monitoringStartDate: '2016-08-22T14:00:00.000Z',
    _id: '57bf2becd9bd331294fdf6ce'
  },

  uploadImage: function(id) {
    var fileToUpload = '../../../../scripts/test-images/logo.png';
    var largeFileToUpload = '../../../../scripts/test-images/large_photo.jpeg';
    var veryLargeFileToUpload = '../../../../scripts/test-images/very_large_image.jpg';
    var tooLargeFileToUpload = '../../../../scripts/test-images/too_large_image.png';

    var absolutePath = path.resolve(__dirname, fileToUpload);
    var imageUploader = element(by.id(id));
    var input = imageUploader.element(by.css('input[type="file"]'));
    input.sendKeys(absolutePath);
    browser.sleep(500);
  },

  assertImage: function(id) {
    element(by.id(id)).element(by.css('img[class="img-thumbnail"]')).getAttribute('src')
    .then(function(text){
      if (text !== null) {
        expect(text).not.toEqual('');
        expect(text.search('s3-us-west-1.amazonaws.com')).toBeGreaterThan(-1);
      }
    });
  },

  defaultMapCoordinates: function(target) {
    element(by.css('a[data-target="#'+target+'"]')).click();
    browser.sleep(1000);
    element(by.id('saveMapSelectModal-'+target)).click();
    browser.wait(EC.invisibilityOf(element(by.id('saveMapSelectModal-'+target))), 5000);
    browser.sleep(1000);
  },

  assertMapCoordinates: function(target) {
    element(by.css('input[data-target="#'+target+'"]')).getAttribute('value')
    .then(function(text){
      expect(text).not.toEqual('');
      expect(text.search(', ')).toBeGreaterThan(-1);
    });
  },

  uploadFile: function(id, filepath) {
    var absolutePath = path.resolve(__dirname, filepath);
    var fileUploader = element(by.id(id));
    var input = fileUploader.element(by.css('input[type="file"]'));
    input.sendKeys(absolutePath);
    browser.sleep(500);
  },

  assertFiles: function(id) {
    var fileList = element.all(by.id(id));
    fileList.get(0).getAttribute('href').then(function(text) {
      if (text !== null) {
        expect(text).not.toEqual('');
        expect(text.search('s3-us-west-1.amazonaws.com')).toBeGreaterThan(-1);
      }
    });
  },
};
