(function () {
  'use strict';

  // Events controller
  angular
    .module('events')
    .controller('EventsController', EventsController);

  EventsController.$inject = ['$scope', '$rootScope', '$state', '$window', '$http', '$location', '$timeout',
    'Authentication', 'eventResolve', 'EventHelper', 'FileUploader', 'EventTypesService', 'moment', 'lodash'];

  function EventsController ($scope, $rootScope, $state, $window, $http, $location, $timeout,
    Authentication, event, EventHelper, FileUploader, EventTypesService, moment, lodash) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.event = event;
    vm.error = [];
    vm.form = {};
    vm.save = save;

    vm.mapControls = {};
    vm.mapClick = function(e){
    };
    vm.markerDragEnd = function(location){
    };
    if (vm.event.location) {
      vm.mapPoints = [{
        lat: vm.event.location.latitude,
        lng: vm.event.location.longitude,
        icon: {
          icon: 'glyphicon-map-marker',
          prefix: 'glyphicon',
          markerColor: 'blue'
        },
      }];
    } else {
      vm.mapPoints = [];
    }

    vm.featuredImageURL = (vm.event && vm.event.featuredImage) ? vm.event.featuredImage.path : '';
    vm.resourcesFiles = (vm.event && vm.event.resources && vm.event.resources.resourcesFiles) ?
      vm.event.resources.resourcesFiles : [];
    vm.resourceLinks = (vm.event && vm.event.resources && vm.event.resources.resourcesLinks) ?
      vm.event.resources.resourcesLinks : [];
    vm.event.deadlineToRegister = (vm.event && vm.event.deadlineToRegister) ? moment(vm.event.deadlineToRegister).toDate() : '';
    vm.registrantToOpen = {};

    vm.featuredImageUploader = new FileUploader({
      alias: 'newFeaturedImage',
      queueLimit: 2
    });

    vm.resourcesFilesUploader = new FileUploader({
      alias: 'newResourceFile',
      queueLimit: 20
    });

    EventTypesService.query({
    }, function(data) {
      vm.eventTypes = data;
    });

    vm.addDate = function() {
      vm.event.dates.push({
        date: moment().startOf('day').toDate(),
        startTime: moment().startOf('hour').toDate(),
        endTime: moment().startOf('hour').toDate()
      });
    };

    vm.removeDate = function(index) {
      vm.event.dates.splice(index, 1);
    };

    if (!vm.event.dates || vm.event.dates.length === 0) {
      vm.event.dates = [];
      vm.addDate();
    } else {
      for (var i = 0; i < vm.event.dates.length; i++) {
        vm.event.dates[i].date = (vm.event.dates[i].startDateTime) ?
          moment(vm.event.dates[i].startDateTime).startOf('day').toDate() : '';
        vm.event.dates[i].startTime = (vm.event.dates[i].startDateTime) ?
          moment(vm.event.dates[i].startDateTime).toDate() : '';
        vm.event.dates[i].endTime = (vm.event.dates[i].endDateTime) ?
          moment(vm.event.dates[i].endDateTime).toDate() : '';
      }
    }

    vm.resetDateValidity = function(fieldName) {
      vm.form.eventForm[fieldName].$setValidity('required', true);
    };

    vm.getEventDate = EventHelper.getEventDate;
    vm.getEventMonthShort = EventHelper.getEventMonthShort;
    vm.getEventDay = EventHelper.getEventDay;
    vm.getEventYear = EventHelper.getEventYear;
    vm.getEventTimeRange = EventHelper.getEventTimeRange;
    vm.getEventDayOfWeekLong = EventHelper.getEventDayOfWeekLong;
    vm.getEventDayOfWeekShort = EventHelper.getEventDayOfWeekShort;
    vm.earliestDateString = EventHelper.getEarliestDateString(vm.event.dates);
    vm.earliestDate = moment(vm.earliestDateString, 'MMM D YYYY');
    vm.earliestDateTimeString = EventHelper.getEarliestDateTimeRangeString(vm.event.dates);
    vm.dateTimeRangeString = EventHelper.getDateTimeRangeString(vm.event.dates);
    vm.openSpots = EventHelper.getOpenSpots(vm.event.registrants, vm.event.maximumCapacity);
    vm.deadline = moment(EventHelper.getDeadline(vm.event.dates, vm.event.deadlineToRegister)).format('MM/DD/YYYY');
    vm.daysRemainingDeadline = EventHelper.getDaysRemainingDeadline(vm.event.dates, vm.event.deadlineToRegister);
    vm.daysRemainingEvent = EventHelper.getDaysRemainingEvent(vm.event.dates);
    vm.today = moment().isSame(vm.earliestDate, 'day');
    vm.past = (vm.daysRemainingEvent < 0) ? true : false;
    vm.eventType = (vm.event.category && vm.event.category.type) ? vm.event.category.type.type : '';

    var checkRole = function(role) {
      var roleIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (roleIndex > -1) ? true : false;
    };

    if (vm.user) {
      vm.isAdmin = checkRole('admin');
      vm.isTeamLead = (checkRole('team lead') || checkRole('team lead pending')) ? true : false;
      vm.isTeamMember = (checkRole('team member') || checkRole('team member pending')) ? true : false;
      vm.notLoggedIn = false;
    } else {
      vm.notLoggedIn = true;
      vm.isAdmin = false;
      vm.isTeamLead = false;
      vm.isTeamMember = false;
    }

    vm.signinOrRegister = function() {
      $rootScope.redirectFromLogin = $location.path();
      angular.element('#modal-event-signin-or-signup').modal('show');
    };

    vm.signinOrRegisterClose = function(path) {
      angular.element('#modal-event-signin-or-signup').modal('hide');
      $timeout(function() {
        $location.path(path);
      }, 500);
    };

    vm.getRegistrationDate = function(date) {
      return moment(date).format('MMMM D, YYYY');
    };

    vm.openFeedback = function() {
      angular.element('#modal-feedback').modal('show');
    };

    vm.openEmailRegistrants = function() {
      angular.element('#modal-email-registrants').modal('show');
    };

    vm.deleteResourceFile = function(index, file) {
      if (file.index !== undefined && file.index > -1) {
        vm.resourcesFilesUploader.removeFromQueue(file.index);
      }
      vm.resourcesFiles.splice(index, 1);
    };

    vm.deleteResourceLink = function(index) {
      vm.resourceLinks.splice(index, 1);
    };

    vm.changedCategory = function() {
      var index = lodash.findIndex(vm.eventTypes, function(c) {
        return c._id === vm.event.category.type._id;
      });
      vm.eventType = (index > -1) ? vm.eventTypes[index].type : '';

      if (vm.eventType !== 'Other') {
        vm.event.category.otherType = undefined;
      }
    };

    vm.registerEvent = function() {
      $http.post('/api/events/' + vm.event._id + '/register', {
        full: true,
        dateTimeString: vm.dateTimeRangeString
      }).
      success(function(data, status, headers, config) {
        angular.element('#modal-event-register').modal('show');
        vm.event.isRegistered = true;
        vm.event.registrants = data.registrants;
        vm.error = [];
      }).
      error(function(data, status, headers, config) {
        vm.error = data.message;
        console.log('vm.error', vm.error);
      });
    };

    vm.unregisterEvent = function() {
      $http.post('/api/events/' + vm.event._id + '/unregister', {
        full: true
      }).
      success(function(data, status, headers, config) {
        angular.element('#modal-event-unregister').modal('show');
        vm.event.isRegistered = false;
        vm.event.registrants = data.registrants;
        vm.error = [];
      }).
      error(function(data, status, headers, config) {
        vm.error = data.message;
        console.log('vm.error', vm.error);
      });
    };

    vm.attendedEvent = function(registrant) {
      $http.post('/api/events/' + vm.event._id + '/attended', {
        registrant: registrant.user
      }).
      success(function(data, status, headers, config) {
        vm.event.registrants = data.registrants;
        vm.event.attendees = data.attendees;
        vm.error = [];
      }).
      error(function(data, status, headers, config) {
        vm.error = data.message;
        console.log('vm.error', vm.error);
      });
    };

    vm.notAttendedEvent = function(registrant) {
      $http.post('/api/events/' + vm.event._id + '/not-attended', {
        registrant: registrant.user
      }).
      success(function(data, status, headers, config) {
        vm.event.registrants = data.registrants;
        vm.event.attendees = data.attendees;
        vm.error = [];
      }).
      error(function(data, status, headers, config) {
        vm.error = data.message;
        console.log('vm.error', vm.error);
      });
    };

    vm.openEventNote = function(registrant, note) {
      vm.registrantToOpen = (registrant) ? registrant : {};
      angular.element('#modal-registrant-note').modal('show');
    };

    vm.closeEventNote = function(registrants, attendees) {
      angular.element('#modal-registrant-note').modal('hide');
      if (registrants && attendees) {
        $timeout(function() {
          vm.event.registrants = registrants;
          vm.event.attendees = attendees;
        }, 500);
      }
    };

    vm.openMap = function() {
      angular.element('#modal-event-map').modal('show');
      $timeout(function() {
        if (vm.event.location) vm.mapControls.panTo({ lat: vm.event.location.latitude, lng: vm.event.location.longitude });
      }, 300);
    };

    vm.closeMap = function() {
      angular.element('#modal-event-map').modal('hide');
    };

    vm.duplicateEvent = function() {
      $state.go('events.duplicate', {
        eventId: vm.event._id
      });
    };

    vm.openDeleteEvent = function() {
      angular.element('#modal-delete-event').modal('show');
    };

    vm.confirmDeleteEvent = function(shouldDelete) {
      var element = angular.element('#modal-delete-event');
      element.bind('hidden.bs.modal', function () {
        if (shouldDelete) vm.remove();
      });
      element.modal('hide');
    };

    vm.getColumnNumber = function() {
      var columns = 1;
      if (vm.event.location && vm.event.location.addressString) columns++;
      if (vm.past || vm.today) columns++;
      if ((!vm.past || (vm.past && vm.isAdmin)) && vm.event.maximumCapacity > 0) columns++;
      return columns;
    };
    vm.columns = vm.getColumnNumber();

    vm.setEventDatesToGmt = function() {
      if(vm.event.dates === null || vm.event.dates === undefined || vm.event.dates.length === 0) {
        return;
      }
      for(var i = 0; i < vm.event.dates.length; i++) {
        var currEventDate = vm.event.dates[i];
        var year = moment(currEventDate.date).get('year');
        var month = moment(currEventDate.date).get('month');
        var day = moment(currEventDate.date).get('date');
        var startHour = moment(currEventDate.startTime).get('hour');
        var startMinute = moment(currEventDate.startTime).get('minute');
        var endHour = moment(currEventDate.endTime).get('hour');
        var endMinute = moment(currEventDate.endTime).get('minute');
        var startDateTime = moment().set({ year: year, month: month, date: day, hour: startHour, minute: startMinute, second: 0, millisecond: 0 });
        var endDateTime = moment().set({ year: year, month: month, date: day, hour: endHour, minute: endMinute, second: 0, millisecond: 0 });
        var startDateTimeStr = startDateTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        var endDateTimeStr = endDateTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        vm.event.dates[i].startDateTime = startDateTimeStr;
        vm.event.dates[i].endDateTime = endDateTimeStr;
      }

      if(vm.event.deadlineToRegister !== null && vm.event.deadlineToRegister !== undefined) {
        var deadlineYear = moment(vm.event.deadlineToRegister).get('year');
        var deadlineMonth = moment(vm.event.deadlineToRegister).get('month');
        var deadlineDay = moment(vm.event.deadlineToRegister).get('date');
        var deadlineToRegister = moment().set({ year: deadlineYear, month: deadlineMonth, date: deadlineDay, hour: 0, minute: 0, second: 0, millisecond: 0 });
        var deadlineToRegisterStr = deadlineToRegister.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        vm.event.deadlineToRegister = deadlineToRegisterStr;
      }
    };

    // Save Event
    function save(isValid) {
      vm.error = [];
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventForm');
        return false;
      }
      var dateError = false;
      var dateErrors = {};
      if (!vm.event.dates || vm.event.dates.length === 0) {
        vm.error.push('Must have at least one date');
        dateError = true;
      } else if (vm.event.dates.length > 0) {
        for (var i = 0; i < vm.event.dates.length; i++) {
          if (!vm.event.dates[i].date || !vm.event.dates[i].startTime || !vm.event.dates[i].endTime) {
            //vm.error.push('Must fill in date and start/end times');
            if(!vm.event.dates[i].date) vm.form.eventForm['date-'+i].$setValidity('required', false);
            if(!vm.event.dates[i].startTime) vm.form.eventForm['startTime-'+i].$setValidity('required', false);
            if(!vm.event.dates[i].endTime) vm.form.eventForm['endTime-'+i].$setValidity('required', false);
            dateError = true;
          }
        }
      }
      if (dateError) return false;

      if (!vm.event.resources) {
        vm.event.resources = {
          resourcesLinks: vm.resourceLinks,
          resourcesFiles: vm.resourcesFiles
        };
      } else {
        vm.event.resources.resourcesLinks = vm.resourceLinks;
        vm.event.resources.resourcesFiles = vm.resourcesFiles;
      }

      // TODO: move create/update logic to service
      if (vm.event._id) {
        vm.setEventDatesToGmt();
        vm.event.$update(successCallback, errorCallback);
      } else {
        vm.setEventDatesToGmt();
        vm.event.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var eventId = res._id;

        function goToView(eventId) {
          $state.go('events.view', {
            eventId: eventId
          });
        }

        var uploadFeaturedImage = function (eventId, featuredImageCallback) {
          if (vm.featuredImageUploader.queue.length > 0) {
            vm.featuredImageUploader.onSuccessItem = function (fileItem, response, status, headers) {
              vm.featuredImageUploader.removeFromQueue(fileItem);
              featuredImageCallback();
            };

            vm.featuredImageUploader.onErrorItem = function (fileItem, response, status, headers) {
              featuredImageCallback(response.message);
            };

            vm.featuredImageUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/events/' + eventId + '/upload-featured-image';
            };
            vm.featuredImageUploader.uploadAll();
          } else {
            featuredImageCallback();
          }
        };

        var uploadResourceFiles = function (eventId, resourceFileCallback) {
          if (vm.resourcesFilesUploader.queue.length > 0) {
            vm.resourcesFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
              vm.resourcesFilesUploader.removeFromQueue(fileItem);
              resourceFileCallback();
            };

            vm.resourcesFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
              resourceFileCallback(response.message);
            };

            vm.resourcesFilesUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/events/' + eventId + '/upload-resources';
            };
            vm.resourcesFilesUploader.uploadAll();
          } else {
            resourceFileCallback();
          }
        };

        $timeout(function (){
          uploadFeaturedImage(eventId, function(uploadFeaturedImageError) {
            if (uploadFeaturedImageError) vm.error.push(uploadFeaturedImageError);
            $timeout(function (){
              uploadResourceFiles(eventId, function(uploadResourceFilesError) {
                if (uploadResourceFilesError) vm.error.push(uploadResourceFilesError);

                if (vm.error && vm.error.length > 0) {
                  vm.valid = false;
                } else {
                  vm.error = [];
                  $timeout(function (){
                    goToView(eventId);
                  }, 1000);
                }
              });
            }, 500);
          });
        }, 500);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        vm.valid = false;
      }
    }
  }
}());
