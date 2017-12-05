#!/usr/bin/env nodejs
'use strict';

var mongoose = require('mongoose'),
    chalk = require('chalk'),
    config = require('../config/config'),
    mg = require('../config/lib/mongoose');

mongoose.Promise = global.Promise;

mg.loadModels();

mongoose.connect('mongodb://localhost/bop-dev');

mongoose.connection.on("open", function(ref) {
  return console.log("Connected to mongo server!".green);
});

mongoose.connection.on("error", function(err) {
  console.log("Could not connect to mongo server!".yellow);
  return console.log(err.message.red);
});

// var args = process.argv.slice(2);
var User = mongoose.model('User');

var newUser = new User({
    username: 'admin',
    roles:    ['admin', 'user'],
    password: 'admin123',
    firstName: 'Admin',
    lastName:  'User',
    email:    'admin@localhost.com',
    pending:  false,
    provider: 'local',
});

newUser.save(function(err, data){
    if(err){
        console.log(err);
        process.exit(1);
    }
});
