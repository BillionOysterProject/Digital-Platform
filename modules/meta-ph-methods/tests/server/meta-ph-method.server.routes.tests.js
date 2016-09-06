// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaPhMethod = mongoose.model('MetaPhMethod'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaPhMethod;
//
// /**
//  * Meta ph method routes tests
//  */
// describe('Meta ph method CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta ph method
//     user.save(function () {
//       metaPhMethod = {
//         name: 'Meta ph method name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta ph method if logged in', function (done) {
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
//         // Save a new Meta ph method
//         agent.post('/api/metaPhMethods')
//           .send(metaPhMethod)
//           .expect(200)
//           .end(function (metaPhMethodSaveErr, metaPhMethodSaveRes) {
//             // Handle Meta ph method save error
//             if (metaPhMethodSaveErr) {
//               return done(metaPhMethodSaveErr);
//             }
//
//             // Get a list of Meta ph methods
//             agent.get('/api/metaPhMethods')
//               .end(function (metaPhMethodsGetErr, metaPhMethodsGetRes) {
//                 // Handle Meta ph methods save error
//                 if (metaPhMethodsGetErr) {
//                   return done(metaPhMethodsGetErr);
//                 }
//
//                 // Get Meta ph methods list
//                 var metaPhMethods = metaPhMethodsGetRes.body;
//
//                 // Set assertions
//                 (metaPhMethods[0].user._id).should.equal(userId);
//                 (metaPhMethods[0].name).should.match('Meta ph method name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta ph method if not logged in', function (done) {
//     agent.post('/api/metaPhMethods')
//       .send(metaPhMethod)
//       .expect(403)
//       .end(function (metaPhMethodSaveErr, metaPhMethodSaveRes) {
//         // Call the assertion callback
//         done(metaPhMethodSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta ph method if no name is provided', function (done) {
//     // Invalidate name field
//     metaPhMethod.name = '';
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
//         // Save a new Meta ph method
//         agent.post('/api/metaPhMethods')
//           .send(metaPhMethod)
//           .expect(400)
//           .end(function (metaPhMethodSaveErr, metaPhMethodSaveRes) {
//             // Set message assertion
//             (metaPhMethodSaveRes.body.message).should.match('Please fill Meta ph method name');
//
//             // Handle Meta ph method save error
//             done(metaPhMethodSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta ph method if signed in', function (done) {
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
//         // Save a new Meta ph method
//         agent.post('/api/metaPhMethods')
//           .send(metaPhMethod)
//           .expect(200)
//           .end(function (metaPhMethodSaveErr, metaPhMethodSaveRes) {
//             // Handle Meta ph method save error
//             if (metaPhMethodSaveErr) {
//               return done(metaPhMethodSaveErr);
//             }
//
//             // Update Meta ph method name
//             metaPhMethod.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta ph method
//             agent.put('/api/metaPhMethods/' + metaPhMethodSaveRes.body._id)
//               .send(metaPhMethod)
//               .expect(200)
//               .end(function (metaPhMethodUpdateErr, metaPhMethodUpdateRes) {
//                 // Handle Meta ph method update error
//                 if (metaPhMethodUpdateErr) {
//                   return done(metaPhMethodUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaPhMethodUpdateRes.body._id).should.equal(metaPhMethodSaveRes.body._id);
//                 (metaPhMethodUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta ph methods if not signed in', function (done) {
//     // Create new Meta ph method model instance
//     var metaPhMethodObj = new MetaPhMethod(metaPhMethod);
//
//     // Save the metaPhMethod
//     metaPhMethodObj.save(function () {
//       // Request Meta ph methods
//       request(app).get('/api/metaPhMethods')
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
//   it('should be able to get a single Meta ph method if not signed in', function (done) {
//     // Create new Meta ph method model instance
//     var metaPhMethodObj = new MetaPhMethod(metaPhMethod);
//
//     // Save the Meta ph method
//     metaPhMethodObj.save(function () {
//       request(app).get('/api/metaPhMethods/' + metaPhMethodObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaPhMethod.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta ph method with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaPhMethods/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta ph method is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta ph method which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta ph method
//     request(app).get('/api/metaPhMethods/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta ph method with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta ph method if signed in', function (done) {
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
//         // Save a new Meta ph method
//         agent.post('/api/metaPhMethods')
//           .send(metaPhMethod)
//           .expect(200)
//           .end(function (metaPhMethodSaveErr, metaPhMethodSaveRes) {
//             // Handle Meta ph method save error
//             if (metaPhMethodSaveErr) {
//               return done(metaPhMethodSaveErr);
//             }
//
//             // Delete an existing Meta ph method
//             agent.delete('/api/metaPhMethods/' + metaPhMethodSaveRes.body._id)
//               .send(metaPhMethod)
//               .expect(200)
//               .end(function (metaPhMethodDeleteErr, metaPhMethodDeleteRes) {
//                 // Handle metaPhMethod error error
//                 if (metaPhMethodDeleteErr) {
//                   return done(metaPhMethodDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaPhMethodDeleteRes.body._id).should.equal(metaPhMethodSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta ph method if not signed in', function (done) {
//     // Set Meta ph method user
//     metaPhMethod.user = user;
//
//     // Create new Meta ph method model instance
//     var metaPhMethodObj = new MetaPhMethod(metaPhMethod);
//
//     // Save the Meta ph method
//     metaPhMethodObj.save(function () {
//       // Try deleting Meta ph method
//       request(app).delete('/api/metaPhMethods/' + metaPhMethodObj._id)
//         .expect(403)
//         .end(function (metaPhMethodDeleteErr, metaPhMethodDeleteRes) {
//           // Set message assertion
//           (metaPhMethodDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta ph method error error
//           done(metaPhMethodDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta ph method that has an orphaned user reference', function (done) {
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
//           // Save a new Meta ph method
//           agent.post('/api/metaPhMethods')
//             .send(metaPhMethod)
//             .expect(200)
//             .end(function (metaPhMethodSaveErr, metaPhMethodSaveRes) {
//               // Handle Meta ph method save error
//               if (metaPhMethodSaveErr) {
//                 return done(metaPhMethodSaveErr);
//               }
//
//               // Set assertions on new Meta ph method
//               (metaPhMethodSaveRes.body.name).should.equal(metaPhMethod.name);
//               should.exist(metaPhMethodSaveRes.body.user);
//               should.equal(metaPhMethodSaveRes.body.user._id, orphanId);
//
//               // force the Meta ph method to have an orphaned user reference
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
//                     // Get the Meta ph method
//                     agent.get('/api/metaPhMethods/' + metaPhMethodSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaPhMethodInfoErr, metaPhMethodInfoRes) {
//                         // Handle Meta ph method error
//                         if (metaPhMethodInfoErr) {
//                           return done(metaPhMethodInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaPhMethodInfoRes.body._id).should.equal(metaPhMethodSaveRes.body._id);
//                         (metaPhMethodInfoRes.body.name).should.equal(metaPhMethod.name);
//                         should.equal(metaPhMethodInfoRes.body.user, undefined);
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
//       MetaPhMethod.remove().exec(done);
//     });
//   });
// });
