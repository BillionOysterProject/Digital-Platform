// 'use strict';
//
// /**
//  * Module dependencies.
//  */
// var should = require('should'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaBoroughsCounty = mongoose.model('MetaBoroughsCounty');
//
// /**
//  * Globals
//  */
// var user,
//   metaBoroughsCounty;
//
// /**
//  * Unit tests
//  */
// describe('Meta boroughs county Model Unit Tests:', function() {
//   beforeEach(function(done) {
//     user = new User({
//       firstName: 'Full',
//       lastName: 'Name',
//       displayName: 'Full Name',
//       email: 'test@test.com',
//       username: 'username',
//       password: 'password'
//     });
//
//     user.save(function() {
//       metaBoroughsCounty = new MetaBoroughsCounty({
//         name: 'Meta boroughs county Name',
//         user: user
//       });
//
//       done();
//     });
//   });
//
//   describe('Method Save', function() {
//     it('should be able to save without problems', function(done) {
//       this.timeout(0);
//       return metaBoroughsCounty.save(function(err) {
//         should.not.exist(err);
//         done();
//       });
//     });
//
//     it('should be able to show an error when try to save without name', function(done) {
//       metaBoroughsCounty.name = '';
//
//       return metaBoroughsCounty.save(function(err) {
//         should.exist(err);
//         done();
//       });
//     });
//   });
//
//   afterEach(function(done) {
//     MetaBoroughsCounty.remove().exec(function() {
//       User.remove().exec(function() {
//         done();
//       });
//     });
//   });
// });
