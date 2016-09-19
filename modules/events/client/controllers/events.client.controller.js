(function () {
  'use strict';

  // Events controller
  angular
    .module('events')
    .controller('EventsController', EventsController);

  EventsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'eventResolve',
  'FileUploader', 'moment'];

  function EventsController ($scope, $state, $window, Authentication, event,
    FileUploader, moment) {
    var vm = this;

    vm.authentication = Authentication;
    vm.event = event;
    vm.error = null;
    vm.form = {};
    vm.save = save;

    vm.addDate = function() {
      vm.event.dates.push({
        startDateTime: moment().startOf('hour').toDate(),
        endDateTime: moment().startOf('hour').toDate()
      });
    };

    vm.removeDate = function(index) {
      vm.event.dates.splice(index, 1);
    };

    if (!vm.event.dates || vm.event.dates.length === 0) {
      vm.event.dates = [];
      vm.addDate();
    }
    vm.featuredImageURL = (vm.lesson && vm.lesson.featuredImage) ? vm.lesson.featuredImage.path : '';
    vm.resourceFiles = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.teacherResourcesFiles : [];
    vm.tempResourceFiles = [];
    vm.resourceLinks = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.teacherResourcesLinks : [];
    vm.tempResourceLinkName = '';
    vm.tempResourceLink = '';

    vm.featuredImageUploader = new FileUploader({
      alias: 'newFeaturedImage',
      queueLimit: 2
    });

    vm.resourceFilesUploader = new FileUploader({
      alias: 'newResourceFile',
      queueLimit: 20
    });

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
