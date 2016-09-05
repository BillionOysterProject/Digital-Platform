// 'use strict';
//
// /**
//  * Module dependencies.
//  */
// var should = require('should'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaDissolvedOxygenUnit = mongoose.model('MetaDissolvedOxygenUnit');
//
// /**
//  * Globals
//  */
// var user,
//   metaDissolvedOxygenUnit;
//
// /**
//  * Unit tests
//  */
// describe('Meta dissolved oxygen unit Model Unit Tests:', function() {
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
//       metaDissolvedOxygenUnit = new MetaDissolvedOxygenUnit({
//         name: 'Meta dissolved oxygen unit Name',
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
//       return metaDissolvedOxygenUnit.save(function(err) {
//         should.not.exist(err);
//         done();
//       });
//     });
//
//     it('should be able to show an error when try to save without name', function(done) {
//       metaDissolvedOxygenUnit.name = '';
//
//       return metaDissolvedOxygenUnit.save(function(err) {
//         should.exist(err);
//         done();
//       });
//     });
//   });
//
//   afterEach(function(done) {
//     MetaDissolvedOxygenUnit.remove().exec(function() {
//       User.remove().exec(function() {
//         done();
//       });
//     });
//   });
// });
