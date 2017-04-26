(function () {
  'use strict';

  // Researches controller
  angular
    .module('researches')
    .controller('ResearchesController', ResearchesController);

  ResearchesController.$inject = ['$scope', '$state', '$http', '$timeout', 'researchResolve', 'lodash', 'moment', 'Authentication', 'FileUploader',
  'ExpeditionViewHelper', 'TeamsService'];

  function ResearchesController ($scope, $state, $http, $timeout, research, lodash, moment, Authentication, FileUploader,
  ExpeditionViewHelper, TeamsService) {
    var vm = this;
    var toGoState = null;
    var toGoParams = null;

    vm.research = research;

    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.error = [];
    vm.form = {};
    vm.saving = false;
    vm.valid = (vm.research.status === 'published') ? true : false;
    vm.getDate = ExpeditionViewHelper.getDate;

    //TODO remove font
    vm.research.font = 'Serif';

    vm.headerImageURL = (vm.research && vm.research.headerImage) ? vm.research.headerImage.path : '';

    vm.headerImageUploader = new FileUploader({
      alias: 'newHeaderImage',
      queueLimit: 2
    });

    TeamsService.query({
      byMember: true
    }, function(data) {
      vm.myTeams = data;
      if (vm.myTeams && vm.myTeams.length === 1) vm.team = vm.myTeams[0];
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
      var modal = angular.element('#modal-delete-poster');
      modal.bind('hidden.bs.modal', function() {
        if (shouldDelete) vm.research.$remove($state.go('researches.list'));
      });
      modal.modal('hide');
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
        if (status === 'draft') {
          $scope.savingStatus = 'Saving Poster Draft';
          vm.modal = angular.element('#modal-save-draft-progress-bar');
        } else if (vm.research._id) {
          vm.modal = angular.element('#modal-updated-poster');
        } else {
          vm.modal = angular.element('#modal-saved-poster');
        }
        vm.modal.modal('show');

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
            if (vm.modal) {
              vm.modal.bind('hidden.bs.modal', function() {
                console.log('close modal', vm.modal);
                vm.saving = false;
                vm.finishedSaving = 100;
                $state.go('researches.view', {
                  researchId: res._id
                });
              });

              vm.modal.modal('hide');
            } else {
              $state.go('researches.view', {
                researchId: res._id
              });
            }
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

    vm.downloadResearch = function() {
      var filename = lodash.replace(vm.research.title.trim() + '.pdf', /\s/, '_');
      $http.get('/api/research/' + vm.research._id + '/download?filename=' + filename, {
        responseType: 'arraybuffer'
      }).
        success(function(data, status, headers, config) {
          var blob = new Blob([data], { type: 'application/pdf' });
          var url = (window.URL || window.webkitURL).createObjectURL(blob);

          var anchor = angular.element('<a/>');
          anchor.attr({
            href: url,
            target: '_blank',
            download: filename
          })[0].click();
        }).
        error(function(data, status, headers, config) {

        });
    };

    vm.openViewUserModal = function() {
      angular.element('#modal-profile-user').modal('show');
    };

    vm.closeViewUserModal = function(refresh) {
      angular.element('#modal-profile-user').modal('hide');
    };
  }
}());
