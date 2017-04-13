(function () {
  'use strict';

  angular
    .module('school-orgs')
    .controller('SchoolOrganizationsApprovalController', SchoolOrganizationsApprovalController);

  SchoolOrganizationsApprovalController.$inject = ['$scope', '$http'];

  function SchoolOrganizationsApprovalController($scope, $http) {
    $scope.reset = function() {
      for (var i = 0; i < $scope.orgRequests.length; i++) {
        delete $scope.orgRequests.approve;
      }

      $scope.team = {
        teamId: null,
        newTeamName: null
      };

      $scope.form.approveSchoolOrgRequestsForm.$setSubmitted();
      $scope.form.approveSchoolOrgRequestsForm.$setPristine();
    };

    $scope.cancel = function() {
      $scope.reset();
      $scope.cancelFunction();
    };

    $scope.approve = function(pendingOrgRequest) {
      $scope.savePendingUpdate(pendingOrgRequest, true);
    };

    $scope.deny = function(pendingOrgRequest) {
      $scope.savePendingUpdate(pendingOrgRequest, false);
    };

    $scope.closeIfLast = function() {
      if($scope.orgRequests === null || $scope.orgRequests === undefined ||
        $scope.orgRequests.length === 0) {
        $scope.cancel();
      }
    };

    $scope.savePendingUpdate = function(pendingItem, approved) {
      var spinner = new Spinner({}).spin(document.getElementById('modal-org-requests'));

      $http.post('/api/school-orgs/' + pendingItem._id +
        (approved === true ? '/approve' : '/deny'), {}).
      success(function(data, status, headers, config) {
        spinner.stop();
        var idx = $scope.orgRequests.indexOf(pendingItem);
        if(idx >= 0) {
          $scope.orgRequests.splice(idx, 1);
        }
        $scope.closeIfLast();
      }).
      error(function(data, status, headers, config) {
        if(data === null || data === undefined || data.message === null || data.message === undefined) {
          $scope.error = 'An unknown error occurred.';
        } else {
          $scope.error = data.message;
        }
        $scope.$broadcast('show-errors-check-validity', 'form.approveSchoolOrgRequestsForm');
        spinner.stop();
        $scope.closeIfLast();
      });

    };
  }
})();
