// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaDissolvedOxygenUnit = mongoose.model('MetaDissolvedOxygenUnit'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaDissolvedOxygenUnit;
//
// /**
//  * Meta dissolved oxygen unit routes tests
//  */
// describe('Meta dissolved oxygen unit CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta dissolved oxygen unit
//     user.save(function () {
//       metaDissolvedOxygenUnit = {
//         name: 'Meta dissolved oxygen unit name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta dissolved oxygen unit if logged in', function (done) {
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
//         // Save a new Meta dissolved oxygen unit
//         agent.post('/api/metaDissolvedOxygenUnits')
//           .send(metaDissolvedOxygenUnit)
//           .expect(200)
//           .end(function (metaDissolvedOxygenUnitSaveErr, metaDissolvedOxygenUnitSaveRes) {
//             // Handle Meta dissolved oxygen unit save error
//             if (metaDissolvedOxygenUnitSaveErr) {
//               return done(metaDissolvedOxygenUnitSaveErr);
//             }
//
//             // Get a list of Meta dissolved oxygen units
//             agent.get('/api/metaDissolvedOxygenUnits')
//               .end(function (metaDissolvedOxygenUnitsGetErr, metaDissolvedOxygenUnitsGetRes) {
//                 // Handle Meta dissolved oxygen units save error
//                 if (metaDissolvedOxygenUnitsGetErr) {
//                   return done(metaDissolvedOxygenUnitsGetErr);
//                 }
//
//                 // Get Meta dissolved oxygen units list
//                 var metaDissolvedOxygenUnits = metaDissolvedOxygenUnitsGetRes.body;
//
//                 // Set assertions
//                 (metaDissolvedOxygenUnits[0].user._id).should.equal(userId);
//                 (metaDissolvedOxygenUnits[0].name).should.match('Meta dissolved oxygen unit name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta dissolved oxygen unit if not logged in', function (done) {
//     agent.post('/api/metaDissolvedOxygenUnits')
//       .send(metaDissolvedOxygenUnit)
//       .expect(403)
//       .end(function (metaDissolvedOxygenUnitSaveErr, metaDissolvedOxygenUnitSaveRes) {
//         // Call the assertion callback
//         done(metaDissolvedOxygenUnitSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta dissolved oxygen unit if no name is provided', function (done) {
//     // Invalidate name field
//     metaDissolvedOxygenUnit.name = '';
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
//         // Save a new Meta dissolved oxygen unit
//         agent.post('/api/metaDissolvedOxygenUnits')
//           .send(metaDissolvedOxygenUnit)
//           .expect(400)
//           .end(function (metaDissolvedOxygenUnitSaveErr, metaDissolvedOxygenUnitSaveRes) {
//             // Set message assertion
//             (metaDissolvedOxygenUnitSaveRes.body.message).should.match('Please fill Meta dissolved oxygen unit name');
//
//             // Handle Meta dissolved oxygen unit save error
//             done(metaDissolvedOxygenUnitSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta dissolved oxygen unit if signed in', function (done) {
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
//         // Save a new Meta dissolved oxygen unit
//         agent.post('/api/metaDissolvedOxygenUnits')
//           .send(metaDissolvedOxygenUnit)
//           .expect(200)
//           .end(function (metaDissolvedOxygenUnitSaveErr, metaDissolvedOxygenUnitSaveRes) {
//             // Handle Meta dissolved oxygen unit save error
//             if (metaDissolvedOxygenUnitSaveErr) {
//               return done(metaDissolvedOxygenUnitSaveErr);
//             }
//
//             // Update Meta dissolved oxygen unit name
//             metaDissolvedOxygenUnit.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta dissolved oxygen unit
//             agent.put('/api/metaDissolvedOxygenUnits/' + metaDissolvedOxygenUnitSaveRes.body._id)
//               .send(metaDissolvedOxygenUnit)
//               .expect(200)
//               .end(function (metaDissolvedOxygenUnitUpdateErr, metaDissolvedOxygenUnitUpdateRes) {
//                 // Handle Meta dissolved oxygen unit update error
//                 if (metaDissolvedOxygenUnitUpdateErr) {
//                   return done(metaDissolvedOxygenUnitUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaDissolvedOxygenUnitUpdateRes.body._id).should.equal(metaDissolvedOxygenUnitSaveRes.body._id);
//                 (metaDissolvedOxygenUnitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta dissolved oxygen units if not signed in', function (done) {
//     // Create new Meta dissolved oxygen unit model instance
//     var metaDissolvedOxygenUnitObj = new MetaDissolvedOxygenUnit(metaDissolvedOxygenUnit);
//
//     // Save the metaDissolvedOxygenUnit
//     metaDissolvedOxygenUnitObj.save(function () {
//       // Request Meta dissolved oxygen units
//       request(app).get('/api/metaDissolvedOxygenUnits')
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
//   it('should be able to get a single Meta dissolved oxygen unit if not signed in', function (done) {
//     // Create new Meta dissolved oxygen unit model instance
//     var metaDissolvedOxygenUnitObj = new MetaDissolvedOxygenUnit(metaDissolvedOxygenUnit);
//
//     // Save the Meta dissolved oxygen unit
//     metaDissolvedOxygenUnitObj.save(function () {
//       request(app).get('/api/metaDissolvedOxygenUnits/' + metaDissolvedOxygenUnitObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaDissolvedOxygenUnit.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta dissolved oxygen unit with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaDissolvedOxygenUnits/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta dissolved oxygen unit is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta dissolved oxygen unit which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta dissolved oxygen unit
//     request(app).get('/api/metaDissolvedOxygenUnits/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta dissolved oxygen unit with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta dissolved oxygen unit if signed in', function (done) {
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
//         // Save a new Meta dissolved oxygen unit
//         agent.post('/api/metaDissolvedOxygenUnits')
//           .send(metaDissolvedOxygenUnit)
//           .expect(200)
//           .end(function (metaDissolvedOxygenUnitSaveErr, metaDissolvedOxygenUnitSaveRes) {
//             // Handle Meta dissolved oxygen unit save error
//             if (metaDissolvedOxygenUnitSaveErr) {
//               return done(metaDissolvedOxygenUnitSaveErr);
//             }
//
//             // Delete an existing Meta dissolved oxygen unit
//             agent.delete('/api/metaDissolvedOxygenUnits/' + metaDissolvedOxygenUnitSaveRes.body._id)
//               .send(metaDissolvedOxygenUnit)
//               .expect(200)
//               .end(function (metaDissolvedOxygenUnitDeleteErr, metaDissolvedOxygenUnitDeleteRes) {
//                 // Handle metaDissolvedOxygenUnit error error
//                 if (metaDissolvedOxygenUnitDeleteErr) {
//                   return done(metaDissolvedOxygenUnitDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaDissolvedOxygenUnitDeleteRes.body._id).should.equal(metaDissolvedOxygenUnitSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta dissolved oxygen unit if not signed in', function (done) {
//     // Set Meta dissolved oxygen unit user
//     metaDissolvedOxygenUnit.user = user;
//
//     // Create new Meta dissolved oxygen unit model instance
//     var metaDissolvedOxygenUnitObj = new MetaDissolvedOxygenUnit(metaDissolvedOxygenUnit);
//
//     // Save the Meta dissolved oxygen unit
//     metaDissolvedOxygenUnitObj.save(function () {
//       // Try deleting Meta dissolved oxygen unit
//       request(app).delete('/api/metaDissolvedOxygenUnits/' + metaDissolvedOxygenUnitObj._id)
//         .expect(403)
//         .end(function (metaDissolvedOxygenUnitDeleteErr, metaDissolvedOxygenUnitDeleteRes) {
//           // Set message assertion
//           (metaDissolvedOxygenUnitDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta dissolved oxygen unit error error
//           done(metaDissolvedOxygenUnitDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta dissolved oxygen unit that has an orphaned user reference', function (done) {
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
//           // Save a new Meta dissolved oxygen unit
//           agent.post('/api/metaDissolvedOxygenUnits')
//             .send(metaDissolvedOxygenUnit)
//             .expect(200)
//             .end(function (metaDissolvedOxygenUnitSaveErr, metaDissolvedOxygenUnitSaveRes) {
//               // Handle Meta dissolved oxygen unit save error
//               if (metaDissolvedOxygenUnitSaveErr) {
//                 return done(metaDissolvedOxygenUnitSaveErr);
//               }
//
//               // Set assertions on new Meta dissolved oxygen unit
//               (metaDissolvedOxygenUnitSaveRes.body.name).should.equal(metaDissolvedOxygenUnit.name);
//               should.exist(metaDissolvedOxygenUnitSaveRes.body.user);
//               should.equal(metaDissolvedOxygenUnitSaveRes.body.user._id, orphanId);
//
//               // force the Meta dissolved oxygen unit to have an orphaned user reference
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
//                     // Get the Meta dissolved oxygen unit
//                     agent.get('/api/metaDissolvedOxygenUnits/' + metaDissolvedOxygenUnitSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaDissolvedOxygenUnitInfoErr, metaDissolvedOxygenUnitInfoRes) {
//                         // Handle Meta dissolved oxygen unit error
//                         if (metaDissolvedOxygenUnitInfoErr) {
//                           return done(metaDissolvedOxygenUnitInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaDissolvedOxygenUnitInfoRes.body._id).should.equal(metaDissolvedOxygenUnitSaveRes.body._id);
//                         (metaDissolvedOxygenUnitInfoRes.body.name).should.equal(metaDissolvedOxygenUnit.name);
//                         should.equal(metaDissolvedOxygenUnitInfoRes.body.user, undefined);
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
//       MetaDissolvedOxygenUnit.remove().exec(done);
//     });
//   });
// });
