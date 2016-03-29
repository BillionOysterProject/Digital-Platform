(function () {
  'use strict';

  angular
    .module('teams')
    .controller('TeamsImportController', TeamsImportController);

  TeamsImportController.$inject = ['$scope', '$http'];

  function TeamsImportController($scope, $http) {

    $scope.csv = {
      content: null,
      header: true,
      separator: ',',
      result: null,
      headersValid: false,
      filename: ''
    };

    $scope.bulkFileUploaded = false;

    $scope.totalValidating = 0;
    $scope.validCsv = [];
    $scope.invalidCsv = [];
    $scope.finishedValidation = false;
    $scope.uploadingCsv = false;

    $scope.team = {
      teamId: null,
      newTeamName: null
    };

    $scope.reset = function() {
      $scope.csv = {};
      $scope.csv = {
        content: null,
        header: true,
        separator: ',',
        result: null,
        headersValid: false,
        filename: ''
      };

      $scope.bulkFileUploaded = false;

      $scope.totalValidating = 0;
      $scope.validCsv = [];
      $scope.invalidCsv = [];
      $scope.finishedValidation = false;
      $scope.uploadingCsv = false;
      $scope.headersInvalid = false;

      $scope.team = {
        teamId: null,
        newTeamName: null
      };
    };

    $scope.downloadExample = function() {
      $http({ method: 'GET', url: '/api/teams/members/csv' }).
        success(function(data, status, headers, config) {
          var anchor = angular.element('<a/>');
          anchor.attr({
            href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
            target: '_blank',
            download: 'team_members.csv'
          })[0].click();
        }).
        error(function(data, status, headers, config) {
		// if there's an error you should see it here
        });
    };

    $scope.validate = function() {
      var csvMembers = $scope.csv.result;
      $scope.totalValidating = csvMembers.length;
      $scope.bulkFileUploaded = true;

      if ($scope.csv.headersValid) {
        var finishedValidatingCount = 0;
        for (var i = 0; i < csvMembers.length; i++) {
          var errorMessages = [];
          if (!csvMembers[i]['First Name *']) {
            errorMessages.push('First Name is required');
          }
          if (!csvMembers[i]['Last Name *']) {
            errorMessages.push('Last Name is required');
          }
          if (!csvMembers[i]['Email *']) {
            errorMessages.push('Email is required');
          }

          if (errorMessages.length > 0) {
            csvMembers[i].errors = errorMessages.join();
            $scope.invalidCsv.push(csvMembers[i]);
          } else {
            csvMembers[i].valid = true;
            $scope.validCsv.push(csvMembers[i]);
          }
        }
        $scope.finishedValidation = true;
      } else {
        $scope.headersInvalid = true;
        $scope.finishedValidation = true;
      }
    };

    $scope.upload = function() {
      $scope.uploadingCsv = true;
      var spinner = new Spinner({}).spin(document.getElementById('modal-import-team-members'));

      var finishedAddingCount = 0;
      var done = function() {
        finishedAddingCount++;
        if (finishedAddingCount === $scope.validCsv.length) {
          spinner.stop();
          $scope.saveFunction();
        }
      };
      $scope.successfullyAdded = 0;

      var uploadMember = function(currMember, validCsv, callback) {
        if (currMember < validCsv.length) {
          var csvMember = validCsv[currMember];
          var toAdd = {
            member: validCsv[currMember],
            teamId: $scope.team.teamId,
            newTeamName: $scope.team.newTeamName
          };

          $http.post('/api/teams/members/csv', toAdd).
          success(function(data, status, headers, config) {
            $scope.successfullyAdded++;
            done();
          }).
          error(function(data, status, headers, config) {
            done();
          });

          uploadMember(currMember+1, validCsv, callback);
        } else {
          callback();
        }
      };

      uploadMember(0, $scope.validCsv, function() {

      });
    };

    $scope.cancel = function() {
      $scope.reset();
      $scope.cancelFunction();
    };
  }
})();