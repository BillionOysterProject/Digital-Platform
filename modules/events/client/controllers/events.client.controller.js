(function () {
  'use strict';

  // Events controller
  angular
    .module('events')
    .controller('EventsController', EventsController);

  EventsController.$inject = ['$scope', '$state', '$window', '$http', 'Authentication', 'eventResolve',
  'EventHelper', 'FileUploader', 'moment', 'lodash'];

  function EventsController ($scope, $state, $window, $http, Authentication, event,
    EventHelper, FileUploader, moment, lodash) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.event = event;
    vm.error = [];
    vm.form = {};
    vm.save = save;

    vm.getEventDate = EventHelper.getEventDate;
    vm.getEventMonthShort = EventHelper.getEventMonthShort;
    vm.getEventDay = EventHelper.getEventDay;
    vm.getEventYear = EventHelper.getEventYear;
    vm.getEventTimeRange = EventHelper.getEventTimeRange;
    vm.earliestDateString = EventHelper.getEarliestDateString(vm.event.dates);
    vm.openSpots = EventHelper.getOpenSpots(vm.event.registrants, vm.event.maximumCapacity);
    vm.daysRemaining = EventHelper.getDaysRemaining(vm.event.dates, vm.event.deadlineToRegister);
    vm.past = (vm.daysRemaining < 0) ? true : false;

    var checkRole = function(role) {
      var roleIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (roleIndex > -1) ? true : false;
    };
    vm.isAdmin = checkRole('admin');
    vm.isTeamLead = (checkRole('team lead') || checkRole('team lead pending')) ? true : false;

    vm.getRegistrationDate = function(date) {
      return moment(date).format('MMMM D, YYYY');
    };

    vm.openFeedback = function() {
      angular.element('#modal-feedback').modal('show');
    };

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

    vm.featuredImageURL = (vm.event && vm.event.featuredImage) ? vm.event.featuredImage.path : '';
    vm.resourceFiles = (vm.event && vm.event.resources.resourcesFiles) ? vm.event.resources.resourcesFiles : [];
    vm.resourceLinks = (vm.event && vm.event.resources.resourcesLinks) ? vm.event.resources.resourcesLinks : [];
    vm.event.deadlineToRegister = (vm.event && vm.event.deadlineToRegister) ? moment(vm.event.deadlineToRegister).toDate() : '';

    vm.featuredImageUploader = new FileUploader({
      alias: 'newFeaturedImage',
      queueLimit: 2
    });

    vm.resourceFilesUploader = new FileUploader({
      alias: 'newResourceFile',
      queueLimit: 20
    });

    vm.deleteResourceFile = function(index, file) {
      if (file.index) {
        vm.resourceFilesUploader.removeFromQueue(file.index);
      }
      vm.resourcesFiles.splice(index, 1);
    };

    vm.deleteResourceLink = function(index) {
      vm.resourceLinks.splice(index, 1);
    };

    vm.registerEvent = function() {
      $http.post('/api/events/' + vm.event._id + '/register', {
        full: true
      }).
      success(function(data, status, headers, config) {
        angular.element('#modal-event-register').modal('show');
        vm.event.isRegistered = true;
        vm.event.registrants = data.registrants;
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
      }).
      error(function(data, status, headers, config) {
        vm.error = data.message;
        console.log('vm.error', vm.error);
      });
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

    // Save Event
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.event._id) {
        vm.event.$update(successCallback, errorCallback);
      } else {
        vm.event.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var eventId = res._id;
        vm.error = [];

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
          if (vm.resourceFilesUploader.queue.length > 0) {
            vm.resourceFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
              vm.resourceFilesUploader.removeFromQueue(fileItem);
              resourceFileCallback();
            };

            vm.resourceFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
              resourceFileCallback(response.message);
            };

            vm.resourceFilesUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/events/' + eventId + '/upload-resources';
            };
            vm.resourceFilesUploader.uploadAll();
          } else {
            resourceFileCallback();
          }
        };

        uploadFeaturedImage(eventId, function(uploadFeaturedImageError) {
          if (uploadFeaturedImageError) vm.error.push(uploadFeaturedImageError);
          uploadResourceFiles(eventId, function(uploadResourceFilesError) {
            if (uploadResourceFilesError) vm.error.push(uploadResourceFilesError);

            if (vm.error && vm.error.length > 0) {
              vm.valid = false;
            } else {
              vm.error = [];
              goToView(eventId);
            }
          });
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        vm.valid = false;
      }
    }
  }
}());
