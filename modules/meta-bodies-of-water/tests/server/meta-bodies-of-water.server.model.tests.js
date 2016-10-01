// 'use strict';
//
// /**
//  * Module dependencies.
//  */
// var should = require('should'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaBodiesOfWater = mongoose.model('MetaBodiesOfWater');
//
// /**
//  * Globals
//  */
// var user,
//   metaBodiesOfWater;
//
// /**
//  * Unit tests
//  */
// describe('Meta bodies of water Model Unit Tests:', function() {
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
//       metaBodiesOfWater = new MetaBodiesOfWater({
//         name: 'Meta bodies of water Name',
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
//       return metaBodiesOfWater.save(function(err) {
//         should.not.exist(err);
//         done();
//       });
//     });
//
//     it('should be able to show an error when try to save without name', function(done) {
//       metaBodiesOfWater.name = '';
//
//       return metaBodiesOfWater.save(function(err) {
//         should.exist(err);
//         done();
//       });
//     });
//   });
//
//   afterEach(function(done) {
//     MetaBodiesOfWater.remove().exec(function() {
//       User.remove().exec(function() {
//         done();
//       });
//     });
//   });
// });
