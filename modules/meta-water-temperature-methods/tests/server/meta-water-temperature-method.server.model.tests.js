// 'use strict';
//
// /**
//  * Module dependencies.
//  */
// var should = require('should'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaWaterTemperatureMethod = mongoose.model('MetaWaterTemperatureMethod');
//
// /**
//  * Globals
//  */
// var user,
//   metaWaterTemperatureMethod;
//
// /**
//  * Unit tests
//  */
// describe('Meta water temperature method Model Unit Tests:', function() {
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
//       metaWaterTemperatureMethod = new MetaWaterTemperatureMethod({
//         name: 'Meta water temperature method Name',
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
//       return metaWaterTemperatureMethod.save(function(err) {
//         should.not.exist(err);
//         done();
//       });
//     });
//
//     it('should be able to show an error when try to save without name', function(done) {
//       metaWaterTemperatureMethod.name = '';
//
//       return metaWaterTemperatureMethod.save(function(err) {
//         should.exist(err);
//         done();
//       });
//     });
//   });
//
//   afterEach(function(done) {
//     MetaWaterTemperatureMethod.remove().exec(function() {
//       User.remove().exec(function() {
//         done();
//       });
//     });
//   });
// });
