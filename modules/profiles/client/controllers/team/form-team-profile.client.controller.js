(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamFormController', TeamFormController);

  TeamFormController.$inject = ['$scope', '$http', 'FileUploader', 'TeamsService', 'ExpeditionViewHelper', 'Authentication', 'SchoolOrganizationsService'];

  function TeamFormController($scope, $http, FileUploader, TeamsService, ExpeditionViewHelper, Authentication, SchoolOrganizationsService) {
    $scope.teamPhotoURL = ($scope.team && $scope.team.photo && $scope.team.photo.path) ? $scope.team.photo.path : '';
    $scope.teamPhotoUploader = new FileUploader({
      alias: 'teamPhoto'
    });
    $scope.error = [];

    var checkRole = ExpeditionViewHelper.checkRole;
    $scope.isAdmin = checkRole('admin');

    $scope.findCurrentUserSchoolOrg = function() {
      $http.get('api/users/username', {
        params: { username: Authentication.user.username }
      })
      .success(function(data, status, headers, config) {
        $scope.currentUserSchoolOrg = data.schoolOrg;

        SchoolOrganizationsService.query({
          approvedOnly: true
        }, function(data) {
          $scope.organizations = data;
        });
      })
      .error(function(data, status, headers, config) {
        $scope.error = data;
      });
    };
    $scope.findCurrentUserSchoolOrg();

    $scope.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.teamProfileForm');
        return false;
      }

      $scope.team = $scope.editTeam;
      if ($scope.team.photo) {
        if ($scope.teamPhotoURL) {
          $scope.team.photo.path = $scope.teamPhotoURL;
        } else {
          $scope.team.photo = null;
        }
      }

      if (!$scope.team.schoolOrg) {
        if ($scope.organization) {
          $scope.team.schoolOrg = $scope.organization;
        } else if ($scope.isAdmin) {
          $scope.team.schoolOrg = $scope.organizationSelected;
        } else {
          $scope.team.schoolOrg = $scope.currentUserSchoolOrg;
        }
      }

      if ($scope.team._id) {
        $scope.team.$update(successCallback, errorCallback);
      } else {
        $scope.team.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var teamId = res._id;

        function uploadTeamPhoto(teamId, imageSuccessCallback, imageErrorCallback) {
          if ($scope.teamPhotoUploader.queue.length > 0) {
            $scope.teamPhotoUploader.onSuccessItem = function (fileItem, response, status, headers) {
              $scope.teamPhotoUploader.removeFromQueue(fileItem);
              imageSuccessCallback();
            };

            $scope.teamPhotoUploader.onErrorItem = function (fileItem, response, status, headers) {
              imageErrorCallback(response.message);
            };

            $scope.teamPhotoUploader.onBeforeUploadItem = function (item) {
              item.url = 'api/teams/' + teamId + '/upload-image';
            };
            $scope.teamPhotoUploader.uploadAll();
          } else {
            imageSuccessCallback();
          }
        }

        uploadTeamPhoto(teamId, function() {
          TeamsService.get({
            teamId: teamId,
            full: true
          }, function(data) {
            $scope.closeFunction(data);
          });
        }, function(errorMessage) {
          $scope.error = errorMessage;
        });
      }

      function errorCallback(res) {
        $scope.error = res.data.message;
      }
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
