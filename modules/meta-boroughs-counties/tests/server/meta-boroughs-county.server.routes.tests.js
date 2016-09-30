// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   MetaBoroughsCounty = mongoose.model('MetaBoroughsCounty'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   credentials,
//   user,
//   metaBoroughsCounty;
//
// /**
//  * Meta boroughs county routes tests
//  */
// describe('Meta boroughs county CRUD tests', function () {
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
//     // Save a user to the test db and create new Meta boroughs county
//     user.save(function () {
//       metaBoroughsCounty = {
//         name: 'Meta boroughs county name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Meta boroughs county if logged in', function (done) {
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
//         // Save a new Meta boroughs county
//         agent.post('/api/metaBoroughsCounties')
//           .send(metaBoroughsCounty)
//           .expect(200)
//           .end(function (metaBoroughsCountySaveErr, metaBoroughsCountySaveRes) {
//             // Handle Meta boroughs county save error
//             if (metaBoroughsCountySaveErr) {
//               return done(metaBoroughsCountySaveErr);
//             }
//
//             // Get a list of Meta boroughs counties
//             agent.get('/api/metaBoroughsCounties')
//               .end(function (metaBoroughsCountiesGetErr, metaBoroughsCountiesGetRes) {
//                 // Handle Meta boroughs counties save error
//                 if (metaBoroughsCountiesGetErr) {
//                   return done(metaBoroughsCountiesGetErr);
//                 }
//
//                 // Get Meta boroughs counties list
//                 var metaBoroughsCounties = metaBoroughsCountiesGetRes.body;
//
//                 // Set assertions
//                 (metaBoroughsCounties[0].user._id).should.equal(userId);
//                 (metaBoroughsCounties[0].name).should.match('Meta boroughs county name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Meta boroughs county if not logged in', function (done) {
//     agent.post('/api/metaBoroughsCounties')
//       .send(metaBoroughsCounty)
//       .expect(403)
//       .end(function (metaBoroughsCountySaveErr, metaBoroughsCountySaveRes) {
//         // Call the assertion callback
//         done(metaBoroughsCountySaveErr);
//       });
//   });
//
//   it('should not be able to save an Meta boroughs county if no name is provided', function (done) {
//     // Invalidate name field
//     metaBoroughsCounty.name = '';
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
//         // Save a new Meta boroughs county
//         agent.post('/api/metaBoroughsCounties')
//           .send(metaBoroughsCounty)
//           .expect(400)
//           .end(function (metaBoroughsCountySaveErr, metaBoroughsCountySaveRes) {
//             // Set message assertion
//             (metaBoroughsCountySaveRes.body.message).should.match('Please fill Meta boroughs county name');
//
//             // Handle Meta boroughs county save error
//             done(metaBoroughsCountySaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Meta boroughs county if signed in', function (done) {
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
//         // Save a new Meta boroughs county
//         agent.post('/api/metaBoroughsCounties')
//           .send(metaBoroughsCounty)
//           .expect(200)
//           .end(function (metaBoroughsCountySaveErr, metaBoroughsCountySaveRes) {
//             // Handle Meta boroughs county save error
//             if (metaBoroughsCountySaveErr) {
//               return done(metaBoroughsCountySaveErr);
//             }
//
//             // Update Meta boroughs county name
//             metaBoroughsCounty.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Meta boroughs county
//             agent.put('/api/metaBoroughsCounties/' + metaBoroughsCountySaveRes.body._id)
//               .send(metaBoroughsCounty)
//               .expect(200)
//               .end(function (metaBoroughsCountyUpdateErr, metaBoroughsCountyUpdateRes) {
//                 // Handle Meta boroughs county update error
//                 if (metaBoroughsCountyUpdateErr) {
//                   return done(metaBoroughsCountyUpdateErr);
//                 }
//
//                 // Set assertions
//                 (metaBoroughsCountyUpdateRes.body._id).should.equal(metaBoroughsCountySaveRes.body._id);
//                 (metaBoroughsCountyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Meta boroughs counties if not signed in', function (done) {
//     // Create new Meta boroughs county model instance
//     var metaBoroughsCountyObj = new MetaBoroughsCounty(metaBoroughsCounty);
//
//     // Save the metaBoroughsCounty
//     metaBoroughsCountyObj.save(function () {
//       // Request Meta boroughs counties
//       request(app).get('/api/metaBoroughsCounties')
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
//   it('should be able to get a single Meta boroughs county if not signed in', function (done) {
//     // Create new Meta boroughs county model instance
//     var metaBoroughsCountyObj = new MetaBoroughsCounty(metaBoroughsCounty);
//
//     // Save the Meta boroughs county
//     metaBoroughsCountyObj.save(function () {
//       request(app).get('/api/metaBoroughsCounties/' + metaBoroughsCountyObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', metaBoroughsCounty.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Meta boroughs county with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/metaBoroughsCounties/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Meta boroughs county is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Meta boroughs county which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Meta boroughs county
//     request(app).get('/api/metaBoroughsCounties/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Meta boroughs county with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Meta boroughs county if signed in', function (done) {
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
//         // Save a new Meta boroughs county
//         agent.post('/api/metaBoroughsCounties')
//           .send(metaBoroughsCounty)
//           .expect(200)
//           .end(function (metaBoroughsCountySaveErr, metaBoroughsCountySaveRes) {
//             // Handle Meta boroughs county save error
//             if (metaBoroughsCountySaveErr) {
//               return done(metaBoroughsCountySaveErr);
//             }
//
//             // Delete an existing Meta boroughs county
//             agent.delete('/api/metaBoroughsCounties/' + metaBoroughsCountySaveRes.body._id)
//               .send(metaBoroughsCounty)
//               .expect(200)
//               .end(function (metaBoroughsCountyDeleteErr, metaBoroughsCountyDeleteRes) {
//                 // Handle metaBoroughsCounty error error
//                 if (metaBoroughsCountyDeleteErr) {
//                   return done(metaBoroughsCountyDeleteErr);
//                 }
//
//                 // Set assertions
//                 (metaBoroughsCountyDeleteRes.body._id).should.equal(metaBoroughsCountySaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Meta boroughs county if not signed in', function (done) {
//     // Set Meta boroughs county user
//     metaBoroughsCounty.user = user;
//
//     // Create new Meta boroughs county model instance
//     var metaBoroughsCountyObj = new MetaBoroughsCounty(metaBoroughsCounty);
//
//     // Save the Meta boroughs county
//     metaBoroughsCountyObj.save(function () {
//       // Try deleting Meta boroughs county
//       request(app).delete('/api/metaBoroughsCounties/' + metaBoroughsCountyObj._id)
//         .expect(403)
//         .end(function (metaBoroughsCountyDeleteErr, metaBoroughsCountyDeleteRes) {
//           // Set message assertion
//           (metaBoroughsCountyDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Meta boroughs county error error
//           done(metaBoroughsCountyDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Meta boroughs county that has an orphaned user reference', function (done) {
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
//           // Save a new Meta boroughs county
//           agent.post('/api/metaBoroughsCounties')
//             .send(metaBoroughsCounty)
//             .expect(200)
//             .end(function (metaBoroughsCountySaveErr, metaBoroughsCountySaveRes) {
//               // Handle Meta boroughs county save error
//               if (metaBoroughsCountySaveErr) {
//                 return done(metaBoroughsCountySaveErr);
//               }
//
//               // Set assertions on new Meta boroughs county
//               (metaBoroughsCountySaveRes.body.name).should.equal(metaBoroughsCounty.name);
//               should.exist(metaBoroughsCountySaveRes.body.user);
//               should.equal(metaBoroughsCountySaveRes.body.user._id, orphanId);
//
//               // force the Meta boroughs county to have an orphaned user reference
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
//                     // Get the Meta boroughs county
//                     agent.get('/api/metaBoroughsCounties/' + metaBoroughsCountySaveRes.body._id)
//                       .expect(200)
//                       .end(function (metaBoroughsCountyInfoErr, metaBoroughsCountyInfoRes) {
//                         // Handle Meta boroughs county error
//                         if (metaBoroughsCountyInfoErr) {
//                           return done(metaBoroughsCountyInfoErr);
//                         }
//
//                         // Set assertions
//                         (metaBoroughsCountyInfoRes.body._id).should.equal(metaBoroughsCountySaveRes.body._id);
//                         (metaBoroughsCountyInfoRes.body.name).should.equal(metaBoroughsCounty.name);
//                         should.equal(metaBoroughsCountyInfoRes.body.user, undefined);
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
//       MetaBoroughsCounty.remove().exec(done);
//     });
//   });
// });
