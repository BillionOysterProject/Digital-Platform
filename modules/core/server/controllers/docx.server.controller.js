'use strict';

var archiver = require('archiver'),
  fs = require('fs'),
  path = require('path'),
  util = require('util');

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

var rmdir = function(dir) {
//simple function to remove a directory and it's contents
  var list = fs.readdirSync(dir);
  for(var i = 0; i < list.length; i++) {
    var filename = path.join(dir, list[i]);
    var stat = fs.statSync(filename);

    if(filename === '.' || filename === '..') {
      // pass these files
    } else if(stat.isDirectory()) {
      // rmdir recursively
      rmdir(filename);
    } else {
      // rm fiilename
      fs.unlinkSync(filename);
    }
  }
  fs.rmdirSync(dir);
};

function templateToDocx(tempTemplatePath){
  //convert the template dir into a docx file by zipping the dir

  //get file pathing
  var baseDir = path.dirname(tempTemplatePath);
  var fileName = path.basename(tempTemplatePath);
  var docxName = path.join(baseDir, fileName.concat('.docx'));

  var output = fs.createWriteStream(docxName);
  var archive = archiver('zip');

  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
    rmdir(tempTemplatePath);
  });

  archive.on('error', function(err){
    throw err;
  });

  archive.pipe(output);
  archive.directory(tempTemplatePath, '');
  archive.finalize();

  return docxName;
}

function processTemplate(data, lessonObject){
  return 'made it';
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

exports.createLessonDocx = function(pathToTemplate, lessonObject, callback) {

  //hopefully we just stick to utf8
  var encoding = 'utf8';

  if (!fs.statSync(pathToTemplate)){
    return console.log("Bad template path: " + pathToTemplate);
  }

  var tempTemplatePath = createTempTemplatePath(pathToTemplate);
  copyDir(pathToTemplate, tempTemplatePath);

  if (!fs.statSync(pathToTemplate)){
    return console.log("Unable to create temp path: " + tempTemplatePath);
  }

  var documentPath = path.join(pathToTemplate, 'word', 'document.xml');

  fs.readFile(documentPath, encoding, function (err, data) {
    if (err) {
      return console.log(err);
    }

    var bar = processTemplate(data, lessonObject);
  });

  var docxName = templateToDocx(tempTemplatePath);
  console.log('docsName', docxName);
  callback(docxName);
};
