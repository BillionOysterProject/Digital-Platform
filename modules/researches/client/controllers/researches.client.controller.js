(function () {
  'use strict';

  // Researches controller
  angular
    .module('researches')
    .controller('ResearchesController', ResearchesController);

  ResearchesController.$inject = ['$scope', '$state', '$http', '$timeout', 'researchResolve', 'lodash', 'moment', 'Authentication', 'FileUploader',
  'ExpeditionViewHelper', 'TeamsService', 'ResearchesService', 'ResearchFeedbackService'];

  function ResearchesController ($scope, $state, $http, $timeout, research, lodash, moment, Authentication, FileUploader,
  ExpeditionViewHelper, TeamsService, ResearchesService, ResearchFeedbackService) {
    var vm = this;
    var toGoState = null;
    var toGoParams = null;

    vm.research = research;
    vm.research.organization = null;
    if (vm.research.team && vm.research.team.schoolOrg) {
      vm.research.organization = vm.research.team.schoolOrg;
    } else if (!vm.research.team && vm.research.user && vm.research.user.schoolOrg && vm.research.user.schoolOrg._id) {
      vm.research.organization = vm.research.user.schoolOrg;
    }

    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.error = [];
    vm.form = {};
    vm.saving = false;
    vm.valid = (vm.research.status === 'published') ? true : false;
    vm.getDate = ExpeditionViewHelper.getDate;

    //TODO remove font
    vm.research.font = 'Roboto';

    vm.headerImageURL = (vm.research && vm.research.headerImage) ? vm.research.headerImage.path : '';

    vm.headerImageUploader = new FileUploader({
      alias: 'newHeaderImage',
      queueLimit: 2
    });

    TeamsService.query({
      byMember: true
    }, function(data) {
      vm.myTeams = data;
      if (vm.myTeams && vm.myTeams.length === 1 && !vm.research.team) vm.research.team = vm.myTeams[0];
    });

    if (vm.research && vm.research._id) {
      ResearchFeedbackService.get({
        researchId: vm.research._id
      }, function(data) {
        vm.feedback = data;
      });
    }

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

    var updateResearchObject = function(researchId) {
      ResearchesService.get({
        researchId: researchId
      }, function(data) {
        vm.research = data;
        vm.headerImageURL = (vm.research && vm.research.headerImage) ? vm.research.headerImage.path : '';
      });
    };

    // Save Research
    vm.save = function(isValid, status, stayOnPage) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.researchForm');
        return false;
      }
      vm.saving = true;
      vm.research.status = status || 'pending';

      vm.finishedSaving = 0;
      $timeout(function() {
        if (status === 'draft') {
          $scope.savingStatus = 'Saving Poster Draft';
          vm.modal = angular.element('#modal-save-draft-progress-bar');
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
            vm.saving = false;
            if (vm.modal) {
              vm.modal.bind('hidden.bs.modal', function() {
                vm.finishedSaving = 100;
                if (stayOnPage) {
                  updateResearchObject(researchId);
                } else {
                  vm.goToView(researchId);
                }
              });
              vm.modal.modal('hide');
            } else {
              if (stayOnPage) {
                updateResearchObject(researchId);
              } else {
                vm.goToView(researchId);
              }
            }
          });
        }, 500);
      }

      function errorCallback(res) {
        vm.error = res.message;
        vm.saving = false;
        if (vm.modal) {
          vm.modal.bind('hidden.bs.modal', function() {
            vm.finishedSaving = 100;
          });
          vm.modal.modal('hide');
        }
      }
    };

    vm.goToView = function(researchId) {
      $state.go('researches.view', {
        researchId: researchId
      });
    };

    vm.saveDraft = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.researchForm');
      }
      vm.save(true, 'draft', true);
    };

    vm.saveDraftAndPreview = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.researchForm');
      }
      vm.save(true, 'draft', false);
    };

    vm.saveAndSubmit = function(isValid) {
      vm.save(isValid, 'pending', false);
    };

    vm.downloadResearch = function() {
      var filename = lodash.replace(vm.research.title.trim() + '.pdf', /\s/g, '_');
      $http.get('/api/research/' + vm.research._id + '/download?filename=' + filename + '&title=' + vm.research.title, {
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

    vm.openResearchFeedbackModal = function() {
      angular.element('#modal-research-feedback').modal('show');
    };

    vm.closeResearchFeedbackModal = function(refresh) {
      angular.element('#modal-research-feedback').modal('hide');
      if (refresh) console.log('reload feedback');
    };

    vm.openResearchFeedbackView = function() {
      angular.element('#modal-research-view-feedback').modal('show');
    };

    vm.closeResearchFeedbackView = function(refresh) {
      angular.element('#modal-research-view-feedback').modal('hide');
      if (refresh) console.log('reload feedback view');
    };

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (vm.modal && vm.modal.hasClass('in')) {
        event.preventDefault();
        vm.modal.bind('hidden.bs.modal', function() {
          if (toState) {
            $state.go(toState, toParams);
          }
        });
        vm.modal.modal('hide');
      }
    });
  }
}());
