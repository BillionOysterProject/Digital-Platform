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
  browser.sleep(1000);
  // Enter UserName
  element(by.model('vm.credentials.username')).sendKeys(user.username);
  // Enter Password
  element(by.model('vm.credentials.password')).sendKeys(user.password);
  // Click Submit button
  element(by.id('signin')).click();
};

var signup = function(user) {
  //Assumes already on signup page
  element(by.model('vm.credentials.firstName')).sendKeys(user.firstName);
  element(by.model('vm.credentials.lastName')).sendKeys(user.lastName);
  element(by.model('vm.credentials.email')).sendKeys(user.email);
  element(by.model('vm.credentials.userrole')).all(by.tagName('option')).get(user.userrole).click();
  if (user.userroleText === 'team lead pending')
    element(by.model('vm.credentials.teamLeadType')).all(by.tagName('option')).get(user.typeLeadType).click();
  element(by.model('vm.credentials.schoolOrg')).all(by.tagName('option')).get(user.schoolOrg).click();
  if (user.userroleText === 'team member pending')
    element(by.model('vm.credentials.teamLead')).all(by.tagName('option')).get(user.teamLead).click();
  element(by.model('vm.credentials.username')).sendKeys(user.username);
  element(by.model('vm.credentials.password')).sendKeys(user.password);
  element(by.model('vm.credentials.retypePassword')).sendKeys(user.password);
  element(by.model('vm.hasAcceptedTermsOfUse')).click();
  element(by.buttonText('Sign up')).click();
  browser.sleep(1000);
};

module.exports = {
  admin: {
    username: 'admin',
    password: 'P@$$w0rd!!',
    displayName: 'Admin Local'
  },
  leader: {
    username: 'teacher1',
    password: 'P@$$w0rd!!',
    displayName: 'Teacher1 Local',
    email: 'teacher1@localhost.com',
    researchInterestsText: 'I\'m interested in teaching.'
  },
  leader2: {
    username: 'teacher2',
    password: 'P@$$w0rd!!',
    displayName: 'Teacher2 Local',
    email: 'teacher2@localhost.com'
  },
  member1: {
    username: 'student1',
    password: 'P@$$w0rd!!',
    displayName: 'Student1 Local',
    researchInterestsText: 'I want to learn.'
  },
  member2: {
    username: 'student2',
    password: 'P@$$w0rd!!',
    displayName: 'Student2 Local'
  },
  member3: {
    username: 'student3',
    password: 'P@$$w0rd!!',
    displayName: 'Student3 Local'
  },
  member4: {
    username: 'student4',
    password: 'P@$$w0rd!!',
    displayName: 'Student4 Local'
  },
  newLeader: {
    firstName: 'New Leader',
    lastName: 'Local',
    email: 'newleader@localhost.com',
    userrole: 1,
    userroleText: 'team lead pending',
    typeLeadType: 1,
    typeLeadTypeText: 'Teacher',
    schoolOrg: 1,
    schoolOrgText: 'Org1',
    username: 'newleader',
    password: 'P@$$w0rd!!',
    displayName: 'New Leader Local'
  },
  newStudent: {
    firstName: 'New Student',
    lastName: 'Local',
    email: 'newstudent@@localhost.com',
    userrole: 2,
    userroleText: 'team member pending',
    schoolOrg: 1,
    schoolOrgText: 'Org1',
    teamLead: 1,
    teamLeadText: 'Teacher Local',
    username: 'newstudent',
    password: 'P@$$w0rd!!',
    displayName: 'New Student Local'
  },
  team: {
    name: 'Test Team1',
    teamLeads: [{
      displayName: 'Teacher1 Local'
    }, {
      displayName: 'Teacher2 Local'
    }]
  },
  team2: {
    name: 'Test Team2',
    teamLeads: [{
      displayName: 'Teacher1 Local'
    }, {
      displayName: 'Teacher2 Local'
    }]
  },
  organization: {
    name: 'Org1',
    city: 'Anytown',
    state: 'NY'
  },
  station: {
    name: 'Test Station',
    baselines: {
      substrateShell1: {
        substrateShellNumber: 1,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 1,
        sourceText: 'Muscongus Bay, Maine',
        totalNumberOfLiveOystersAtBaseline: 40
      },
      substrateShell2: {
        substrateShellNumber: 2,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 2,
        sourceText: 'Fishers Island, New York',
        totalNumberOfLiveOystersAtBaseline: 35
      },
      substrateShell3: {
        substrateShellNumber: 3,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 3,
        sourceText: 'Soundview, New York',
        totalNumberOfLiveOystersAtBaseline: 30
      },
      substrateShell4: {
        substrateShellNumber: 4,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 4,
        sourceText: 'Bronx River, New York',
        totalNumberOfLiveOystersAtBaseline: 25
      },
      substrateShell5: {
        substrateShellNumber: 5,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 5,
        sourceText: 'Tappan Zee, New York',
        totalNumberOfLiveOystersAtBaseline: 20
      },
      substrateShell6: {
        substrateShellNumber: 6,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 6,
        sourceText: 'Hudson River, New York',
        totalNumberOfLiveOystersAtBaseline: 15
      },
      substrateShell7: {
        substrateShellNumber: 7,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 7,
        sourceText: 'Other',
        otherSource: 'Other Test',
        totalNumberOfLiveOystersAtBaseline: 10
      },
      substrateShell8: {
        substrateShellNumber: 8,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 1,
        sourceText: 'Muscongus Bay, Maine',
        totalNumberOfLiveOystersAtBaseline: 5
      },
      substrateShell9: {
        substrateShellNumber: 9,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 2,
        sourceText: 'Fishers Island, New York',
        totalNumberOfLiveOystersAtBaseline: 10
      },
      substrateShell10: {
        substrateShellNumber: 10,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 3,
        sourceText: 'Soundview, New York',
        totalNumberOfLiveOystersAtBaseline: 15
      }
    }
  },
  station2: {
    name: 'Other Station',
    baselines: {
      substrateShell1: {
        substrateShellNumber: 1,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 1,
        sourceText: 'Muscongus Bay, Maine',
        totalNumberOfLiveOystersAtBaseline: 40
      },
      substrateShell2: {
        substrateShellNumber: 2,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 2,
        sourceText: 'Fishers Island, New York',
        totalNumberOfLiveOystersAtBaseline: 35
      },
      substrateShell3: {
        substrateShellNumber: 3,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 3,
        sourceText: 'Soundview, New York',
        totalNumberOfLiveOystersAtBaseline: 30
      },
      substrateShell4: {
        substrateShellNumber: 4,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 4,
        sourceText: 'Bronx River, New York',
        totalNumberOfLiveOystersAtBaseline: 25
      },
      substrateShell5: {
        substrateShellNumber: 5,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 5,
        sourceText: 'Tappan Zee, New York',
        totalNumberOfLiveOystersAtBaseline: 20
      },
      substrateShell6: {
        substrateShellNumber: 6,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 6,
        sourceText: 'Hudson River, New York',
        totalNumberOfLiveOystersAtBaseline: 15
      },
      substrateShell7: {
        substrateShellNumber: 7,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 7,
        sourceText: 'Other',
        otherSource: 'Other Test',
        totalNumberOfLiveOystersAtBaseline: 10
      },
      substrateShell8: {
        substrateShellNumber: 8,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 1,
        sourceText: 'Muscongus Bay, Maine',
        totalNumberOfLiveOystersAtBaseline: 5
      },
      substrateShell9: {
        substrateShellNumber: 9,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 2,
        sourceText: 'Fishers Island, New York',
        totalNumberOfLiveOystersAtBaseline: 10
      },
      substrateShell10: {
        substrateShellNumber: 10,
        setDate: '2016-08-11T06:00:00.000Z',
        source: 3,
        sourceText: 'Soundview, New York',
        totalNumberOfLiveOystersAtBaseline: 15
      }
    }
  },

  signout: signout,
  signinAs: signinAs,
  signup: signup
};
