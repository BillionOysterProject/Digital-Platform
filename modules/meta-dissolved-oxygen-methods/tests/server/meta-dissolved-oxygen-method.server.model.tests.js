// 'use strict';
//
// /**
//  * Module dependencies.
//  */
// var should = require('should'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaDissolvedOxygenMethod = mongoose.model('MetaDissolvedOxygenMethod');
//
// /**
//  * Globals
//  */
// var user,
//   metaDissolvedOxygenMethod;
//
// /**
//  * Unit tests
//  */
// describe('Meta dissolved oxygen method Model Unit Tests:', function() {
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
//       metaDissolvedOxygenMethod = new MetaDissolvedOxygenMethod({
//         name: 'Meta dissolved oxygen method Name',
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
//       return metaDissolvedOxygenMethod.save(function(err) {
//         should.not.exist(err);
//         done();
//       });
//     });
//
//     it('should be able to show an error when try to save without name', function(done) {
//       metaDissolvedOxygenMethod.name = '';
//
//       return metaDissolvedOxygenMethod.save(function(err) {
//         should.exist(err);
//         done();
//       });
//     });
//   });
//
//   afterEach(function(done) {
//     MetaDissolvedOxygenMethod.remove().exec(function() {
//       User.remove().exec(function() {
//         done();
//       });
//     });
//   });
// });
