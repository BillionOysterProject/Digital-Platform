// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaPhUnit = mongoose.model('MetaPhUnit'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaPhUnit;
//
// /**
//  * Meta ph unit routes tests
//  */
// describe('Meta ph unit CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta ph unit
//     user.save(function () {
//       metaPhUnit = {
//         name: 'Meta ph unit name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta ph unit if logged in', function (done) {
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
//         // Save a new Meta ph unit
//         agent.post('/api/metaPhUnits')
//           .send(metaPhUnit)
//           .expect(200)
//           .end(function (metaPhUnitSaveErr, metaPhUnitSaveRes) {
//             // Handle Meta ph unit save error
//             if (metaPhUnitSaveErr) {
//               return done(metaPhUnitSaveErr);
//             }
//
//             // Get a list of Meta ph units
//             agent.get('/api/metaPhUnits')
//               .end(function (metaPhUnitsGetErr, metaPhUnitsGetRes) {
//                 // Handle Meta ph units save error
//                 if (metaPhUnitsGetErr) {
//                   return done(metaPhUnitsGetErr);
//                 }
//
//                 // Get Meta ph units list
//                 var metaPhUnits = metaPhUnitsGetRes.body;
//
//                 // Set assertions
//                 (metaPhUnits[0].user._id).should.equal(userId);
//                 (metaPhUnits[0].name).should.match('Meta ph unit name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta ph unit if not logged in', function (done) {
//     agent.post('/api/metaPhUnits')
//       .send(metaPhUnit)
//       .expect(403)
//       .end(function (metaPhUnitSaveErr, metaPhUnitSaveRes) {
//         // Call the assertion callback
//         done(metaPhUnitSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta ph unit if no name is provided', function (done) {
//     // Invalidate name field
//     metaPhUnit.name = '';
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
//         // Save a new Meta ph unit
//         agent.post('/api/metaPhUnits')
//           .send(metaPhUnit)
//           .expect(400)
//           .end(function (metaPhUnitSaveErr, metaPhUnitSaveRes) {
//             // Set message assertion
//             (metaPhUnitSaveRes.body.message).should.match('Please fill Meta ph unit name');
//
//             // Handle Meta ph unit save error
//             done(metaPhUnitSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta ph unit if signed in', function (done) {
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
//         // Save a new Meta ph unit
//         agent.post('/api/metaPhUnits')
//           .send(metaPhUnit)
//           .expect(200)
//           .end(function (metaPhUnitSaveErr, metaPhUnitSaveRes) {
//             // Handle Meta ph unit save error
//             if (metaPhUnitSaveErr) {
//               return done(metaPhUnitSaveErr);
//             }
//
//             // Update Meta ph unit name
//             metaPhUnit.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta ph unit
//             agent.put('/api/metaPhUnits/' + metaPhUnitSaveRes.body._id)
//               .send(metaPhUnit)
//               .expect(200)
//               .end(function (metaPhUnitUpdateErr, metaPhUnitUpdateRes) {
//                 // Handle Meta ph unit update error
//                 if (metaPhUnitUpdateErr) {
//                   return done(metaPhUnitUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaPhUnitUpdateRes.body._id).should.equal(metaPhUnitSaveRes.body._id);
//                 (metaPhUnitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta ph units if not signed in', function (done) {
//     // Create new Meta ph unit model instance
//     var metaPhUnitObj = new MetaPhUnit(metaPhUnit);
//
//     // Save the metaPhUnit
//     metaPhUnitObj.save(function () {
//       // Request Meta ph units
//       request(app).get('/api/metaPhUnits')
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
//   it('should be able to get a single Meta ph unit if not signed in', function (done) {
//     // Create new Meta ph unit model instance
//     var metaPhUnitObj = new MetaPhUnit(metaPhUnit);
//
//     // Save the Meta ph unit
//     metaPhUnitObj.save(function () {
//       request(app).get('/api/metaPhUnits/' + metaPhUnitObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaPhUnit.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta ph unit with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaPhUnits/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta ph unit is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta ph unit which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta ph unit
//     request(app).get('/api/metaPhUnits/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta ph unit with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta ph unit if signed in', function (done) {
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
//         // Save a new Meta ph unit
//         agent.post('/api/metaPhUnits')
//           .send(metaPhUnit)
//           .expect(200)
//           .end(function (metaPhUnitSaveErr, metaPhUnitSaveRes) {
//             // Handle Meta ph unit save error
//             if (metaPhUnitSaveErr) {
//               return done(metaPhUnitSaveErr);
//             }
//
//             // Delete an existing Meta ph unit
//             agent.delete('/api/metaPhUnits/' + metaPhUnitSaveRes.body._id)
//               .send(metaPhUnit)
//               .expect(200)
//               .end(function (metaPhUnitDeleteErr, metaPhUnitDeleteRes) {
//                 // Handle metaPhUnit error error
//                 if (metaPhUnitDeleteErr) {
//                   return done(metaPhUnitDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaPhUnitDeleteRes.body._id).should.equal(metaPhUnitSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta ph unit if not signed in', function (done) {
//     // Set Meta ph unit user
//     metaPhUnit.user = user;
//
//     // Create new Meta ph unit model instance
//     var metaPhUnitObj = new MetaPhUnit(metaPhUnit);
//
//     // Save the Meta ph unit
//     metaPhUnitObj.save(function () {
//       // Try deleting Meta ph unit
//       request(app).delete('/api/metaPhUnits/' + metaPhUnitObj._id)
//         .expect(403)
//         .end(function (metaPhUnitDeleteErr, metaPhUnitDeleteRes) {
//           // Set message assertion
//           (metaPhUnitDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta ph unit error error
//           done(metaPhUnitDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta ph unit that has an orphaned user reference', function (done) {
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
//           // Save a new Meta ph unit
//           agent.post('/api/metaPhUnits')
//             .send(metaPhUnit)
//             .expect(200)
//             .end(function (metaPhUnitSaveErr, metaPhUnitSaveRes) {
//               // Handle Meta ph unit save error
//               if (metaPhUnitSaveErr) {
//                 return done(metaPhUnitSaveErr);
//               }
//
//               // Set assertions on new Meta ph unit
//               (metaPhUnitSaveRes.body.name).should.equal(metaPhUnit.name);
//               should.exist(metaPhUnitSaveRes.body.user);
//               should.equal(metaPhUnitSaveRes.body.user._id, orphanId);
//
//               // force the Meta ph unit to have an orphaned user reference
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
//                     // Get the Meta ph unit
//                     agent.get('/api/metaPhUnits/' + metaPhUnitSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaPhUnitInfoErr, metaPhUnitInfoRes) {
//                         // Handle Meta ph unit error
//                         if (metaPhUnitInfoErr) {
//                           return done(metaPhUnitInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaPhUnitInfoRes.body._id).should.equal(metaPhUnitSaveRes.body._id);
//                         (metaPhUnitInfoRes.body.name).should.equal(metaPhUnit.name);
//                         should.equal(metaPhUnitInfoRes.body.user, undefined);
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
//       MetaPhUnit.remove().exec(done);
//     });
//   });
// });
