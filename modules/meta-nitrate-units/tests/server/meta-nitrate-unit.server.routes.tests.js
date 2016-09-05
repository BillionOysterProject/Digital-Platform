// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaNitrateUnit = mongoose.model('MetaNitrateUnit'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaNitrateUnit;
//
// /**
//  * Meta nitrate unit routes tests
//  */
// describe('Meta nitrate unit CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta nitrate unit
//     user.save(function () {
//       metaNitrateUnit = {
//         name: 'Meta nitrate unit name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta nitrate unit if logged in', function (done) {
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
//         // Save a new Meta nitrate unit
//         agent.post('/api/metaNitrateUnits')
//           .send(metaNitrateUnit)
//           .expect(200)
//           .end(function (metaNitrateUnitSaveErr, metaNitrateUnitSaveRes) {
//             // Handle Meta nitrate unit save error
//             if (metaNitrateUnitSaveErr) {
//               return done(metaNitrateUnitSaveErr);
//             }
//
//             // Get a list of Meta nitrate units
//             agent.get('/api/metaNitrateUnits')
//               .end(function (metaNitrateUnitsGetErr, metaNitrateUnitsGetRes) {
//                 // Handle Meta nitrate units save error
//                 if (metaNitrateUnitsGetErr) {
//                   return done(metaNitrateUnitsGetErr);
//                 }
//
//                 // Get Meta nitrate units list
//                 var metaNitrateUnits = metaNitrateUnitsGetRes.body;
//
//                 // Set assertions
//                 (metaNitrateUnits[0].user._id).should.equal(userId);
//                 (metaNitrateUnits[0].name).should.match('Meta nitrate unit name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta nitrate unit if not logged in', function (done) {
//     agent.post('/api/metaNitrateUnits')
//       .send(metaNitrateUnit)
//       .expect(403)
//       .end(function (metaNitrateUnitSaveErr, metaNitrateUnitSaveRes) {
//         // Call the assertion callback
//         done(metaNitrateUnitSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta nitrate unit if no name is provided', function (done) {
//     // Invalidate name field
//     metaNitrateUnit.name = '';
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
//         // Save a new Meta nitrate unit
//         agent.post('/api/metaNitrateUnits')
//           .send(metaNitrateUnit)
//           .expect(400)
//           .end(function (metaNitrateUnitSaveErr, metaNitrateUnitSaveRes) {
//             // Set message assertion
//             (metaNitrateUnitSaveRes.body.message).should.match('Please fill Meta nitrate unit name');
//
//             // Handle Meta nitrate unit save error
//             done(metaNitrateUnitSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta nitrate unit if signed in', function (done) {
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
//         // Save a new Meta nitrate unit
//         agent.post('/api/metaNitrateUnits')
//           .send(metaNitrateUnit)
//           .expect(200)
//           .end(function (metaNitrateUnitSaveErr, metaNitrateUnitSaveRes) {
//             // Handle Meta nitrate unit save error
//             if (metaNitrateUnitSaveErr) {
//               return done(metaNitrateUnitSaveErr);
//             }
//
//             // Update Meta nitrate unit name
//             metaNitrateUnit.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta nitrate unit
//             agent.put('/api/metaNitrateUnits/' + metaNitrateUnitSaveRes.body._id)
//               .send(metaNitrateUnit)
//               .expect(200)
//               .end(function (metaNitrateUnitUpdateErr, metaNitrateUnitUpdateRes) {
//                 // Handle Meta nitrate unit update error
//                 if (metaNitrateUnitUpdateErr) {
//                   return done(metaNitrateUnitUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaNitrateUnitUpdateRes.body._id).should.equal(metaNitrateUnitSaveRes.body._id);
//                 (metaNitrateUnitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta nitrate units if not signed in', function (done) {
//     // Create new Meta nitrate unit model instance
//     var metaNitrateUnitObj = new MetaNitrateUnit(metaNitrateUnit);
//
//     // Save the metaNitrateUnit
//     metaNitrateUnitObj.save(function () {
//       // Request Meta nitrate units
//       request(app).get('/api/metaNitrateUnits')
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
//   it('should be able to get a single Meta nitrate unit if not signed in', function (done) {
//     // Create new Meta nitrate unit model instance
//     var metaNitrateUnitObj = new MetaNitrateUnit(metaNitrateUnit);
//
//     // Save the Meta nitrate unit
//     metaNitrateUnitObj.save(function () {
//       request(app).get('/api/metaNitrateUnits/' + metaNitrateUnitObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaNitrateUnit.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta nitrate unit with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaNitrateUnits/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta nitrate unit is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta nitrate unit which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta nitrate unit
//     request(app).get('/api/metaNitrateUnits/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta nitrate unit with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta nitrate unit if signed in', function (done) {
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
//         // Save a new Meta nitrate unit
//         agent.post('/api/metaNitrateUnits')
//           .send(metaNitrateUnit)
//           .expect(200)
//           .end(function (metaNitrateUnitSaveErr, metaNitrateUnitSaveRes) {
//             // Handle Meta nitrate unit save error
//             if (metaNitrateUnitSaveErr) {
//               return done(metaNitrateUnitSaveErr);
//             }
//
//             // Delete an existing Meta nitrate unit
//             agent.delete('/api/metaNitrateUnits/' + metaNitrateUnitSaveRes.body._id)
//               .send(metaNitrateUnit)
//               .expect(200)
//               .end(function (metaNitrateUnitDeleteErr, metaNitrateUnitDeleteRes) {
//                 // Handle metaNitrateUnit error error
//                 if (metaNitrateUnitDeleteErr) {
//                   return done(metaNitrateUnitDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaNitrateUnitDeleteRes.body._id).should.equal(metaNitrateUnitSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta nitrate unit if not signed in', function (done) {
//     // Set Meta nitrate unit user
//     metaNitrateUnit.user = user;
//
//     // Create new Meta nitrate unit model instance
//     var metaNitrateUnitObj = new MetaNitrateUnit(metaNitrateUnit);
//
//     // Save the Meta nitrate unit
//     metaNitrateUnitObj.save(function () {
//       // Try deleting Meta nitrate unit
//       request(app).delete('/api/metaNitrateUnits/' + metaNitrateUnitObj._id)
//         .expect(403)
//         .end(function (metaNitrateUnitDeleteErr, metaNitrateUnitDeleteRes) {
//           // Set message assertion
//           (metaNitrateUnitDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta nitrate unit error error
//           done(metaNitrateUnitDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta nitrate unit that has an orphaned user reference', function (done) {
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
//           // Save a new Meta nitrate unit
//           agent.post('/api/metaNitrateUnits')
//             .send(metaNitrateUnit)
//             .expect(200)
//             .end(function (metaNitrateUnitSaveErr, metaNitrateUnitSaveRes) {
//               // Handle Meta nitrate unit save error
//               if (metaNitrateUnitSaveErr) {
//                 return done(metaNitrateUnitSaveErr);
//               }
//
//               // Set assertions on new Meta nitrate unit
//               (metaNitrateUnitSaveRes.body.name).should.equal(metaNitrateUnit.name);
//               should.exist(metaNitrateUnitSaveRes.body.user);
//               should.equal(metaNitrateUnitSaveRes.body.user._id, orphanId);
//
//               // force the Meta nitrate unit to have an orphaned user reference
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
//                     // Get the Meta nitrate unit
//                     agent.get('/api/metaNitrateUnits/' + metaNitrateUnitSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaNitrateUnitInfoErr, metaNitrateUnitInfoRes) {
//                         // Handle Meta nitrate unit error
//                         if (metaNitrateUnitInfoErr) {
//                           return done(metaNitrateUnitInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaNitrateUnitInfoRes.body._id).should.equal(metaNitrateUnitSaveRes.body._id);
//                         (metaNitrateUnitInfoRes.body.name).should.equal(metaNitrateUnit.name);
//                         should.equal(metaNitrateUnitInfoRes.body.user, undefined);
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
//       MetaNitrateUnit.remove().exec(done);
//     });
//   });
// });
