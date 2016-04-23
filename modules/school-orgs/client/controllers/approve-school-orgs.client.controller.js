(function () {
  'use strict';

  angular
    .module('school-orgs')
    .controller('SchoolOrganizationsApprovalController', SchoolOrganizationsApprovalController);

  SchoolOrganizationsApprovalController.$inject = ['$scope', '$http'];

  function SchoolOrganizationsApprovalController($scope, $http) {
    $scope.save = function(isValid) {
      var allRequestsResolved = true;
      for (var i = 0; i < $scope.orgRequests.length; i++) {
        if ($scope.orgRequests[i].approve !== true && $scope.orgRequests[i].approve !== false) {
          $scope.orgRequests[i].error = 'Accept or Reject is required';
          allRequestsResolved = false;
        }
      }
      if (!allRequestsResolved) {
        $scope.$broadcast('show-errors-check-validity', 'form.approveSchoolOrgRequestsForm');
        return false;
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.approveSchoolOrgRequestsForm');
        return false;
      }

      var spinner = new Spinner({}).spin(document.getElementById('modal-org-requests'));

      var finishedApprovingCount = 0;
      var done = function() {
        finishedApprovingCount++;
        if (finishedApprovingCount === $scope.orgRequests.length) {
          spinner.stop();
          $scope.saveFunction();
        }
      };

      var approveRequest = function(currRequest, orgRequests, callback) {
        if (currRequest < orgRequests.length) {
          var request = orgRequests[currRequest];

          var doneNext = function(currMember, orgRequests, callback) {
            done();
            approveRequest(currMember+1, orgRequests, callback);
          };

          if (request.approve === true) {
            $http.post('/api/school-orgs/' + request._id + '/approve', {}).
            success(function(data, status, headers, config) {
              doneNext(currRequest, orgRequests, callback);
            }).
            error(function(data, status, headers, config) {
              $scope.error = data.message;
              $scope.$broadcast('show-errors-check-validity', 'form.approveSchoolOrgRequestsForm');
              spinner.stop();
              return false;
              //doneNext(currRequest, orgRequests, callback);
            });
          } else if (request.approve === false) {
            $http.post('/api/school-orgs/' + request._id + '/deny', {}).
            success(function(data, status, headers, config) {
              doneNext(currRequest, orgRequests, callback);
            }).
            error(function(data, status, headers, config) {
              $scope.error = data.message;
              $scope.$broadcast('show-errors-check-validity', 'form.approveSchoolOrgRequestsForm');
              spinner.stop();
              return false;
              //doneNext(currRequest, orgRequests, callback);
            });
          } else {
            doneNext(currRequest, orgRequests, callback);
          }
        } else {
          callback();
        }
      };

      approveRequest(0, $scope.orgRequests, function() {

      });
    };

    $scope.reset = function() {
      for (var i = 0; i < $scope.orgRequests.length; i++) {
        delete $scope.orgRequests.approve;
      }

      $scope.team = {
        teamId: null,
        newTeamName: null
      };

      $scope.approveCount = 0;
      $scope.denyCount = $scope.orgRequests.length;

      $scope.form.approveSchoolOrgRequestsForm.$setSubmitted();
      $scope.form.approveSchoolOrgRequestsForm.$setPristine();
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
        $scope.denyCount = $scope.orgRequests.length;
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
