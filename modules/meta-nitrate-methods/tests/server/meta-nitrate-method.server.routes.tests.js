// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaNitratesMethod = mongoose.model('MetaNitratesMethod'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaNitratesMethod;
//
// /**
//  * Meta nitrates method routes tests
//  */
// describe('Meta nitrates method CRUD tests', function () {
//
//   before(function (done) {
//     // Get application
//     app = express.init(mongoose);
//     agent = request.agent(app);
//
//     done();
//   });
//
//   beforeEach(function (done) {
//     // Create user credentials
//     credentials = {
//       username: 'username',
//       password: 'M3@n.jsI$Aw3$0m3'
//     };
//
//     // Create a new user
//     user = new User({
//       firstName: 'Full',
//       lastName: 'Name',
//       displayName: 'Full Name',
//       email: 'test@test.com',
//       username: credentials.username,
//       password: credentials.password,
//       provider: 'local'
//     });
//
//     // Save a user to the test db and create new Meta nitrates method
//     user.save(function () {
//       metaNitratesMethod = {
//         name: 'Meta nitrates method name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta nitrates method if logged in', function (done) {
//     agent.post('/api/auth/signin')
//       .send(credentials)
//       .expect(200)
//       .end(function (signinErr, signinRes) {
//         // Handle signin error
//         if (signinErr) {
//           return done(signinErr);
//         }
//
//         // Get the userId
//         var userId = user.id;
//
//         // Save a new Meta nitrates method
//         agent.post('/api/metaNitratesMethods')
//           .send(metaNitratesMethod)
//           .expect(200)
//           .end(function (metaNitratesMethodSaveErr, metaNitratesMethodSaveRes) {
//             // Handle Meta nitrates method save error
//             if (metaNitratesMethodSaveErr) {
//               return done(metaNitratesMethodSaveErr);
//             }
//
//             // Get a list of Meta nitrates methods
//             agent.get('/api/metaNitratesMethods')
//               .end(function (metaNitratesMethodsGetErr, metaNitratesMethodsGetRes) {
//                 // Handle Meta nitrates methods save error
//                 if (metaNitratesMethodsGetErr) {
//                   return done(metaNitratesMethodsGetErr);
//                 }
//
//                 // Get Meta nitrates methods list
//                 var metaNitratesMethods = metaNitratesMethodsGetRes.body;
//
//                 // Set assertions
//                 (metaNitratesMethods[0].user._id).should.equal(userId);
//                 (metaNitratesMethods[0].name).should.match('Meta nitrates method name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta nitrates method if not logged in', function (done) {
//     agent.post('/api/metaNitratesMethods')
//       .send(metaNitratesMethod)
//       .expect(403)
//       .end(function (metaNitratesMethodSaveErr, metaNitratesMethodSaveRes) {
//         // Call the assertion callback
//         done(metaNitratesMethodSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta nitrates method if no name is provided', function (done) {
//     // Invalidate name field
//     metaNitratesMethod.name = '';
//
//     agent.post('/api/auth/signin')
//       .send(credentials)
//       .expect(200)
//       .end(function (signinErr, signinRes) {
//         // Handle signin error
//         if (signinErr) {
//           return done(signinErr);
//         }
//
//         // Get the userId
//         var userId = user.id;
//
//         // Save a new Meta nitrates method
//         agent.post('/api/metaNitratesMethods')
//           .send(metaNitratesMethod)
//           .expect(400)
//           .end(function (metaNitratesMethodSaveErr, metaNitratesMethodSaveRes) {
//             // Set message assertion
//             (metaNitratesMethodSaveRes.body.message).should.match('Please fill Meta nitrates method name');
//
//             // Handle Meta nitrates method save error
//             done(metaNitratesMethodSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta nitrates method if signed in', function (done) {
//     agent.post('/api/auth/signin')
//       .send(credentials)
//       .expect(200)
//       .end(function (signinErr, signinRes) {
//         // Handle signin error
//         if (signinErr) {
//           return done(signinErr);
//         }
//
//         // Get the userId
//         var userId = user.id;
//
//         // Save a new Meta nitrates method
//         agent.post('/api/metaNitratesMethods')
//           .send(metaNitratesMethod)
//           .expect(200)
//           .end(function (metaNitratesMethodSaveErr, metaNitratesMethodSaveRes) {
//             // Handle Meta nitrates method save error
//             if (metaNitratesMethodSaveErr) {
//               return done(metaNitratesMethodSaveErr);
//             }
//
//             // Update Meta nitrates method name
//             metaNitratesMethod.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta nitrates method
//             agent.put('/api/metaNitratesMethods/' + metaNitratesMethodSaveRes.body._id)
//               .send(metaNitratesMethod)
//               .expect(200)
//               .end(function (metaNitratesMethodUpdateErr, metaNitratesMethodUpdateRes) {
//                 // Handle Meta nitrates method update error
//                 if (metaNitratesMethodUpdateErr) {
//                   return done(metaNitratesMethodUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaNitratesMethodUpdateRes.body._id).should.equal(metaNitratesMethodSaveRes.body._id);
//                 (metaNitratesMethodUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta nitrates methods if not signed in', function (done) {
//     // Create new Meta nitrates method model instance
//     var metaNitratesMethodObj = new MetaNitratesMethod(metaNitratesMethod);
//
//     // Save the metaNitratesMethod
//     metaNitratesMethodObj.save(function () {
//       // Request Meta nitrates methods
//       request(app).get('/api/metaNitratesMethods')
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Array).and.have.lengthOf(1);
//
//           // Call the assertion callback
//           done();
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta nitrates method if not signed in', function (done) {
//     // Create new Meta nitrates method model instance
//     var metaNitratesMethodObj = new MetaNitratesMethod(metaNitratesMethod);
//
//     // Save the Meta nitrates method
//     metaNitratesMethodObj.save(function () {
//       request(app).get('/api/metaNitratesMethods/' + metaNitratesMethodObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaNitratesMethod.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta nitrates method with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaNitratesMethods/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta nitrates method is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta nitrates method which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta nitrates method
//     request(app).get('/api/metaNitratesMethods/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta nitrates method with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta nitrates method if signed in', function (done) {
//     agent.post('/api/auth/signin')
//       .send(credentials)
//       .expect(200)
//       .end(function (signinErr, signinRes) {
//         // Handle signin error
//         if (signinErr) {
//           return done(signinErr);
//         }
//
//         // Get the userId
//         var userId = user.id;
//
//         // Save a new Meta nitrates method
//         agent.post('/api/metaNitratesMethods')
//           .send(metaNitratesMethod)
//           .expect(200)
//           .end(function (metaNitratesMethodSaveErr, metaNitratesMethodSaveRes) {
//             // Handle Meta nitrates method save error
//             if (metaNitratesMethodSaveErr) {
//               return done(metaNitratesMethodSaveErr);
//             }
//
//             // Delete an existing Meta nitrates method
//             agent.delete('/api/metaNitratesMethods/' + metaNitratesMethodSaveRes.body._id)
//               .send(metaNitratesMethod)
//               .expect(200)
//               .end(function (metaNitratesMethodDeleteErr, metaNitratesMethodDeleteRes) {
//                 // Handle metaNitratesMethod error error
//                 if (metaNitratesMethodDeleteErr) {
//                   return done(metaNitratesMethodDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaNitratesMethodDeleteRes.body._id).should.equal(metaNitratesMethodSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta nitrates method if not signed in', function (done) {
//     // Set Meta nitrates method user
//     metaNitratesMethod.user = user;
//
//     // Create new Meta nitrates method model instance
//     var metaNitratesMethodObj = new MetaNitratesMethod(metaNitratesMethod);
//
//     // Save the Meta nitrates method
//     metaNitratesMethodObj.save(function () {
//       // Try deleting Meta nitrates method
//       request(app).delete('/api/metaNitratesMethods/' + metaNitratesMethodObj._id)
//         .expect(403)
//         .end(function (metaNitratesMethodDeleteErr, metaNitratesMethodDeleteRes) {
//           // Set message assertion
//           (metaNitratesMethodDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta nitrates method error error
//           done(metaNitratesMethodDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta nitrates method that has an orphaned user reference', function (done) {
//     // Create orphan user creds
//     var _creds = {
//       username: 'orphan',
//       password: 'M3@n.jsI$Aw3$0m3'
//     };
//
//     // Create orphan user
//     var _orphan = new User({
//       firstName: 'Full',
//       lastName: 'Name',
//       displayName: 'Full Name',
//       email: 'orphan@test.com',
//       username: _creds.username,
//       password: _creds.password,
//       provider: 'local'
//     });
//
//     _orphan.save(function (err, orphan) {
//       // Handle save error
//       if (err) {
//         return done(err);
//       }
//
//       agent.post('/api/auth/signin')
//         .send(_creds)
//         .expect(200)
//         .end(function (signinErr, signinRes) {
//           // Handle signin error
//           if (signinErr) {
//             return done(signinErr);
//           }
//
//           // Get the userId
//           var orphanId = orphan._id;
//
//           // Save a new Meta nitrates method
//           agent.post('/api/metaNitratesMethods')
//             .send(metaNitratesMethod)
//             .expect(200)
//             .end(function (metaNitratesMethodSaveErr, metaNitratesMethodSaveRes) {
//               // Handle Meta nitrates method save error
//               if (metaNitratesMethodSaveErr) {
//                 return done(metaNitratesMethodSaveErr);
//               }
//
//               // Set assertions on new Meta nitrates method
//               (metaNitratesMethodSaveRes.body.name).should.equal(metaNitratesMethod.name);
//               should.exist(metaNitratesMethodSaveRes.body.user);
//               should.equal(metaNitratesMethodSaveRes.body.user._id, orphanId);
//
//               // force the Meta nitrates method to have an orphaned user reference
//               orphan.remove(function () {
//                 // now signin with valid user
//                 agent.post('/api/auth/signin')
//                   .send(credentials)
//                   .expect(200)
//                   .end(function (err, res) {
//                     // Handle signin error
//                     if (err) {
//                       return done(err);
//                     }
//
//                     // Get the Meta nitrates method
//                     agent.get('/api/metaNitratesMethods/' + metaNitratesMethodSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaNitratesMethodInfoErr, metaNitratesMethodInfoRes) {
//                         // Handle Meta nitrates method error
//                         if (metaNitratesMethodInfoErr) {
//                           return done(metaNitratesMethodInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaNitratesMethodInfoRes.body._id).should.equal(metaNitratesMethodSaveRes.body._id);
//                         (metaNitratesMethodInfoRes.body.name).should.equal(metaNitratesMethod.name);
//                         should.equal(metaNitratesMethodInfoRes.body.user, undefined);
//
//                         // Call the assertion callback
//                         done();
//                       });
//                   });
//               });
//             });
//         });
//     });
//   });
//
//   afterEach(function (done) {
//     User.remove().exec(function () {
//       MetaNitratesMethod.remove().exec(done);
//     });
//   });
// });
