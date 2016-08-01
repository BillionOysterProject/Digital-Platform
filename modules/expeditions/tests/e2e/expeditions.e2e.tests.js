'use strict';

describe('Expedition E2E Tests', function() {

  var leader = {
    username: 'teacher',
    password: 'P@$$w0rd!!'
  };

  var member = {
    username: 'student',
    password: 'P@$$w0rd!!'
  };

  var signout = function () {
    // Make sure user is signed out first
    browser.get('http://localhost:8081/authentication/signout');
    // Delete all cookies
    browser.driver.manage().deleteAllCookies();
  };


  describe('Create Expedition', function() {
    it('Log in as the team lead', function() {
      //Make sure user is signed out first
      signout();
      //Sign in
      browser.get('http://localhost:8081/authentication/signin');
      // Enter UserName
      element(by.model('vm.credentials.username')).sendKeys(leader.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(leader.password);
      // Click Submit button
      element(by.id('signin')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
    });
  });
});
