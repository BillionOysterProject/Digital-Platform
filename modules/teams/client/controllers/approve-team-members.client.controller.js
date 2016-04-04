(function () {
  'use strict';

  angular
    .module('teams')
    .controller('TeamApprovalController', TeamApprovalController);

  TeamApprovalController.$inject = ['$scope', '$http'];

  function TeamApprovalController($scope, $http) {
    $scope.team = {
      teamId: null,
      newTeamName: null
    };

    $scope.save = function(isValid) {
      var allRequestsResolved = true;
      for (var i = 0; i < $scope.teamRequests.length; i++) {
        if ($scope.teamRequests[i].approve !== true && $scope.teamRequests[i].approve !== false) {
          $scope.teamRequests[i].error = 'Accept or Reject is required';
          allRequestsResolved = false;
        }
      }
      if (!allRequestsResolved) {
        $scope.$broadcast('show-errors-check-validity', 'form.approveTeamRequestsForm');
        return false;
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.approveTeamRequestsForm');
        return false;
      }

      var spinner = new Spinner({}).spin(document.getElementById('modal-team-member-requests'));

      var finishedApprovingCount = 0;
      var done = function() {
        finishedApprovingCount++;
        if (finishedApprovingCount === $scope.teamRequests.length) {
          spinner.stop();
          $scope.saveFunction();
        }
      };

      var approveRequest = function(currRequest, teamRequests, callback) {
        if (currRequest < teamRequests.length) {
          var request = teamRequests[currRequest];
          var toAdd = {
            teamId: $scope.team.teamId,
            newTeamName: $scope.team.newTeamName
          };

          var doneNext = function(currMember, teamRequests, callback) {
            done();
            approveRequest(currMember+1, teamRequests, callback);
          };

          if (request.approve === true) {
            $http.post('/api/team-requests/' + request._id + '/approve', toAdd).
            success(function(data, status, headers, config) {
              doneNext(currRequest, teamRequests, callback);
            }).
            error(function(data, status, headers, config) {
              $scope.error = data.message;
              $scope.$broadcast('show-errors-check-validity', 'form.approveTeamRequestsForm');
              spinner.stop();
              return false;
              //doneNext(currRequest, teamRequests, callback);
            });
          } else if (request.approve === false) {
            $http.post('/api/team-requests/' + request._id + '/deny', toAdd).
            success(function(data, status, headers, config) {
              doneNext(currRequest, teamRequests, callback);
            }).
            error(function(data, status, headers, config) {
              $scope.error = data.message;
              $scope.$broadcast('show-errors-check-validity', 'form.approveTeamRequestsForm');
              spinner.stop();
              return false;
              //doneNext(currRequest, teamRequests, callback);
            });
          } else {
            doneNext(currRequest, teamRequests, callback);
          }
        } else {
          callback();
        }
      };

      approveRequest(0, $scope.teamRequests, function() {

      });
    };

    $scope.reset = function() {
      for (var i = 0; i < $scope.teamRequests.length; i++) {
        delete $scope.teamRequests.approve;
      }

      $scope.team = {
        teamId: null,
        newTeamName: null
      };

      $scope.approveCount = 0;
      $scope.denyCount = $scope.teamRequests.length;

      $scope.form.approveTeamRequestsForm.$setPristine();
    };

    $scope.cancel = function() {
      $scope.reset();
      $scope.cancelFunction();
    };

    $scope.getApproveCount = function() {
      if (!$scope.approveCount) {
        $scope.approveCount = 0;
      }
      return $scope.approveCount;
    };

    $scope.getDenyCount = function() {
      if (!$scope.denyCount) {
        $scope.denyCount = $scope.teamRequests.length;
      }
      return $scope.denyCount;
    };

    $scope.approve = function() {
      $scope.getApproveCount();
      $scope.getDenyCount();

      $scope.approveCount++;
      $scope.denyCount--;
    };

    $scope.deny = function() {
      $scope.getApproveCount();
      $scope.getDenyCount();

      $scope.approveCount--;
      $scope.denyCount++;
    };
  }
})();
