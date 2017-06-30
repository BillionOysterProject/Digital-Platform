// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   Research = mongoose.model('Research'),
//   express = require(path.resolve('./config/lib/express')),
//   async = require('async');
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   research;
//
// /**
//  * Research routes tests
//  */
// describe('Research CRUD tests', function () {
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
//     // Save a user to the test db and create new Research
//     user.save(function () {
//       research = {
//         name: 'Research name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Research if logged in', function (done) {
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
//         // Save a new Research
//         agent.post('/api/researches')
//           .send(research)
//           .expect(200)
//           .end(function (researchSaveErr, researchSaveRes) {
//             // Handle Research save error
//             if (researchSaveErr) {
//               return done(researchSaveErr);
//             }
//
//             // Get a list of Researches
//             agent.get('/api/researches')
//               .end(function (researchesGetErr, researchesGetRes) {
//                 // Handle Researches save error
//                 if (researchesGetErr) {
//                   return done(researchesGetErr);
//                 }
//
//                 // Get Researches list
//                 var researches = researchesGetRes.body;
//
//                 // Set assertions
//                 (researches[0].user._id).should.equal(userId);
//                 (researches[0].name).should.match('Research name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Research if not logged in', function (done) {
//     agent.post('/api/researches')
//       .send(research)
//       .expect(403)
//       .end(function (researchSaveErr, researchSaveRes) {
//         // Call the assertion callback
//         done(researchSaveErr);
//       });
//   });
//
//   it('should not be able to save an Research if no name is provided', function (done) {
//     // Invalidate name field
//     research.name = '';
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
//         // Save a new Research
//         agent.post('/api/researches')
//           .send(research)
//           .expect(400)
//           .end(function (researchSaveErr, researchSaveRes) {
//             // Set message assertion
//             (researchSaveRes.body.message).should.match('Please fill Research name');
//
//             // Handle Research save error
//             done(researchSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Research if signed in', function (done) {
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
//         // Save a new Research
//         agent.post('/api/researches')
//           .send(research)
//           .expect(200)
//           .end(function (researchSaveErr, researchSaveRes) {
//             // Handle Research save error
//             if (researchSaveErr) {
//               return done(researchSaveErr);
//             }
//
//             // Update Research name
//             research.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Research
//             agent.put('/api/researches/' + researchSaveRes.body._id)
//               .send(research)
//               .expect(200)
//               .end(function (researchUpdateErr, researchUpdateRes) {
//                 // Handle Research update error
//                 if (researchUpdateErr) {
//                   return done(researchUpdateErr);
//                 }
//
//                 // Set assertions
//                 (researchUpdateRes.body._id).should.equal(researchSaveRes.body._id);
//                 (researchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Researches if not signed in', function (done) {
//     // Create new Research model instance
//     var researchObj = new Research(research);
//
//     // Save the research
//     researchObj.save(function () {
//       // Request Researches
//       request(app).get('/api/researches')
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
//   it('should be able to get a single Research if not signed in', function (done) {
//     // Create new Research model instance
//     var researchObj = new Research(research);
//
//     // Save the Research
//     researchObj.save(function () {
//       request(app).get('/api/researches/' + researchObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', research.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Research with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/researches/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Research is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Research which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Research
//     request(app).get('/api/researches/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Research with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Research if signed in', function (done) {
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
//         // Save a new Research
//         agent.post('/api/researches')
//           .send(research)
//           .expect(200)
//           .end(function (researchSaveErr, researchSaveRes) {
//             // Handle Research save error
//             if (researchSaveErr) {
//               return done(researchSaveErr);
//             }
//
//             // Delete an existing Research
//             agent.delete('/api/researches/' + researchSaveRes.body._id)
//               .send(research)
//               .expect(200)
//               .end(function (researchDeleteErr, researchDeleteRes) {
//                 // Handle research error error
//                 if (researchDeleteErr) {
//                   return done(researchDeleteErr);
//                 }
//
//                 // Set assertions
//                 (researchDeleteRes.body._id).should.equal(researchSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Research if not signed in', function (done) {
//     // Set Research user
//     research.user = user;
//
//     // Create new Research model instance
//     var researchObj = new Research(research);
//
//     // Save the Research
//     researchObj.save(function () {
//       // Try deleting Research
//       request(app).delete('/api/researches/' + researchObj._id)
//         .expect(403)
//         .end(function (researchDeleteErr, researchDeleteRes) {
//           // Set message assertion
//           (researchDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Research error error
//           done(researchDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Research that has an orphaned user reference', function (done) {
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
//           // Save a new Research
//           agent.post('/api/researches')
//             .send(research)
//             .expect(200)
//             .end(function (researchSaveErr, researchSaveRes) {
//               // Handle Research save error
//               if (researchSaveErr) {
//                 return done(researchSaveErr);
//               }
//
//               // Set assertions on new Research
//               (researchSaveRes.body.name).should.equal(research.name);
//               should.exist(researchSaveRes.body.user);
//               should.equal(researchSaveRes.body.user._id, orphanId);
//
//               // force the Research to have an orphaned user reference
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
//                     // Get the Research
//                     agent.get('/api/researches/' + researchSaveRes.body._id)
//                       .expect(200)
//                       .end(function (researchInfoErr, researchInfoRes) {
//                         // Handle Research error
//                         if (researchInfoErr) {
//                           return done(researchInfoErr);
//                         }
//
//                         // Set assertions
//                         (researchInfoRes.body._id).should.equal(researchSaveRes.body._id);
//                         (researchInfoRes.body.name).should.equal(research.name);
//                         should.equal(researchInfoRes.body.user, undefined);
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
//     Research.find({ 'title': research.title }).exec(function(err, researches) {
//       async.forEach(researches, function(research, callback) {
//         research.remove().exec(function() {
//           callback();
//         });
//       }, function(err) {
//         done();
//       });
//     });
//   });
// });
