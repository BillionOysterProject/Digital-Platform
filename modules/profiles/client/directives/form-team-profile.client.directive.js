(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('formTeamProfileModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/form-team-profile.client.view.html',
        scope: {
          team: '=',
          organization: '=?',
          closeFunction: '='
        },
        replace: true,
        controller: function($scope, FileUploader, TeamsService) {
          $scope.teamPhotoURL = ($scope.team && $scope.team.photo && $scope.team.photo.path) ? $scope.team.photo.path : '';
          $scope.teamPhotoUploader = new FileUploader({
            alias: 'teamPhoto'
          });
          $scope.error = [];

          $scope.save = function(isValid) {
            if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'form.teamProfileForm');
              return false;
            }

            if ($scope.team.photo) {
              if ($scope.teamPhotoURL) {
                $scope.team.photo.path = $scope.teamPhotoURL;
              } else {
                $scope.team.photo = null;
              }
            }
            if (!$scope.team.schoolOrg) {
              $scope.team.schoolOrg = $scope.organization;
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
                  $scope.closeFunction(true);
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
        },
        link: function(scope, element, attrs) {
          scope.$watch('team', function(newValue, oldValue) {
            scope.team = newValue;
            scope.teamPhotoURL = (scope.team && scope.team.photo && scope.team.photo.path) ? scope.team.photo.path : '';
          });
        }
      };
    });
})();
