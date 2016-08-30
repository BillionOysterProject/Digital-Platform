'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CalendarEvent = mongoose.model('CalendarEvent'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  calendarEvent;

/**
 * Calendar Event routes tests
 */
describe('Calendar Event CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Calendar Event
    user.save(function () {
      calendarEvent = {
        name: 'Calendar Event name'
      };

      done();
    });
  });

  it('should be able to save a Calendar Event if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Calendar Event
        agent.post('/api/events')
          .send(event)
          .expect(200)
          .end(function (eventSaveErr, eventSaveRes) {
            // Handle Calendar Event save error
            if (eventSaveErr) {
              return done(eventSaveErr);
            }

            // Get a list of Calendar Events
            agent.get('/api/events')
              .end(function (eventsGetErr, eventsGetRes) {
                // Handle Calendar Events save error
                if (eventsGetErr) {
                  return done(eventsGetErr);
                }

                // Get Calendar Events list
                var events = eventsGetRes.body;

                // Set assertions
                (events[0].user._id).should.equal(userId);
                (events[0].name).should.match('Calendar Event name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Calendar Event if not logged in', function (done) {
    agent.post('/api/events')
      .send(event)
      .expect(403)
      .end(function (eventSaveErr, eventSaveRes) {
        // Call the assertion callback
        done(eventSaveErr);
      });
  });

  it('should not be able to save an Calendar Event if no name is provided', function (done) {
    // Invalidate name field
    event.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Calendar Event
        agent.post('/api/events')
          .send(event)
          .expect(400)
          .end(function (eventSaveErr, eventSaveRes) {
            // Set message assertion
            (eventSaveRes.body.message).should.match('Please fill Calendar Event name');

            // Handle Calendar Event save error
            done(eventSaveErr);
          });
      });
  });

  it('should be able to update an Calendar Event if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Calendar Event
        agent.post('/api/events')
          .send(event)
          .expect(200)
          .end(function (eventSaveErr, eventSaveRes) {
            // Handle Calendar Event save error
            if (eventSaveErr) {
              return done(eventSaveErr);
            }

            // Update Calendar Event name
            event.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Calendar Event
            agent.put('/api/events/' + eventSaveRes.body._id)
              .send(event)
              .expect(200)
              .end(function (eventUpdateErr, eventUpdateRes) {
                // Handle Calendar Event update error
                if (eventUpdateErr) {
                  return done(eventUpdateErr);
                }

                // Set assertions
                (eventUpdateRes.body._id).should.equal(eventSaveRes.body._id);
                (eventUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Calendar Events if not signed in', function (done) {
    // Create new Calendar Event model instance
    var eventObj = new CalendarEvent(event);

    // Save the event
    eventObj.save(function () {
      // Request Calendar Events
      request(app).get('/api/events')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Calendar Event if not signed in', function (done) {
    // Create new Calendar Event model instance
    var eventObj = new CalendarEvent(event);

    // Save the Calendar Event
    eventObj.save(function () {
      request(app).get('/api/events/' + eventObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', event.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Calendar Event with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/events/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Calendar Event is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Calendar Event which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Calendar Event
    request(app).get('/api/events/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Calendar Event with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Calendar Event if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Calendar Event
        agent.post('/api/events')
          .send(event)
          .expect(200)
          .end(function (eventSaveErr, eventSaveRes) {
            // Handle Calendar Event save error
            if (eventSaveErr) {
              return done(eventSaveErr);
            }

            // Delete an existing Calendar Event
            agent.delete('/api/events/' + eventSaveRes.body._id)
              .send(event)
              .expect(200)
              .end(function (eventDeleteErr, eventDeleteRes) {
                // Handle event error error
                if (eventDeleteErr) {
                  return done(eventDeleteErr);
                }

                // Set assertions
                (eventDeleteRes.body._id).should.equal(eventSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Calendar Event if not signed in', function (done) {
    // Set Calendar Event user
    event.user = user;

    // Create new Calendar Event model instance
    var eventObj = new CalendarEvent(event);

    // Save the Calendar Event
    eventObj.save(function () {
      // Try deleting Calendar Event
      request(app).delete('/api/events/' + eventObj._id)
        .expect(403)
        .end(function (eventDeleteErr, eventDeleteRes) {
          // Set message assertion
          (eventDeleteRes.body.message).should.match('User is not authorized');

          // Handle Calendar Event error error
          done(eventDeleteErr);
        });

    });
  });

  it('should be able to get a single Calendar Event that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Calendar Event
          agent.post('/api/events')
            .send(event)
            .expect(200)
            .end(function (eventSaveErr, eventSaveRes) {
              // Handle Calendar Event save error
              if (eventSaveErr) {
                return done(eventSaveErr);
              }

              // Set assertions on new Calendar Event
              (eventSaveRes.body.name).should.equal(event.name);
              should.exist(eventSaveRes.body.user);
              should.equal(eventSaveRes.body.user._id, orphanId);

              // force the Calendar Event to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Calendar Event
                    agent.get('/api/events/' + eventSaveRes.body._id)
                      .expect(200)
                      .end(function (eventInfoErr, eventInfoRes) {
                        // Handle Calendar Event error
                        if (eventInfoErr) {
                          return done(eventInfoErr);
                        }

                        // Set assertions
                        (eventInfoRes.body._id).should.equal(eventSaveRes.body._id);
                        (eventInfoRes.body.name).should.equal(event.name);
                        should.equal(eventInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      CalendarEvent.remove().exec(done);
    });
  });
});
