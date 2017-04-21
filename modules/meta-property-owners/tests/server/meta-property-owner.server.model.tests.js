// 'use strict';
//
// /**
//  * Module dependencies.
//  */
// var should = require('should'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaPropertyOwner = mongoose.model('MetaPropertyOwner');
//
// /**
//  * Globals
//  */
// var user,
//   metaPropertyOwner;
//
// /**
//  * Unit tests
//  */
// describe('Meta property owner Model Unit Tests:', function() {
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
//       metaPropertyOwner = new MetaPropertyOwner({
//         name: 'Meta property owner Name',
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
//       return metaPropertyOwner.save(function(err) {
//         should.not.exist(err);
//         done();
//       });
//     });
//
//     it('should be able to show an error when try to save without name', function(done) {
//       metaPropertyOwner.name = '';
//
//       return metaPropertyOwner.save(function(err) {
//         should.exist(err);
//         done();
//       });
//     });
//   });
//
//   afterEach(function(done) {
//     MetaPropertyOwner.remove().exec(function() {
//       User.remove().exec(function() {
//         done();
//       });
//     });
//   });
// });
