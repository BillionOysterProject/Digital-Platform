// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaWaterTemperatureUnit = mongoose.model('MetaWaterTemperatureUnit'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaWaterTemperatureUnit;
//
// /**
//  * Meta water temperature unit routes tests
//  */
// describe('Meta water temperature unit CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta water temperature unit
//     user.save(function () {
//       metaWaterTemperatureUnit = {
//         name: 'Meta water temperature unit name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta water temperature unit if logged in', function (done) {
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
//         // Save a new Meta water temperature unit
//         agent.post('/api/metaWaterTemperatureUnits')
//           .send(metaWaterTemperatureUnit)
//           .expect(200)
//           .end(function (metaWaterTemperatureUnitSaveErr, metaWaterTemperatureUnitSaveRes) {
//             // Handle Meta water temperature unit save error
//             if (metaWaterTemperatureUnitSaveErr) {
//               return done(metaWaterTemperatureUnitSaveErr);
//             }
//
//             // Get a list of Meta water temperature units
//             agent.get('/api/metaWaterTemperatureUnits')
//               .end(function (metaWaterTemperatureUnitsGetErr, metaWaterTemperatureUnitsGetRes) {
//                 // Handle Meta water temperature units save error
//                 if (metaWaterTemperatureUnitsGetErr) {
//                   return done(metaWaterTemperatureUnitsGetErr);
//                 }
//
//                 // Get Meta water temperature units list
//                 var metaWaterTemperatureUnits = metaWaterTemperatureUnitsGetRes.body;
//
//                 // Set assertions
//                 (metaWaterTemperatureUnits[0].user._id).should.equal(userId);
//                 (metaWaterTemperatureUnits[0].name).should.match('Meta water temperature unit name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta water temperature unit if not logged in', function (done) {
//     agent.post('/api/metaWaterTemperatureUnits')
//       .send(metaWaterTemperatureUnit)
//       .expect(403)
//       .end(function (metaWaterTemperatureUnitSaveErr, metaWaterTemperatureUnitSaveRes) {
//         // Call the assertion callback
//         done(metaWaterTemperatureUnitSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta water temperature unit if no name is provided', function (done) {
//     // Invalidate name field
//     metaWaterTemperatureUnit.name = '';
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
//         // Save a new Meta water temperature unit
//         agent.post('/api/metaWaterTemperatureUnits')
//           .send(metaWaterTemperatureUnit)
//           .expect(400)
//           .end(function (metaWaterTemperatureUnitSaveErr, metaWaterTemperatureUnitSaveRes) {
//             // Set message assertion
//             (metaWaterTemperatureUnitSaveRes.body.message).should.match('Please fill Meta water temperature unit name');
//
//             // Handle Meta water temperature unit save error
//             done(metaWaterTemperatureUnitSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta water temperature unit if signed in', function (done) {
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
//         // Save a new Meta water temperature unit
//         agent.post('/api/metaWaterTemperatureUnits')
//           .send(metaWaterTemperatureUnit)
//           .expect(200)
//           .end(function (metaWaterTemperatureUnitSaveErr, metaWaterTemperatureUnitSaveRes) {
//             // Handle Meta water temperature unit save error
//             if (metaWaterTemperatureUnitSaveErr) {
//               return done(metaWaterTemperatureUnitSaveErr);
//             }
//
//             // Update Meta water temperature unit name
//             metaWaterTemperatureUnit.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta water temperature unit
//             agent.put('/api/metaWaterTemperatureUnits/' + metaWaterTemperatureUnitSaveRes.body._id)
//               .send(metaWaterTemperatureUnit)
//               .expect(200)
//               .end(function (metaWaterTemperatureUnitUpdateErr, metaWaterTemperatureUnitUpdateRes) {
//                 // Handle Meta water temperature unit update error
//                 if (metaWaterTemperatureUnitUpdateErr) {
//                   return done(metaWaterTemperatureUnitUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaWaterTemperatureUnitUpdateRes.body._id).should.equal(metaWaterTemperatureUnitSaveRes.body._id);
//                 (metaWaterTemperatureUnitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta water temperature units if not signed in', function (done) {
//     // Create new Meta water temperature unit model instance
//     var metaWaterTemperatureUnitObj = new MetaWaterTemperatureUnit(metaWaterTemperatureUnit);
//
//     // Save the metaWaterTemperatureUnit
//     metaWaterTemperatureUnitObj.save(function () {
//       // Request Meta water temperature units
//       request(app).get('/api/metaWaterTemperatureUnits')
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
//   it('should be able to get a single Meta water temperature unit if not signed in', function (done) {
//     // Create new Meta water temperature unit model instance
//     var metaWaterTemperatureUnitObj = new MetaWaterTemperatureUnit(metaWaterTemperatureUnit);
//
//     // Save the Meta water temperature unit
//     metaWaterTemperatureUnitObj.save(function () {
//       request(app).get('/api/metaWaterTemperatureUnits/' + metaWaterTemperatureUnitObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaWaterTemperatureUnit.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta water temperature unit with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaWaterTemperatureUnits/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta water temperature unit is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta water temperature unit which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta water temperature unit
//     request(app).get('/api/metaWaterTemperatureUnits/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta water temperature unit with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta water temperature unit if signed in', function (done) {
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
//         // Save a new Meta water temperature unit
//         agent.post('/api/metaWaterTemperatureUnits')
//           .send(metaWaterTemperatureUnit)
//           .expect(200)
//           .end(function (metaWaterTemperatureUnitSaveErr, metaWaterTemperatureUnitSaveRes) {
//             // Handle Meta water temperature unit save error
//             if (metaWaterTemperatureUnitSaveErr) {
//               return done(metaWaterTemperatureUnitSaveErr);
//             }
//
//             // Delete an existing Meta water temperature unit
//             agent.delete('/api/metaWaterTemperatureUnits/' + metaWaterTemperatureUnitSaveRes.body._id)
//               .send(metaWaterTemperatureUnit)
//               .expect(200)
//               .end(function (metaWaterTemperatureUnitDeleteErr, metaWaterTemperatureUnitDeleteRes) {
//                 // Handle metaWaterTemperatureUnit error error
//                 if (metaWaterTemperatureUnitDeleteErr) {
//                   return done(metaWaterTemperatureUnitDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaWaterTemperatureUnitDeleteRes.body._id).should.equal(metaWaterTemperatureUnitSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta water temperature unit if not signed in', function (done) {
//     // Set Meta water temperature unit user
//     metaWaterTemperatureUnit.user = user;
//
//     // Create new Meta water temperature unit model instance
//     var metaWaterTemperatureUnitObj = new MetaWaterTemperatureUnit(metaWaterTemperatureUnit);
//
//     // Save the Meta water temperature unit
//     metaWaterTemperatureUnitObj.save(function () {
//       // Try deleting Meta water temperature unit
//       request(app).delete('/api/metaWaterTemperatureUnits/' + metaWaterTemperatureUnitObj._id)
//         .expect(403)
//         .end(function (metaWaterTemperatureUnitDeleteErr, metaWaterTemperatureUnitDeleteRes) {
//           // Set message assertion
//           (metaWaterTemperatureUnitDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta water temperature unit error error
//           done(metaWaterTemperatureUnitDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta water temperature unit that has an orphaned user reference', function (done) {
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
//           // Save a new Meta water temperature unit
//           agent.post('/api/metaWaterTemperatureUnits')
//             .send(metaWaterTemperatureUnit)
//             .expect(200)
//             .end(function (metaWaterTemperatureUnitSaveErr, metaWaterTemperatureUnitSaveRes) {
//               // Handle Meta water temperature unit save error
//               if (metaWaterTemperatureUnitSaveErr) {
//                 return done(metaWaterTemperatureUnitSaveErr);
//               }
//
//               // Set assertions on new Meta water temperature unit
//               (metaWaterTemperatureUnitSaveRes.body.name).should.equal(metaWaterTemperatureUnit.name);
//               should.exist(metaWaterTemperatureUnitSaveRes.body.user);
//               should.equal(metaWaterTemperatureUnitSaveRes.body.user._id, orphanId);
//
//               // force the Meta water temperature unit to have an orphaned user reference
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
//                     // Get the Meta water temperature unit
//                     agent.get('/api/metaWaterTemperatureUnits/' + metaWaterTemperatureUnitSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaWaterTemperatureUnitInfoErr, metaWaterTemperatureUnitInfoRes) {
//                         // Handle Meta water temperature unit error
//                         if (metaWaterTemperatureUnitInfoErr) {
//                           return done(metaWaterTemperatureUnitInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaWaterTemperatureUnitInfoRes.body._id).should.equal(metaWaterTemperatureUnitSaveRes.body._id);
//                         (metaWaterTemperatureUnitInfoRes.body.name).should.equal(metaWaterTemperatureUnit.name);
//                         should.equal(metaWaterTemperatureUnitInfoRes.body.user, undefined);
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
//       MetaWaterTemperatureUnit.remove().exec(done);
//     });
//   });
// });
