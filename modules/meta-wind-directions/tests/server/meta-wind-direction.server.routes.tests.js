// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaWindDirection = mongoose.model('MetaWindDirection'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaWindDirection;
//
// /**
//  * Meta wind direction routes tests
//  */
// describe('Meta wind direction CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta wind direction
//     user.save(function () {
//       metaWindDirection = {
//         name: 'Meta wind direction name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta wind direction if logged in', function (done) {
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
//         // Save a new Meta wind direction
//         agent.post('/api/metaWindDirections')
//           .send(metaWindDirection)
//           .expect(200)
//           .end(function (metaWindDirectionSaveErr, metaWindDirectionSaveRes) {
//             // Handle Meta wind direction save error
//             if (metaWindDirectionSaveErr) {
//               return done(metaWindDirectionSaveErr);
//             }
//
//             // Get a list of Meta wind directions
//             agent.get('/api/metaWindDirections')
//               .end(function (metaWindDirectionsGetErr, metaWindDirectionsGetRes) {
//                 // Handle Meta wind directions save error
//                 if (metaWindDirectionsGetErr) {
//                   return done(metaWindDirectionsGetErr);
//                 }
//
//                 // Get Meta wind directions list
//                 var metaWindDirections = metaWindDirectionsGetRes.body;
//
//                 // Set assertions
//                 (metaWindDirections[0].user._id).should.equal(userId);
//                 (metaWindDirections[0].name).should.match('Meta wind direction name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta wind direction if not logged in', function (done) {
//     agent.post('/api/metaWindDirections')
//       .send(metaWindDirection)
//       .expect(403)
//       .end(function (metaWindDirectionSaveErr, metaWindDirectionSaveRes) {
//         // Call the assertion callback
//         done(metaWindDirectionSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta wind direction if no name is provided', function (done) {
//     // Invalidate name field
//     metaWindDirection.name = '';
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
//         // Save a new Meta wind direction
//         agent.post('/api/metaWindDirections')
//           .send(metaWindDirection)
//           .expect(400)
//           .end(function (metaWindDirectionSaveErr, metaWindDirectionSaveRes) {
//             // Set message assertion
//             (metaWindDirectionSaveRes.body.message).should.match('Please fill Meta wind direction name');
//
//             // Handle Meta wind direction save error
//             done(metaWindDirectionSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta wind direction if signed in', function (done) {
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
//         // Save a new Meta wind direction
//         agent.post('/api/metaWindDirections')
//           .send(metaWindDirection)
//           .expect(200)
//           .end(function (metaWindDirectionSaveErr, metaWindDirectionSaveRes) {
//             // Handle Meta wind direction save error
//             if (metaWindDirectionSaveErr) {
//               return done(metaWindDirectionSaveErr);
//             }
//
//             // Update Meta wind direction name
//             metaWindDirection.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta wind direction
//             agent.put('/api/metaWindDirections/' + metaWindDirectionSaveRes.body._id)
//               .send(metaWindDirection)
//               .expect(200)
//               .end(function (metaWindDirectionUpdateErr, metaWindDirectionUpdateRes) {
//                 // Handle Meta wind direction update error
//                 if (metaWindDirectionUpdateErr) {
//                   return done(metaWindDirectionUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaWindDirectionUpdateRes.body._id).should.equal(metaWindDirectionSaveRes.body._id);
//                 (metaWindDirectionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta wind directions if not signed in', function (done) {
//     // Create new Meta wind direction model instance
//     var metaWindDirectionObj = new MetaWindDirection(metaWindDirection);
//
//     // Save the metaWindDirection
//     metaWindDirectionObj.save(function () {
//       // Request Meta wind directions
//       request(app).get('/api/metaWindDirections')
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
//   it('should be able to get a single Meta wind direction if not signed in', function (done) {
//     // Create new Meta wind direction model instance
//     var metaWindDirectionObj = new MetaWindDirection(metaWindDirection);
//
//     // Save the Meta wind direction
//     metaWindDirectionObj.save(function () {
//       request(app).get('/api/metaWindDirections/' + metaWindDirectionObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaWindDirection.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta wind direction with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaWindDirections/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta wind direction is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta wind direction which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta wind direction
//     request(app).get('/api/metaWindDirections/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta wind direction with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta wind direction if signed in', function (done) {
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
//         // Save a new Meta wind direction
//         agent.post('/api/metaWindDirections')
//           .send(metaWindDirection)
//           .expect(200)
//           .end(function (metaWindDirectionSaveErr, metaWindDirectionSaveRes) {
//             // Handle Meta wind direction save error
//             if (metaWindDirectionSaveErr) {
//               return done(metaWindDirectionSaveErr);
//             }
//
//             // Delete an existing Meta wind direction
//             agent.delete('/api/metaWindDirections/' + metaWindDirectionSaveRes.body._id)
//               .send(metaWindDirection)
//               .expect(200)
//               .end(function (metaWindDirectionDeleteErr, metaWindDirectionDeleteRes) {
//                 // Handle metaWindDirection error error
//                 if (metaWindDirectionDeleteErr) {
//                   return done(metaWindDirectionDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaWindDirectionDeleteRes.body._id).should.equal(metaWindDirectionSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta wind direction if not signed in', function (done) {
//     // Set Meta wind direction user
//     metaWindDirection.user = user;
//
//     // Create new Meta wind direction model instance
//     var metaWindDirectionObj = new MetaWindDirection(metaWindDirection);
//
//     // Save the Meta wind direction
//     metaWindDirectionObj.save(function () {
//       // Try deleting Meta wind direction
//       request(app).delete('/api/metaWindDirections/' + metaWindDirectionObj._id)
//         .expect(403)
//         .end(function (metaWindDirectionDeleteErr, metaWindDirectionDeleteRes) {
//           // Set message assertion
//           (metaWindDirectionDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta wind direction error error
//           done(metaWindDirectionDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta wind direction that has an orphaned user reference', function (done) {
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
//           // Save a new Meta wind direction
//           agent.post('/api/metaWindDirections')
//             .send(metaWindDirection)
//             .expect(200)
//             .end(function (metaWindDirectionSaveErr, metaWindDirectionSaveRes) {
//               // Handle Meta wind direction save error
//               if (metaWindDirectionSaveErr) {
//                 return done(metaWindDirectionSaveErr);
//               }
//
//               // Set assertions on new Meta wind direction
//               (metaWindDirectionSaveRes.body.name).should.equal(metaWindDirection.name);
//               should.exist(metaWindDirectionSaveRes.body.user);
//               should.equal(metaWindDirectionSaveRes.body.user._id, orphanId);
//
//               // force the Meta wind direction to have an orphaned user reference
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
//                     // Get the Meta wind direction
//                     agent.get('/api/metaWindDirections/' + metaWindDirectionSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaWindDirectionInfoErr, metaWindDirectionInfoRes) {
//                         // Handle Meta wind direction error
//                         if (metaWindDirectionInfoErr) {
//                           return done(metaWindDirectionInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaWindDirectionInfoRes.body._id).should.equal(metaWindDirectionSaveRes.body._id);
//                         (metaWindDirectionInfoRes.body.name).should.equal(metaWindDirection.name);
//                         should.equal(metaWindDirectionInfoRes.body.user, undefined);
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
//       MetaWindDirection.remove().exec(done);
//     });
//   });
// });
