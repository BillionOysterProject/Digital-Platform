'use strict';

var archiver = require('archiver'),
  fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Docxtemplater = require('docxtemplater'),
  moment = require('moment'),
  htmlToText = require('html-to-text'),
  _ = require('lodash');

var mkdir = function(dir) {
// making directory without exception if exists
  try {
    fs.mkdirSync(dir, '0755');
  } catch(e) {
    if(e.code !== 'EEXIST') {
      throw e;
    }
  }
};

function sanitizeHtml(str){
  var re = /(&nbsp;|<([^>]+)>)/ig;
  var sanitizedStr = str.replace(re, '');
  return sanitizedStr;
}

function createTempTemplatePath(pathToTemplate){
  //simple helper function to create a file name from the date

  var date = new Date().getTime().toString();
  var basePath = path.dirname(pathToTemplate);
  var tempPath = path.join(basePath, date);
  return tempPath;
}

//---- File system helper functions ----

var copy = function(src, dest) {
  var oldFile = fs.createReadStream(src);
  var newFile = fs.createWriteStream(dest);
  util.pump(oldFile, newFile);
};

var copyDir = function(src, dest) {
  mkdir(dest);
  var files = fs.readdirSync(src);
  for(var i = 0; i < files.length; i++) {
    var current = fs.lstatSync(path.join(src, files[i]));
    if(current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]));
    } else if(current.isSymbolicLink()) {
      var symlink = fs.readlinkSync(path.join(src, files[i]));
      fs.symlinkSync(symlink, path.join(dest, files[i]));
    } else {
      copy(path.join(src, files[i]), path.join(dest, files[i]));
    }
  }
};

var convertProtocolConnections = function(protocolConnections) {
  var protocols = [];
  for (var i = 0; i < protocolConnections; i++) {
    switch(protocolConnections[i]) {
      case 'protocol1': protocols.push('Protocol 1: Site Conditions'); break;
      case 'protocol2': protocols.push('Protocol 2: Oyster Measurements'); break;
      case 'protocol3': protocols.push('Protocol 3: Mobile Trap'); break;
      case 'protocol4': protocols.push('Protocol 4: Settlement Tiles'); break;
      case 'protocol5': protocols.push('Protocol 5: Water Quality'); break;
      default: break;
    }
  }
  return protocols.join(', ');
};

var convertHtmlToText = function(html) {
  if (html && html !== '') {
    html = _.replace(html, /<li>/ig, '\n<li>');
    var text = htmlToText.fromString(html, {});
    return text;
  } else {
    return '';
  }
};

exports.createLessonDocx = function(pathToTemplate, lesson, successCallback, errorCallback) {
  //pass in docx template


  if (!fs.statSync(pathToTemplate)){
    errorCallback(console.log('Bad template path: ' + pathToTemplate));
  }
  try{

    var __dirname = path.dirname(pathToTemplate);

    //var json = JSON.parse(sanitizeHtml(lessonObject));

    var content = fs
    .readFileSync(pathToTemplate, 'binary');

    var doc = new Docxtemplater(content);

    var json = {
      'title': lesson.title,
      'user-displayName': lesson.user.displayName,
      'user-email': lesson.user.email,
      'created': moment(lesson.created).format('MMM D YYYY'),
      'unit-title': lesson.unit.title,
      'lessonOverview-protocolConnections': convertProtocolConnections(lesson.lessonOverview.protocolConnections),
      'lessonOverview-grade': lesson.lessonOverview.grade,
      'lessonOverview-classPeriods': lesson.lessonOverview.classPeriods,
      'lessonOverview-setting': lesson.lessonOverview.setting,
      'lessonOverview-subjectAreas': lesson.lessonOverview.subjectAreas,
      'lessonOverview-lessonSummary': convertHtmlToText(lesson.lessonOverview.lessonSummary),
      'lessonObjectives': convertHtmlToText(lesson.lessonObjectives),
      'materialsResources-supplies': lesson.materialsResources.supplies,
      'materialsResources-teacherResourceLinks': lesson.materialsResources.teacherResourcesLinks,
      'materialsResources-teacherResourceFiles': lesson.materialsResources.teacherResourcesFiles,
      'materialsResources-handoutsFileInput': lesson.materialsResources.handoutsFileInput,
      'materialsResources-stateTestQuestions': lesson.materialsResources.stateTestQuestions,
      'materialsResources-vocabulary': lesson.materialsResources.vocabulary,
      'background': convertHtmlToText(lesson.background),
      'materialsResources-teacherTips': [{ 'tip': lesson.materialsResources.teacherTips }],
      'instructionPlan': (lesson.instructionPlan) ? 'true' : null,
      'instructionPlan-engage': (lesson.instructionPlan) ? convertHtmlToText(lesson.instructionPlan.engage) : '',
      'instructionPlan-explore': (lesson.instructionPlan) ? convertHtmlToText(lesson.instructionPlan.explore) : '',
      'instructionPlan-explain': (lesson.instructionPlan) ? convertHtmlToText(lesson.instructionPlan.explain) : '',
      'instructionPlan-elaborate': (lesson.instructionPlan) ? convertHtmlToText(lesson.instructionPlan.elaborate) : '',
      'instructionPlan-evaluate': (lesson.instructionPlan) ? convertHtmlToText(lesson.instructionPlan.evaluate) : '',
      'standards': (lesson.standards) ? 'true' : null,
      'standards-nycsssUnits': lesson.standards.nycsssUnits,
      'standards-nysssKeyIdeas': lesson.standards.nysssKeyIdeas,
      'standards-nysssMajorUnderstandings': lesson.standards.nysssMajorUnderstandings,
      'standards-nysssMst': lesson.standards.nysssMst,
      'standards-ngssDisciplinaryCoreIdeas': lesson.standards.ngssDisciplinaryCoreIdeas,
      'standards-ngssScienceEngineeringPractices': lesson.standards.ngssScienceEngineeringPractices,
      'standards-ngssCrossCuttingConcepts': lesson.standards.ngssCrossCuttingConcepts,
      'standards-cclsMathematics': lesson.standards.cclsMathematics,
      'standards-cclsElaScienceTechnicalSubjects': lesson.standards.cclsElaScienceTechnicalSubjects
    };

    doc.setData(json);
    doc.render();
    var buf = doc.getZip()
                 .generate({ type:'nodebuffer' });

    var date = new Date().getTime().toString();
    var formattedFile = path.join(__dirname, date+'.docx');
    fs.writeFileSync(formattedFile, buf);

    successCallback(formattedFile);
  }
  catch(err){
    errorCallback(err);
  }

};
