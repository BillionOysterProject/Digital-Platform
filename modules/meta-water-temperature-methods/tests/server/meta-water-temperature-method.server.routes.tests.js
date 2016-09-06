// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaWaterTemperatureMethod = mongoose.model('MetaWaterTemperatureMethod'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaWaterTemperatureMethod;
//
// /**
//  * Meta water temperature method routes tests
//  */
// describe('Meta water temperature method CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta water temperature method
//     user.save(function () {
//       metaWaterTemperatureMethod = {
//         name: 'Meta water temperature method name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta water temperature method if logged in', function (done) {
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
//         // Save a new Meta water temperature method
//         agent.post('/api/metaWaterTemperatureMethods')
//           .send(metaWaterTemperatureMethod)
//           .expect(200)
//           .end(function (metaWaterTemperatureMethodSaveErr, metaWaterTemperatureMethodSaveRes) {
//             // Handle Meta water temperature method save error
//             if (metaWaterTemperatureMethodSaveErr) {
//               return done(metaWaterTemperatureMethodSaveErr);
//             }
//
//             // Get a list of Meta water temperature methods
//             agent.get('/api/metaWaterTemperatureMethods')
//               .end(function (metaWaterTemperatureMethodsGetErr, metaWaterTemperatureMethodsGetRes) {
//                 // Handle Meta water temperature methods save error
//                 if (metaWaterTemperatureMethodsGetErr) {
//                   return done(metaWaterTemperatureMethodsGetErr);
//                 }
//
//                 // Get Meta water temperature methods list
//                 var metaWaterTemperatureMethods = metaWaterTemperatureMethodsGetRes.body;
//
//                 // Set assertions
//                 (metaWaterTemperatureMethods[0].user._id).should.equal(userId);
//                 (metaWaterTemperatureMethods[0].name).should.match('Meta water temperature method name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta water temperature method if not logged in', function (done) {
//     agent.post('/api/metaWaterTemperatureMethods')
//       .send(metaWaterTemperatureMethod)
//       .expect(403)
//       .end(function (metaWaterTemperatureMethodSaveErr, metaWaterTemperatureMethodSaveRes) {
//         // Call the assertion callback
//         done(metaWaterTemperatureMethodSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta water temperature method if no name is provided', function (done) {
//     // Invalidate name field
//     metaWaterTemperatureMethod.name = '';
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
//         // Save a new Meta water temperature method
//         agent.post('/api/metaWaterTemperatureMethods')
//           .send(metaWaterTemperatureMethod)
//           .expect(400)
//           .end(function (metaWaterTemperatureMethodSaveErr, metaWaterTemperatureMethodSaveRes) {
//             // Set message assertion
//             (metaWaterTemperatureMethodSaveRes.body.message).should.match('Please fill Meta water temperature method name');
//
//             // Handle Meta water temperature method save error
//             done(metaWaterTemperatureMethodSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta water temperature method if signed in', function (done) {
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
//         // Save a new Meta water temperature method
//         agent.post('/api/metaWaterTemperatureMethods')
//           .send(metaWaterTemperatureMethod)
//           .expect(200)
//           .end(function (metaWaterTemperatureMethodSaveErr, metaWaterTemperatureMethodSaveRes) {
//             // Handle Meta water temperature method save error
//             if (metaWaterTemperatureMethodSaveErr) {
//               return done(metaWaterTemperatureMethodSaveErr);
//             }
//
//             // Update Meta water temperature method name
//             metaWaterTemperatureMethod.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta water temperature method
//             agent.put('/api/metaWaterTemperatureMethods/' + metaWaterTemperatureMethodSaveRes.body._id)
//               .send(metaWaterTemperatureMethod)
//               .expect(200)
//               .end(function (metaWaterTemperatureMethodUpdateErr, metaWaterTemperatureMethodUpdateRes) {
//                 // Handle Meta water temperature method update error
//                 if (metaWaterTemperatureMethodUpdateErr) {
//                   return done(metaWaterTemperatureMethodUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaWaterTemperatureMethodUpdateRes.body._id).should.equal(metaWaterTemperatureMethodSaveRes.body._id);
//                 (metaWaterTemperatureMethodUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta water temperature methods if not signed in', function (done) {
//     // Create new Meta water temperature method model instance
//     var metaWaterTemperatureMethodObj = new MetaWaterTemperatureMethod(metaWaterTemperatureMethod);
//
//     // Save the metaWaterTemperatureMethod
//     metaWaterTemperatureMethodObj.save(function () {
//       // Request Meta water temperature methods
//       request(app).get('/api/metaWaterTemperatureMethods')
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
//   it('should be able to get a single Meta water temperature method if not signed in', function (done) {
//     // Create new Meta water temperature method model instance
//     var metaWaterTemperatureMethodObj = new MetaWaterTemperatureMethod(metaWaterTemperatureMethod);
//
//     // Save the Meta water temperature method
//     metaWaterTemperatureMethodObj.save(function () {
//       request(app).get('/api/metaWaterTemperatureMethods/' + metaWaterTemperatureMethodObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaWaterTemperatureMethod.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta water temperature method with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaWaterTemperatureMethods/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta water temperature method is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta water temperature method which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta water temperature method
//     request(app).get('/api/metaWaterTemperatureMethods/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta water temperature method with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta water temperature method if signed in', function (done) {
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
//         // Save a new Meta water temperature method
//         agent.post('/api/metaWaterTemperatureMethods')
//           .send(metaWaterTemperatureMethod)
//           .expect(200)
//           .end(function (metaWaterTemperatureMethodSaveErr, metaWaterTemperatureMethodSaveRes) {
//             // Handle Meta water temperature method save error
//             if (metaWaterTemperatureMethodSaveErr) {
//               return done(metaWaterTemperatureMethodSaveErr);
//             }
//
//             // Delete an existing Meta water temperature method
//             agent.delete('/api/metaWaterTemperatureMethods/' + metaWaterTemperatureMethodSaveRes.body._id)
//               .send(metaWaterTemperatureMethod)
//               .expect(200)
//               .end(function (metaWaterTemperatureMethodDeleteErr, metaWaterTemperatureMethodDeleteRes) {
//                 // Handle metaWaterTemperatureMethod error error
//                 if (metaWaterTemperatureMethodDeleteErr) {
//                   return done(metaWaterTemperatureMethodDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaWaterTemperatureMethodDeleteRes.body._id).should.equal(metaWaterTemperatureMethodSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta water temperature method if not signed in', function (done) {
//     // Set Meta water temperature method user
//     metaWaterTemperatureMethod.user = user;
//
//     // Create new Meta water temperature method model instance
//     var metaWaterTemperatureMethodObj = new MetaWaterTemperatureMethod(metaWaterTemperatureMethod);
//
//     // Save the Meta water temperature method
//     metaWaterTemperatureMethodObj.save(function () {
//       // Try deleting Meta water temperature method
//       request(app).delete('/api/metaWaterTemperatureMethods/' + metaWaterTemperatureMethodObj._id)
//         .expect(403)
//         .end(function (metaWaterTemperatureMethodDeleteErr, metaWaterTemperatureMethodDeleteRes) {
//           // Set message assertion
//           (metaWaterTemperatureMethodDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta water temperature method error error
//           done(metaWaterTemperatureMethodDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta water temperature method that has an orphaned user reference', function (done) {
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
//           // Save a new Meta water temperature method
//           agent.post('/api/metaWaterTemperatureMethods')
//             .send(metaWaterTemperatureMethod)
//             .expect(200)
//             .end(function (metaWaterTemperatureMethodSaveErr, metaWaterTemperatureMethodSaveRes) {
//               // Handle Meta water temperature method save error
//               if (metaWaterTemperatureMethodSaveErr) {
//                 return done(metaWaterTemperatureMethodSaveErr);
//               }
//
//               // Set assertions on new Meta water temperature method
//               (metaWaterTemperatureMethodSaveRes.body.name).should.equal(metaWaterTemperatureMethod.name);
//               should.exist(metaWaterTemperatureMethodSaveRes.body.user);
//               should.equal(metaWaterTemperatureMethodSaveRes.body.user._id, orphanId);
//
//               // force the Meta water temperature method to have an orphaned user reference
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
//                     // Get the Meta water temperature method
//                     agent.get('/api/metaWaterTemperatureMethods/' + metaWaterTemperatureMethodSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaWaterTemperatureMethodInfoErr, metaWaterTemperatureMethodInfoRes) {
//                         // Handle Meta water temperature method error
//                         if (metaWaterTemperatureMethodInfoErr) {
//                           return done(metaWaterTemperatureMethodInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaWaterTemperatureMethodInfoRes.body._id).should.equal(metaWaterTemperatureMethodSaveRes.body._id);
//                         (metaWaterTemperatureMethodInfoRes.body.name).should.equal(metaWaterTemperatureMethod.name);
//                         should.equal(metaWaterTemperatureMethodInfoRes.body.user, undefined);
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
//       MetaWaterTemperatureMethod.remove().exec(done);
//     });
//   });
// });
