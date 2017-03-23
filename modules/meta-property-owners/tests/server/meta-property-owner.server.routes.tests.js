// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaPropertyOwner = mongoose.model('MetaPropertyOwner'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaPropertyOwner;
//
// /**
//  * Meta property owner routes tests
//  */
// describe('Meta property owner CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta property owner
//     user.save(function () {
//       metaPropertyOwner = {
//         name: 'Meta property owner name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta property owner if logged in', function (done) {
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
//         // Save a new Meta property owner
//         agent.post('/api/metaPropertyOwners')
//           .send(metaPropertyOwner)
//           .expect(200)
//           .end(function (metaPropertyOwnerSaveErr, metaPropertyOwnerSaveRes) {
//             // Handle Meta property owner save error
//             if (metaPropertyOwnerSaveErr) {
//               return done(metaPropertyOwnerSaveErr);
//             }
//
//             // Get a list of Meta property owners
//             agent.get('/api/metaPropertyOwners')
//               .end(function (metaPropertyOwnersGetErr, metaPropertyOwnersGetRes) {
//                 // Handle Meta property owners save error
//                 if (metaPropertyOwnersGetErr) {
//                   return done(metaPropertyOwnersGetErr);
//                 }
//
//                 // Get Meta property owners list
//                 var metaPropertyOwners = metaPropertyOwnersGetRes.body;
//
//                 // Set assertions
//                 (metaPropertyOwners[0].user._id).should.equal(userId);
//                 (metaPropertyOwners[0].name).should.match('Meta property owner name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta property owner if not logged in', function (done) {
//     agent.post('/api/metaPropertyOwners')
//       .send(metaPropertyOwner)
//       .expect(403)
//       .end(function (metaPropertyOwnerSaveErr, metaPropertyOwnerSaveRes) {
//         // Call the assertion callback
//         done(metaPropertyOwnerSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta property owner if no name is provided', function (done) {
//     // Invalidate name field
//     metaPropertyOwner.name = '';
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
//         // Save a new Meta property owner
//         agent.post('/api/metaPropertyOwners')
//           .send(metaPropertyOwner)
//           .expect(400)
//           .end(function (metaPropertyOwnerSaveErr, metaPropertyOwnerSaveRes) {
//             // Set message assertion
//             (metaPropertyOwnerSaveRes.body.message).should.match('Please fill Meta property owner name');
//
//             // Handle Meta property owner save error
//             done(metaPropertyOwnerSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta property owner if signed in', function (done) {
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
//         // Save a new Meta property owner
//         agent.post('/api/metaPropertyOwners')
//           .send(metaPropertyOwner)
//           .expect(200)
//           .end(function (metaPropertyOwnerSaveErr, metaPropertyOwnerSaveRes) {
//             // Handle Meta property owner save error
//             if (metaPropertyOwnerSaveErr) {
//               return done(metaPropertyOwnerSaveErr);
//             }
//
//             // Update Meta property owner name
//             metaPropertyOwner.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta property owner
//             agent.put('/api/metaPropertyOwners/' + metaPropertyOwnerSaveRes.body._id)
//               .send(metaPropertyOwner)
//               .expect(200)
//               .end(function (metaPropertyOwnerUpdateErr, metaPropertyOwnerUpdateRes) {
//                 // Handle Meta property owner update error
//                 if (metaPropertyOwnerUpdateErr) {
//                   return done(metaPropertyOwnerUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaPropertyOwnerUpdateRes.body._id).should.equal(metaPropertyOwnerSaveRes.body._id);
//                 (metaPropertyOwnerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta property owners if not signed in', function (done) {
//     // Create new Meta property owner model instance
//     var metaPropertyOwnerObj = new MetaPropertyOwner(metaPropertyOwner);
//
//     // Save the metaPropertyOwner
//     metaPropertyOwnerObj.save(function () {
//       // Request Meta property owners
//       request(app).get('/api/metaPropertyOwners')
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
//   it('should be able to get a single Meta property owner if not signed in', function (done) {
//     // Create new Meta property owner model instance
//     var metaPropertyOwnerObj = new MetaPropertyOwner(metaPropertyOwner);
//
//     // Save the Meta property owner
//     metaPropertyOwnerObj.save(function () {
//       request(app).get('/api/metaPropertyOwners/' + metaPropertyOwnerObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaPropertyOwner.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta property owner with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaPropertyOwners/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta property owner is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta property owner which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta property owner
//     request(app).get('/api/metaPropertyOwners/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta property owner with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta property owner if signed in', function (done) {
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
//         // Save a new Meta property owner
//         agent.post('/api/metaPropertyOwners')
//           .send(metaPropertyOwner)
//           .expect(200)
//           .end(function (metaPropertyOwnerSaveErr, metaPropertyOwnerSaveRes) {
//             // Handle Meta property owner save error
//             if (metaPropertyOwnerSaveErr) {
//               return done(metaPropertyOwnerSaveErr);
//             }
//
//             // Delete an existing Meta property owner
//             agent.delete('/api/metaPropertyOwners/' + metaPropertyOwnerSaveRes.body._id)
//               .send(metaPropertyOwner)
//               .expect(200)
//               .end(function (metaPropertyOwnerDeleteErr, metaPropertyOwnerDeleteRes) {
//                 // Handle metaPropertyOwner error error
//                 if (metaPropertyOwnerDeleteErr) {
//                   return done(metaPropertyOwnerDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaPropertyOwnerDeleteRes.body._id).should.equal(metaPropertyOwnerSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta property owner if not signed in', function (done) {
//     // Set Meta property owner user
//     metaPropertyOwner.user = user;
//
//     // Create new Meta property owner model instance
//     var metaPropertyOwnerObj = new MetaPropertyOwner(metaPropertyOwner);
//
//     // Save the Meta property owner
//     metaPropertyOwnerObj.save(function () {
//       // Try deleting Meta property owner
//       request(app).delete('/api/metaPropertyOwners/' + metaPropertyOwnerObj._id)
//         .expect(403)
//         .end(function (metaPropertyOwnerDeleteErr, metaPropertyOwnerDeleteRes) {
//           // Set message assertion
//           (metaPropertyOwnerDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta property owner error error
//           done(metaPropertyOwnerDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta property owner that has an orphaned user reference', function (done) {
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
//           // Save a new Meta property owner
//           agent.post('/api/metaPropertyOwners')
//             .send(metaPropertyOwner)
//             .expect(200)
//             .end(function (metaPropertyOwnerSaveErr, metaPropertyOwnerSaveRes) {
//               // Handle Meta property owner save error
//               if (metaPropertyOwnerSaveErr) {
//                 return done(metaPropertyOwnerSaveErr);
//               }
//
//               // Set assertions on new Meta property owner
//               (metaPropertyOwnerSaveRes.body.name).should.equal(metaPropertyOwner.name);
//               should.exist(metaPropertyOwnerSaveRes.body.user);
//               should.equal(metaPropertyOwnerSaveRes.body.user._id, orphanId);
//
//               // force the Meta property owner to have an orphaned user reference
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
//                     // Get the Meta property owner
//                     agent.get('/api/metaPropertyOwners/' + metaPropertyOwnerSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaPropertyOwnerInfoErr, metaPropertyOwnerInfoRes) {
//                         // Handle Meta property owner error
//                         if (metaPropertyOwnerInfoErr) {
//                           return done(metaPropertyOwnerInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaPropertyOwnerInfoRes.body._id).should.equal(metaPropertyOwnerSaveRes.body._id);
//                         (metaPropertyOwnerInfoRes.body.name).should.equal(metaPropertyOwner.name);
//                         should.equal(metaPropertyOwnerInfoRes.body.user, undefined);
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
//       MetaPropertyOwner.remove().exec(done);
//     });
//   });
// });
