// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaTurbidityUnit = mongoose.model('MetaTurbidityUnit'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaTurbidityUnit;
//
// /**
//  * Meta turbidity unit routes tests
//  */
// describe('Meta turbidity unit CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta turbidity unit
//     user.save(function () {
//       metaTurbidityUnit = {
//         name: 'Meta turbidity unit name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta turbidity unit if logged in', function (done) {
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
//         // Save a new Meta turbidity unit
//         agent.post('/api/metaTurbidityUnits')
//           .send(metaTurbidityUnit)
//           .expect(200)
//           .end(function (metaTurbidityUnitSaveErr, metaTurbidityUnitSaveRes) {
//             // Handle Meta turbidity unit save error
//             if (metaTurbidityUnitSaveErr) {
//               return done(metaTurbidityUnitSaveErr);
//             }
//
//             // Get a list of Meta turbidity units
//             agent.get('/api/metaTurbidityUnits')
//               .end(function (metaTurbidityUnitsGetErr, metaTurbidityUnitsGetRes) {
//                 // Handle Meta turbidity units save error
//                 if (metaTurbidityUnitsGetErr) {
//                   return done(metaTurbidityUnitsGetErr);
//                 }
//
//                 // Get Meta turbidity units list
//                 var metaTurbidityUnits = metaTurbidityUnitsGetRes.body;
//
//                 // Set assertions
//                 (metaTurbidityUnits[0].user._id).should.equal(userId);
//                 (metaTurbidityUnits[0].name).should.match('Meta turbidity unit name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta turbidity unit if not logged in', function (done) {
//     agent.post('/api/metaTurbidityUnits')
//       .send(metaTurbidityUnit)
//       .expect(403)
//       .end(function (metaTurbidityUnitSaveErr, metaTurbidityUnitSaveRes) {
//         // Call the assertion callback
//         done(metaTurbidityUnitSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta turbidity unit if no name is provided', function (done) {
//     // Invalidate name field
//     metaTurbidityUnit.name = '';
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
//         // Save a new Meta turbidity unit
//         agent.post('/api/metaTurbidityUnits')
//           .send(metaTurbidityUnit)
//           .expect(400)
//           .end(function (metaTurbidityUnitSaveErr, metaTurbidityUnitSaveRes) {
//             // Set message assertion
//             (metaTurbidityUnitSaveRes.body.message).should.match('Please fill Meta turbidity unit name');
//
//             // Handle Meta turbidity unit save error
//             done(metaTurbidityUnitSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta turbidity unit if signed in', function (done) {
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
//         // Save a new Meta turbidity unit
//         agent.post('/api/metaTurbidityUnits')
//           .send(metaTurbidityUnit)
//           .expect(200)
//           .end(function (metaTurbidityUnitSaveErr, metaTurbidityUnitSaveRes) {
//             // Handle Meta turbidity unit save error
//             if (metaTurbidityUnitSaveErr) {
//               return done(metaTurbidityUnitSaveErr);
//             }
//
//             // Update Meta turbidity unit name
//             metaTurbidityUnit.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta turbidity unit
//             agent.put('/api/metaTurbidityUnits/' + metaTurbidityUnitSaveRes.body._id)
//               .send(metaTurbidityUnit)
//               .expect(200)
//               .end(function (metaTurbidityUnitUpdateErr, metaTurbidityUnitUpdateRes) {
//                 // Handle Meta turbidity unit update error
//                 if (metaTurbidityUnitUpdateErr) {
//                   return done(metaTurbidityUnitUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaTurbidityUnitUpdateRes.body._id).should.equal(metaTurbidityUnitSaveRes.body._id);
//                 (metaTurbidityUnitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta turbidity units if not signed in', function (done) {
//     // Create new Meta turbidity unit model instance
//     var metaTurbidityUnitObj = new MetaTurbidityUnit(metaTurbidityUnit);
//
//     // Save the metaTurbidityUnit
//     metaTurbidityUnitObj.save(function () {
//       // Request Meta turbidity units
//       request(app).get('/api/metaTurbidityUnits')
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
//   it('should be able to get a single Meta turbidity unit if not signed in', function (done) {
//     // Create new Meta turbidity unit model instance
//     var metaTurbidityUnitObj = new MetaTurbidityUnit(metaTurbidityUnit);
//
//     // Save the Meta turbidity unit
//     metaTurbidityUnitObj.save(function () {
//       request(app).get('/api/metaTurbidityUnits/' + metaTurbidityUnitObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaTurbidityUnit.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta turbidity unit with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaTurbidityUnits/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta turbidity unit is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta turbidity unit which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta turbidity unit
//     request(app).get('/api/metaTurbidityUnits/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta turbidity unit with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta turbidity unit if signed in', function (done) {
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
//         // Save a new Meta turbidity unit
//         agent.post('/api/metaTurbidityUnits')
//           .send(metaTurbidityUnit)
//           .expect(200)
//           .end(function (metaTurbidityUnitSaveErr, metaTurbidityUnitSaveRes) {
//             // Handle Meta turbidity unit save error
//             if (metaTurbidityUnitSaveErr) {
//               return done(metaTurbidityUnitSaveErr);
//             }
//
//             // Delete an existing Meta turbidity unit
//             agent.delete('/api/metaTurbidityUnits/' + metaTurbidityUnitSaveRes.body._id)
//               .send(metaTurbidityUnit)
//               .expect(200)
//               .end(function (metaTurbidityUnitDeleteErr, metaTurbidityUnitDeleteRes) {
//                 // Handle metaTurbidityUnit error error
//                 if (metaTurbidityUnitDeleteErr) {
//                   return done(metaTurbidityUnitDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaTurbidityUnitDeleteRes.body._id).should.equal(metaTurbidityUnitSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta turbidity unit if not signed in', function (done) {
//     // Set Meta turbidity unit user
//     metaTurbidityUnit.user = user;
//
//     // Create new Meta turbidity unit model instance
//     var metaTurbidityUnitObj = new MetaTurbidityUnit(metaTurbidityUnit);
//
//     // Save the Meta turbidity unit
//     metaTurbidityUnitObj.save(function () {
//       // Try deleting Meta turbidity unit
//       request(app).delete('/api/metaTurbidityUnits/' + metaTurbidityUnitObj._id)
//         .expect(403)
//         .end(function (metaTurbidityUnitDeleteErr, metaTurbidityUnitDeleteRes) {
//           // Set message assertion
//           (metaTurbidityUnitDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta turbidity unit error error
//           done(metaTurbidityUnitDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta turbidity unit that has an orphaned user reference', function (done) {
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
//           // Save a new Meta turbidity unit
//           agent.post('/api/metaTurbidityUnits')
//             .send(metaTurbidityUnit)
//             .expect(200)
//             .end(function (metaTurbidityUnitSaveErr, metaTurbidityUnitSaveRes) {
//               // Handle Meta turbidity unit save error
//               if (metaTurbidityUnitSaveErr) {
//                 return done(metaTurbidityUnitSaveErr);
//               }
//
//               // Set assertions on new Meta turbidity unit
//               (metaTurbidityUnitSaveRes.body.name).should.equal(metaTurbidityUnit.name);
//               should.exist(metaTurbidityUnitSaveRes.body.user);
//               should.equal(metaTurbidityUnitSaveRes.body.user._id, orphanId);
//
//               // force the Meta turbidity unit to have an orphaned user reference
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
//                     // Get the Meta turbidity unit
//                     agent.get('/api/metaTurbidityUnits/' + metaTurbidityUnitSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaTurbidityUnitInfoErr, metaTurbidityUnitInfoRes) {
//                         // Handle Meta turbidity unit error
//                         if (metaTurbidityUnitInfoErr) {
//                           return done(metaTurbidityUnitInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaTurbidityUnitInfoRes.body._id).should.equal(metaTurbidityUnitSaveRes.body._id);
//                         (metaTurbidityUnitInfoRes.body.name).should.equal(metaTurbidityUnit.name);
//                         should.equal(metaTurbidityUnitInfoRes.body.user, undefined);
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
//       MetaTurbidityUnit.remove().exec(done);
//     });
//   });
// });
