// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaTurbidityMethod = mongoose.model('MetaTurbidityMethod'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaTurbidityMethod;
//
// /**
//  * Meta turbidity method routes tests
//  */
// describe('Meta turbidity method CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta turbidity method
//     user.save(function () {
//       metaTurbidityMethod = {
//         name: 'Meta turbidity method name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta turbidity method if logged in', function (done) {
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
//         // Save a new Meta turbidity method
//         agent.post('/api/metaTurbidityMethods')
//           .send(metaTurbidityMethod)
//           .expect(200)
//           .end(function (metaTurbidityMethodSaveErr, metaTurbidityMethodSaveRes) {
//             // Handle Meta turbidity method save error
//             if (metaTurbidityMethodSaveErr) {
//               return done(metaTurbidityMethodSaveErr);
//             }
//
//             // Get a list of Meta turbidity methods
//             agent.get('/api/metaTurbidityMethods')
//               .end(function (metaTurbidityMethodsGetErr, metaTurbidityMethodsGetRes) {
//                 // Handle Meta turbidity methods save error
//                 if (metaTurbidityMethodsGetErr) {
//                   return done(metaTurbidityMethodsGetErr);
//                 }
//
//                 // Get Meta turbidity methods list
//                 var metaTurbidityMethods = metaTurbidityMethodsGetRes.body;
//
//                 // Set assertions
//                 (metaTurbidityMethods[0].user._id).should.equal(userId);
//                 (metaTurbidityMethods[0].name).should.match('Meta turbidity method name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta turbidity method if not logged in', function (done) {
//     agent.post('/api/metaTurbidityMethods')
//       .send(metaTurbidityMethod)
//       .expect(403)
//       .end(function (metaTurbidityMethodSaveErr, metaTurbidityMethodSaveRes) {
//         // Call the assertion callback
//         done(metaTurbidityMethodSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta turbidity method if no name is provided', function (done) {
//     // Invalidate name field
//     metaTurbidityMethod.name = '';
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
//         // Save a new Meta turbidity method
//         agent.post('/api/metaTurbidityMethods')
//           .send(metaTurbidityMethod)
//           .expect(400)
//           .end(function (metaTurbidityMethodSaveErr, metaTurbidityMethodSaveRes) {
//             // Set message assertion
//             (metaTurbidityMethodSaveRes.body.message).should.match('Please fill Meta turbidity method name');
//
//             // Handle Meta turbidity method save error
//             done(metaTurbidityMethodSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta turbidity method if signed in', function (done) {
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
//         // Save a new Meta turbidity method
//         agent.post('/api/metaTurbidityMethods')
//           .send(metaTurbidityMethod)
//           .expect(200)
//           .end(function (metaTurbidityMethodSaveErr, metaTurbidityMethodSaveRes) {
//             // Handle Meta turbidity method save error
//             if (metaTurbidityMethodSaveErr) {
//               return done(metaTurbidityMethodSaveErr);
//             }
//
//             // Update Meta turbidity method name
//             metaTurbidityMethod.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta turbidity method
//             agent.put('/api/metaTurbidityMethods/' + metaTurbidityMethodSaveRes.body._id)
//               .send(metaTurbidityMethod)
//               .expect(200)
//               .end(function (metaTurbidityMethodUpdateErr, metaTurbidityMethodUpdateRes) {
//                 // Handle Meta turbidity method update error
//                 if (metaTurbidityMethodUpdateErr) {
//                   return done(metaTurbidityMethodUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaTurbidityMethodUpdateRes.body._id).should.equal(metaTurbidityMethodSaveRes.body._id);
//                 (metaTurbidityMethodUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta turbidity methods if not signed in', function (done) {
//     // Create new Meta turbidity method model instance
//     var metaTurbidityMethodObj = new MetaTurbidityMethod(metaTurbidityMethod);
//
//     // Save the metaTurbidityMethod
//     metaTurbidityMethodObj.save(function () {
//       // Request Meta turbidity methods
//       request(app).get('/api/metaTurbidityMethods')
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
//   it('should be able to get a single Meta turbidity method if not signed in', function (done) {
//     // Create new Meta turbidity method model instance
//     var metaTurbidityMethodObj = new MetaTurbidityMethod(metaTurbidityMethod);
//
//     // Save the Meta turbidity method
//     metaTurbidityMethodObj.save(function () {
//       request(app).get('/api/metaTurbidityMethods/' + metaTurbidityMethodObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaTurbidityMethod.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta turbidity method with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaTurbidityMethods/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta turbidity method is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta turbidity method which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta turbidity method
//     request(app).get('/api/metaTurbidityMethods/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta turbidity method with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta turbidity method if signed in', function (done) {
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
//         // Save a new Meta turbidity method
//         agent.post('/api/metaTurbidityMethods')
//           .send(metaTurbidityMethod)
//           .expect(200)
//           .end(function (metaTurbidityMethodSaveErr, metaTurbidityMethodSaveRes) {
//             // Handle Meta turbidity method save error
//             if (metaTurbidityMethodSaveErr) {
//               return done(metaTurbidityMethodSaveErr);
//             }
//
//             // Delete an existing Meta turbidity method
//             agent.delete('/api/metaTurbidityMethods/' + metaTurbidityMethodSaveRes.body._id)
//               .send(metaTurbidityMethod)
//               .expect(200)
//               .end(function (metaTurbidityMethodDeleteErr, metaTurbidityMethodDeleteRes) {
//                 // Handle metaTurbidityMethod error error
//                 if (metaTurbidityMethodDeleteErr) {
//                   return done(metaTurbidityMethodDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaTurbidityMethodDeleteRes.body._id).should.equal(metaTurbidityMethodSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta turbidity method if not signed in', function (done) {
//     // Set Meta turbidity method user
//     metaTurbidityMethod.user = user;
//
//     // Create new Meta turbidity method model instance
//     var metaTurbidityMethodObj = new MetaTurbidityMethod(metaTurbidityMethod);
//
//     // Save the Meta turbidity method
//     metaTurbidityMethodObj.save(function () {
//       // Try deleting Meta turbidity method
//       request(app).delete('/api/metaTurbidityMethods/' + metaTurbidityMethodObj._id)
//         .expect(403)
//         .end(function (metaTurbidityMethodDeleteErr, metaTurbidityMethodDeleteRes) {
//           // Set message assertion
//           (metaTurbidityMethodDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta turbidity method error error
//           done(metaTurbidityMethodDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta turbidity method that has an orphaned user reference', function (done) {
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
//           // Save a new Meta turbidity method
//           agent.post('/api/metaTurbidityMethods')
//             .send(metaTurbidityMethod)
//             .expect(200)
//             .end(function (metaTurbidityMethodSaveErr, metaTurbidityMethodSaveRes) {
//               // Handle Meta turbidity method save error
//               if (metaTurbidityMethodSaveErr) {
//                 return done(metaTurbidityMethodSaveErr);
//               }
//
//               // Set assertions on new Meta turbidity method
//               (metaTurbidityMethodSaveRes.body.name).should.equal(metaTurbidityMethod.name);
//               should.exist(metaTurbidityMethodSaveRes.body.user);
//               should.equal(metaTurbidityMethodSaveRes.body.user._id, orphanId);
//
//               // force the Meta turbidity method to have an orphaned user reference
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
//                     // Get the Meta turbidity method
//                     agent.get('/api/metaTurbidityMethods/' + metaTurbidityMethodSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaTurbidityMethodInfoErr, metaTurbidityMethodInfoRes) {
//                         // Handle Meta turbidity method error
//                         if (metaTurbidityMethodInfoErr) {
//                           return done(metaTurbidityMethodInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaTurbidityMethodInfoRes.body._id).should.equal(metaTurbidityMethodSaveRes.body._id);
//                         (metaTurbidityMethodInfoRes.body.name).should.equal(metaTurbidityMethod.name);
//                         should.equal(metaTurbidityMethodInfoRes.body.user, undefined);
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
//       MetaTurbidityMethod.remove().exec(done);
//     });
//   });
// });
