'use strict';

var path = require('path'),
  CommonUser = require('../../../users/tests/e2e/common-users.e2e.tests'),
  signinAs = CommonUser.signinAs,
  CommonExpedition = require('../../../expeditions/tests/e2e/common-expeditions.e2e.tests'),
  uploadImage = CommonExpedition.uploadImage,
  assertImage = CommonExpedition.assertImage,
  uploadFile = CommonExpedition.uploadFile,
  assertFiles = CommonExpedition.assertFiles,
  CommonCore = require('../../../core/tests/e2e/common-core.e2e.tests'),
  select2Fillin = CommonCore.select2Fillin,
  wysiwygFillin = CommonCore.wysiwygFillin,
  EC = protractor.ExpectedConditions;

xdescribe('Lesson E2E Tests', function() {
  var leader = CommonUser.leader;
  var member1 = CommonUser.member1;
  var member2 = CommonUser.member2;
  var team = CommonUser.team;
  var organization = CommonUser.organization;
  var station = CommonUser.station;
  var station2 = CommonUser.station2;

  var resource1 = '../../../../scripts/test-files/resource.txt';
  var resource2 = '../../../../scripts/test-files/resource2.txt';

  var handout1 = '../../../../scripts/test-files/handout.txt';
  var handout2 = '../../../../scripts/test-files/handout2.txt';
  var handout3 = '../../../../scripts/test-files/handout3.txt';

  var stateQuestion1 = '../../../../scripts/test-images/stateQuestion1.png';
  var stateQuestion2 = '../../../../scripts/test-images/stateQuestion2.png';
  var stateQuestion3 = '../../../../scripts/test-images/stateQuestion3.png';

  var initialLesson = {
    title: 'Test Title Limited'
  };

  var fullLesson = {
    title: 'Test Title Full',
    unit: 1,
    unitText: 'Unit 1: New York’s Urban Ecosystem',
    featuredImage: true,
    grade: 2,
    gradeText: '6th',
    classPeriods: 3,
    classPeriodsText: '3',
    settings: 2,
    settingsText: 'Field',
    subjectAreas: 'Science',
    lessonSummary: 'This is a test lesson summary.',
    lessonObjectives: 'This is a test lesson objective.',
    supplies: '*item 1\n*item 2',
    term: 'Test',
    definition: 'This is a test term.',
    handouts: [handout1, handout2, handout3],
    handoutNames: ['handout.txt', 'handout2.txt', 'handout3.txt'],
    resources: {
      resourceLinks: [{
        link: 'www.google.com',
        name: 'Google'
      }],
      resourceFiles: [resource1],
      resourceFileNames: ['resource.txt']
    },
    teacherTips: 'This is a test teacher tip.',
    stateQuestions: [stateQuestion1, stateQuestion2],
    stateTestQuestionNames: ['stateQuestion1.png', 'stateQuestion2.png'],
    preparation: 'This is a test preparation.',
    background: 'This is a test background.',
    engage: 'Test engage.',
    explore: 'Test explore.',
    explain: 'Test explain.',
    elaborate: 'Test elaborate.',
    evaluate: 'Test evaluate.',
    nycssUnits: 'Grade 6, Unit 2',
    nysssKeyIdeas: 'LE Key Idea 3',
    nysssMajorUnderstandings: 'LE-1.1d',
    nysssMst: 'Standard 2',
    ngssDisciplinaryCoreIdeas: 'ESS1.B: Earth and the Solar System',
    ngssScienceEngineeringPractices: 'Construct and interpret',
    ngssCrossCuttingConcepts: 'Phenomena may have',
    cclsMathematics: 'CCSS.MATH.CONTENT.6.G.A.1',
    cclsElaScienceTechnicalSubjects: 'CCSS.ELA-LITERACY.RI.6.4'
  };

  var draft1 = {
    title: 'Test Title Draft',
    unit: 1,
    unitText: 'Unit 1: New York’s Urban Ecosystem',
    featuredImage: true,
    grade: 2,
    gradeText: '6th',
    classPeriods: 3,
    classPeriodsText: '3',
    settings: 2,
    settingsText: 'Field',
    subjectAreas: 'Science',
  };

  var draft2 = {
    title: 'Test Title Draft',
    lessonSummary: 'This is a test lesson summary.',
    lessonObjectives: 'This is a test lesson objective.',
    supplies: '*item 1\n*item 2',
    term: 'Test2',
    definition: 'This is a test term2.',
    handouts: [handout1, handout2, handout3],
    handoutNames: ['handout.txt', 'handout2.txt', 'handout3.txt'],
    resources: {
      resourceLinks: [{
        link: 'www.google.com',
        name: 'Google'
      }],
      resourceFiles: [resource1],
      resourceFileNames: ['resource.txt']
    },
    teacherTips: 'This is a test teacher tip.',
    stateQuestions: [stateQuestion1, stateQuestion2],
    stateTestQuestionNames: ['stateQuestion1.png', 'stateQuestion2.png'],
    preparation: 'This is a test preparation.',
    background: 'This is a test background.',
  };

  var draft12 = {
    title: 'Test Title Draft',
    unit: 1,
    unitText: 'Unit 1: New York’s Urban Ecosystem',
    featuredImage: true,
    grade: 2,
    gradeText: '6th',
    classPeriods: 3,
    classPeriodsText: '3',
    settings: 2,
    settingsText: 'Field',
    subjectAreas: 'Science',
    lessonSummary: 'This is a test lesson summary.',
    lessonObjectives: 'This is a test lesson objective.',
    supplies: '*item 1\n*item 2',
    term: 'Test2',
    definition: 'This is a test term2.',
    handouts: [handout1, handout2, handout3],
    handoutNames: ['handout.txt', 'handout2.txt', 'handout3.txt'],
    resources: {
      resourceLinks: [{
        link: 'www.google.com',
        name: 'Google'
      }],
      resourceFiles: [resource1],
      resourceFileNames: ['resource.txt']
    },
    teacherTips: 'This is a test teacher tip.',
    stateQuestions: [stateQuestion1, stateQuestion2],
    stateTestQuestionNames: ['stateQuestion1.png', 'stateQuestion2.png'],
    preparation: 'This is a test preparation.',
    background: 'This is a test background.',
  };

  var draft3 = {
    title: 'Test Title Draft',
    engage: 'Test engage.',
    explore: 'Test explore.',
    explain: 'Test explain.',
    elaborate: 'Test elaborate.',
    evaluate: 'Test evaluate.',
    nycssUnits: 'Grade 6, Unit 2',
    nysssKeyIdeas: 'LE Key Idea 3',
    nysssMajorUnderstandings: 'LE-1.1d',
    nysssMst: 'Standard 2',
    ngssDisciplinaryCoreIdeas: 'ESS1.B: Earth and the Solar System',
    ngssScienceEngineeringPractices: 'Construct and interpret',
    ngssCrossCuttingConcepts: 'Phenomena may have',
    cclsMathematics: 'CCSS.MATH.CONTENT.6.G.A.1',
    cclsElaScienceTechnicalSubjects: 'CCSS.ELA-LITERACY.RI.6.4'
  };

  var draft123 = {
    title: 'Test Title Draft',
    unit: 1,
    unitText: 'Unit 1: New York’s Urban Ecosystem',
    featuredImage: true,
    grade: 2,
    gradeText: '6th',
    classPeriods: 3,
    classPeriodsText: '3',
    settings: 2,
    settingsText: 'Field',
    subjectAreas: 'Science',
    lessonSummary: 'This is a test lesson summary.',
    lessonObjectives: 'This is a test lesson objective.',
    supplies: '*item 1\n*item 2',
    term: 'Test2',
    definition: 'This is a test term2.',
    handouts: [handout1, handout2, handout3],
    handoutNames: ['handout.txt', 'handout2.txt', 'handout3.txt'],
    resources: {
      resourceLinks: [{
        link: 'www.google.com',
        name: 'Google'
      }],
      resourceFiles: [resource1],
      resourceFileNames: ['resource.txt']
    },
    teacherTips: 'This is a test teacher tip.',
    stateQuestions: [stateQuestion1, stateQuestion2],
    stateTestQuestionNames: ['stateQuestion1.png', 'stateQuestion2.png'],
    preparation: 'This is a test preparation.',
    background: 'This is a test background.',
    engage: 'Test engage.',
    explore: 'Test explore.',
    explain: 'Test explain.',
    elaborate: 'Test elaborate.',
    evaluate: 'Test evaluate.',
    nycssUnits: 'Grade 6, Unit 2',
    nysssKeyIdeas: 'LE Key Idea 3',
    nysssMajorUnderstandings: 'LE-1.1d',
    nysssMst: 'Standard 2',
    ngssDisciplinaryCoreIdeas: 'ESS1.B: Earth and the Solar System',
    ngssScienceEngineeringPractices: 'Construct and interpret',
    ngssCrossCuttingConcepts: 'Phenomena may have',
    cclsMathematics: 'CCSS.MATH.CONTENT.6.G.A.1',
    cclsElaScienceTechnicalSubjects: 'CCSS.ELA-LITERACY.RI.6.4'
  };

  var fillInLesson = function(values, update) {
    element(by.model('vm.lesson.title')).clear().sendKeys(values.title);
    var updateOption = (update) ? -1 : 0;
    if (values.unit) element(by.model('vm.lesson.unit._id')).all(by.tagName('option')).get((values.unit + updateOption)).click();
    if (values.featuredImage) uploadImage('lesson-featured-image');
    if (values.grade) element(by.model('vm.lesson.lessonOverview.grade')).all(by.tagName('option')).get((values.grade + updateOption)).click();
    if (values.classPeriods) element(by.model('vm.lesson.lessonOverview.classPeriods')).all(by.tagName('option')).get((values.classPeriods + updateOption)).click();
    if (values.settings) element(by.model('vm.lesson.lessonOverview.setting')).all(by.tagName('option')).get((values.settings + updateOption)).click();
    // if (values.subjectAreas) select2Fillin('s2id_subjectAreas', values.subjectAreas);
    if (values.subjectAreas) select2Fillin('subjectAreas', values.subjectAreas);
    if (values.lessonSummary) wysiwygFillin('vm.lesson.lessonOverview.lessonSummary', values.lessonSummary);
    if (values.lessonObjectives) wysiwygFillin('vm.lesson.lessonObjectives', values.lessonObjectives);
    if (values.supplies) wysiwygFillin('vm.lesson.materialsResources.supplies', values.supplies);
    // if (values.vocabulary) select2Fillin('s2id_vocabulary', values.vocabulary);
    if (values.vocabulary) select2Fillin('vocabulary', values.vocabulary);
    if (values.term && values.definition) {
      element(by.css('[title="Add term"]')).click();
      browser.sleep(500);
      element(by.model('term.term')).clear().sendKeys(values.term);
      element(by.model('term.definition')).clear().sendKeys(values.definition);
      element(by.buttonText('Save')).click();
      browser.sleep(500);
      select2Fillin('vocabulary', values.term);
    }
    if (values.handouts) {
      for(var i = 0; i < values.handouts.length; i++) {
        uploadFile('lesson-handout-files', values.handouts[i]);
      }
    }
    if (values.resources) {
      element(by.css('a[data-target="#modal-resources"]')).click();
      browser.sleep(500);
      if (values.resources.resourceLinks) {
        element(by.model('tempResourceLinkName')).clear().sendKeys(values.resources.resourceLinks[0].name);
        element(by.model('tempResourceLink')).clear().sendKeys(values.resources.resourceLinks[0].link);
      }
      if (values.resources.resourceFiles) {
        element(by.css('a[href="#upload"]')).click();
        for(var j = 0; j < values.resources.resourceFiles.length; j++) {
          uploadFile('lesson-resources-file-dropzone', values.resources.resourceFiles[j]);
        }
      }
      element(by.buttonText('Add')).click();
      browser.sleep(500);
    }
    if (values.teacherTips) wysiwygFillin('vm.lesson.materialsResources.teacherTips', values.teacherTips);
    if (values.stateQuestions) {
      for(var k = 0; k < values.stateQuestions.length; k++) {
        uploadFile('lesson-state-test-questions-files', values.stateQuestions[k]);
      }
    }
    if (values.preparation) wysiwygFillin('vm.lesson.preparation', values.preparation);
    if (values.background) wysiwygFillin('vm.lesson.background', values.background);
    if (values.engage) wysiwygFillin('vm.lesson.instructionPlan.engage', values.engage);
    if (values.explore) {
      element(by.css('a[href="#explore"]')).click();
      browser.sleep(100);
      wysiwygFillin('vm.lesson.instructionPlan.explore', values.explore);
    }
    if (values.explain) {
      element(by.css('a[href="#explain"]')).click();
      browser.sleep(100);
      wysiwygFillin('vm.lesson.instructionPlan.explain', values.explain);
    }
    if (values.elaborate) {
      element(by.css('a[href="#elaborate"]')).click();
      browser.sleep(100);
      wysiwygFillin('vm.lesson.instructionPlan.elaborate', values.elaborate);
    }
    if (values.evaluate) {
      element(by.css('a[href="#evaluate"]')).click();
      browser.sleep(100);
      wysiwygFillin('vm.lesson.instructionPlan.evaluate', values.evaluate);
    }
    // if (values.nycssUnits) select2Fillin('s2id_autogen3', values.nycssUnits);
    if (values.nycssUnits) select2Fillin('nycsssUnits', values.nycssUnits);
    // if (values.nysssKeyIdeas) select2Fillin('s2id_autogen5', values.nysssKeyIdeas);
    if (values.nysssKeyIdeas) select2Fillin('nysssKeyIdeas', values.nysssKeyIdeas);
    // if (values.nysssMajorUnderstandings) select2Fillin('s2id_autogen7', values.nysssMajorUnderstandings);
    if (values.nysssMajorUnderstandings) select2Fillin('nysssMajorUnderstandings', values.nysssMajorUnderstandings);
    // if (values.nysssMst) select2Fillin('s2id_autogen9', values.nysssMst);
    if (values.nysssMst) select2Fillin('nysssMst', values.nysssMst);
    // if (values.ngssDisciplinaryCoreIdeas) select2Fillin('s2id_autogen11', values.ngssDisciplinaryCoreIdeas);
    if (values.ngssDisciplinaryCoreIdeas) select2Fillin('ngssDisciplinaryCoreIdeas', values.ngssDisciplinaryCoreIdeas);
    // if (values.ngssScienceEngineeringPractices) select2Fillin('s2id_autogen13', values.ngssScienceEngineeringPractices);
    if (values.ngssScienceEngineeringPractices) select2Fillin('ngssScienceEngineeringPractices', values.ngssScienceEngineeringPractices);
    // if (values.ngssCrossCuttingConcepts) select2Fillin('s2id_autogen15', values.ngssCrossCuttingConcepts);
    if (values.ngssCrossCuttingConcepts) select2Fillin('ngssCrossCuttingConcepts', values.ngssCrossCuttingConcepts);
    // if (values.cclsMathematics) select2Fillin('s2id_autogen17', values.cclsMathematics);
    if (values.cclsMathematics) select2Fillin('cclsMathematics', values.cclsMathematics);
    // if (values.cclsElaScienceTechnicalSubjects) select2Fillin('s2id_autogen19', values.cclsElaScienceTechnicalSubjects);
    if (values.cclsElaScienceTechnicalSubjects) select2Fillin('cclsElaScienceTechnicalSubjects', values.cclsElaScienceTechnicalSubjects);
  };

  var checkElement = function(element, value, isDisplayed) {
    if (isDisplayed) {
      expect(element.getText()).toEqual(value);
    } else {
      expect(element.isDisplayed()).toBe(false);
    }
  };

  var checkStandardList = function(divElement, header, value, isDisplayed) {
    var headerElement = divElement.element(by.tagName('b'));
    if (isDisplayed) {
      expect(headerElement.isDisplayed()).toBe(true);
      expect(headerElement.getText()).toEqual(header);
      var itemElement = divElement.element(by.tagName('span'));
      expect(itemElement.isDisplayed()).toBe(true);
      expect(itemElement.getText()).toMatch(value);
    } else {
      expect(headerElement.isDisplayed()).toBe(false);
    }
  };

  var viewLesson = function(values, status, isFavorited, isOwner, isTeamLead) {
    // Featured Image
    if (values.featuredImage) {
      expect(element(by.id('lesson-featured-image')).isDisplayed()).toBe(true);
    } else {
      expect(element(by.id('no-lesson-featured-image')).isDisplayed()).toBe(true);
    }

    // Title and Favorite
    expect(element(by.id('lesson-title')).getText()).toEqual(values.title);
    if (isFavorited) {
      expect(element(by.css('i[class="glyphicon glyphicon-star red"]')).isDisplayed()).toBe(true);
    } else {
      expect(element(by.css('i[class="glyphicon glyphicon-star-empty"]')).isDisplayed()).toBe(true);
    }

    // Status and Action buttons
    if (status === 'draft') {
      expect(element(by.id('status-draft')).isDisplayed()).toBe(true);
    } else if (status === 'pending') {
      expect(element(by.id('status-pending')).isDisplayed()).toBe(true);
    } else if (status === 'returned') {
      expect(element(by.id('status-returned')).isDisplayed()).toBe(true);
    }
    if (isOwner) {
      if (status === 'published') {
        expect(element(by.id('status-published')).isDisplayed()).toBe(true);
        expect(element(by.partialLinkText('Unpublish and edit')).isDisplayed()).toBe(true);
      } else if (status !== 'pending') {
        expect(element(by.partialLinkText('Edit')).isDisplayed()).toBe(true);
      }
    } else {
      expect(element(by.css('a[ng-click="vm.openLessonFeedback()"]')).isDisplayed()).toBe(true);
    }
    if (isTeamLead) expect(element(by.css('a[ng-click="vm.duplicateLesson()"]')).isDisplayed()).toBe(true);
    expect(element(by.css('a[ng-click="vm.openDownloadLesson()"]')).isDisplayed()).toBe(true);

    // Author Info
    if (isOwner) expect(element(by.id('lesson-author-info')).getText()).toEqual(leader.displayName + '\n' +
      team.name + ' / ' + leader.email);

    // Unit
    checkElement(element(by.css('div[ng-show="vm.lesson.unit"]')),
      'Unit: ' + values.unitText, values.unitText ? true : false);

    // Grade
    checkElement(element(by.css('div[ng-show="vm.lesson.lessonOverview.grade"]')),
      'Grade\n' + values.gradeText, values.gradeText ? true : false);

    // Class Period
    checkElement(element(by.css('div[ng-show="vm.lesson.lessonOverview.classPeriods"]')),
      'Class Periods\n' + values.classPeriodsText, values.classPeriodsText ? true : false);

    // Setting
    checkElement(element(by.css('div[ng-show="vm.lesson.lessonOverview.setting"]')),
      'Setting\n' + values.settingsText, values.settingsText ? true : false);

    // Subject Areas
    checkElement(element(by.css('div[ng-show="vm.lesson.lessonOverview.subjectAreas && vm.lesson.lessonOverview.subjectAreas.length > 0"]')),
      'Subject Areas\n' + values.subjectAreas, values.subjectAreas ? true : false);

    // Lesson Resources
    var resources = element(by.id('lesson-resources'));
    if (values.resources) {
      expect(resources.isDisplayed()).toBe(true);
      if (values.resources.resourceLinks) {
        for (var i = 0; i < values.resources.resourceLinks.length; i++) {
          expect(element(by.partialLinkText(values.resources.resourceLinks[i].name)).isDisplayed()).toBe(true);
        }
      }
      if (values.resources.resourceFiles) {
        for (var j = 0; j < values.resources.resourceFileNames.length; j++) {
          expect(element(by.partialLinkText(values.resources.resourceFileNames[j])).isDisplayed()).toBe(true);
        }
      }
    } else {
      expect(resources.isDisplayed()).toBe(false);
    }

    // Hand Outs
    var handouts = element(by.id('lesson-handouts'));
    if (values.handoutNames) {
      expect(handouts.isDisplayed()).toBe(true);
      for (var k = 0; k < values.handoutNames.length; k++) {
        expect(element(by.partialLinkText(values.handoutNames[k])).isDisplayed()).toBe(true);
      }
    } else {
      expect(handouts.isDisplayed()).toBe(false);
    }

    // State Test Questions
    var stateQuestions = element(by.id('lesson-state-test-questions'));
    if (values.stateTestQuestionNames) {
      expect(stateQuestions.isDisplayed()).toBe(true);
      for (var l = 0; l < values.stateTestQuestionNames.length; l++) {
        expect(element(by.id('img-'+values.stateTestQuestionNames[l])).isDisplayed()).toBe(true);
      }
    } else {
      expect(stateQuestions.isDisplayed()).toBe(false);
    }

    // Lesson Summary
    checkElement(element(by.css('div[ng-show="vm.lesson.lessonOverview.lessonSummary"]')),
      'Lesson Summary\n'+values.lessonSummary, values.lessonSummary ? true : false);

    // Objectives
    checkElement(element(by.css('div[ng-show="vm.lesson.lessonObjectives"]')),
      'Objectives\n'+values.lessonObjectives, values.lessonObjectives ? true : false);

    // Vocabulary
    var vocabulary = element(by.id('lesson-vocabulary'));
    if (values.term || values.vocabulary) {
      expect(vocabulary.element(by.tagName('h3')).getText()).toEqual('Vocabulary');
      var terms = vocabulary.all(by.tagName('a'));
      expect(terms.count()).toEqual((values.vocabulary ? values.vocabulary.length : 0) + (values.term ? 1 : 0));
      if (values.term) {
        expect(vocabulary.element(by.partialLinkText(values.term)).isDisplayed()).toBe(true);
      }
      if (values.vocabulary) {
        for (var m = 0; m < values.vocabulary.length; m++) {
          expect(vocabulary.element(by.partialLinkText(values.vocabulary[m]))).toBe(true);
        }
      }
    } else {
      expect(vocabulary.isDisplayed()).toBe(false);
    }

    // Supplies
    checkElement(element(by.css('div[ng-show="vm.lesson.materialsResources.supplies"]')),
      'Supplies\n'+values.supplies, values.supplies ? true : false);

    // Preparation
    checkElement(element(by.css('div[ng-show="vm.lesson.preparation"]')),
      'Preparation\n'+values.preparation, values.preparation ? true : false);

    // Background
    checkElement(element(by.css('div[ng-show="vm.lesson.background"]')),
      'Background\n'+values.background, values.background ? true : false);

    // Teacher Tips
    checkElement(element(by.css('div[ng-show="vm.lesson.materialsResources.teacherTips"]')),
      'Teacher Tips\n'+values.teacherTips, values.teacherTips ? true : false);

    // Instruction Plan
    checkElement(element(by.id('lesson-instruction-plan')).element(by.tagName('h3')),
      'Instruction Plan', (values.engage || values.explore || values.explain || values.elaborate || values.evaluate));

    // Engage
    checkElement(element(by.css('div[ng-show="vm.lesson.instructionPlan.engage"]')),
      'Engage\n'+values.engage, values.engage ? true : false);

    // Explore
    checkElement(element(by.css('div[ng-show="vm.lesson.instructionPlan.explore"]')),
      'Explore\n'+values.explore, values.explore ? true : false);

    // Explain
    checkElement(element(by.css('div[ng-show="vm.lesson.instructionPlan.explain"]')),
      'Explain\n'+values.explain, values.explain ? true : false);

    // Elaborate
    checkElement(element(by.css('div[ng-show="vm.lesson.instructionPlan.elaborate"]')),
      'Elaborate\n'+values.elaborate, values.elaborate ? true : false);

    // Evaluate
    checkElement(element(by.css('div[ng-show="vm.lesson.instructionPlan.evaluate"]')),
      'Evaluate\n'+values.evaluate, values.evaluate ? true : false);

    // Standards
    checkElement(element(by.id('lesson-standards')).element(by.tagName('h3')),
      'Standards', (values.nycssUnits || values.nysssKeyIdeas || values.nysssMajorUnderstandings ||
      values.nysssMst || values.ngssDisciplinaryCoreIdeas || values.ngssScienceEngineeringPractices ||
      values.ngssCrossCuttingConcepts || values.cclsMathematics || values.cclsElaScienceTechnicalSubjects));

    var nycsss = element(by.css('div[ng-show="vm.lesson.standards.nycsssUnits && vm.lesson.standards.nycsssUnits.length > 0"]'));
    checkStandardList(nycsss, 'NYC Science Scope & Sequence - Units', values.nycssUnits,
      values.nycssUnits ? true : false);

    var nysssKeyIdeas = element(by.css('div[ng-show="vm.lesson.standards.nysssKeyIdeas && vm.lesson.standards.nysssKeyIdeas.length > 0"]'));
    checkStandardList(nysssKeyIdeas, 'NYS Science Standards - Key Ideas', values.nysssKeyIdeas,
      values.nysssKeyIdeas ? true : false);

    var nysssMajorUnderstandings = element(by.css('div[ng-show="vm.lesson.standards.nysssMajorUnderstandings && vm.lesson.standards.nysssMajorUnderstandings.length > 0"]'));
    checkStandardList(nysssMajorUnderstandings, 'NYS Science Standards - Major Understandings',
      values.nysssMajorUnderstandings, values.nysssMajorUnderstandings ? true : false);

    var nysssMst = element(by.css('div[ng-show="vm.lesson.standards.nysssMst && vm.lesson.standards.nysssMst.length > 0"]'));
    checkStandardList(nysssMst, 'NYS Science Standards - MST', values.nysssMst, values.nysssMst ? true : false);

    var ngssDisciplinaryCoreIdeas = element(by.css('div[ng-show="vm.lesson.standards.ngssDisciplinaryCoreIdeas && vm.lesson.standards.ngssDisciplinaryCoreIdeas.length > 0"]'));
    checkStandardList(ngssDisciplinaryCoreIdeas, 'NGSS - Disciplinary Core Ideas',
      values.ngssDisciplinaryCoreIdeas, values.ngssDisciplinaryCoreIdeas ? true : false);

    var ngssScienceEngineeringPractices = element(by.css('div[ng-show="vm.lesson.standards.ngssScienceEngineeringPractices && vm.lesson.standards.ngssScienceEngineeringPractices.length > 0"]'));
    checkStandardList(ngssScienceEngineeringPractices, 'NGSS - Science and Engineering Practices',
      values.ngssScienceEngineeringPractices, values.ngssScienceEngineeringPractices ? true : false);

    var ngssCrossCuttingConcepts = element(by.css('div[ng-show="vm.lesson.standards.ngssCrossCuttingConcepts && vm.lesson.standards.ngssCrossCuttingConcepts.length > 0"]'));
    checkStandardList(ngssCrossCuttingConcepts, 'NGSS - Cross-Cutting Concepts',
      values.ngssCrossCuttingConcepts, values.ngssCrossCuttingConcepts ? true : false);

    var cclsMathematics = element(by.css('div[ng-show="vm.lesson.standards.cclsMathematics && vm.lesson.standards.cclsMathematics.length > 0"]'));
    checkStandardList(cclsMathematics, 'CCLS - Mathematics',
      values.cclsMathematics, values.cclsMathematics ? true : false);

    var cclsElaScienceTechnicalSubjects = element(by.css('div[ng-show="vm.lesson.standards.cclsElaScienceTechnicalSubjects && vm.lesson.standards.cclsElaScienceTechnicalSubjects.length > 0"]'));
    checkStandardList(cclsElaScienceTechnicalSubjects, 'CCLS - ELA Science & Technical Subjects',
      values.cclsElaScienceTechnicalSubjects, values.cclsElaScienceTechnicalSubjects ? true : false);
  };

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


      var subjectAreaFilterId = '.5706e1b9ecf01e67b1b304f0';
      var subjectAreaFilterName = 'Math';

      var unitFilterId = '.57083bd5a30222a60a46259c';
      var unitFilterName = 'Unit 5: Water Quality';

      it('should allow a team lead to view lessons', function() {
        // Sign in as team lead
        signinAs(leader);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
        browser.get('http://localhost:8081/lessons');
        // Assert taht there are 6 expeditions
        var lessons = element.all(by.repeater('lesson in vm.lessons track by lesson._id'));
        expect(lessons.count()).toEqual(6);
      });

      it('should allow a team lead to filter by subject areas - Math', function() {
        subjectAreaToggle.click();
        element(by.css('[ok-sel="'+subjectAreaFilterId+'"]')).click();
        browser.sleep(100);

        var lessons = element.all(by.repeater('lesson in vm.lessons track by lesson._id'));
        expect(lessons.count()).toEqual(2);
        expect(subjectAreaToggle.getText()).toEqual('Subject Area: ' + subjectAreaFilterName);

        showAllButton.click();
      });

      it('should allow a team lead to filter by setting - Field', function() {
        settingToggle.click();
        settingFieldField.click();
        browser.sleep(100);

        var lessons = element.all(by.repeater('lesson in vm.lessons track by lesson._id'));
        expect(lessons.count()).toEqual(2);
        expect(settingToggle.getText()).toEqual('Setting: Field');

        showAllButton.click();
      });

      it('should allow a team lead to filter by setting - Classroom', function() {
        settingToggle.click();
        settingClassroomField.click();
        browser.sleep(100);

        var lessons = element.all(by.repeater('lesson in vm.lessons track by lesson._id'));
        expect(lessons.count()).toEqual(4);
        expect(settingToggle.getText()).toEqual('Setting: Classroom');

        showAllButton.click();
      });

      it('should allow a team lead to filter by units - Water Quality', function() {
        unitsToggle.click();
        element(by.css('[ok-sel="'+unitFilterId+'"]')).click();
        browser.sleep(100);

        var lessons = element.all(by.repeater('lesson in vm.lessons track by lesson._id'));
        expect(lessons.count()).toEqual(2);
        expect(unitsToggle.getText()).toEqual('Units: ' + unitFilterName);

        showAllButton.click();
      });

      it('should allow a team lead to filter by subject area, setting, and unit', function() {
        subjectAreaToggle.click();
        element(by.css('[ok-sel="'+subjectAreaFilterId+'"]')).click();
        browser.sleep(100);

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

  describe('Lesson CRUD Tests', function() {
    var createALesson = function(values, buttonName) {
      // Sign in as team lead
      signinAs(leader);
      // Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
      browser.get('http://localhost:8081/lessons');
      // Click create lesson button
      element(by.css('[ui-sref="lessons.create"]')).click();
      // View form page
      expect(element(by.id('lesson-header')).isPresent()).toBe(true);
      // Fill in lesson
      fillInLesson(values);
      // Save lesson
      if (buttonName === 'Publish lesson') {
        element(by.buttonText(buttonName)).click();
      } else {
        element(by.partialLinkText(buttonName)).click();
      }
    };
    var waitForSave = function(visibilityTimeout, invisibilityTimeout) {
      var saveModal = element(by.id('modal-saved-lesson'));
      if (visibilityTimeout > 0) browser.wait(EC.visibilityOf(saveModal), visibilityTimeout);
      browser.sleep(500);
      if (invisibilityTimeout > 0) browser.wait(EC.invisibilityOf(saveModal), invisibilityTimeout);
    };

    var waitForSaveDraft = function() {
      var progressBar = element(by.id('modal-save-draft-progress-bar'));

      browser.wait(EC.invisibilityOf(progressBar), 3000);

      browser.sleep(1000);
    };

    describe('Create minimal lesson', function() {
      it('should allow a team lead to create a minimal lesson', function() {
        createALesson(initialLesson, 'Publish lesson');

        browser.sleep(7000);

        viewLesson(initialLesson, 'pending', false, true, true);
      });
    });
    describe('Create full lesson', function() {
      it('should allow a team lead to create a full lesson', function() {
        createALesson(fullLesson, 'Publish lesson');

        waitForSave(1000, 10000);

        viewLesson(fullLesson, 'pending', false, true, true);
      });
    });
    describe('Draft full lesson', function() {
      it('should allow a team lead to create a lesson draft', function() {
        createALesson(draft1, 'Save draft');

        waitForSaveDraft();
      });
      it('should allow a team lead to update a lesson draft', function() {
        fillInLesson(draft2, false);
        element(by.partialLinkText('Save draft')).click();

        waitForSaveDraft();

        element(by.partialLinkText('Cancel')).click();
        browser.sleep(1000);
        viewLesson(draft12, 'draft', false, true, true);
      });
      it('should allow a team lead to edit a lesson draft', function() {
        element(by.partialLinkText('Edit')).click();
        browser.sleep(1000);

        fillInLesson(draft3, false);
        element(by.buttonText('Update lesson')).click();

        waitForSave(0, 10000);

        // viewLesson(draft123, 'pending', false, true, true);
      });
    });
  });
});
