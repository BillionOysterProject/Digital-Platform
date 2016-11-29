// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaEventType = mongoose.model('MetaEventType'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaEventType;
//
// /**
//  * Meta event type routes tests
//  */
// describe('Meta event type CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta event type
//     user.save(function () {
//       metaEventType = {
//         name: 'Meta event type name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta event type if logged in', function (done) {
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
//         // Save a new Meta event type
//         agent.post('/api/metaEventTypes')
//           .send(metaEventType)
//           .expect(200)
//           .end(function (metaEventTypeSaveErr, metaEventTypeSaveRes) {
//             // Handle Meta event type save error
//             if (metaEventTypeSaveErr) {
//               return done(metaEventTypeSaveErr);
//             }
//
//             // Get a list of Meta event types
//             agent.get('/api/metaEventTypes')
//               .end(function (metaEventTypesGetErr, metaEventTypesGetRes) {
//                 // Handle Meta event types save error
//                 if (metaEventTypesGetErr) {
//                   return done(metaEventTypesGetErr);
//                 }
//
//                 // Get Meta event types list
//                 var metaEventTypes = metaEventTypesGetRes.body;
//
//                 // Set assertions
//                 (metaEventTypes[0].user._id).should.equal(userId);
//                 (metaEventTypes[0].name).should.match('Meta event type name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta event type if not logged in', function (done) {
//     agent.post('/api/metaEventTypes')
//       .send(metaEventType)
//       .expect(403)
//       .end(function (metaEventTypeSaveErr, metaEventTypeSaveRes) {
//         // Call the assertion callback
//         done(metaEventTypeSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta event type if no name is provided', function (done) {
//     // Invalidate name field
//     metaEventType.name = '';
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
//         // Save a new Meta event type
//         agent.post('/api/metaEventTypes')
//           .send(metaEventType)
//           .expect(400)
//           .end(function (metaEventTypeSaveErr, metaEventTypeSaveRes) {
//             // Set message assertion
//             (metaEventTypeSaveRes.body.message).should.match('Please fill Meta event type name');
//
//             // Handle Meta event type save error
//             done(metaEventTypeSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta event type if signed in', function (done) {
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
//         // Save a new Meta event type
//         agent.post('/api/metaEventTypes')
//           .send(metaEventType)
//           .expect(200)
//           .end(function (metaEventTypeSaveErr, metaEventTypeSaveRes) {
//             // Handle Meta event type save error
//             if (metaEventTypeSaveErr) {
//               return done(metaEventTypeSaveErr);
//             }
//
//             // Update Meta event type name
//             metaEventType.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta event type
//             agent.put('/api/metaEventTypes/' + metaEventTypeSaveRes.body._id)
//               .send(metaEventType)
//               .expect(200)
//               .end(function (metaEventTypeUpdateErr, metaEventTypeUpdateRes) {
//                 // Handle Meta event type update error
//                 if (metaEventTypeUpdateErr) {
//                   return done(metaEventTypeUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaEventTypeUpdateRes.body._id).should.equal(metaEventTypeSaveRes.body._id);
//                 (metaEventTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta event types if not signed in', function (done) {
//     // Create new Meta event type model instance
//     var metaEventTypeObj = new MetaEventType(metaEventType);
//
//     // Save the metaEventType
//     metaEventTypeObj.save(function () {
//       // Request Meta event types
//       request(app).get('/api/metaEventTypes')
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
//   it('should be able to get a single Meta event type if not signed in', function (done) {
//     // Create new Meta event type model instance
//     var metaEventTypeObj = new MetaEventType(metaEventType);
//
//     // Save the Meta event type
//     metaEventTypeObj.save(function () {
//       request(app).get('/api/metaEventTypes/' + metaEventTypeObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaEventType.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta event type with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaEventTypes/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta event type is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta event type which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta event type
//     request(app).get('/api/metaEventTypes/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta event type with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta event type if signed in', function (done) {
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
//         // Save a new Meta event type
//         agent.post('/api/metaEventTypes')
//           .send(metaEventType)
//           .expect(200)
//           .end(function (metaEventTypeSaveErr, metaEventTypeSaveRes) {
//             // Handle Meta event type save error
//             if (metaEventTypeSaveErr) {
//               return done(metaEventTypeSaveErr);
//             }
//
//             // Delete an existing Meta event type
//             agent.delete('/api/metaEventTypes/' + metaEventTypeSaveRes.body._id)
//               .send(metaEventType)
//               .expect(200)
//               .end(function (metaEventTypeDeleteErr, metaEventTypeDeleteRes) {
//                 // Handle metaEventType error error
//                 if (metaEventTypeDeleteErr) {
//                   return done(metaEventTypeDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaEventTypeDeleteRes.body._id).should.equal(metaEventTypeSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta event type if not signed in', function (done) {
//     // Set Meta event type user
//     metaEventType.user = user;
//
//     // Create new Meta event type model instance
//     var metaEventTypeObj = new MetaEventType(metaEventType);
//
//     // Save the Meta event type
//     metaEventTypeObj.save(function () {
//       // Try deleting Meta event type
//       request(app).delete('/api/metaEventTypes/' + metaEventTypeObj._id)
//         .expect(403)
//         .end(function (metaEventTypeDeleteErr, metaEventTypeDeleteRes) {
//           // Set message assertion
//           (metaEventTypeDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta event type error error
//           done(metaEventTypeDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta event type that has an orphaned user reference', function (done) {
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
//           // Save a new Meta event type
//           agent.post('/api/metaEventTypes')
//             .send(metaEventType)
//             .expect(200)
//             .end(function (metaEventTypeSaveErr, metaEventTypeSaveRes) {
//               // Handle Meta event type save error
//               if (metaEventTypeSaveErr) {
//                 return done(metaEventTypeSaveErr);
//               }
//
//               // Set assertions on new Meta event type
//               (metaEventTypeSaveRes.body.name).should.equal(metaEventType.name);
//               should.exist(metaEventTypeSaveRes.body.user);
//               should.equal(metaEventTypeSaveRes.body.user._id, orphanId);
//
//               // force the Meta event type to have an orphaned user reference
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
//                     // Get the Meta event type
//                     agent.get('/api/metaEventTypes/' + metaEventTypeSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaEventTypeInfoErr, metaEventTypeInfoRes) {
//                         // Handle Meta event type error
//                         if (metaEventTypeInfoErr) {
//                           return done(metaEventTypeInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaEventTypeInfoRes.body._id).should.equal(metaEventTypeSaveRes.body._id);
//                         (metaEventTypeInfoRes.body.name).should.equal(metaEventType.name);
//                         should.equal(metaEventTypeInfoRes.body.user, undefined);
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
//       MetaEventType.remove().exec(done);
//     });
//   });
// });
