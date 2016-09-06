// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaAmmoniaUnit = mongoose.model('MetaAmmoniaUnit'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaAmmoniaUnit;
//
// /**
//  * Meta ammonia unit routes tests
//  */
// describe('Meta ammonia unit CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta ammonia unit
//     user.save(function () {
//       metaAmmoniaUnit = {
//         name: 'Meta ammonia unit name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta ammonia unit if logged in', function (done) {
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
//         // Save a new Meta ammonia unit
//         agent.post('/api/metaAmmoniaUnits')
//           .send(metaAmmoniaUnit)
//           .expect(200)
//           .end(function (metaAmmoniaUnitSaveErr, metaAmmoniaUnitSaveRes) {
//             // Handle Meta ammonia unit save error
//             if (metaAmmoniaUnitSaveErr) {
//               return done(metaAmmoniaUnitSaveErr);
//             }
//
//             // Get a list of Meta ammonia units
//             agent.get('/api/metaAmmoniaUnits')
//               .end(function (metaAmmoniaUnitsGetErr, metaAmmoniaUnitsGetRes) {
//                 // Handle Meta ammonia units save error
//                 if (metaAmmoniaUnitsGetErr) {
//                   return done(metaAmmoniaUnitsGetErr);
//                 }
//
//                 // Get Meta ammonia units list
//                 var metaAmmoniaUnits = metaAmmoniaUnitsGetRes.body;
//
//                 // Set assertions
//                 (metaAmmoniaUnits[0].user._id).should.equal(userId);
//                 (metaAmmoniaUnits[0].name).should.match('Meta ammonia unit name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta ammonia unit if not logged in', function (done) {
//     agent.post('/api/metaAmmoniaUnits')
//       .send(metaAmmoniaUnit)
//       .expect(403)
//       .end(function (metaAmmoniaUnitSaveErr, metaAmmoniaUnitSaveRes) {
//         // Call the assertion callback
//         done(metaAmmoniaUnitSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta ammonia unit if no name is provided', function (done) {
//     // Invalidate name field
//     metaAmmoniaUnit.name = '';
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
//         // Save a new Meta ammonia unit
//         agent.post('/api/metaAmmoniaUnits')
//           .send(metaAmmoniaUnit)
//           .expect(400)
//           .end(function (metaAmmoniaUnitSaveErr, metaAmmoniaUnitSaveRes) {
//             // Set message assertion
//             (metaAmmoniaUnitSaveRes.body.message).should.match('Please fill Meta ammonia unit name');
//
//             // Handle Meta ammonia unit save error
//             done(metaAmmoniaUnitSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta ammonia unit if signed in', function (done) {
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
//         // Save a new Meta ammonia unit
//         agent.post('/api/metaAmmoniaUnits')
//           .send(metaAmmoniaUnit)
//           .expect(200)
//           .end(function (metaAmmoniaUnitSaveErr, metaAmmoniaUnitSaveRes) {
//             // Handle Meta ammonia unit save error
//             if (metaAmmoniaUnitSaveErr) {
//               return done(metaAmmoniaUnitSaveErr);
//             }
//
//             // Update Meta ammonia unit name
//             metaAmmoniaUnit.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta ammonia unit
//             agent.put('/api/metaAmmoniaUnits/' + metaAmmoniaUnitSaveRes.body._id)
//               .send(metaAmmoniaUnit)
//               .expect(200)
//               .end(function (metaAmmoniaUnitUpdateErr, metaAmmoniaUnitUpdateRes) {
//                 // Handle Meta ammonia unit update error
//                 if (metaAmmoniaUnitUpdateErr) {
//                   return done(metaAmmoniaUnitUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaAmmoniaUnitUpdateRes.body._id).should.equal(metaAmmoniaUnitSaveRes.body._id);
//                 (metaAmmoniaUnitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta ammonia units if not signed in', function (done) {
//     // Create new Meta ammonia unit model instance
//     var metaAmmoniaUnitObj = new MetaAmmoniaUnit(metaAmmoniaUnit);
//
//     // Save the metaAmmoniaUnit
//     metaAmmoniaUnitObj.save(function () {
//       // Request Meta ammonia units
//       request(app).get('/api/metaAmmoniaUnits')
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
//   it('should be able to get a single Meta ammonia unit if not signed in', function (done) {
//     // Create new Meta ammonia unit model instance
//     var metaAmmoniaUnitObj = new MetaAmmoniaUnit(metaAmmoniaUnit);
//
//     // Save the Meta ammonia unit
//     metaAmmoniaUnitObj.save(function () {
//       request(app).get('/api/metaAmmoniaUnits/' + metaAmmoniaUnitObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaAmmoniaUnit.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta ammonia unit with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaAmmoniaUnits/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta ammonia unit is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta ammonia unit which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta ammonia unit
//     request(app).get('/api/metaAmmoniaUnits/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta ammonia unit with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta ammonia unit if signed in', function (done) {
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
//         // Save a new Meta ammonia unit
//         agent.post('/api/metaAmmoniaUnits')
//           .send(metaAmmoniaUnit)
//           .expect(200)
//           .end(function (metaAmmoniaUnitSaveErr, metaAmmoniaUnitSaveRes) {
//             // Handle Meta ammonia unit save error
//             if (metaAmmoniaUnitSaveErr) {
//               return done(metaAmmoniaUnitSaveErr);
//             }
//
//             // Delete an existing Meta ammonia unit
//             agent.delete('/api/metaAmmoniaUnits/' + metaAmmoniaUnitSaveRes.body._id)
//               .send(metaAmmoniaUnit)
//               .expect(200)
//               .end(function (metaAmmoniaUnitDeleteErr, metaAmmoniaUnitDeleteRes) {
//                 // Handle metaAmmoniaUnit error error
//                 if (metaAmmoniaUnitDeleteErr) {
//                   return done(metaAmmoniaUnitDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaAmmoniaUnitDeleteRes.body._id).should.equal(metaAmmoniaUnitSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta ammonia unit if not signed in', function (done) {
//     // Set Meta ammonia unit user
//     metaAmmoniaUnit.user = user;
//
//     // Create new Meta ammonia unit model instance
//     var metaAmmoniaUnitObj = new MetaAmmoniaUnit(metaAmmoniaUnit);
//
//     // Save the Meta ammonia unit
//     metaAmmoniaUnitObj.save(function () {
//       // Try deleting Meta ammonia unit
//       request(app).delete('/api/metaAmmoniaUnits/' + metaAmmoniaUnitObj._id)
//         .expect(403)
//         .end(function (metaAmmoniaUnitDeleteErr, metaAmmoniaUnitDeleteRes) {
//           // Set message assertion
//           (metaAmmoniaUnitDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta ammonia unit error error
//           done(metaAmmoniaUnitDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta ammonia unit that has an orphaned user reference', function (done) {
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
//           // Save a new Meta ammonia unit
//           agent.post('/api/metaAmmoniaUnits')
//             .send(metaAmmoniaUnit)
//             .expect(200)
//             .end(function (metaAmmoniaUnitSaveErr, metaAmmoniaUnitSaveRes) {
//               // Handle Meta ammonia unit save error
//               if (metaAmmoniaUnitSaveErr) {
//                 return done(metaAmmoniaUnitSaveErr);
//               }
//
//               // Set assertions on new Meta ammonia unit
//               (metaAmmoniaUnitSaveRes.body.name).should.equal(metaAmmoniaUnit.name);
//               should.exist(metaAmmoniaUnitSaveRes.body.user);
//               should.equal(metaAmmoniaUnitSaveRes.body.user._id, orphanId);
//
//               // force the Meta ammonia unit to have an orphaned user reference
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
//                     // Get the Meta ammonia unit
//                     agent.get('/api/metaAmmoniaUnits/' + metaAmmoniaUnitSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaAmmoniaUnitInfoErr, metaAmmoniaUnitInfoRes) {
//                         // Handle Meta ammonia unit error
//                         if (metaAmmoniaUnitInfoErr) {
//                           return done(metaAmmoniaUnitInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaAmmoniaUnitInfoRes.body._id).should.equal(metaAmmoniaUnitSaveRes.body._id);
//                         (metaAmmoniaUnitInfoRes.body.name).should.equal(metaAmmoniaUnit.name);
//                         should.equal(metaAmmoniaUnitInfoRes.body.user, undefined);
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
//       MetaAmmoniaUnit.remove().exec(done);
//     });
//   });
// });
