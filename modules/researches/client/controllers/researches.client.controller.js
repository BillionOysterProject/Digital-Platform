(function () {
  'use strict';

  // Researches controller
  angular
    .module('researches')
    .controller('ResearchesController', ResearchesController);

  ResearchesController.$inject = ['$scope', '$state', '$timeout', 'researchResolve', 'lodash', 'Authentication', 'FileUploader'];

  function ResearchesController ($scope, $state, $timeout, research, lodash, Authentication, FileUploader) {
    var vm = this;

    vm.research = research;
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.error = [];
    vm.form = {};
    vm.saving = false;
    vm.valid = (vm.research.status === 'published') ? true : false;

    vm.headerImageURL = (vm.research && vm.research.headerImage) ? vm.research.headerImage.path : '';

    vm.headerImageUploader = new FileUploader({
      alias: 'newHeaderImage',
      queueLimit: 2
    });

    vm.checkRole = function(role) {
      var roleIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (roleIndex > -1) ? true : false;
    };

    vm.changeColor = function(color) {
      vm.research.color = color;
    };

    // Remove existing Research
    vm.openDeleteResearch = function() {
      angular.element('#modal-delete-poster').modal('show');
    };

    vm.confirmDeleteResearch = function(shouldDelete) {
      var element = angular.element('#modal-delete-poster');
      element.bind('hidden.bs.modal', function() {
        if (shouldDelete) vm.research.$remove($state.go('researches.list'));
      });
      element.modal('hide');
    };

    vm.cancel = function() {
      $state.go('researches.list');
    };

    var uploadHeaderImage = function(researchId, headerImageCallback) {
      if (vm.headerImageUploader.queue.length > 0) {
        $scope.savingStatus = 'Uploading Header Image';
        vm.headerImageUploader.onSuccessItem = function(fileItem, response, status, headers) {
          vm.headerImageUploader.removeFromQueue(fileItem);
          headerImageCallback();
        };

        vm.headerImageUploader.onErrorItem = function(fileItem, response, status, headers) {
          headerImageCallback(response.message);
        };

        vm.headerImageUploader.onBeforeUploadItem = function(item) {
          item.url = 'api/research/' + researchId + '/upload-header-image';
        };
        vm.headerImageUploader.uploadAll();
      } else {
        headerImageCallback();
      }
    };

    // Save Research
    vm.save = function(isValid, status) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.researchForm');
        return false;
      }
      vm.saving = true;
      if (status) vm.research.status = status;

      vm.finishedSaving = 0;
      $timeout(function() {
        var element;
        if (status === 'draft') {
          $scope.savingStatus = 'Saving Poster Draft';
          element = angular.element('#modal-save-draft-progress-bar');
        } else if (vm.research._id) {
          element = angular.element('#modal-updated-poster');
        } else {
          element = angular.element('#modal-saved-poster');
        }
        element.modal('show');

        // TODO: move create/update logic to service
        if (vm.research._id) {
          vm.research.$update(successCallback, errorCallback);
        } else {
          vm.research.$save(successCallback, errorCallback);
        }
      }, 500);

      function successCallback(res) {
        var researchId = res._id;

        vm.finishedSaving = 50;
        $timeout(function () {
          uploadHeaderImage(researchId, function() {
            element.modal('hide');
            vm.saving = false;
            vm.finishedSaving = 100;
            $state.go('researches.view', {
              researchId: res._id
            });
          });
        }, 500);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        vm.saving = true;
      }
    };

    vm.saveDraft = function(isValid) {
      vm.save(isValid, 'draft');
    };

    vm.saveDraftAndPreview = function(isValid) {
      vm.save(isValid, 'draft');
    };
  }
}());
