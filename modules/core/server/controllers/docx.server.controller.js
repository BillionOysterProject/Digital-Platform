'use strict';

var archiver = require('archiver'),
  fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Docxtemplater = require('docxtemplater');

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
  var re = /(&nbsp;|<([^>]+)>)/ig
  var sanitizedStr = str.replace(re, '');
  return sanitizedStr
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

exports.createLessonDocx = function(pathToTemplate, lessonObject, successCallback, errorCallback) {
  //pass in docx template


  if (!fs.statSync(pathToTemplate)){
    errorCallback(console.log('Bad template path: ' + pathToTemplate));
  }
  try{

    var __dirname = path.dirname(pathToTemplate);

    var json = JSON.parse(sanitizeHtml(lessonObject));

    var content = fs
    .readFileSync(pathToTemplate, "binary");

    var doc = new Docxtemplater(content);

    doc.setData(json);
    doc.render()
    var buf = doc.getZip()
                 .generate({type:"nodebuffer"});

    var date = new Date().getTime().toString();
    var formattedFile = path.join(__dirname, date+".docx");
    fs.writeFileSync(formattedFile, buf);

    successCallback(formattedFile)
  }
  catch(err){
    errorCallback(err)
  }

};
