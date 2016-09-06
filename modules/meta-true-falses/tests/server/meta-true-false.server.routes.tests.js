// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaTrueFalse = mongoose.model('MetaTrueFalse'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaTrueFalse;
//
// /**
//  * Meta true false routes tests
//  */
// describe('Meta true false CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta true false
//     user.save(function () {
//       metaTrueFalse = {
//         name: 'Meta true false name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta true false if logged in', function (done) {
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
//         // Save a new Meta true false
//         agent.post('/api/metaTrueFalses')
//           .send(metaTrueFalse)
//           .expect(200)
//           .end(function (metaTrueFalseSaveErr, metaTrueFalseSaveRes) {
//             // Handle Meta true false save error
//             if (metaTrueFalseSaveErr) {
//               return done(metaTrueFalseSaveErr);
//             }
//
//             // Get a list of Meta true falses
//             agent.get('/api/metaTrueFalses')
//               .end(function (metaTrueFalsesGetErr, metaTrueFalsesGetRes) {
//                 // Handle Meta true falses save error
//                 if (metaTrueFalsesGetErr) {
//                   return done(metaTrueFalsesGetErr);
//                 }
//
//                 // Get Meta true falses list
//                 var metaTrueFalses = metaTrueFalsesGetRes.body;
//
//                 // Set assertions
//                 (metaTrueFalses[0].user._id).should.equal(userId);
//                 (metaTrueFalses[0].name).should.match('Meta true false name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta true false if not logged in', function (done) {
//     agent.post('/api/metaTrueFalses')
//       .send(metaTrueFalse)
//       .expect(403)
//       .end(function (metaTrueFalseSaveErr, metaTrueFalseSaveRes) {
//         // Call the assertion callback
//         done(metaTrueFalseSaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta true false if no name is provided', function (done) {
//     // Invalidate name field
//     metaTrueFalse.name = '';
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
//         // Save a new Meta true false
//         agent.post('/api/metaTrueFalses')
//           .send(metaTrueFalse)
//           .expect(400)
//           .end(function (metaTrueFalseSaveErr, metaTrueFalseSaveRes) {
//             // Set message assertion
//             (metaTrueFalseSaveRes.body.message).should.match('Please fill Meta true false name');
//
//             // Handle Meta true false save error
//             done(metaTrueFalseSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta true false if signed in', function (done) {
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
//         // Save a new Meta true false
//         agent.post('/api/metaTrueFalses')
//           .send(metaTrueFalse)
//           .expect(200)
//           .end(function (metaTrueFalseSaveErr, metaTrueFalseSaveRes) {
//             // Handle Meta true false save error
//             if (metaTrueFalseSaveErr) {
//               return done(metaTrueFalseSaveErr);
//             }
//
//             // Update Meta true false name
//             metaTrueFalse.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta true false
//             agent.put('/api/metaTrueFalses/' + metaTrueFalseSaveRes.body._id)
//               .send(metaTrueFalse)
//               .expect(200)
//               .end(function (metaTrueFalseUpdateErr, metaTrueFalseUpdateRes) {
//                 // Handle Meta true false update error
//                 if (metaTrueFalseUpdateErr) {
//                   return done(metaTrueFalseUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaTrueFalseUpdateRes.body._id).should.equal(metaTrueFalseSaveRes.body._id);
//                 (metaTrueFalseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta true falses if not signed in', function (done) {
//     // Create new Meta true false model instance
//     var metaTrueFalseObj = new MetaTrueFalse(metaTrueFalse);
//
//     // Save the metaTrueFalse
//     metaTrueFalseObj.save(function () {
//       // Request Meta true falses
//       request(app).get('/api/metaTrueFalses')
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
//   it('should be able to get a single Meta true false if not signed in', function (done) {
//     // Create new Meta true false model instance
//     var metaTrueFalseObj = new MetaTrueFalse(metaTrueFalse);
//
//     // Save the Meta true false
//     metaTrueFalseObj.save(function () {
//       request(app).get('/api/metaTrueFalses/' + metaTrueFalseObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaTrueFalse.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta true false with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaTrueFalses/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta true false is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta true false which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta true false
//     request(app).get('/api/metaTrueFalses/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta true false with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta true false if signed in', function (done) {
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
//         // Save a new Meta true false
//         agent.post('/api/metaTrueFalses')
//           .send(metaTrueFalse)
//           .expect(200)
//           .end(function (metaTrueFalseSaveErr, metaTrueFalseSaveRes) {
//             // Handle Meta true false save error
//             if (metaTrueFalseSaveErr) {
//               return done(metaTrueFalseSaveErr);
//             }
//
//             // Delete an existing Meta true false
//             agent.delete('/api/metaTrueFalses/' + metaTrueFalseSaveRes.body._id)
//               .send(metaTrueFalse)
//               .expect(200)
//               .end(function (metaTrueFalseDeleteErr, metaTrueFalseDeleteRes) {
//                 // Handle metaTrueFalse error error
//                 if (metaTrueFalseDeleteErr) {
//                   return done(metaTrueFalseDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaTrueFalseDeleteRes.body._id).should.equal(metaTrueFalseSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta true false if not signed in', function (done) {
//     // Set Meta true false user
//     metaTrueFalse.user = user;
//
//     // Create new Meta true false model instance
//     var metaTrueFalseObj = new MetaTrueFalse(metaTrueFalse);
//
//     // Save the Meta true false
//     metaTrueFalseObj.save(function () {
//       // Try deleting Meta true false
//       request(app).delete('/api/metaTrueFalses/' + metaTrueFalseObj._id)
//         .expect(403)
//         .end(function (metaTrueFalseDeleteErr, metaTrueFalseDeleteRes) {
//           // Set message assertion
//           (metaTrueFalseDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta true false error error
//           done(metaTrueFalseDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta true false that has an orphaned user reference', function (done) {
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
//           // Save a new Meta true false
//           agent.post('/api/metaTrueFalses')
//             .send(metaTrueFalse)
//             .expect(200)
//             .end(function (metaTrueFalseSaveErr, metaTrueFalseSaveRes) {
//               // Handle Meta true false save error
//               if (metaTrueFalseSaveErr) {
//                 return done(metaTrueFalseSaveErr);
//               }
//
//               // Set assertions on new Meta true false
//               (metaTrueFalseSaveRes.body.name).should.equal(metaTrueFalse.name);
//               should.exist(metaTrueFalseSaveRes.body.user);
//               should.equal(metaTrueFalseSaveRes.body.user._id, orphanId);
//
//               // force the Meta true false to have an orphaned user reference
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
//                     // Get the Meta true false
//                     agent.get('/api/metaTrueFalses/' + metaTrueFalseSaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaTrueFalseInfoErr, metaTrueFalseInfoRes) {
//                         // Handle Meta true false error
//                         if (metaTrueFalseInfoErr) {
//                           return done(metaTrueFalseInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaTrueFalseInfoRes.body._id).should.equal(metaTrueFalseSaveRes.body._id);
//                         (metaTrueFalseInfoRes.body.name).should.equal(metaTrueFalse.name);
//                         should.equal(metaTrueFalseInfoRes.body.user, undefined);
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
//       MetaTrueFalse.remove().exec(done);
//     });
//   });
// });
