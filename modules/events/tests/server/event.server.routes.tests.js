// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   moment = require('moment'),
//   User = mongoose.model('User'),
//   CalendarEvent = mongoose.model('CalendarEvent'),
//   express = require(path.resolve('./config/lib/express')),
//   CommonUser = require('../../../users/tests/e2e/common-users.e2e.tests');
//
// var admin = CommonUser.admin;
// var leader = CommonUser.leader;
// var member1 = CommonUser.member1;
// var member2 = CommonUser.member2;
// var team = CommonUser.team;
// var organization = CommonUser.organization;
// var station = CommonUser.station;
// var station2 = CommonUser.station2;
//
// /**
//  * Globals
//  */
// var app,
//   agent,
//   user,
//   credentials,
//   calendarEvent;
//
// /**
//  * Calendar Event routes tests
//  */
// describe('Calendar Event CRUD tests', function () {
//
//   before(function (done) {
//
//     credentials = {
//       username: admin.username,
//       password: admin.password
//     };
//
//     done();
//   });
//
//   beforeEach(function(done) {
//     // Get application
//     app = express.init(mongoose);
//     agent = request.agent(app);
//
//     User.findOne({ 'username': admin.username }).exec(function(err, adminUser) {
//       should.not.exist(err);
//
//       user = adminUser;
//       calendarEvent = {
//         title: 'Calendar Event',
//         dates: [{
//           startDateTime: moment().toDate(),
//           endDateTime: moment().toDate()
//         }],
//         category: {
//           type: 'field training',
//         },
//         deadlineToRegister: moment().toDate(),
//         location: {
//           addressString: '123 Main St, New York, New York',
//           latitude: 39.765,
//           longitude: -76.234
//         },
//         cost: '$100 donation',
//         maximumCapacity: 40,
//         description: 'This is a test event',
//         skillsTaught: 'How to add an event',
//         featuredImage: {
//           originalname: 'someimage.png',
//           mimetype: 'image/png',
//           filename: '1234567890.png',
//           path: 'aws.com/1234567890.png'
//         },
//         resources: {
//           resourcesLinks: [{
//             name: 'Link Resource 1',
//             link: 'www.resource.com/resource1'
//           }],
//           resourcesFiles: [{
//             originalname: 'resourcefile.pdf',
//             mimetype: 'application/pdf',
//             filename: '0987654321.pdf',
//             path: 'aws.com/0987654321.pdf'
//           }]
//         },
//         user: user
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Calendar Event if logged in', function (done) {
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
//         // Save a new Calendar Event
//         agent.post('/api/events')
//           .send(calendarEvent)
//           .expect(200)
//           .end(function (eventSaveErr, eventSaveRes) {
//             // Handle Calendar Event save error
//             if (eventSaveErr) {
//               return done(eventSaveErr);
//             }
//
//             // Get a list of Calendar Events
//             agent.get('/api/events')
//               .end(function (eventsGetErr, eventsGetRes) {
//                 // Handle Calendar Events save error
//                 if (eventsGetErr) {
//                   return done(eventsGetErr);
//                 }
//
//                 // Get Calendar Events list
//                 var events = eventsGetRes.body;
//
//                 // Set assertions
//                 (events[0].user._id).should.equal(userId);
//                 (events[0].title).should.match('Calendar Event');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Calendar Event if not logged in', function (done) {
//     agent.post('/api/events')
//       .send(calendarEvent)
//       .expect(403)
//       .end(function (eventSaveErr, eventSaveRes) {
//         // Call the assertion callback
//         done(eventSaveErr);
//       });
//   });
//
//   it('should not be able to save an Calendar Event if no title is provided', function (done) {
//     // Invalidate title field
//     calendarEvent.title = '';
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
//         // Save a new Calendar Event
//         agent.post('/api/events')
//           .send(calendarEvent)
//           .expect(400)
//           .end(function (eventSaveErr, eventSaveRes) {
//             // Set message assertion
//             (eventSaveRes.body.message).should.match('Please fill in Event title');
//
//             // Handle Calendar Event save error
//             done(eventSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Calendar Event if signed in', function (done) {
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
//         // Save a new Calendar Event
//         agent.post('/api/events')
//           .send(calendarEvent)
//           .expect(200)
//           .end(function (eventSaveErr, eventSaveRes) {
//             // Handle Calendar Event save error
//             if (eventSaveErr) {
//               return done(eventSaveErr);
//             }
//
//             // Update Calendar Event name
//             calendarEvent.title = 'Updated Calendar Event';
//
//             // Update an existing Calendar Event
//             agent.put('/api/events/' + eventSaveRes.body._id)
//               .send(calendarEvent)
//               .expect(200)
//               .end(function (eventUpdateErr, eventUpdateRes) {
//                 // Handle Calendar Event update error
//                 if (eventUpdateErr) {
//                   return done(eventUpdateErr);
//                 }
//
//                 // Set assertions
//                 (eventUpdateRes.body._id).should.equal(eventSaveRes.body._id);
//                 (eventUpdateRes.body.title).should.match('Updated Calendar Event');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Calendar Events if not signed in', function (done) {
//     // Create new Calendar Event model instance
//     var eventObj = new CalendarEvent(calendarEvent);
//
//     // Save the event
//     eventObj.save(function () {
//       // Request Calendar Events
//       request(app).get('/api/events')
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
//   it('should be able to get a single Calendar Event if not signed in', function (done) {
//     // Create new Calendar Event model instance
//     var eventObj = new CalendarEvent(calendarEvent);
//
//     // Save the Calendar Event
//     eventObj.save(function () {
//       request(app).get('/api/events/' + eventObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('title', calendarEvent.title);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Calendar Event with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/events/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Event is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Calendar Event which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Calendar Event
//     request(app).get('/api/events/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Event with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Calendar Event if signed in', function (done) {
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
//         // Save a new Calendar Event
//         agent.post('/api/events')
//           .send(calendarEvent)
//           .expect(200)
//           .end(function (eventSaveErr, eventSaveRes) {
//             // Handle Calendar Event save error
//             if (eventSaveErr) {
//               return done(eventSaveErr);
//             }
//
//             // Delete an existing Calendar Event
//             agent.delete('/api/events/' + eventSaveRes.body._id)
//               .send(calendarEvent)
//               .expect(200)
//               .end(function (eventDeleteErr, eventDeleteRes) {
//                 // Handle event error error
//                 if (eventDeleteErr) {
//                   return done(eventDeleteErr);
//                 }
//
//                 // Set assertions
//                 (eventDeleteRes.body._id).should.equal(eventSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Calendar Event if not signed in', function (done) {
//     // Set Calendar Event user
//     calendarEvent.user = user;
//
//     // Create new Calendar Event model instance
//     var eventObj = new CalendarEvent(calendarEvent);
//
//     // Save the Calendar Event
//     eventObj.save(function () {
//       // Try deleting Calendar Event
//       request(app).delete('/api/events/' + eventObj._id)
//         .expect(403)
//         .end(function (eventDeleteErr, eventDeleteRes) {
//           // Set message assertion
//           (eventDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Calendar Event error error
//           done(eventDeleteErr);
//         });
//
//     });
//   });
//
//   afterEach(function (done) {
//     CalendarEvent.remove().exec(done);
//   });
// });
