// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaSalinityUnit = mongoose.model('MetaSalinityUnit'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaSalinityUnit;
//
// /**
//  * Meta salinity unit routes tests
//  */
// describe('Meta salinity unit CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta salinity unit
//     user.save(function () {
//       metaSalinityUnit = {
//         name: 'Meta salinity unit name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta salinity unit if logged in', function (done) {
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
//         // Save a new Meta salinity unit
//         agent.post('/api/metaSalinityUnits')
//           .send(metaSalinityUnit)
//           .expect(200)
//           .end(function (metaSalinityUnitSaveErr, metaSalinityUnitSaveRes) {
//             // Handle Meta salinity unit save error
//             if (metaSalinityUnitSaveErr) {
//               return done(metaSalinityUnitSaveErr);
//             }
//
//             // Get a list of Meta salinity units
//             agent.get('/api/metaSalinityUnits')
//               .end(function (metaSalinityUnitsGetErr, metaSalinityUnitsGetRes) {
//                 // Handle Meta salinity units save error
//                 if (metaSalinityUnitsGetErr) {
//                   return done(metaSalinityUnitsGetErr);
//                 }
//
//                 // Get Meta salinity units list
//                 var metaSalinityUnits = metaSalinityUnitsGetRes.body;
//
//                 // Set assertions
//                 (metaSalinityUnits[0].user._id).should.equal(userId);
//                 (metaSalinityUnits[0].name).should.match('Meta salinity unit name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta salinity unit if not logged in', function (done) {
//     agent.post('/api/metaSalinityUnits')
//       .send(metaSalinityUnit)
//       .expect(403)
//       .end(function (metaSalinityUnitSaveErr, metaSalinityUnitSaveRes) {
//         // Call the assertion callback
//         done(metaSalinityUnitSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta salinity unit if no name is provided', function (done) {
//     // Invalidate name field
//     metaSalinityUnit.name = '';
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
//         // Save a new Meta salinity unit
//         agent.post('/api/metaSalinityUnits')
//           .send(metaSalinityUnit)
//           .expect(400)
//           .end(function (metaSalinityUnitSaveErr, metaSalinityUnitSaveRes) {
//             // Set message assertion
//             (metaSalinityUnitSaveRes.body.message).should.match('Please fill Meta salinity unit name');
//
//             // Handle Meta salinity unit save error
//             done(metaSalinityUnitSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta salinity unit if signed in', function (done) {
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
//         // Save a new Meta salinity unit
//         agent.post('/api/metaSalinityUnits')
//           .send(metaSalinityUnit)
//           .expect(200)
//           .end(function (metaSalinityUnitSaveErr, metaSalinityUnitSaveRes) {
//             // Handle Meta salinity unit save error
//             if (metaSalinityUnitSaveErr) {
//               return done(metaSalinityUnitSaveErr);
//             }
//
//             // Update Meta salinity unit name
//             metaSalinityUnit.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta salinity unit
//             agent.put('/api/metaSalinityUnits/' + metaSalinityUnitSaveRes.body._id)
//               .send(metaSalinityUnit)
//               .expect(200)
//               .end(function (metaSalinityUnitUpdateErr, metaSalinityUnitUpdateRes) {
//                 // Handle Meta salinity unit update error
//                 if (metaSalinityUnitUpdateErr) {
//                   return done(metaSalinityUnitUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaSalinityUnitUpdateRes.body._id).should.equal(metaSalinityUnitSaveRes.body._id);
//                 (metaSalinityUnitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta salinity units if not signed in', function (done) {
//     // Create new Meta salinity unit model instance
//     var metaSalinityUnitObj = new MetaSalinityUnit(metaSalinityUnit);
//
//     // Save the metaSalinityUnit
//     metaSalinityUnitObj.save(function () {
//       // Request Meta salinity units
//       request(app).get('/api/metaSalinityUnits')
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
//   it('should be able to get a single Meta salinity unit if not signed in', function (done) {
//     // Create new Meta salinity unit model instance
//     var metaSalinityUnitObj = new MetaSalinityUnit(metaSalinityUnit);
//
//     // Save the Meta salinity unit
//     metaSalinityUnitObj.save(function () {
//       request(app).get('/api/metaSalinityUnits/' + metaSalinityUnitObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaSalinityUnit.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta salinity unit with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaSalinityUnits/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta salinity unit is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta salinity unit which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta salinity unit
//     request(app).get('/api/metaSalinityUnits/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta salinity unit with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta salinity unit if signed in', function (done) {
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
//         // Save a new Meta salinity unit
//         agent.post('/api/metaSalinityUnits')
//           .send(metaSalinityUnit)
//           .expect(200)
//           .end(function (metaSalinityUnitSaveErr, metaSalinityUnitSaveRes) {
//             // Handle Meta salinity unit save error
//             if (metaSalinityUnitSaveErr) {
//               return done(metaSalinityUnitSaveErr);
//             }
//
//             // Delete an existing Meta salinity unit
//             agent.delete('/api/metaSalinityUnits/' + metaSalinityUnitSaveRes.body._id)
//               .send(metaSalinityUnit)
//               .expect(200)
//               .end(function (metaSalinityUnitDeleteErr, metaSalinityUnitDeleteRes) {
//                 // Handle metaSalinityUnit error error
//                 if (metaSalinityUnitDeleteErr) {
//                   return done(metaSalinityUnitDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaSalinityUnitDeleteRes.body._id).should.equal(metaSalinityUnitSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta salinity unit if not signed in', function (done) {
//     // Set Meta salinity unit user
//     metaSalinityUnit.user = user;
//
//     // Create new Meta salinity unit model instance
//     var metaSalinityUnitObj = new MetaSalinityUnit(metaSalinityUnit);
//
//     // Save the Meta salinity unit
//     metaSalinityUnitObj.save(function () {
//       // Try deleting Meta salinity unit
//       request(app).delete('/api/metaSalinityUnits/' + metaSalinityUnitObj._id)
//         .expect(403)
//         .end(function (metaSalinityUnitDeleteErr, metaSalinityUnitDeleteRes) {
//           // Set message assertion
//           (metaSalinityUnitDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta salinity unit error error
//           done(metaSalinityUnitDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta salinity unit that has an orphaned user reference', function (done) {
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
//           // Save a new Meta salinity unit
//           agent.post('/api/metaSalinityUnits')
//             .send(metaSalinityUnit)
//             .expect(200)
//             .end(function (metaSalinityUnitSaveErr, metaSalinityUnitSaveRes) {
//               // Handle Meta salinity unit save error
//               if (metaSalinityUnitSaveErr) {
//                 return done(metaSalinityUnitSaveErr);
//               }
//
//               // Set assertions on new Meta salinity unit
//               (metaSalinityUnitSaveRes.body.name).should.equal(metaSalinityUnit.name);
//               should.exist(metaSalinityUnitSaveRes.body.user);
//               should.equal(metaSalinityUnitSaveRes.body.user._id, orphanId);
//
//               // force the Meta salinity unit to have an orphaned user reference
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
//                     // Get the Meta salinity unit
//                     agent.get('/api/metaSalinityUnits/' + metaSalinityUnitSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaSalinityUnitInfoErr, metaSalinityUnitInfoRes) {
//                         // Handle Meta salinity unit error
//                         if (metaSalinityUnitInfoErr) {
//                           return done(metaSalinityUnitInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaSalinityUnitInfoRes.body._id).should.equal(metaSalinityUnitSaveRes.body._id);
//                         (metaSalinityUnitInfoRes.body.name).should.equal(metaSalinityUnit.name);
//                         should.equal(metaSalinityUnitInfoRes.body.user, undefined);
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
//       MetaSalinityUnit.remove().exec(done);
//     });
//   });
// });
