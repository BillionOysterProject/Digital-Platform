// 'use strict';
//
// /**
//  * Module dependencies.
//  */
// var should = require('should'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaWaterTemperatureUnit = mongoose.model('MetaWaterTemperatureUnit');
//
// /**
//  * Globals
//  */
// var user,
//   metaWaterTemperatureUnit;
//
// /**
//  * Unit tests
//  */
// describe('Meta water temperature unit Model Unit Tests:', function() {
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
//       metaWaterTemperatureUnit = new MetaWaterTemperatureUnit({
//         name: 'Meta water temperature unit Name',
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
//       return metaWaterTemperatureUnit.save(function(err) {
//         should.not.exist(err);
//         done();
//       });
//     });
//
//     it('should be able to show an error when try to save without name', function(done) {
//       metaWaterTemperatureUnit.name = '';
//
//       return metaWaterTemperatureUnit.save(function(err) {
//         should.exist(err);
//         done();
//       });
//     });
//   });
//
//   afterEach(function(done) {
//     MetaWaterTemperatureUnit.remove().exec(function() {
//       User.remove().exec(function() {
//         done();
//       });
//     });
//   });
// });
