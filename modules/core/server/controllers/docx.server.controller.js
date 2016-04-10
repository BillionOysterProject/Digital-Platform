archiver = require('archiver')
fs = require('fs')
path = require('path')
util = require('util')


exports.createLessonDocx = function(pathToTemplate, lessonObject, callback ){

  //hopefully we just stick to utf8
  var encoding = "utf8";

  tempTemplatePath = createTempTemplate(pathToTemplate);
  copyDir(pathToTemplate, tempTemplatePath);
  documentPath = createDocumentPathString(tempTemplatePath);


  bar = "Hey"
  fs.readFile(documentPath, encoding, function (err, data) {
    if (err) {
      return console.log(err);
    }

    bar = processTemplate(data, lessonObject)

  });

  docxName = templateToDocx(tempTemplatePath)

  return docxName
};


var fs = require("fs");
var path = require("path");

var rmdir = function(dir) {
	var list = fs.readdirSync(dir);
	for(var i = 0; i < list.length; i++) {
		var filename = path.join(dir, list[i]);
		var stat = fs.statSync(filename);

		if(filename == "." || filename == "..") {
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
  baseDir = path.dirname(tempTemplatePath)
  fileName = path.basename(tempTemplatePath)
  docxName = path.join(baseDir, fileName.concat('.docx'))


  var output = fs.createWriteStream(docxName);
  var archive = archiver('zip');

  output.on('close', function () {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      rmdir(tempTemplatePath)
  });

  archive.on('error', function(err){
      throw err;
  });

  archive.pipe(output);
  archive.directory(tempTemplatePath, "")
  archive.finalize();


  return docxName
}

function processTemplate(data, lessonObject){
  return "made it"
}

function createDocumentPathString(pathToTemplate){
  document = path.join(pathToTemplate, "word", "document.xml")
  return document
}

function createTempTemplate(pathToTemplate){
  date = new Date().toLocaleString();
  basePath = path.dirname(pathToTemplate);
  tempPath = path.join(basePath, date);
  return tempPath;
}

var mkdir = function(dir) {
	// making directory without exception if exists
	try {
		fs.mkdirSync(dir, 0755);
	} catch(e) {
		if(e.code != "EEXIST") {
			throw e;
		}
	}
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

var copy = function(src, dest) {
	var oldFile = fs.createReadStream(src);
	var newFile = fs.createWriteStream(dest);
	util.pump(oldFile, newFile);
};


