// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaSalinityMethod = mongoose.model('MetaSalinityMethod'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaSalinityMethod;
//
// /**
//  * Meta salinity method routes tests
//  */
// describe('Meta salinity method CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta salinity method
//     user.save(function () {
//       metaSalinityMethod = {
//         name: 'Meta salinity method name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta salinity method if logged in', function (done) {
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
//         // Save a new Meta salinity method
//         agent.post('/api/metaSalinityMethods')
//           .send(metaSalinityMethod)
//           .expect(200)
//           .end(function (metaSalinityMethodSaveErr, metaSalinityMethodSaveRes) {
//             // Handle Meta salinity method save error
//             if (metaSalinityMethodSaveErr) {
//               return done(metaSalinityMethodSaveErr);
//             }
//
//             // Get a list of Meta salinity methods
//             agent.get('/api/metaSalinityMethods')
//               .end(function (metaSalinityMethodsGetErr, metaSalinityMethodsGetRes) {
//                 // Handle Meta salinity methods save error
//                 if (metaSalinityMethodsGetErr) {
//                   return done(metaSalinityMethodsGetErr);
//                 }
//
//                 // Get Meta salinity methods list
//                 var metaSalinityMethods = metaSalinityMethodsGetRes.body;
//
//                 // Set assertions
//                 (metaSalinityMethods[0].user._id).should.equal(userId);
//                 (metaSalinityMethods[0].name).should.match('Meta salinity method name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta salinity method if not logged in', function (done) {
//     agent.post('/api/metaSalinityMethods')
//       .send(metaSalinityMethod)
//       .expect(403)
//       .end(function (metaSalinityMethodSaveErr, metaSalinityMethodSaveRes) {
//         // Call the assertion callback
//         done(metaSalinityMethodSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta salinity method if no name is provided', function (done) {
//     // Invalidate name field
//     metaSalinityMethod.name = '';
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
//         // Save a new Meta salinity method
//         agent.post('/api/metaSalinityMethods')
//           .send(metaSalinityMethod)
//           .expect(400)
//           .end(function (metaSalinityMethodSaveErr, metaSalinityMethodSaveRes) {
//             // Set message assertion
//             (metaSalinityMethodSaveRes.body.message).should.match('Please fill Meta salinity method name');
//
//             // Handle Meta salinity method save error
//             done(metaSalinityMethodSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta salinity method if signed in', function (done) {
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
//         // Save a new Meta salinity method
//         agent.post('/api/metaSalinityMethods')
//           .send(metaSalinityMethod)
//           .expect(200)
//           .end(function (metaSalinityMethodSaveErr, metaSalinityMethodSaveRes) {
//             // Handle Meta salinity method save error
//             if (metaSalinityMethodSaveErr) {
//               return done(metaSalinityMethodSaveErr);
//             }
//
//             // Update Meta salinity method name
//             metaSalinityMethod.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta salinity method
//             agent.put('/api/metaSalinityMethods/' + metaSalinityMethodSaveRes.body._id)
//               .send(metaSalinityMethod)
//               .expect(200)
//               .end(function (metaSalinityMethodUpdateErr, metaSalinityMethodUpdateRes) {
//                 // Handle Meta salinity method update error
//                 if (metaSalinityMethodUpdateErr) {
//                   return done(metaSalinityMethodUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaSalinityMethodUpdateRes.body._id).should.equal(metaSalinityMethodSaveRes.body._id);
//                 (metaSalinityMethodUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta salinity methods if not signed in', function (done) {
//     // Create new Meta salinity method model instance
//     var metaSalinityMethodObj = new MetaSalinityMethod(metaSalinityMethod);
//
//     // Save the metaSalinityMethod
//     metaSalinityMethodObj.save(function () {
//       // Request Meta salinity methods
//       request(app).get('/api/metaSalinityMethods')
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
//   it('should be able to get a single Meta salinity method if not signed in', function (done) {
//     // Create new Meta salinity method model instance
//     var metaSalinityMethodObj = new MetaSalinityMethod(metaSalinityMethod);
//
//     // Save the Meta salinity method
//     metaSalinityMethodObj.save(function () {
//       request(app).get('/api/metaSalinityMethods/' + metaSalinityMethodObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaSalinityMethod.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta salinity method with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaSalinityMethods/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta salinity method is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta salinity method which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta salinity method
//     request(app).get('/api/metaSalinityMethods/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta salinity method with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta salinity method if signed in', function (done) {
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
//         // Save a new Meta salinity method
//         agent.post('/api/metaSalinityMethods')
//           .send(metaSalinityMethod)
//           .expect(200)
//           .end(function (metaSalinityMethodSaveErr, metaSalinityMethodSaveRes) {
//             // Handle Meta salinity method save error
//             if (metaSalinityMethodSaveErr) {
//               return done(metaSalinityMethodSaveErr);
//             }
//
//             // Delete an existing Meta salinity method
//             agent.delete('/api/metaSalinityMethods/' + metaSalinityMethodSaveRes.body._id)
//               .send(metaSalinityMethod)
//               .expect(200)
//               .end(function (metaSalinityMethodDeleteErr, metaSalinityMethodDeleteRes) {
//                 // Handle metaSalinityMethod error error
//                 if (metaSalinityMethodDeleteErr) {
//                   return done(metaSalinityMethodDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaSalinityMethodDeleteRes.body._id).should.equal(metaSalinityMethodSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta salinity method if not signed in', function (done) {
//     // Set Meta salinity method user
//     metaSalinityMethod.user = user;
//
//     // Create new Meta salinity method model instance
//     var metaSalinityMethodObj = new MetaSalinityMethod(metaSalinityMethod);
//
//     // Save the Meta salinity method
//     metaSalinityMethodObj.save(function () {
//       // Try deleting Meta salinity method
//       request(app).delete('/api/metaSalinityMethods/' + metaSalinityMethodObj._id)
//         .expect(403)
//         .end(function (metaSalinityMethodDeleteErr, metaSalinityMethodDeleteRes) {
//           // Set message assertion
//           (metaSalinityMethodDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta salinity method error error
//           done(metaSalinityMethodDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta salinity method that has an orphaned user reference', function (done) {
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
//           // Save a new Meta salinity method
//           agent.post('/api/metaSalinityMethods')
//             .send(metaSalinityMethod)
//             .expect(200)
//             .end(function (metaSalinityMethodSaveErr, metaSalinityMethodSaveRes) {
//               // Handle Meta salinity method save error
//               if (metaSalinityMethodSaveErr) {
//                 return done(metaSalinityMethodSaveErr);
//               }
//
//               // Set assertions on new Meta salinity method
//               (metaSalinityMethodSaveRes.body.name).should.equal(metaSalinityMethod.name);
//               should.exist(metaSalinityMethodSaveRes.body.user);
//               should.equal(metaSalinityMethodSaveRes.body.user._id, orphanId);
//
//               // force the Meta salinity method to have an orphaned user reference
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
//                     // Get the Meta salinity method
//                     agent.get('/api/metaSalinityMethods/' + metaSalinityMethodSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaSalinityMethodInfoErr, metaSalinityMethodInfoRes) {
//                         // Handle Meta salinity method error
//                         if (metaSalinityMethodInfoErr) {
//                           return done(metaSalinityMethodInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaSalinityMethodInfoRes.body._id).should.equal(metaSalinityMethodSaveRes.body._id);
//                         (metaSalinityMethodInfoRes.body.name).should.equal(metaSalinityMethod.name);
//                         should.equal(metaSalinityMethodInfoRes.body.user, undefined);
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
//       MetaSalinityMethod.remove().exec(done);
//     });
//   });
// });
