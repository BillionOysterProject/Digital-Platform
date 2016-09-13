// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaGarbageExtent = mongoose.model('MetaGarbageExtent'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaGarbageExtent;
//
// /**
//  * Meta garbage extent routes tests
//  */
// describe('Meta garbage extent CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta garbage extent
//     user.save(function () {
//       metaGarbageExtent = {
//         name: 'Meta garbage extent name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta garbage extent if logged in', function (done) {
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
//         // Save a new Meta garbage extent
//         agent.post('/api/metaGarbageExtents')
//           .send(metaGarbageExtent)
//           .expect(200)
//           .end(function (metaGarbageExtentSaveErr, metaGarbageExtentSaveRes) {
//             // Handle Meta garbage extent save error
//             if (metaGarbageExtentSaveErr) {
//               return done(metaGarbageExtentSaveErr);
//             }
//
//             // Get a list of Meta garbage extents
//             agent.get('/api/metaGarbageExtents')
//               .end(function (metaGarbageExtentsGetErr, metaGarbageExtentsGetRes) {
//                 // Handle Meta garbage extents save error
//                 if (metaGarbageExtentsGetErr) {
//                   return done(metaGarbageExtentsGetErr);
//                 }
//
//                 // Get Meta garbage extents list
//                 var metaGarbageExtents = metaGarbageExtentsGetRes.body;
//
//                 // Set assertions
//                 (metaGarbageExtents[0].user._id).should.equal(userId);
//                 (metaGarbageExtents[0].name).should.match('Meta garbage extent name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta garbage extent if not logged in', function (done) {
//     agent.post('/api/metaGarbageExtents')
//       .send(metaGarbageExtent)
//       .expect(403)
//       .end(function (metaGarbageExtentSaveErr, metaGarbageExtentSaveRes) {
//         // Call the assertion callback
//         done(metaGarbageExtentSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta garbage extent if no name is provided', function (done) {
//     // Invalidate name field
//     metaGarbageExtent.name = '';
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
//         // Save a new Meta garbage extent
//         agent.post('/api/metaGarbageExtents')
//           .send(metaGarbageExtent)
//           .expect(400)
//           .end(function (metaGarbageExtentSaveErr, metaGarbageExtentSaveRes) {
//             // Set message assertion
//             (metaGarbageExtentSaveRes.body.message).should.match('Please fill Meta garbage extent name');
//
//             // Handle Meta garbage extent save error
//             done(metaGarbageExtentSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta garbage extent if signed in', function (done) {
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
//         // Save a new Meta garbage extent
//         agent.post('/api/metaGarbageExtents')
//           .send(metaGarbageExtent)
//           .expect(200)
//           .end(function (metaGarbageExtentSaveErr, metaGarbageExtentSaveRes) {
//             // Handle Meta garbage extent save error
//             if (metaGarbageExtentSaveErr) {
//               return done(metaGarbageExtentSaveErr);
//             }
//
//             // Update Meta garbage extent name
//             metaGarbageExtent.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta garbage extent
//             agent.put('/api/metaGarbageExtents/' + metaGarbageExtentSaveRes.body._id)
//               .send(metaGarbageExtent)
//               .expect(200)
//               .end(function (metaGarbageExtentUpdateErr, metaGarbageExtentUpdateRes) {
//                 // Handle Meta garbage extent update error
//                 if (metaGarbageExtentUpdateErr) {
//                   return done(metaGarbageExtentUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaGarbageExtentUpdateRes.body._id).should.equal(metaGarbageExtentSaveRes.body._id);
//                 (metaGarbageExtentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta garbage extents if not signed in', function (done) {
//     // Create new Meta garbage extent model instance
//     var metaGarbageExtentObj = new MetaGarbageExtent(metaGarbageExtent);
//
//     // Save the metaGarbageExtent
//     metaGarbageExtentObj.save(function () {
//       // Request Meta garbage extents
//       request(app).get('/api/metaGarbageExtents')
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
//   it('should be able to get a single Meta garbage extent if not signed in', function (done) {
//     // Create new Meta garbage extent model instance
//     var metaGarbageExtentObj = new MetaGarbageExtent(metaGarbageExtent);
//
//     // Save the Meta garbage extent
//     metaGarbageExtentObj.save(function () {
//       request(app).get('/api/metaGarbageExtents/' + metaGarbageExtentObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaGarbageExtent.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta garbage extent with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaGarbageExtents/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta garbage extent is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta garbage extent which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta garbage extent
//     request(app).get('/api/metaGarbageExtents/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta garbage extent with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta garbage extent if signed in', function (done) {
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
//         // Save a new Meta garbage extent
//         agent.post('/api/metaGarbageExtents')
//           .send(metaGarbageExtent)
//           .expect(200)
//           .end(function (metaGarbageExtentSaveErr, metaGarbageExtentSaveRes) {
//             // Handle Meta garbage extent save error
//             if (metaGarbageExtentSaveErr) {
//               return done(metaGarbageExtentSaveErr);
//             }
//
//             // Delete an existing Meta garbage extent
//             agent.delete('/api/metaGarbageExtents/' + metaGarbageExtentSaveRes.body._id)
//               .send(metaGarbageExtent)
//               .expect(200)
//               .end(function (metaGarbageExtentDeleteErr, metaGarbageExtentDeleteRes) {
//                 // Handle metaGarbageExtent error error
//                 if (metaGarbageExtentDeleteErr) {
//                   return done(metaGarbageExtentDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaGarbageExtentDeleteRes.body._id).should.equal(metaGarbageExtentSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta garbage extent if not signed in', function (done) {
//     // Set Meta garbage extent user
//     metaGarbageExtent.user = user;
//
//     // Create new Meta garbage extent model instance
//     var metaGarbageExtentObj = new MetaGarbageExtent(metaGarbageExtent);
//
//     // Save the Meta garbage extent
//     metaGarbageExtentObj.save(function () {
//       // Try deleting Meta garbage extent
//       request(app).delete('/api/metaGarbageExtents/' + metaGarbageExtentObj._id)
//         .expect(403)
//         .end(function (metaGarbageExtentDeleteErr, metaGarbageExtentDeleteRes) {
//           // Set message assertion
//           (metaGarbageExtentDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta garbage extent error error
//           done(metaGarbageExtentDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta garbage extent that has an orphaned user reference', function (done) {
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
//           // Save a new Meta garbage extent
//           agent.post('/api/metaGarbageExtents')
//             .send(metaGarbageExtent)
//             .expect(200)
//             .end(function (metaGarbageExtentSaveErr, metaGarbageExtentSaveRes) {
//               // Handle Meta garbage extent save error
//               if (metaGarbageExtentSaveErr) {
//                 return done(metaGarbageExtentSaveErr);
//               }
//
//               // Set assertions on new Meta garbage extent
//               (metaGarbageExtentSaveRes.body.name).should.equal(metaGarbageExtent.name);
//               should.exist(metaGarbageExtentSaveRes.body.user);
//               should.equal(metaGarbageExtentSaveRes.body.user._id, orphanId);
//
//               // force the Meta garbage extent to have an orphaned user reference
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
//                     // Get the Meta garbage extent
//                     agent.get('/api/metaGarbageExtents/' + metaGarbageExtentSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaGarbageExtentInfoErr, metaGarbageExtentInfoRes) {
//                         // Handle Meta garbage extent error
//                         if (metaGarbageExtentInfoErr) {
//                           return done(metaGarbageExtentInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaGarbageExtentInfoRes.body._id).should.equal(metaGarbageExtentSaveRes.body._id);
//                         (metaGarbageExtentInfoRes.body.name).should.equal(metaGarbageExtent.name);
//                         should.equal(metaGarbageExtentInfoRes.body.user, undefined);
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
//       MetaGarbageExtent.remove().exec(done);
//     });
//   });
// });
