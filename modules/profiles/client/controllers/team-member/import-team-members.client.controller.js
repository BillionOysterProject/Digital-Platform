(function () {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamsImportController', TeamsImportController);

  TeamsImportController.$inject = ['$scope', '$http'];

  function TeamsImportController($scope, $http) {

    $scope.reset = function() {
      //$scope.csv = {};
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
      angular.element('#import-team-members-upload').trigger('change');
    };

    $scope.reset();

    $scope.downloadExample = function() {
      $http({ method: 'GET', url: '/api/users/leaders/csv' }).
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
      if(!csvMembers) {
        $scope.headersInvalid = true;
        $scope.finishedValidation = true;
        return;
      }

      $scope.totalValidating = csvMembers.length;
      $scope.bulkFileUploaded = true;

      if ($scope.csv.headersValid) {
        var spinner = new Spinner({}).spin(document.getElementById('modal-import-team-members'));

        var finishedValidatingCount = 0;
        var done = function() {
          finishedValidatingCount++;
          if (finishedValidatingCount === $scope.totalValidating) {
            spinner.stop();
            $scope.finishedValidation = true;
          }
        };

        var validateMember = function(currMember, csvMembers, callback) {
          if (currMember < csvMembers.length) {
            var member = csvMembers[currMember];

            var errorMessages = [];
            if (!member['First Name *']) {
              errorMessages.push('First Name is required');
            }
            if (!member['Last Name *']) {
              errorMessages.push('Last Name is required');
            }
            if (!member['Email *']) {
              errorMessages.push('Email is required');
            }

            $http.post('/api/users/leaders/validate/csv', { member: member })
            .success(function(data, status, headers, config) {
              member.valid = true;
              $scope.validCsv.push(member);
              done();
              validateMember(currMember+1, csvMembers, callback);
            })
            .error(function(data, status, headers, config) {
              errorMessages.push(data.message);
              member.errors = errorMessages.join();
              $scope.invalidCsv.push(member);
              done();
              validateMember(currMember+1, csvMembers, callback);
            });
          } else {
            callback();
          }
        };

        validateMember(0, csvMembers, function() {

        });
      } else {
        $scope.headersInvalid = true;
        $scope.finishedValidation = true;
      }
    };

    $scope.upload = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.importTeamMembersForm');
        return false;
      }

      $scope.uploadingCsv = true;
      var spinner = new Spinner({}).spin(document.getElementById('modal-import-team-members'));

      var finishedAddingCount = 0;
      var done = function() {
        finishedAddingCount++;
        if (finishedAddingCount === $scope.validCsv.length) {
          spinner.stop();
          $scope.reset();
          $scope.closeFunction(true);
        }
      };
      $scope.successfullyAdded = 0;

      var uploadMember = function(currMember, validCsv, callback) {
        if (currMember < validCsv.length) {
          var toAdd = {
            user: validCsv[currMember],
            role: 'team member pending',
            teamOrOrg: 'team',
            team: $scope.team,
            organization: $scope.organization
          };

          $http.post('/api/users/leaders/csv', toAdd).
          success(function(data, status, headers, config) {
            $scope.successfullyAdded++;
            done();
            uploadMember(currMember+1, validCsv, callback);
          }).
          error(function(data, status, headers, config) {
            done();
            uploadMember(currMember+1, validCsv, callback);
          });

        } else {
          callback();
        }
      };

      uploadMember(0, $scope.validCsv, function() {

      });
    };

    $scope.cancel = function() {
      $scope.reset();
      $scope.closeFunction();
    };
  }
})();
