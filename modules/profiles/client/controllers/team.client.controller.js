(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamProfileController', TeamProfileController);

  TeamProfileController.$inject = ['$scope', '$rootScope', '$http', '$stateParams', '$timeout', 'Authentication',
    'TeamsService', 'TeamMembersService', 'ExpeditionsService', 'ExpeditionViewHelper', 'FileUploader'];

  function TeamProfileController($scope, $rootScope, $http, $stateParams, $timeout, Authentication,
      TeamsService, TeamMembersService, ExpeditionsService, ExpeditionViewHelper, FileUploader) {
    var vm = this;
    vm.userToOpen = {};

    var checkRole = ExpeditionViewHelper.checkRole;
    vm.isAdmin = checkRole('admin');
    vm.isTeamLead = checkRole('team lead') || checkRole('team lead pending');

    vm.filter = {
      searchString: '',
      sort: 'lastName'
    };

    var findTeamMembers = function() {
      TeamMembersService.query({
        teamId: vm.team._id,
        searchString: vm.filter.searchString,
        sort: vm.filter.sort
      }, function(data) {
        vm.teamMembers = data;
        vm.error = null;
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        });
      }, function(error) {
        vm.error = error.data.message;
      });
    };

    $scope.$on('$viewContentLoaded', function() {
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      });
    });

    vm.clearFilters = function() {
      vm.filter = {
        searchString: '',
        sort: 'lastName'
      };
      findTeamMembers();
    };

    vm.searchChange = function($event) {
      if (vm.filter.searchString.length >= 2 || vm.filter.searchString.length === 0) {
        vm.filter.page = 1;
        findTeamMembers();
      }
    };

    var findExpeditions = function(teamId) {
      ExpeditionsService.query({
        team: teamId,
        published: true
      }, function(data) {
        vm.expeditions = data;
      });
    };

    var findTeam = function() {
      TeamsService.get({
        teamId: $stateParams.teamId,
        full: true
      }, function(data) {
        vm.team = (data) ? data : new TeamsService();
        vm.teamPhotoURL = (vm.team && vm.team.photo && vm.team.photo.path) ? vm.team.photo.path : '';
        findExpeditions(vm.team._id);
        findTeamMembers();
      });
    };
    findTeam();

    vm.authentication = Authentication;
    vm.error = [];

    vm.teamPhotoUploader = new FileUploader({
      alias: 'teamPhoto'
    });

    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.teamProfileForm');
        return false;
      }

      if (vm.team.photo) {
        if (vm.teamPhotoURL) {
          vm.team.photo.path = vm.teamPhotoURL;
        } else {
          vm.team.photo = null;
        }
      }

      if (vm.team._id) {
        vm.team.$update(successCallback, errorCallback);
      } else {
        vm.team.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var teamId = res._id;

        function uploadTeamPhoto(teamId, imageSuccessCallback, imageErrorCallback) {
          if (vm.teamPhotoUploader.queue.length > 0) {
            vm.teamPhotoUploader.onSuccessItem = function (fileItem, response, status, headers) {
              vm.teamPhotoUploader.removeFromQueue(fileItem);
              imageSuccessCallback();
            };

            vm.teamPhotoUploader.onErrorItem = function (fileItem, response, status, headers) {
              imageErrorCallback(response.message);
            };

            vm.teamPhotoUploader.onBeforeUploadItem = function (item) {
              item.url = 'api/teams/' + teamId + '/upload-image';
            };
            vm.teamPhotoUploader.uploadAll();
          } else {
            imageSuccessCallback();
          }
        }

        uploadTeamPhoto(teamId, function() {
          findTeam();
        }, function(errorMessage) {
          vm.error = errorMessage;
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    vm.remove = function(callback) {
      vm.team.$remove(function() {
        if (callback) callback();
      });
    };

    vm.openTeamProfileForm = function() {
      angular.element('#modal-team-edit').modal('show');
    };

    vm.closeTeamProfileForm = function() {
      angular.element('#modal-team-edit').modal('hide');
    };

    vm.openInviteTeamLead = function() {
      angular.element('#modal-team-lead-invite').modal('show');
    };

    vm.closeInviteTeamLead = function() {
      angular.element('#modal-team-lead-invite').modal('hide');
    };

    vm.openDeleteTeamLead = function() {
      angular.element('#modal-team-lead-remove').modal('show');
    };

    vm.closeDeleteTeamLead = function() {
      angular.element('#modal-team-lead-remove').modal('hide');
    };

    vm.openViewUserModal = function(user) {
      vm.userToOpen = (user) ? user : {};
      angular.element('#modal-profile-user').modal('show');
    };

    vm.closeViewUserModal = function(openNewModalName) {
      angular.element('#modal-profile-user').modal('hide');
    };
  }
})();
