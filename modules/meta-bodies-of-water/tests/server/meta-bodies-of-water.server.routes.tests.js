// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaBodiesOfWater = mongoose.model('MetaBodiesOfWater'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaBodiesOfWater;
//
// /**
//  * Meta bodies of water routes tests
//  */
// describe('Meta bodies of water CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta bodies of water
//     user.save(function () {
//       metaBodiesOfWater = {
//         name: 'Meta bodies of water name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta bodies of water if logged in', function (done) {
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
//         // Save a new Meta bodies of water
//         agent.post('/api/metaBodiesOfWaters')
//           .send(metaBodiesOfWater)
//           .expect(200)
//           .end(function (metaBodiesOfWaterSaveErr, metaBodiesOfWaterSaveRes) {
//             // Handle Meta bodies of water save error
//             if (metaBodiesOfWaterSaveErr) {
//               return done(metaBodiesOfWaterSaveErr);
//             }
//
//             // Get a list of Meta bodies of waters
//             agent.get('/api/metaBodiesOfWaters')
//               .end(function (metaBodiesOfWatersGetErr, metaBodiesOfWatersGetRes) {
//                 // Handle Meta bodies of waters save error
//                 if (metaBodiesOfWatersGetErr) {
//                   return done(metaBodiesOfWatersGetErr);
//                 }
//
//                 // Get Meta bodies of waters list
//                 var metaBodiesOfWaters = metaBodiesOfWatersGetRes.body;
//
//                 // Set assertions
//                 (metaBodiesOfWaters[0].user._id).should.equal(userId);
//                 (metaBodiesOfWaters[0].name).should.match('Meta bodies of water name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta bodies of water if not logged in', function (done) {
//     agent.post('/api/metaBodiesOfWaters')
//       .send(metaBodiesOfWater)
//       .expect(403)
//       .end(function (metaBodiesOfWaterSaveErr, metaBodiesOfWaterSaveRes) {
//         // Call the assertion callback
//         done(metaBodiesOfWaterSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta bodies of water if no name is provided', function (done) {
//     // Invalidate name field
//     metaBodiesOfWater.name = '';
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
//         // Save a new Meta bodies of water
//         agent.post('/api/metaBodiesOfWaters')
//           .send(metaBodiesOfWater)
//           .expect(400)
//           .end(function (metaBodiesOfWaterSaveErr, metaBodiesOfWaterSaveRes) {
//             // Set message assertion
//             (metaBodiesOfWaterSaveRes.body.message).should.match('Please fill Meta bodies of water name');
//
//             // Handle Meta bodies of water save error
//             done(metaBodiesOfWaterSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta bodies of water if signed in', function (done) {
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
//         // Save a new Meta bodies of water
//         agent.post('/api/metaBodiesOfWaters')
//           .send(metaBodiesOfWater)
//           .expect(200)
//           .end(function (metaBodiesOfWaterSaveErr, metaBodiesOfWaterSaveRes) {
//             // Handle Meta bodies of water save error
//             if (metaBodiesOfWaterSaveErr) {
//               return done(metaBodiesOfWaterSaveErr);
//             }
//
//             // Update Meta bodies of water name
//             metaBodiesOfWater.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta bodies of water
//             agent.put('/api/metaBodiesOfWaters/' + metaBodiesOfWaterSaveRes.body._id)
//               .send(metaBodiesOfWater)
//               .expect(200)
//               .end(function (metaBodiesOfWaterUpdateErr, metaBodiesOfWaterUpdateRes) {
//                 // Handle Meta bodies of water update error
//                 if (metaBodiesOfWaterUpdateErr) {
//                   return done(metaBodiesOfWaterUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaBodiesOfWaterUpdateRes.body._id).should.equal(metaBodiesOfWaterSaveRes.body._id);
//                 (metaBodiesOfWaterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta bodies of waters if not signed in', function (done) {
//     // Create new Meta bodies of water model instance
//     var metaBodiesOfWaterObj = new MetaBodiesOfWater(metaBodiesOfWater);
//
//     // Save the metaBodiesOfWater
//     metaBodiesOfWaterObj.save(function () {
//       // Request Meta bodies of waters
//       request(app).get('/api/metaBodiesOfWaters')
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
//   it('should be able to get a single Meta bodies of water if not signed in', function (done) {
//     // Create new Meta bodies of water model instance
//     var metaBodiesOfWaterObj = new MetaBodiesOfWater(metaBodiesOfWater);
//
//     // Save the Meta bodies of water
//     metaBodiesOfWaterObj.save(function () {
//       request(app).get('/api/metaBodiesOfWaters/' + metaBodiesOfWaterObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaBodiesOfWater.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta bodies of water with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaBodiesOfWaters/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta bodies of water is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta bodies of water which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta bodies of water
//     request(app).get('/api/metaBodiesOfWaters/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta bodies of water with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta bodies of water if signed in', function (done) {
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
//         // Save a new Meta bodies of water
//         agent.post('/api/metaBodiesOfWaters')
//           .send(metaBodiesOfWater)
//           .expect(200)
//           .end(function (metaBodiesOfWaterSaveErr, metaBodiesOfWaterSaveRes) {
//             // Handle Meta bodies of water save error
//             if (metaBodiesOfWaterSaveErr) {
//               return done(metaBodiesOfWaterSaveErr);
//             }
//
//             // Delete an existing Meta bodies of water
//             agent.delete('/api/metaBodiesOfWaters/' + metaBodiesOfWaterSaveRes.body._id)
//               .send(metaBodiesOfWater)
//               .expect(200)
//               .end(function (metaBodiesOfWaterDeleteErr, metaBodiesOfWaterDeleteRes) {
//                 // Handle metaBodiesOfWater error error
//                 if (metaBodiesOfWaterDeleteErr) {
//                   return done(metaBodiesOfWaterDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaBodiesOfWaterDeleteRes.body._id).should.equal(metaBodiesOfWaterSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta bodies of water if not signed in', function (done) {
//     // Set Meta bodies of water user
//     metaBodiesOfWater.user = user;
//
//     // Create new Meta bodies of water model instance
//     var metaBodiesOfWaterObj = new MetaBodiesOfWater(metaBodiesOfWater);
//
//     // Save the Meta bodies of water
//     metaBodiesOfWaterObj.save(function () {
//       // Try deleting Meta bodies of water
//       request(app).delete('/api/metaBodiesOfWaters/' + metaBodiesOfWaterObj._id)
//         .expect(403)
//         .end(function (metaBodiesOfWaterDeleteErr, metaBodiesOfWaterDeleteRes) {
//           // Set message assertion
//           (metaBodiesOfWaterDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta bodies of water error error
//           done(metaBodiesOfWaterDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta bodies of water that has an orphaned user reference', function (done) {
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
//           // Save a new Meta bodies of water
//           agent.post('/api/metaBodiesOfWaters')
//             .send(metaBodiesOfWater)
//             .expect(200)
//             .end(function (metaBodiesOfWaterSaveErr, metaBodiesOfWaterSaveRes) {
//               // Handle Meta bodies of water save error
//               if (metaBodiesOfWaterSaveErr) {
//                 return done(metaBodiesOfWaterSaveErr);
//               }
//
//               // Set assertions on new Meta bodies of water
//               (metaBodiesOfWaterSaveRes.body.name).should.equal(metaBodiesOfWater.name);
//               should.exist(metaBodiesOfWaterSaveRes.body.user);
//               should.equal(metaBodiesOfWaterSaveRes.body.user._id, orphanId);
//
//               // force the Meta bodies of water to have an orphaned user reference
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
//                     // Get the Meta bodies of water
//                     agent.get('/api/metaBodiesOfWaters/' + metaBodiesOfWaterSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaBodiesOfWaterInfoErr, metaBodiesOfWaterInfoRes) {
//                         // Handle Meta bodies of water error
//                         if (metaBodiesOfWaterInfoErr) {
//                           return done(metaBodiesOfWaterInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaBodiesOfWaterInfoRes.body._id).should.equal(metaBodiesOfWaterSaveRes.body._id);
//                         (metaBodiesOfWaterInfoRes.body.name).should.equal(metaBodiesOfWater.name);
//                         should.equal(metaBodiesOfWaterInfoRes.body.user, undefined);
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
//       MetaBodiesOfWater.remove().exec(done);
//     });
//   });
// });
