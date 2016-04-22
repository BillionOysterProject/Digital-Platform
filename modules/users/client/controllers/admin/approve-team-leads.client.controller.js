(function () {
  'use strict';

  angular
    .module('teams')
    .controller('TeamLeadApprovalController', TeamLeadApprovalController);

  TeamLeadApprovalController.$inject = ['$scope', '$http'];

  function TeamLeadApprovalController($scope, $http) {
    $scope.save = function(isValid) {
      var allRequestsResolved = true;
      for (var i = 0; i < $scope.leadRequests.length; i++) {
        if ($scope.leadRequests[i].approve !== true && $scope.leadRequests[i].approve !== false) {
          $scope.leadRequests[i].error = 'Accept or Reject is required';
          allRequestsResolved = false;
        }
      }
      if (!allRequestsResolved) {
        $scope.$broadcast('show-errors-check-validity', 'form.approveTeamLeadRequestsForm');
        return false;
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.approveTeamLeadRequestsForm');
        return false;
      }

      var spinner = new Spinner({}).spin(document.getElementById('modal-team-member-requests'));

      var finishedApprovingCount = 0;
      var done = function() {
        finishedApprovingCount++;
        if (finishedApprovingCount === $scope.leadRequests.length) {
          spinner.stop();
          $scope.saveFunction();
        }
      };

      var approveRequest = function(currRequest, leadRequests, callback) {
        if (currRequest < leadRequests.length) {
          var request = leadRequests[currRequest];

          var doneNext = function(currMember, leadRequests, callback) {
            done();
            approveRequest(currMember+1, leadRequests, callback);
          };

          if (request.approve === true) {
            $http.post('/api/users/' + request._id + '/approve', {}).
            success(function(data, status, headers, config) {
              doneNext(currRequest, leadRequests, callback);
            }).
            error(function(data, status, headers, config) {
              $scope.error = data.message;
              $scope.$broadcast('show-errors-check-validity', 'form.approveTeamLeadRequestsForm');
              spinner.stop();
              return false;
              //doneNext(currRequest, leadRequests, callback);
            });
          } else if (request.approve === false) {
            $http.post('/api/users/' + request._id + '/deny', {}).
            success(function(data, status, headers, config) {
              doneNext(currRequest, leadRequests, callback);
            }).
            error(function(data, status, headers, config) {
              $scope.error = data.message;
              $scope.$broadcast('show-errors-check-validity', 'form.approveTeamLeadRequestsForm');
              spinner.stop();
              return false;
              //doneNext(currRequest, leadRequests, callback);
            });
          } else {
            doneNext(currRequest, leadRequests, callback);
          }
        } else {
          callback();
        }
      };

      approveRequest(0, $scope.leadRequests, function() {

      });
    };

    $scope.reset = function() {
      for (var i = 0; i < $scope.leadRequests.length; i++) {
        delete $scope.leadRequests.approve;
      }

      $scope.team = {
        teamId: null,
        newTeamName: null
      };

      $scope.approveCount = 0;
      $scope.denyCount = $scope.leadRequests.length;

      $scope.form.approveTeamLeadRequestsForm.$setSubmitted();
      $scope.form.approveTeamLeadRequestsForm.$setPristine();
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
        $scope.denyCount = $scope.leadRequests.length;
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
