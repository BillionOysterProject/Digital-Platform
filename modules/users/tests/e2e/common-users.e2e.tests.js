'use strict';

var signout = function () {
  // Make sure user is signed out first
  browser.get('http://localhost:8081/authentication/signout');
  // Delete all cookies
  browser.driver.manage().deleteAllCookies();
};

var signinAs = function(user) {
  //Make sure user is signed out first
  signout();
  //Sign in
  browser.get('http://localhost:8081/authentication/signin');
  // Enter UserName
  element(by.model('vm.credentials.username')).sendKeys(user.username);
  // Enter Password
  element(by.model('vm.credentials.password')).sendKeys(user.password);
  // Click Submit button
  element(by.id('signin')).click();
};

module.exports = {
  leader: {
    username: 'teacher',
    password: 'P@$$w0rd!!'
  },
  member1: {
    username: 'student1',
    password: 'P@$$w0rd!!'
  },
  member2: {
    username: 'student2',
    password: 'P@$$w0rd!!'
  },
  team: { name: 'Test Team' },
  station: { name: 'Test Station' },
  expedition1: { name: 'Test Expedition 1 - Auto Assign' },

  signout: signout,
  signinAs: signinAs
};
