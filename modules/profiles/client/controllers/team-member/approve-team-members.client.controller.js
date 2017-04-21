(function () {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamApprovalController', TeamApprovalController);

  TeamApprovalController.$inject = ['$scope', '$http', 'TeamsService'];

  function TeamApprovalController($scope, $http) {
    $scope.error = null;
    $scope.teamRequestsTeams = [];

    $scope.reset = function() {
      for (var i = 0; i < $scope.teamRequests.length; i++) {
        delete $scope.teamRequests[i].approve;
        delete $scope.teamRequests[i].error;
      }

      for(i = 0; i < $scope.teamRequests.length; i++) {
        $scope.teamRequestsTeams[$scope.teamRequests[i]._id] = null;
      }

      $scope.form.approveTeamRequestsForm.$setPristine();
    };

    $scope.cancel = function() {
      $scope.reset();
      $scope.closeFunction();
    };

    $scope.closeIfLast = function() {
      if($scope.teamRequests === null || $scope.teamRequests === undefined ||
        $scope.teamRequests.length === 0) {
        $scope.cancel();
      }
    };

    $scope.onTeamSelectionChange = function(index) {
      //when the user selects a team, make sure neither
      //approve/deny is selected. i want the actual approve/deny action
      //to only occur when they click one of those buttons.
      for (var i = 0; i < $scope.teamRequests.length; i++) {
        if(i === index) {
          delete $scope.teamRequests[i].approve;
        }
      }
    };

    $scope.checkValidityAndConfirm = function(pendingTeamMemberRequest, index, approved) {
      $scope.$broadcast('show-errors-check-validity', 'form.approveTeamRequestsForm');

      //check if the team membership is selected
      var teamVal = $scope.teamRequestsTeams[pendingTeamMemberRequest._id];

      if (!approved) {
        //reject doesn't require a team selection
        $scope.savePendingUpdate(pendingTeamMemberRequest, null, approved);
      } else if(approved === true && teamVal !== undefined && teamVal !== null && teamVal !== ''){
        //approve required team selection
        var teamToApprove = {
          teamId: teamVal
          //newTeamName: teamVal.newTeamName
        };
        $scope.savePendingUpdate(pendingTeamMemberRequest, teamToApprove, approved);
      }
    };

    $scope.savePendingUpdate = function(pendingTeamMemberRequest, team, approved) {
      var spinner = new Spinner({}).spin(document.getElementById('modal-team-member-requests'));

      if (pendingTeamMemberRequest.approve === true) {
        $http.post('/api/team-requests/' + pendingTeamMemberRequest._id + '/approve', team).
        success(function(data, status, headers, config) {
          spinner.stop();
          var idx = $scope.teamRequests.indexOf(pendingTeamMemberRequest);
          if(idx >= 0) {
            $scope.teamRequests.splice(idx, 1);
          }
          $scope.closeIfLast();
        }).
        error(function(data, status, headers, config) {
          $scope.error = data.message;
          spinner.stop();
        });
      } else if (pendingTeamMemberRequest.approve === false) {
        $http.post('/api/team-requests/' + pendingTeamMemberRequest._id + '/deny', pendingTeamMemberRequest).
        success(function(data, status, headers, config) {
          spinner.stop();
          var idx = $scope.teamRequests.indexOf(pendingTeamMemberRequest);
          if(idx >= 0) {
            $scope.teamRequests.splice(idx, 1);
          }
          $scope.closeIfLast();
        }).
        error(function(data, status, headers, config) {
          $scope.error = data.message;
          spinner.stop();
        });
      }
    };
  }
})();
