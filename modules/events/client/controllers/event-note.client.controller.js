(function() {
  'use strict';

  angular
    .module('events')
    .controller('EventNoteController', EventNoteController);

  EventNoteController.$inject = ['$scope', '$http'];

  function EventNoteController($scope, $http) {
    $scope.note = ($scope.registrant) ? $scope.registrant.note : '';
    $scope.error = [];

    $scope.save = function() {
      $http.post('/api/events/' + $scope.event._id + '/note', {
        registrant: $scope.registrant.user,
        note: $scope.note
      })
      .success(function(data, status, headers, config) {
        $scope.closeFunction(data.registrants, data.attendees);
      })
      .error(function(data, status, headers, config) {
        $scope.error = data.message;
      });
    };

    $scope.delete = function() {
      $scope.note = undefined;
      $scope.save();
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
