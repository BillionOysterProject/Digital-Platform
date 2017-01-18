(function () {
  'use strict';

  angular
    .module('teams')
    .controller('TeamLeadApprovalController', TeamLeadApprovalController);

  TeamLeadApprovalController.$inject = ['$scope', '$http'];

  function TeamLeadApprovalController($scope, $http) {

    $scope.reset = function() {
      $scope.team = {
        teamId: null,
        newTeamName: null
      };

      $scope.form.approveTeamLeadRequestsForm.$setSubmitted();
      $scope.form.approveTeamLeadRequestsForm.$setPristine();
    };

    $scope.cancel = function() {
      $scope.reset();
      $scope.cancelFunction();
    };

    $scope.approve = function(pendingTeamLeadRequest) {
      $scope.savePendingUpdate(pendingTeamLeadRequest, true);
    };

    $scope.deny = function(pendingTeamLeadRequest) {
      $scope.savePendingUpdate(pendingTeamLeadRequest, false);
    };

    $scope.savePendingUpdate = function(pendingTeamLeadRequest, approved) {
      var spinner = new Spinner({}).spin(document.getElementById('modal-team-lead-requests'));

      $http.post('/api/users/' + pendingTeamLeadRequest._id +
        (approved === true ? '/approve' : '/deny'), {}).
      success(function(data, status, headers, config) {
        spinner.stop();
        var idx = $scope.leadRequests.indexOf(pendingTeamLeadRequest);
        if(idx >= 0) {
          $scope.leadRequests.splice(idx, 1);
        }
      }).
      error(function(data, status, headers, config) {
        if(data === null || data === undefined || data.message === null || data.message === undefined) {
          $scope.error = "An unknown error occurred.";
        } else {
          $scope.error = data.message;
        }
        $scope.$broadcast('show-errors-check-validity', 'form.approveTeamLeadRequestsForm');
        spinner.stop();
      });
    };
  }
})();
