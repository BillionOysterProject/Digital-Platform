// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaAmmoniaMethod = mongoose.model('MetaAmmoniaMethod'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaAmmoniaMethod;
//
// /**
//  * Meta ammonia method routes tests
//  */
// describe('Meta ammonia method CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta ammonia method
//     user.save(function () {
//       metaAmmoniaMethod = {
//         name: 'Meta ammonia method name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta ammonia method if logged in', function (done) {
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
//         // Save a new Meta ammonia method
//         agent.post('/api/metaAmmoniaMethods')
//           .send(metaAmmoniaMethod)
//           .expect(200)
//           .end(function (metaAmmoniaMethodSaveErr, metaAmmoniaMethodSaveRes) {
//             // Handle Meta ammonia method save error
//             if (metaAmmoniaMethodSaveErr) {
//               return done(metaAmmoniaMethodSaveErr);
//             }
//
//             // Get a list of Meta ammonia methods
//             agent.get('/api/metaAmmoniaMethods')
//               .end(function (metaAmmoniaMethodsGetErr, metaAmmoniaMethodsGetRes) {
//                 // Handle Meta ammonia methods save error
//                 if (metaAmmoniaMethodsGetErr) {
//                   return done(metaAmmoniaMethodsGetErr);
//                 }
//
//                 // Get Meta ammonia methods list
//                 var metaAmmoniaMethods = metaAmmoniaMethodsGetRes.body;
//
//                 // Set assertions
//                 (metaAmmoniaMethods[0].user._id).should.equal(userId);
//                 (metaAmmoniaMethods[0].name).should.match('Meta ammonia method name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta ammonia method if not logged in', function (done) {
//     agent.post('/api/metaAmmoniaMethods')
//       .send(metaAmmoniaMethod)
//       .expect(403)
//       .end(function (metaAmmoniaMethodSaveErr, metaAmmoniaMethodSaveRes) {
//         // Call the assertion callback
//         done(metaAmmoniaMethodSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta ammonia method if no name is provided', function (done) {
//     // Invalidate name field
//     metaAmmoniaMethod.name = '';
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
//         // Save a new Meta ammonia method
//         agent.post('/api/metaAmmoniaMethods')
//           .send(metaAmmoniaMethod)
//           .expect(400)
//           .end(function (metaAmmoniaMethodSaveErr, metaAmmoniaMethodSaveRes) {
//             // Set message assertion
//             (metaAmmoniaMethodSaveRes.body.message).should.match('Please fill Meta ammonia method name');
//
//             // Handle Meta ammonia method save error
//             done(metaAmmoniaMethodSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta ammonia method if signed in', function (done) {
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
//         // Save a new Meta ammonia method
//         agent.post('/api/metaAmmoniaMethods')
//           .send(metaAmmoniaMethod)
//           .expect(200)
//           .end(function (metaAmmoniaMethodSaveErr, metaAmmoniaMethodSaveRes) {
//             // Handle Meta ammonia method save error
//             if (metaAmmoniaMethodSaveErr) {
//               return done(metaAmmoniaMethodSaveErr);
//             }
//
//             // Update Meta ammonia method name
//             metaAmmoniaMethod.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta ammonia method
//             agent.put('/api/metaAmmoniaMethods/' + metaAmmoniaMethodSaveRes.body._id)
//               .send(metaAmmoniaMethod)
//               .expect(200)
//               .end(function (metaAmmoniaMethodUpdateErr, metaAmmoniaMethodUpdateRes) {
//                 // Handle Meta ammonia method update error
//                 if (metaAmmoniaMethodUpdateErr) {
//                   return done(metaAmmoniaMethodUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaAmmoniaMethodUpdateRes.body._id).should.equal(metaAmmoniaMethodSaveRes.body._id);
//                 (metaAmmoniaMethodUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta ammonia methods if not signed in', function (done) {
//     // Create new Meta ammonia method model instance
//     var metaAmmoniaMethodObj = new MetaAmmoniaMethod(metaAmmoniaMethod);
//
//     // Save the metaAmmoniaMethod
//     metaAmmoniaMethodObj.save(function () {
//       // Request Meta ammonia methods
//       request(app).get('/api/metaAmmoniaMethods')
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
//   it('should be able to get a single Meta ammonia method if not signed in', function (done) {
//     // Create new Meta ammonia method model instance
//     var metaAmmoniaMethodObj = new MetaAmmoniaMethod(metaAmmoniaMethod);
//
//     // Save the Meta ammonia method
//     metaAmmoniaMethodObj.save(function () {
//       request(app).get('/api/metaAmmoniaMethods/' + metaAmmoniaMethodObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaAmmoniaMethod.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta ammonia method with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaAmmoniaMethods/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta ammonia method is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta ammonia method which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta ammonia method
//     request(app).get('/api/metaAmmoniaMethods/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta ammonia method with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta ammonia method if signed in', function (done) {
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
//         // Save a new Meta ammonia method
//         agent.post('/api/metaAmmoniaMethods')
//           .send(metaAmmoniaMethod)
//           .expect(200)
//           .end(function (metaAmmoniaMethodSaveErr, metaAmmoniaMethodSaveRes) {
//             // Handle Meta ammonia method save error
//             if (metaAmmoniaMethodSaveErr) {
//               return done(metaAmmoniaMethodSaveErr);
//             }
//
//             // Delete an existing Meta ammonia method
//             agent.delete('/api/metaAmmoniaMethods/' + metaAmmoniaMethodSaveRes.body._id)
//               .send(metaAmmoniaMethod)
//               .expect(200)
//               .end(function (metaAmmoniaMethodDeleteErr, metaAmmoniaMethodDeleteRes) {
//                 // Handle metaAmmoniaMethod error error
//                 if (metaAmmoniaMethodDeleteErr) {
//                   return done(metaAmmoniaMethodDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaAmmoniaMethodDeleteRes.body._id).should.equal(metaAmmoniaMethodSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta ammonia method if not signed in', function (done) {
//     // Set Meta ammonia method user
//     metaAmmoniaMethod.user = user;
//
//     // Create new Meta ammonia method model instance
//     var metaAmmoniaMethodObj = new MetaAmmoniaMethod(metaAmmoniaMethod);
//
//     // Save the Meta ammonia method
//     metaAmmoniaMethodObj.save(function () {
//       // Try deleting Meta ammonia method
//       request(app).delete('/api/metaAmmoniaMethods/' + metaAmmoniaMethodObj._id)
//         .expect(403)
//         .end(function (metaAmmoniaMethodDeleteErr, metaAmmoniaMethodDeleteRes) {
//           // Set message assertion
//           (metaAmmoniaMethodDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta ammonia method error error
//           done(metaAmmoniaMethodDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta ammonia method that has an orphaned user reference', function (done) {
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
//           // Save a new Meta ammonia method
//           agent.post('/api/metaAmmoniaMethods')
//             .send(metaAmmoniaMethod)
//             .expect(200)
//             .end(function (metaAmmoniaMethodSaveErr, metaAmmoniaMethodSaveRes) {
//               // Handle Meta ammonia method save error
//               if (metaAmmoniaMethodSaveErr) {
//                 return done(metaAmmoniaMethodSaveErr);
//               }
//
//               // Set assertions on new Meta ammonia method
//               (metaAmmoniaMethodSaveRes.body.name).should.equal(metaAmmoniaMethod.name);
//               should.exist(metaAmmoniaMethodSaveRes.body.user);
//               should.equal(metaAmmoniaMethodSaveRes.body.user._id, orphanId);
//
//               // force the Meta ammonia method to have an orphaned user reference
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
//                     // Get the Meta ammonia method
//                     agent.get('/api/metaAmmoniaMethods/' + metaAmmoniaMethodSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaAmmoniaMethodInfoErr, metaAmmoniaMethodInfoRes) {
//                         // Handle Meta ammonia method error
//                         if (metaAmmoniaMethodInfoErr) {
//                           return done(metaAmmoniaMethodInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaAmmoniaMethodInfoRes.body._id).should.equal(metaAmmoniaMethodSaveRes.body._id);
//                         (metaAmmoniaMethodInfoRes.body.name).should.equal(metaAmmoniaMethod.name);
//                         should.equal(metaAmmoniaMethodInfoRes.body.user, undefined);
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
//       MetaAmmoniaMethod.remove().exec(done);
//     });
//   });
// });
