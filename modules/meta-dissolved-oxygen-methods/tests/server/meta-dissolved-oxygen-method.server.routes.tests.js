// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaDissolvedOxygenMethod = mongoose.model('MetaDissolvedOxygenMethod'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaDissolvedOxygenMethod;
//
// /**
//  * Meta dissolved oxygen method routes tests
//  */
// describe('Meta dissolved oxygen method CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta dissolved oxygen method
//     user.save(function () {
//       metaDissolvedOxygenMethod = {
//         name: 'Meta dissolved oxygen method name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta dissolved oxygen method if logged in', function (done) {
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
//         // Save a new Meta dissolved oxygen method
//         agent.post('/api/metaDissolvedOxygenMethods')
//           .send(metaDissolvedOxygenMethod)
//           .expect(200)
//           .end(function (metaDissolvedOxygenMethodSaveErr, metaDissolvedOxygenMethodSaveRes) {
//             // Handle Meta dissolved oxygen method save error
//             if (metaDissolvedOxygenMethodSaveErr) {
//               return done(metaDissolvedOxygenMethodSaveErr);
//             }
//
//             // Get a list of Meta dissolved oxygen methods
//             agent.get('/api/metaDissolvedOxygenMethods')
//               .end(function (metaDissolvedOxygenMethodsGetErr, metaDissolvedOxygenMethodsGetRes) {
//                 // Handle Meta dissolved oxygen methods save error
//                 if (metaDissolvedOxygenMethodsGetErr) {
//                   return done(metaDissolvedOxygenMethodsGetErr);
//                 }
//
//                 // Get Meta dissolved oxygen methods list
//                 var metaDissolvedOxygenMethods = metaDissolvedOxygenMethodsGetRes.body;
//
//                 // Set assertions
//                 (metaDissolvedOxygenMethods[0].user._id).should.equal(userId);
//                 (metaDissolvedOxygenMethods[0].name).should.match('Meta dissolved oxygen method name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta dissolved oxygen method if not logged in', function (done) {
//     agent.post('/api/metaDissolvedOxygenMethods')
//       .send(metaDissolvedOxygenMethod)
//       .expect(403)
//       .end(function (metaDissolvedOxygenMethodSaveErr, metaDissolvedOxygenMethodSaveRes) {
//         // Call the assertion callback
//         done(metaDissolvedOxygenMethodSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta dissolved oxygen method if no name is provided', function (done) {
//     // Invalidate name field
//     metaDissolvedOxygenMethod.name = '';
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
//         // Save a new Meta dissolved oxygen method
//         agent.post('/api/metaDissolvedOxygenMethods')
//           .send(metaDissolvedOxygenMethod)
//           .expect(400)
//           .end(function (metaDissolvedOxygenMethodSaveErr, metaDissolvedOxygenMethodSaveRes) {
//             // Set message assertion
//             (metaDissolvedOxygenMethodSaveRes.body.message).should.match('Please fill Meta dissolved oxygen method name');
//
//             // Handle Meta dissolved oxygen method save error
//             done(metaDissolvedOxygenMethodSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta dissolved oxygen method if signed in', function (done) {
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
//         // Save a new Meta dissolved oxygen method
//         agent.post('/api/metaDissolvedOxygenMethods')
//           .send(metaDissolvedOxygenMethod)
//           .expect(200)
//           .end(function (metaDissolvedOxygenMethodSaveErr, metaDissolvedOxygenMethodSaveRes) {
//             // Handle Meta dissolved oxygen method save error
//             if (metaDissolvedOxygenMethodSaveErr) {
//               return done(metaDissolvedOxygenMethodSaveErr);
//             }
//
//             // Update Meta dissolved oxygen method name
//             metaDissolvedOxygenMethod.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta dissolved oxygen method
//             agent.put('/api/metaDissolvedOxygenMethods/' + metaDissolvedOxygenMethodSaveRes.body._id)
//               .send(metaDissolvedOxygenMethod)
//               .expect(200)
//               .end(function (metaDissolvedOxygenMethodUpdateErr, metaDissolvedOxygenMethodUpdateRes) {
//                 // Handle Meta dissolved oxygen method update error
//                 if (metaDissolvedOxygenMethodUpdateErr) {
//                   return done(metaDissolvedOxygenMethodUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaDissolvedOxygenMethodUpdateRes.body._id).should.equal(metaDissolvedOxygenMethodSaveRes.body._id);
//                 (metaDissolvedOxygenMethodUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta dissolved oxygen methods if not signed in', function (done) {
//     // Create new Meta dissolved oxygen method model instance
//     var metaDissolvedOxygenMethodObj = new MetaDissolvedOxygenMethod(metaDissolvedOxygenMethod);
//
//     // Save the metaDissolvedOxygenMethod
//     metaDissolvedOxygenMethodObj.save(function () {
//       // Request Meta dissolved oxygen methods
//       request(app).get('/api/metaDissolvedOxygenMethods')
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
//   it('should be able to get a single Meta dissolved oxygen method if not signed in', function (done) {
//     // Create new Meta dissolved oxygen method model instance
//     var metaDissolvedOxygenMethodObj = new MetaDissolvedOxygenMethod(metaDissolvedOxygenMethod);
//
//     // Save the Meta dissolved oxygen method
//     metaDissolvedOxygenMethodObj.save(function () {
//       request(app).get('/api/metaDissolvedOxygenMethods/' + metaDissolvedOxygenMethodObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaDissolvedOxygenMethod.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta dissolved oxygen method with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaDissolvedOxygenMethods/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta dissolved oxygen method is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta dissolved oxygen method which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta dissolved oxygen method
//     request(app).get('/api/metaDissolvedOxygenMethods/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta dissolved oxygen method with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta dissolved oxygen method if signed in', function (done) {
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
//         // Save a new Meta dissolved oxygen method
//         agent.post('/api/metaDissolvedOxygenMethods')
//           .send(metaDissolvedOxygenMethod)
//           .expect(200)
//           .end(function (metaDissolvedOxygenMethodSaveErr, metaDissolvedOxygenMethodSaveRes) {
//             // Handle Meta dissolved oxygen method save error
//             if (metaDissolvedOxygenMethodSaveErr) {
//               return done(metaDissolvedOxygenMethodSaveErr);
//             }
//
//             // Delete an existing Meta dissolved oxygen method
//             agent.delete('/api/metaDissolvedOxygenMethods/' + metaDissolvedOxygenMethodSaveRes.body._id)
//               .send(metaDissolvedOxygenMethod)
//               .expect(200)
//               .end(function (metaDissolvedOxygenMethodDeleteErr, metaDissolvedOxygenMethodDeleteRes) {
//                 // Handle metaDissolvedOxygenMethod error error
//                 if (metaDissolvedOxygenMethodDeleteErr) {
//                   return done(metaDissolvedOxygenMethodDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaDissolvedOxygenMethodDeleteRes.body._id).should.equal(metaDissolvedOxygenMethodSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta dissolved oxygen method if not signed in', function (done) {
//     // Set Meta dissolved oxygen method user
//     metaDissolvedOxygenMethod.user = user;
//
//     // Create new Meta dissolved oxygen method model instance
//     var metaDissolvedOxygenMethodObj = new MetaDissolvedOxygenMethod(metaDissolvedOxygenMethod);
//
//     // Save the Meta dissolved oxygen method
//     metaDissolvedOxygenMethodObj.save(function () {
//       // Try deleting Meta dissolved oxygen method
//       request(app).delete('/api/metaDissolvedOxygenMethods/' + metaDissolvedOxygenMethodObj._id)
//         .expect(403)
//         .end(function (metaDissolvedOxygenMethodDeleteErr, metaDissolvedOxygenMethodDeleteRes) {
//           // Set message assertion
//           (metaDissolvedOxygenMethodDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta dissolved oxygen method error error
//           done(metaDissolvedOxygenMethodDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta dissolved oxygen method that has an orphaned user reference', function (done) {
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
//           // Save a new Meta dissolved oxygen method
//           agent.post('/api/metaDissolvedOxygenMethods')
//             .send(metaDissolvedOxygenMethod)
//             .expect(200)
//             .end(function (metaDissolvedOxygenMethodSaveErr, metaDissolvedOxygenMethodSaveRes) {
//               // Handle Meta dissolved oxygen method save error
//               if (metaDissolvedOxygenMethodSaveErr) {
//                 return done(metaDissolvedOxygenMethodSaveErr);
//               }
//
//               // Set assertions on new Meta dissolved oxygen method
//               (metaDissolvedOxygenMethodSaveRes.body.name).should.equal(metaDissolvedOxygenMethod.name);
//               should.exist(metaDissolvedOxygenMethodSaveRes.body.user);
//               should.equal(metaDissolvedOxygenMethodSaveRes.body.user._id, orphanId);
//
//               // force the Meta dissolved oxygen method to have an orphaned user reference
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
//                     // Get the Meta dissolved oxygen method
//                     agent.get('/api/metaDissolvedOxygenMethods/' + metaDissolvedOxygenMethodSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaDissolvedOxygenMethodInfoErr, metaDissolvedOxygenMethodInfoRes) {
//                         // Handle Meta dissolved oxygen method error
//                         if (metaDissolvedOxygenMethodInfoErr) {
//                           return done(metaDissolvedOxygenMethodInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaDissolvedOxygenMethodInfoRes.body._id).should.equal(metaDissolvedOxygenMethodSaveRes.body._id);
//                         (metaDissolvedOxygenMethodInfoRes.body.name).should.equal(metaDissolvedOxygenMethod.name);
//                         should.equal(metaDissolvedOxygenMethodInfoRes.body.user, undefined);
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
//       MetaDissolvedOxygenMethod.remove().exec(done);
//     });
//   });
// });
